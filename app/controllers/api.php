<?php

//api接口
class apiController extends Ue
{

    public $app;
    public $out;
    public $Token;
    protected $m;
    protected $table = 'user';

    public function __init()
    {
        $this->ip = t('ip')->getIp();//获取客户端IP
        $this->times = time();
        $this->appConfig = c('app');
        $this->out = t('out', $this->appConfig);
        $this->Token = t('Token', $this->appConfig['USER_TOKENKEY']);
    }

    public function __info()
    {//获取信息
        $checkRules = [
            'token' => ['Jwt', '', 'Token令牌有误']
        ];
        $dataChecker = t('dataChecker', $_POST, $checkRules);
        $res = $dataChecker->check();
        if (!$res) $this->out->e(201, $dataChecker->error);

        $Ures = $this->__TokenCheck();

        $sRes = db('logs')->where('ug = ? and uid = ? and type = ? and state = ? and time > ? and appid = ?', ['user', $Ures['id'], 'signIn', 'y', timeRange(), $this->app['id']])->fetch();//查询用户是否签到
        if ($sRes) {
            $signin = '1';//已签到
        } else {
            $signin = '0';//未签到
        };

        $info = [
            'uid' => $Ures['id'],
            'phone' => $Ures['phone'],
            'email' => $Ures['email'],
            'acctno' => $Ures['acctno'],
            'name' => $Ures['nickname'],
            'pic' => $Ures['avatars'],
            'invID' => $Ures['inviter_id'],
            'fen' => $Ures['fen'],
            'vipExpTime' => $Ures['vip'],
            'vipExpDate' => date("Y-m-d H:i:s", $Ures['vip']),
            'signin' => $signin
        ];
        $this->out->setData($info)->e(200, '登录成功');
    }

    protected function __TokenCheck()
    {//Token检查
        $res = $this->Token->verify($_POST['token']);
        if (!$res) $this->out->e(128);

        if (!isset($this->Token->param['uid']) || !isset($this->Token->param['udid']) || !isset($this->Token->param['appid']) || !isset($this->Token->param['p'])) $this->out->e(128);

        $Ures = $this->db->join("as U LEFT JOIN {$this->db->pre}agent as A on (U.id = A.uid)")->where('U.id = ?', [$this->Token->param['uid']])->fetch('U.*,IF(A.id IS NOT NULL,true,false) AS agent');
        if (!$Ures) $this->out->e(129);
        if ($Ures['ban'] > time()) $this->out->e(127, $Ures['ban_msg']);//账号被禁用
        if (md5($Ures['password']) != $this->Token->param['p']) $this->out->e(131);


        $client_Arr = json_decode($Ures['client_list'], true);
        $found_key = array_search($this->Token->param['udid'], array_column($client_Arr, 'udid'));

        if ($found_key !== 0 && !$found_key && !in_array($this->m, ['getUdid', 'reUdid'])) $this->out->e(130);//登录设备信息不匹配
        return $Ures;
    }

    public function __vip()
    {//验证会员
        $checkRules = [
            'token' => ['Jwt', '', 'Token令牌有误']
        ];
        $dataChecker = t('dataChecker', $_POST, $checkRules);
        $res = $dataChecker->check();
        if (!$res) $this->out->e(201, $dataChecker->error);

        $Ures = $this->__TokenCheck();
        if ($Ures['vip'] < time()) $this->out->e(201, '验证失败');
        $this->out->e(200, '验证成功');
    }

    public function __fen()
    {//积分验证
        $checkRules = [
            'token' => ['Jwt', '', 'Token有误'],
            'fenid' => ['int', '1,11', '积分事件ID有误'],
            'fenmark' => ['string', '1,128', '积分事件标记有误', true],
        ];
        $dataChecker = t('dataChecker', $_POST, $checkRules);
        $res = $dataChecker->check();
        if (!$res) $this->out->e(201, $dataChecker->error);

        $Ures = $this->__TokenCheck();

        $fenRes = db('fen_event')->where('id = ? and appid = ?', [$_POST['fenid'], $this->app['id']])->fetch();
        if (!$fenRes) $this->out->e(146);

        if ($fenRes['vip_free'] == 'y') {
            if ($Ures['vip'] > time()) {
                $this->out->e(200, '验证成功');
            }
        }

        $foData = ['fid' => $_POST['fenid'], 'uid' => $Ures['id'], 'name' => $fenRes['name'], 'fen' => $fenRes['fen'], 'vip' => $fenRes['vip'], 'time' => time(), 'appid' => $this->app['id']];

        if ($fenRes['vip'] > 0) {
            if ($Ures['vip'] >= 9999999999) $this->out->e(199);
            if (isset($_POST['fenmark']) && !empty($_POST['fenmark'])) {
                $fenO = db('fen_order')->where('fid = ? and uid = ? and mark = ? and appid = ?', [$_POST['fenid'], $Ures['id'], $_POST['fenmark'], $this->app['id']])->fetch();
                if ($fenO) $this->out->e(147);//已经兑换过一次了
                $foData['mark'] = $_POST['fenmark'];
            }
        } else {
            if (isset($_POST['fenmark']) && !empty($_POST['fenmark'])) {
                $fenO = db('fen_order')->where('fid = ? and uid = ? and mark = ? and appid = ?', [$_POST['fenid'], $Ures['id'], $_POST['fenmark'], $this->app['id']])->fetch();
                if ($fenO) $this->out->e(200, '验证成功');
                $foData['mark'] = $_POST['fenmark'];
            }
        }
        if ($Ures['fen'] < $fenRes['fen']) $this->out->e(201, '积分余额不足');
        $addRes = db('fen_order')->add($foData);
        if (!$addRes) $this->out->e(201, '验证失败，请重试');
        if ($fenRes['vip'] > 0) {
            if ($Ures['vip'] > time()) {
                $res = $this->db->where('id = ? and appid = ?', [$Ures['id'], $this->app['id']])->update(['fen' => ($Ures['fen'] - $fenRes['fen']), 'vip' => ($Ures['vip'] + $fenRes['vip'])]);
            } else {
                $res = $this->db->where('id = ? and appid = ?', [$Ures['id'], $this->app['id']])->update(['fen' => ($Ures['fen'] - $fenRes['fen']), 'vip' => (time() + $fenRes['vip'])]);
            }
        } else {
            $res = $this->db->where('id = ? and appid = ?', [$Ures['id'], $this->app['id']])->field(['fen' => -$fenRes['fen']]);
        }
        if (!$res) $this->out->e(201, '验证失败');
        $this->out->e(200, '验证成功');
    }

    public function __kamiTopup()
    {//卡密充值
        $checkRules = [
            'token' => ['Jwt', '', 'Token令牌有误'],
            'kami' => ['Kami', '16,32', 'Token令牌有误'],
        ];
        $dataChecker = t('dataChecker', $_POST, $checkRules);
        $res = $dataChecker->check();
        if (!$res) $this->out->e(201, $dataChecker->error);

        $Ures = $this->__TokenCheck();
        $kmDB = db('kami');
        $Kres = $kmDB->where('cardNo = ? and appid = ?', [$_POST['kami'], $this->app['id']])->fetch();
        if (!$Kres) $this->out->e(140);
        if (!empty($Kres['use_uid'])) $this->out->e(141);

        $data = [];
        if ($Kres['type'] == 'vip') {
            if ($Ures['vip'] == 9999999999) $this->out->e(199);

            if ($Kres['val'] == 9999999999) {
                $data['vip'] = $Kres['val'];
            } else {
                if ($Ures['vip'] > time()) {
                    $data['vip'] = $Ures['vip'] + $Kres['val'];
                } else {
                    $data['vip'] = time() + $Kres['val'];
                }
            }
        } else if ($Kres['type'] == 'fen') {
            $data['fen'] = $Ures['fen'] + $Kres['val'];
        } elseif ($Kres['type'] == 'addmc') {
            $data['client_max'] = $Ures['client_max'] + $Kres['val'];
        } else {
            $this->out->e(142);
        }

        $this->db->beginTransaction();//开启事务
        $upRes = $this->db->where('id = ? and appid = ?', [$Ures['id'], $this->app['id']])->update($data);
        if (!$upRes) {
            $this->db->rollback();//事务回滚
            $this->__log($Ures['id'], $this->m, 201);
            $this->out->e(201, '充值失败');
        }
        $upKres = $kmDB->where('id = ? and appid = ?', [$Kres['id'], $this->app['id']])->update(['use_uid' => $Ures['id'], 'use_time' => time(), 'use_ip' => $this->ip]);
        if (!$upKres) {
            $this->db->rollback();//事务回滚
            $this->__log($Ures['id'], $this->m, 201);
            $this->out->e(201, '充值失败');
        }
        $this->db->commit();//提交
        $this->__log($Ures['id'], $this->m);
        $this->out->e(200, '充值成功');
    }

    protected function __log($uid, $type, $code = 200, $data = null)
    {
        if ($this->appConfig['APP_USER_LOG'] == 'on') {//记录日志
            $addData = ['uid' => $uid, 'ug' => 'user', 'type' => $type, 'state' => $code == 200 ? 'y' : 'n', 'time' => time(), 'ip' => $this->ip, 'appid' => $this->app['id']];
            if (!empty($data)) {
                $addData['data'] = json_encode($data);
            }
            db('logs')->add($addData);
        }
    }

    public function __pay()
    {//充值
        $checkRules = [
            'uid' => ['int', '1,11', '用户ID有误'],
            'gid' => ['int', '1,11', '商品ID有误'],
            'type' => ['sameone', 'ali,wx', '支付类型有误'],
        ];
        $dataChecker = t('dataChecker', $_POST, $checkRules);
        $res = $dataChecker->check();
        if (!$res) $this->out->e(201, $dataChecker->error);

        $Ures = $this->db->where('id = ? and appid = ?', [$_POST['uid'], $this->app['id']])->fetch();
        if (!$Ures) $this->out->e(129);

        $Gres = db('goods')->where('id = ? and appid = ?', [$_POST['gid'], $this->app['id']])->fetch();
        if (!$Gres) $this->out->e(151);
        if ($Gres['state'] != 'y') $this->out->e(152);

        $order_no = date("YmdHis", time()) . rand(10000, 99999);
        $data = ['uid' => $Ures['id'], 'gid' => $Gres['id'], 'order_no' => $order_no, 'name' => $Gres['name'], 'money' => $Gres['money'], 'type' => $Gres['type'], 'val' => $Gres['val'], 'ptype' => $_POST['type'], 'add_time' => time(), 'appid' => $this->app['id']];
        if ($Gres['type'] == 'agent') {
            $AGdb = db('agent_group');
            $AGres = $AGdb->where('id = ? and appid = ?', [$Gres['val'], $this->app['id']])->fetch();
            if (!$AGres) $this->out->e(153);
        }
        $Odb = db('order');
        $notify_url = $this->appConfig['WEB_URL'] . 'notify/' . $_POST['type'] . '/' . $order_no;
        $return_url = $this->appConfig['WEB_URL'] . 'return/' . $_POST['type'] . '/' . $order_no;
        if ($_POST['type'] == 'ali') {
            if ($this->app['pay_ali_state'] != 'on' || empty($this->app['pay_ali_config'])) $this->out->e(150);
            $ali_config = json_decode($this->app['pay_ali_config'], true);
            if (!is_array($ali_config)) $this->out->e(150);

            $result = t('pay')->create($order_no, $Gres['name'], $Gres['money'], $notify_url, $return_url, $this->app['pay_ali_type'], $ali_config);
        }
        if ($_POST['type'] == 'wx') {
            if ($this->app['pay_wx_state'] != 'on' || empty($this->app['pay_wx_config'])) $this->out->e(150);
            $wx_config = json_decode($this->app['pay_wx_config'], true);
            if (!is_array($wx_config)) $this->out->e(150);

            $result = t('pay')->create($order_no, $Gres['name'], $Gres['money'], $notify_url, $return_url, $this->app['pay_wx_type'], $wx_config);
        }

        if (!$result || !isset($result['code']) || !isset($result['msg'])) $this->out->e(156);
        if ($result['code'] != 200) $this->out->e(156, $result['msg']);
        if (!isset($result['data'])) $this->out->e(157);
        $res = $Odb->add($data);
        if (!$res) $this->out->e(201, '订单创建失败');
        $this->out->setData($result['data'])->e(200, '订单创建成功');
    }

    public function __order()
    {//获取订单
        $checkRules = [
            'token' => ['Jwt', '', 'Token令牌有误'],
        ];
        $dataChecker = t('dataChecker', $_POST, $checkRules);
        $res = $dataChecker->check();
        if (!$res) $this->out->e(201, $dataChecker->error);

        $Ures = $this->__TokenCheck();
        $gDB = db('order');
        $list = $gDB->where('uid = ? and appid = ?', [$Ures['id'], $this->app['id']])->order('id desc')->fetchAll('order_no,trade_no,name,money,ptype,add_time,end_time,state');
        $this->out->setData(['list' => $list])->e(200, '获取成功');
    }

    public function __goods()
    {//获取商品
        $checkRules = [
            'token' => ['Jwt', '', 'Token令牌有误'],
        ];
        $dataChecker = t('dataChecker', $_POST, $checkRules);
        $res = $dataChecker->check();
        if (!$res) $this->out->e(201, $dataChecker->error);

        $Ures = $this->__TokenCheck();
        $gDB = db('goods');
        $list = $gDB->where('state = ? and appid = ?', ['y', $this->app['id']])->order('id desc')->fetchAll('id,name,type,money,blurb');

        $this->out->setData(['list' => $list])->e(200, '获取成功');
    }

    public function __message()
    {//获取留言列表
        $checkRules = [
            'token' => ['Jwt', '', 'Token令牌有误'],
        ];
        $dataChecker = t('dataChecker', $_POST, $checkRules);
        $res = $dataChecker->check();
        if (!$res) $this->out->e(201, $dataChecker->error);

        $Ures = $this->__TokenCheck();
        $mDB = db('message');
        $list = $mDB->where('uid = ? and reply_id is null and appid = ?', [$Ures['id'], $this->app['id']])->order('id desc')->fetchAll('id,title,time,last_time,state');
        $this->out->setData(['list' => $list])->e(200, '获取成功');
    }

    public function __messageLog()
    {//获取留言对话记录
        $checkRules = [
            'token' => ['Jwt', '', 'Token令牌有误'],
            'mid' => ['int', '1,11', '留言ID有误']
        ];
        $dataChecker = t('dataChecker', $_POST, $checkRules);
        $res = $dataChecker->check();
        if (!$res) $this->out->e(201, $dataChecker->error);

        $Ures = $this->__TokenCheck();
        $mDB = db('message');
        $list = $mDB->where('(id = ? or reply_id = ?) and (uid = ? or uid is null) and appid = ?', [$_POST['mid'], $_POST['mid'], $Ures['id'], $this->app['id']])->fetchAll();

        $lists = [];
        foreach ($list as $rows) {
            if ($rows['uid'] != null) {
                $user = "user";
            } else {
                $user = "admin";
            }

            $lists[] = [
                'content' => $rows['content'],
                'files' => json_decode($rows['file'], true),
                'date' => date('Y-m-d h:i:s', $rows['time']),
                'state' => $rows['state'],
                'type' => $user,
            ];
        }

        $mDB->where('uid IS NULL and reply_id = ?', [$_POST['mid']])->update(['state' => 2]);
        $this->out->setData(['list' => $lists])->e(200, '获取成功');
    }

    public function __messageSubmit()
    {//提交留言
        $checkRules = [
            'token' => ['Jwt', '', 'Token令牌有误'],
            'title' => ['string', '4,128', '留言标题有误'],
            'content' => ['string', '4,255', '留言内容有误'],
        ];
        $dataChecker = t('dataChecker', $_POST, $checkRules);
        $res = $dataChecker->check();
        if (!$res) $this->out->e(201, $dataChecker->error);

        $Ures = $this->__TokenCheck();
        $mDB = db('message');
        $Mres = $mDB->where('uid = ? and title = ? and appid = ?', [$Ures['id'], $_POST['title'], $this->app['id']])->fetch();
        if ($Mres) $this->out->e(201, '您已经提交过一个相同的留言了');

        $data = ['uid' => $Ures['id'], 'title' => $_POST['title'], 'content' => $_POST['content'], 'time' => time(), 'appid' => $this->app['id']];

        if (count($_FILES) > 0) {
            $file = [];
            foreach ($_FILES as $key => $rows) {
                $uper = t('uper', $key, 'assets/message/' . $Ures['id'] . '/' . date('Ymd'));
                $uploadedFile = $uper->upload();
                if (!$uploadedFile) $this->json('图片上传错误 : ' . $uper->error, 201);
                array_push($file, $uploadedFile);
            }
            $data['file'] = json_encode($file);
        }

        $addID = $mDB->add($data);
        if (!$addID) {
            $this->__log($Ures['id'], $this->m, 201);
            $this->out->e(201, '提交失败');
        }
        $this->__log($Ures['id'], $this->m);
        $this->out->e(200, '提交成功');

    }

    public function __messageReply()
    {//回复留言
        $checkRules = [
            'token' => ['Jwt', '', 'Token令牌有误'],
            'mid' => ['int', '1,11', '留言ID有误'],
            'content' => ['string', '4,255', '留言内容有误'],
        ];
        $dataChecker = t('dataChecker', $_POST, $checkRules);
        $res = $dataChecker->check();
        if (!$res) $this->out->e(201, $dataChecker->error);

        $Ures = $this->__TokenCheck();
        $mDB = db('message');
        $Mres = $mDB->where('id = ? and uid = ? and appid = ?', [$_POST['mid'], $Ures['id'], $this->app['id']])->fetch();
        if (!$Mres) $this->out->e(201, '回复留言不存在');
        if ($Mres['state'] == 2) $this->out->e(201, '您已关闭该留言，若问题为解决，请创建新的留言');

        $data = ['uid' => $Ures['id'], 'content' => $_POST['content'], 'reply_id' => $Mres['id'], 'time' => time(), 'appid' => $this->app['id']];

        if (count($_FILES) > 0) {
            $file = [];
            foreach ($_FILES as $key => $rows) {
                $uper = t('uper', $key, 'assets/message/' . $Ures['id'] . '/' . date('Ymd'));
                $uploadedFile = $uper->upload();
                if (!$uploadedFile) $this->json('图片上传错误 : ' . $uper->error, 201);
                array_push($file, $uploadedFile);
            }
            $data['file'] = json_encode($file);
        }
        $addID = $mDB->add($data);
        if (!$addID) {
            $this->__log($Ures['id'], $this->m, 201);
            $this->out->e(201, '回复失败');
        }
        $mDB->where('id = ?', [$Mres['id']])->update(['last_time' => time(), 'state' => 0]);
        $this->out->e(200, '回复成功');
    }

    public function __messageEnd()
    {//留言结束
        $checkRules = [
            'token' => ['Jwt', '', 'Token令牌有误'],
            'mid' => ['int', '1,11', '留言ID有误'],
        ];
        $dataChecker = t('dataChecker', $_POST, $checkRules);
        $res = $dataChecker->check();
        if (!$res) $this->out->e(201, $dataChecker->error);

        $Ures = $this->__TokenCheck();
        $mDB = db('message');
        $Mres = $mDB->where('id = ? and uid = ? and appid = ?', [$_POST['mid'], $Ures['id'], $this->app['id']])->update(['state' => 2]);
        if ($Mres) {
            $this->out->e(200, '操作成功');
        }
        $this->out->e(201, '操作失败');
    }

    public function __modifyName()
    {//修改名称
        $checkRules = [
            'token' => ['Jwt', '', 'Token令牌有误'],
            'name' => ['string', '1,64', 'Token令牌有误'],
        ];
        $dataChecker = t('dataChecker', $_POST, $checkRules);
        $res = $dataChecker->check();
        if (!$res) $this->out->e(201, $dataChecker->error);

        $Ures = $this->__TokenCheck();

        $upRes = $this->db->where('id = ? and appid = ?', [$Ures['id'], $this->app['id']])->update(['nickname' => $_POST['name']]);
        if (!$upRes) {
            $this->__log($Ures['id'], $this->m, 201);
            $this->out->e(201, '修改失败');
        }
        $this->__log($Ures['id'], $this->m);
        $this->out->e(200, '修改成功');
    }

    public function __modifyPwd()
    {//修改密码
        $checkRules = [
            'token' => ['Jwt', '', 'Token令牌有误'],
            'password' => ['Password', '6,18', '当前密码有误'],
            'newPassword' => ['Password', '6,18', '新密码长度需要满足6-18位数,不支持中文以及.-*_以外特殊字符'],
        ];
        $dataChecker = t('dataChecker', $_POST, $checkRules);
        $res = $dataChecker->check();
        if (!$res) $this->out->e(201, $dataChecker->error);

        $Ures = $this->__TokenCheck();

        if ($Ures['password'] != md5($_POST['password'])) $this->out->e(132);
        if (md5($_POST['newPassword']) == md5($_POST['password'])) $this->out->e(133);

        $upRes = $this->db->where('id = ? and appid = ?', [$Ures['id'], $this->app['id']])->update(['password' => md5($_POST['newPassword'])]);
        if (!$upRes) {
            $this->__log($Ures['id'], $this->m, 201);
            $this->out->e(201, '修改失败');
        }
        $this->__log($Ures['id'], $this->m);
        $this->out->e(200, '修改成功');
    }

    public function __modifyPic()
    {//修改头像
        $checkRules = [
            'token' => ['Jwt', '', 'Token令牌有误'],
        ];
        $dataChecker = t('dataChecker', $_POST, $checkRules);
        $res = $dataChecker->check();
        if (!$res) $this->out->e(201, $dataChecker->error);
        $Ures = $this->__TokenCheck();

        if (count($_FILES) >= 1) {
            foreach ($_FILES as $k => $v) {
                $uper = t('uper', $k, 'assets/avatars');
                $uploadedFile = $uper->upload();
                if (!$uploadedFile) {
                    $this->json('头像上传错误 : ' . $uper->error, 201);
                }
            }
        }
        if (isset($uploadedFile)) {
            $res = $this->db->where('id = ? and appid = ?', [$Ures['id'], $this->app['id']])->update(['avatars' => $uploadedFile]);
            if (!$res) {
                unlink($uploadedFile);
                $this->__log($Ures['id'], $this->m, 201);
                $this->out->e(201, '头像上传失败');
            }
            $this->__log($Ures['id'], $this->m);
            $this->out->e(200, '头像上传成功');
        }
        $this->out->e(201, '请上传头像');
    }

    public function __resetPwd()
    {//重置密码
        $checkRules = [
            'account' => ['email,phone', '5,32', '账号有误'],
            'newPassword' => ['Password', '6,18', '密码长度需要满足6-18位数,不支持中文以及.-*_以外特殊字符'],
            'code' => ['int', '4,6', '验证码填写有误'],
        ];
        $dataChecker = t('dataChecker', $_POST, $checkRules);
        $res = $dataChecker->check();
        if (!$res) $this->out->e(201, $dataChecker->error);

        if (!isset($_POST['code']) || empty($_POST['code'])) $this->out->e(118);//验证码为空
        $dtime = time() - (60 * $this->app['vc_time']);//验证码有效期

        $vcDB = db('vcode');
        $res_code = $vcDB->where('eorp = ? and code = ? and type = ? and usable = ? and time > ? and appid = ?', [$_POST['account'], $_POST['code'], 'repwd', 'y', $dtime, $this->app['id']])->update(['usable' => 'n']);
        if (!$res_code || $vcDB->rowCount() < 1) $this->out->e(119);//验证码不正确


        $Ures = $this->db->where('(phone = ? or email = ?) and appid = ?', [$_POST['account'], $_POST['account'], $this->app['id']])->fetch();
        if (!$Ures) $this->out->e(129);//账号不存在

        $res = $this->db->where('id = ?', [$Ures['id']])->update(['password' => md5($_POST['newPassword'])]);
        if (!$res) {
            $this->__log($Ures['id'], $this->m, 201);
            $this->out->e(201, "重置密码失败");
        }
        $this->__log($Ures['id'], $this->m);
        $this->out->e(200, "重置密码成功");
    }

    public function __signIn()
    {//签到
        $checkRules = [
            'token' => ['Jwt', '', 'Token令牌有误'],
        ];
        $dataChecker = t('dataChecker', $_POST, $checkRules);
        $res = $dataChecker->check();
        if (!$res) $this->out->e(201, $dataChecker->error);

        $Ures = $this->__TokenCheck();

        $sRes = db('logs')->where('ug = ? and uid = ? and type = ? and state = ? and time > ? and appid = ?', ['user', $Ures['id'], 'signIn', 'y', timeRange(), $this->app['id']])->fetch();
        if ($sRes) $this->out->e(134);

        $addRes = db('logs')->add(['ug' => 'user', 'uid' => $Ures['id'], 'type' => 'signIn', 'time' => time(), 'ip' => $this->ip, 'appid' => $this->app['id']]);
        if ($addRes) {
            if ($this->app['diary_award'] == 'vip') {
                if ($this->app['diary_award_val'] > 0) {
                    if ($Ures['vip'] == 9999999999) $this->out->e(200, "签到成功");
                    if ($Ures['vip'] > time()) {
                        $upVip = $Ures['vip'] + $this->app['diary_award_val'];
                    } else {
                        $upVip = time() + $this->app['diary_award_val'];
                    }
                    $this->db->where('id = ?', [$Ures['id']])->update(['vip' => $upVip]);
                }
            } else {
                if ($this->app['diary_award_val'] > 0) {
                    $this->db->where('id = ?', [$Ures['id']])->update(['fen' => $Ures['fen'] + $this->app['diary_award_val']]);
                }
            }
            $this->out->e(200, "签到成功");
        }
        $this->out->e(201, "签到失败");
    }

    public function __setAcctno()
    {//设置账号
        $checkRules = [
            'token' => ['Jwt', '', 'Token令牌有误'],
            'acctno' => ['wordnumS', '5,18', '自定义账号有误，必须以字母开头5~18位'],
        ];
        $dataChecker = t('dataChecker', $_POST, $checkRules);
        $res = $dataChecker->check();
        if (!$res) $this->out->e(201, $dataChecker->error);

        $Ures = $this->__TokenCheck();
        if (!empty($Ures['acctno'])) $this->out->e(123);
        $Anores = $this->db->where('acctno = ? and appid = ?', [$_POST['acctno'], $this->app['id']])->fetch();
        if ($Anores) $this->out->e(120);

        $upRes = $this->db->where('id = ?', [$Ures['id']])->update(['acctno' => $_POST['acctno']]);
        if (!$upRes) {
            $this->__log($Ures['id'], $this->m, 201);
            $this->out->e(201, "设置失败");
        }
        $this->__log($Ures['id'], $this->m);
        $this->out->e(200, "设置成功");
    }

    public function __setEmail()
    {//设置邮箱
        $checkRules = [
            'token' => ['Jwt', '', 'Token令牌有误'],
            'email' => ['email', '', '邮箱账号有误'],
            'code' => ['int', '4,6', '验证码填写有误'],
        ];
        $dataChecker = t('dataChecker', $_POST, $checkRules);
        $res = $dataChecker->check();
        if (!$res) $this->out->e(201, $dataChecker->error);

        $Ures = $this->__TokenCheck();
        if (!empty($Ures['email'])) $this->out->e(124);

        $dtime = time() - (60 * $this->app['vc_time']);//验证码有效期
        $vcDB = db('vcode');
        $res_code = $vcDB->where('eorp = ? and code = ? and type = ? and usable = ? and time > ? and appid = ?', [$_POST['email'], $_POST['code'], 'ubind', 'y', $dtime, $this->app['id']])->update(['usable' => 'n']);
        if (!$res_code || $vcDB->rowCount() < 1) $this->out->e(119);//验证码不正确

        $emailRes = $this->db->where('email = ? and appid = ?', [$_POST['email'], $this->app['id']])->fetch();
        if ($emailRes) $this->out->e(120, '该邮箱已被绑定');

        $upRes = $this->db->where('id = ?', [$Ures['id']])->update(['email' => $_POST['email']]);
        if (!$upRes) {
            $this->__log($Ures['id'], $this->m, 201);
            $this->out->e(201, "绑定失败");
        }
        $this->__log($Ures['id'], $this->m);
        $this->out->e(200, "绑定成功");
    }

    public function __setPhone()
    {//设置手机号
        $checkRules = [
            'token' => ['Jwt', '', 'Token令牌有误'],
            'phone' => ['phone', '', '邮箱账号有误'],
            'code' => ['int', '4,6', '验证码填写有误'],
        ];
        $dataChecker = t('dataChecker', $_POST, $checkRules);
        $res = $dataChecker->check();
        if (!$res) $this->out->e(201, $dataChecker->error);

        $Ures = $this->__TokenCheck();
        if (!empty($Ures['phone'])) $this->out->e(125);

        $dtime = time() - (60 * $this->app['vc_time']);//验证码有效期
        $vcDB = db('vcode');
        $res_code = $vcDB->where('eorp = ? and code = ? and type = ? and usable = ? and time > ? and appid = ?', [$_POST['phone'], $_POST['code'], 'ubind', 'y', $dtime, $this->app['id']])->update(['usable' => 'n']);
        if (!$res_code || $vcDB->rowCount() < 1) $this->out->e(119);//验证码不正确

        $emailRes = $this->db->where('phone = ? and appid = ?', [$_POST['phone'], $this->app['id']])->fetch();
        if ($emailRes) $this->out->e(120, '该手机号已被绑定');

        $upRes = $this->db->where('id = ?', [$Ures['id']])->update(['phone' => $_POST['phone']]);
        if (!$upRes) {
            $this->__log($Ures['id'], $this->m, 201);
            $this->out->e(201, "绑定失败");
        }
        $this->__log($Ures['id'], $this->m);
        $this->out->e(200, "绑定成功");
    }

    public function __getUdid()
    {//获取已绑定设备列表
        $checkRules = [
            'token' => ['Jwt', '', 'Token令牌有误'],
        ];
        $dataChecker = t('dataChecker', $_POST, $checkRules);
        $res = $dataChecker->check();
        if (!$res) $this->out->e(201, $dataChecker->error);

        $Ures = $this->__TokenCheck();
        $this->out->setData(['list' => json_decode($Ures['client_list'], true)])->e(200, '获取成功');
    }

    public function __reUdid()
    {//解绑设备
        $checkRules = [
            'token' => ['Jwt', '', 'Token令牌有误'],
            'udid' => ['udid', '1,128', '机器码有误'],
        ];
        $dataChecker = t('dataChecker', $_POST, $checkRules);
        $res = $dataChecker->check();
        if (!$res) $this->out->e(201, $dataChecker->error);

        $Ures = $this->__TokenCheck();
        $client_Arr = json_decode($Ures['client_list'], true);
        $find = false;
        $client = [];
        foreach ($client_Arr as $rows) {
            if ($rows['udid'] == $_POST['udid']) {
                $find = true;
            } else {
                $client[] = ['udid' => $rows['udid'], 'time' => $rows['time']];
            }
        }
        if (!$find) $this->out->e(201, '解绑设备不存在');

        $data = ['client_list' => json_encode($client)];
        if ($this->app['logon_mc_unbdeVal'] > 0) {
            if ($this->app['logon_mc_unbdeType'] == 'vip') {
                if ($Ures['vip'] < time()) $this->out->e(170);//VIP到期无法解绑
                if ($Ures['vip'] < 9999999999) {
                    $data['vip'] = $Ures['vip'] - $this->app['logon_mc_unbdeVal'];
                }
            } else {
                if ($Ures['fen'] < $this->app['logon_mc_unbdeVal']) $this->out->e(171);//积分余额不足
                $data['fen'] = $Ures['fen'] - $this->app['logon_mc_unbdeVal'];
            }
        }
        $upRes = $this->db->where('id = ?', [$Ures['id']])->update($data);
        if (!$upRes) {
            $this->__log($Ures['id'], $this->m, 201);
            $this->out->e(201, "解绑失败");
        }
        $this->__log($Ures['id'], $this->m);
        $this->out->e(200, "解绑成功");
    }

    public function __bindUdid()
    {//绑定设备
        $checkRules = [
            'token' => ['Jwt', '', 'Token令牌有误'],
            'udid' => ['udid', '1,128', '机器码有误'],
        ];
        $dataChecker = t('dataChecker', $_POST, $checkRules);
        $res = $dataChecker->check();
        if (!$res) $this->out->e(201, $dataChecker->error);

        $Ures = $this->__TokenCheck();
        $client_Arr = json_decode($Ures['client_list'], true);
        if (count($client_Arr) >= $this->app['logon_mc_num'] + $Ures['client_max']) $this->out->e(172);//绑定上限

        foreach ($client_Arr as $rows) {
            if ($rows['udid'] == $_POST['udid']) {
                $this->out->e(200, "绑定成功");
            }
        }

        $client_Arr[] = ['udid' => $_POST['udid'], 'time' => $rows['time']];
        $upRes = $this->db->where('id = ?', [$Ures['id']])->update(['client_list' => json_encode($client_Arr)]);
        if (!$upRes) {
            $this->__log($Ures['id'], $this->m, 201);
            $this->out->e(201, "绑定失败");
        }
        $this->__log($Ures['id'], $this->m);
        $this->out->e(200, "绑定成功");
    }

    public function __subordinate()
    {//下级列表
        $checkRules = [
            'token' => ['Jwt', '', 'Token令牌有误'],
            'pg' => ['int', '1,11', '页面有误', 1],
        ];
        $dataChecker = t('dataChecker', $_POST, $checkRules);
        $res = $dataChecker->check();
        if (!$res) $this->out->e(201, $dataChecker->error);

        $Ures = $this->__TokenCheck();
        $page = isset($_POST['pg']) ? (intval($_POST['pg']) >= 1 ? intval($_POST['pg']) : 1) : 1;

        if ($Ures['agent']) {
            $list = $this->db->where('inviter_id = ? and appid = ?', [$Ures['id'], $this->app['id']])->order('id desc')->page($page, 10)->fetchAll('IFNULL(acctno,IFNULL(email,phone)) as user,nickname,avatars,vip,fen,reg_time,ban,ban_msg');
        } else {
            $list = $this->db->where('inviter_id = ? and appid = ?', [$Ures['id'], $this->app['id']])->order('id desc')->page($page, 10)->fetchAll('IFNULL(acctno,IFNULL(email,phone)) as user,nickname,avatars');
        }

        $this->out->setData($list)->e(200, '获取成功');
    }

    public function __agentInfo()
    {//代理获取信息
        $checkRules = [
            'token' => ['Jwt', '', 'Token令牌有误']
        ];
        $dataChecker = t('dataChecker', $_POST, $checkRules);
        $res = $dataChecker->check();
        if (!$res) $this->out->e(201, $dataChecker->error);

        $Ures = $this->__TokenCheck();

        if (!$Ures['agent']) $this->out->e(181);
        $AGres = db('agent')->join("as AG LEFT JOIN {$this->db->pre}agent_group as AGG on (AG.aggid = AGG.id)")->where('AG.uid = ? and AG.appid = ?', [$Ures['id'], $this->app['id']])->fetch('AG.*,AGG.name');
        if (!$AGres) $this->out->e(201, '代理信息不存在');
        $this->out->setData($AGres)->e(200, '获取成功');
    }

    public function __agentGetkamigroup()
    {//代理获取卡密组列表
        $checkRules = [
            'token' => ['Jwt', '', 'Token令牌有误'],
            'pg' => ['int', '1,11', '页面有误', 1]
        ];
        $dataChecker = t('dataChecker', $_POST, $checkRules);
        $res = $dataChecker->check();
        if (!$res) $this->out->e(201, $dataChecker->error);

        $Ures = $this->__TokenCheck();

        if (!$Ures['agent']) $this->out->e(181);

        $AGdb = db('agent');
        $AGres = $AGdb->where('uid = ? and appid = ?', [$Ures['id'], $this->app['id']])->fetch();
        if (!$AGres) $this->out->e(201, '代理信息不存在');
        if ($AGres['state'] != 'on') $this->out->e(180);

        $page = isset($_POST['pg']) ? (intval($_POST['pg']) >= 1 ? intval($_POST['pg']) : 1) : 1;

        $list = db('kami_group')->page($page, 10)->fetchAll("id,name,type,price");
        $this->out->setData($list)->e(200, '获取成功');
    }

    public function __agentAddKaika()
    {//代理开卡
        $checkRules = [
            'token' => ['Jwt', '', 'Token令牌有误'],
            'kgid' => ['int', '1,11', '卡密组有误'],
            'num' => ['betweend', '1,10000', '卡密生成数量有误，一次最多生成1W张'],
            'note' => ['String', '1,64', '卡密备注不规范'],
            'pre' => ['Kami', '1,10', '卡密前缀不规范：1~10位字符']
        ];
        $dataChecker = t('dataChecker', $_POST, $checkRules);
        $res = $dataChecker->check();
        if (!$res) $this->out->e(201, $dataChecker->error);

        $Ures = $this->__TokenCheck();

        if (!$Ures['agent']) $this->out->e(181);

        $AGdb = db('agent');
        $AGres = $AGdb->where('uid = ? and appid = ?', [$Ures['id'], $this->app['id']])->fetch();
        if (!$AGres) $this->out->e(201, '代理信息不存在');
        if ($AGres['state'] != 'on') $this->out->e(180);

        $KGres = db('kami_group')->where('id = ? and appid = ?', [$_POST['kgid'], $this->app['id']])->fetch();
        if (!$KGres) $this->out->e(201, '创建卡密组不存在');

        $originalPrice = $KGres['price'] * $_POST['num'];//计费
        $discountedPrice = $originalPrice * ($AGres['km_discount'] / 10);

        if ($AGres['money'] < $discountedPrice) $this->out->e(182);
        $AGdb->beginTransaction();//开启事务
        $deductRes = $AGdb->where('id = ?', [$AGres['id']])->field(['money' => -$discountedPrice]);//扣除余额
        if (!$deductRes) $this->out->e(201, '开卡失败，请重试');

        $dbkey = 'kgid,cardNo,type,val,note,add_uid,add_time,add_ip,appid';
        $addData = [];
        $note = empty($_POST['note']) ? NULL : $_POST['note'];
        for ($i = 1; $i <= $_POST['num']; $i++) {
            $kami = $_POST['pre'] . strtoupper(str_shuffle(uniqid()) . getcode(4));
            $data = [$_POST['kgid'], $kami, $KGres['type'], $KGres['val'], $note, $Ures['id'], time(), $this->ip, $this->app['id']];
            $addData[] = $data;
        }
        $db = db('kami');
        $addRes = $db->addbatch($dbkey, $addData);
        $snum = $db->rowCount();
        if ($addRes && $snum >= 1) {
            $this->__log($Ures['id'], $this->m);
            $AGdb->commit();//进行提交
            $this->out->e(200, "卡密创建成功，本次添加：{$snum}条卡密，失败：" . ($_POST['num'] - $snum) . '条，计费：' . $discountedPrice . '元');
        } else {
            $AGdb->rollback();//回滚
            $this->__log($Ures['id'], $this->m, 201);
            $this->out->e(201, "卡密创建失败");
        }
    }

    public function __agentGetkami()
    {//代理获取卡密列表
        $checkRules = [
            'token' => ['Jwt', '', 'Token令牌有误'],
            'pg' => ['int', '1,11', '页面有误', 1]
        ];
        $dataChecker = t('dataChecker', $_POST, $checkRules);
        $res = $dataChecker->check();
        if (!$res) $this->out->e(201, $dataChecker->error);

        $Ures = $this->__TokenCheck();

        if (!$Ures['agent']) $this->out->e(181);

        $AGdb = db('agent');
        $AGres = $AGdb->where('uid = ? and appid = ?', [$Ures['id'], $this->app['id']])->fetch();
        if (!$AGres) $this->out->e(201, '代理信息不存在');
        if ($AGres['state'] != 'on') $this->out->e(180);

        $page = isset($_POST['pg']) ? (intval($_POST['pg']) >= 1 ? intval($_POST['pg']) : 1) : 1;

        $list = db('kami')->join("as K LEFT JOIN {$AGdb->pre}kami_group as KG on (K.kgid = KG.id) LEFT JOIN {$AGdb->pre}user as U on (K.use_uid=U.id)")->where('K.add_uid = ? and K.appid = ?', [$Ures['id'], $this->app['id']])->order('K.id desc')->page($page, 10)->fetchAll("K.type,K.cardNo,K.note,K.use_time,K.add_time,K.state,KG.name as Gname,IFNULL(U.phone,IFNULL(U.email,IFNULL(U.acctno,null))) as use_user");
        $this->out->setData($list)->e(200, '获取成功');
    }

    public function __agentSetCash()
    {//代理修改体现信息
        $checkRules = [
            'token' => ['Jwt', '', 'Token令牌有误'],
            'name' => ['string', '2,64', '提现姓名有误'],
            'account' => ['email,phone', '5，32', '提现账号有误'],
            'way' => ['sameone', 'wx,ali', '提现方式有误']
        ];
        $dataChecker = t('dataChecker', $_POST, $checkRules);
        $res = $dataChecker->check();
        if (!$res) $this->out->e(201, $dataChecker->error);

        $Ures = $this->__TokenCheck();

        if (!$Ures['agent']) $this->out->e(181);
        $AGdb = db('agent');
        $AGres = $AGdb->where('uid = ? and appid = ?', [$Ures['id'], $this->app['id']])->fetch();
        if (!$AGres) $this->out->e(201, '代理信息不存在');
        if ($AGres['state'] != 'on') $this->out->e(180);

        $updata = ['cash_name' => $_POST['name'], 'cash_account' => $_POST['account'], 'cash_way' => $_POST['way']];
        $upRes = db('agent')->where('uid = ? and appid = ?', [$Ures['id'], $this->app['id']])->update($updata);
        if (!$upRes) {
            $this->__log($Ures['id'], $this->m, 201);
            $this->out->e(201, "修改失败");
        }
        $this->__log($Ures['id'], $this->m);
        $this->out->e(200, "修改成功");
    }

    public function __agentCash()
    {//代理提现
        $checkRules = [
            'token' => ['Jwt', '', 'Token令牌有误'],
            'money' => ['money', '1,10000', '提现金额有误']
        ];
        $dataChecker = t('dataChecker', $_POST, $checkRules);
        $res = $dataChecker->check();
        if (!$res) $this->out->e(201, $dataChecker->error);

        $Ures = $this->__TokenCheck();

        if (!$Ures['agent']) $this->out->e(181);

        $AGdb = db('agent');
        $AGres = $AGdb->where('uid = ? and appid = ?', [$Ures['id'], $this->app['id']])->fetch();
        if (!$AGres) $this->out->e(201, '代理信息不存在');
        if ($AGres['state'] != 'on') $this->out->e(180);

        if ($AGres['money'] < $_POST['money']) $this->out->e(182);

        $AGdb->beginTransaction();//开启事务
        $deductRes = $AGdb->where('id = ?', [$AGres['id']])->field(['money' => -$_POST['money']]);//扣除余额
        $addID = db('agent_cash')->add(['agid' => $AGres['id'], 'name' => $AGres['cash_name'], 'account' => $AGres['cash_account'], 'way' => $AGres['cash_way'], 'money' => $_POST['money'], 'add_time' => time(), 'state' => 0, 'appid' => $this->app['id']]);
        if ($deductRes && $addID) {//确保两个都执行成功
            $AGdb->commit();//进行提交
            $this->__log($Ures['id'], $this->m);
            $this->out->e(200, "提现成功");
        } else {
            $AGdb->rollback();//回滚
            $this->__log($Ures['id'], $this->m, 201);
            $this->out->e(201, "提现失败");
        }
    }

    public function __agentGetCashLog()
    {//代理提现记录
        $checkRules = [
            'token' => ['Jwt', '', 'Token令牌有误'],
            'pg' => ['int', '1,11', '页面有误', 1]
        ];
        $dataChecker = t('dataChecker', $_POST, $checkRules);
        $res = $dataChecker->check();
        if (!$res) $this->out->e(201, $dataChecker->error);

        $Ures = $this->__TokenCheck();

        if (!$Ures['agent']) $this->out->e(181);

        $AGdb = db('agent');
        $AGres = $AGdb->where('uid = ? and appid = ?', [$Ures['id'], $this->app['id']])->fetch();
        if (!$AGres) $this->out->e(201, '代理信息不存在');
        if ($AGres['state'] != 'on') $this->out->e(180);

        $page = isset($_POST['pg']) ? (intval($_POST['pg']) >= 1 ? intval($_POST['pg']) : 1) : 1;

        $list = db('agent_cash')->where('agid = ?', [$AGres['id']])->page($page, 10)->fetchAll("name,account,way,money,add_time,end_time,state,rebut_msg");
        $this->out->setData($list)->e(200, '获取成功');
    }

    public function __logon()
    {//登录
        $checkRules = [
            'account' => ['email,phone,wordnum', '5,32', '登录账号有误'],
            'password' => ['Password', '6,18', '密码长度需要满足6-18位数,不支持中文以及.-*_以外特殊字符'],
            'udid' => ['udid', '1,128', '机器码有误']
        ];
        $dataChecker = t('dataChecker', $_POST, $checkRules);
        $res = $dataChecker->check();
        if (!$res) $this->out->e(201, $dataChecker->error);
        if ($this->app['logon_state'] == 'off') $this->out->e(103, $this->app['logon_off_msg']);//关闭登录

        $Ures = $this->db->join("as U LEFT JOIN {$this->db->pre}agent as A on (U.id = A.uid)")->where('(U.phone = ? or U.email = ? or U.acctno = ?) and U.password = ? and U.appid = ?', [$_POST['account'], $_POST['account'], $_POST['account'], md5($_POST['password']), $this->app['id']])->fetch('U.*,IF(A.id IS NOT NULL,true,false) AS agent');
        if (!$Ures) $this->out->e(126);//账号密码有误
        if ($Ures['ban'] > time()) $this->out->e(127, $Ures['ban_msg']);//账号被禁用

        $tokenState = 'y';
        if (empty($Ures['client_list'])) {
            $clientInfo = json_encode([['udid' => $_POST['udid'], 'time' => time()]]);//绑定机器码
            $res = $this->db->where('id = ?', [$Ures['id']])->update(['client_list' => $clientInfo]);
            $this->__log($Ures['id'], $this->m, 201);
            if (!$res) $this->out->e(201, '登录失败，请重试');
        } else {
            $client_Arr = json_decode($Ures['client_list'], true);
            $found_key = array_search($_POST['udid'], array_column($client_Arr, 'udid'));

            if ($found_key !== 0 && !$found_key) {//新设备登录
                if (count($client_Arr) >= $this->app['logon_mc_num'] + $Ures['client_max']) {
                    $tokenState = 'n';
                } else {
                    $client_Arr[] = ['udid' => $_POST['udid'], 'time' => time()];
                    $data = ['client_list' => json_encode($client_Arr)];
                    $res = $this->db->where('id = ?', [$Ures['id']])->update($data);
                    $this->__log($Ures['id'], $this->m, 201);
                    if (!$res) $this->out->e(201, '登录失败，请重试');
                }
            }
        }
        $token = $this->Token->get(['uid' => $Ures['id'], 'udid' => $_POST['udid'], 'p' => md5($Ures['password']), 'appid' => $this->app['id']]);
        $info = [
            'token' => $token,
            'tokenState' => $tokenState,
            'info' => [
                'uid' => $Ures['id'],
                'phone' => $Ures['phone'],
                'email' => $Ures['email'],
                'acctno' => $Ures['acctno'],
                'name' => $Ures['nickname'],
                'pic' => $Ures['avatars'],
                'invID' => $Ures['inviter_id'],
                'fen' => $Ures['fen'],
                'vipExpTime' => $Ures['vip'],
                'vipExpDate' => date("Y-m-d H:i:s", $Ures['vip']),
                'agent' => $Ures['agent']
            ]
        ];

        $this->__log($Ures['id'], $this->m);
        $this->out->setData($info)->e(200, '登录成功');
    }

    public function __reg()
    {//注册账号
        $checkRules = [
            'account' => [$this->app['reg_way'], '5,32', $this->app['reg_way'] == 'phone' ? '注册的手机号有误' : ($this->app['reg_way'] == 'email' ? '注册的邮箱有误' : '注册的账号有误，仅支持5~18位字母+数字')],
            'code' => ['int', '4,6', '验证码填写有误', true],
            'password' => ['Password', '6,18', '密码长度需要满足6-18位数,不支持中文以及.-*_以外特殊字符'],
            'invid' => ['int', '1,11', '邀请人ID填写有误', true],
            'udid' => ['udid', '1,128', '机器码有误']
        ];
        $dataChecker = t('dataChecker', $_POST, $checkRules);
        $res = $dataChecker->check();
        if (!$res) $this->out->e(201, $dataChecker->error);
        if ($this->app['reg_state'] == 'off') $this->out->e(102, $this->app['reg_off_msg']);//关闭注册

        $user = $this->app['reg_way'] == 'wordnum' ? 'acctNo' : $this->app['reg_way'];
        $res = $this->db->where("{$user} = ? and appid = ?", [$_POST['account'], $this->app['id']])->fetch();
        if ($res) $this->out->e(120);//账号已存在

        $regData = [$user => $_POST['account'], 'password' => md5($_POST['password']), 'vip' => 0, 'fen' => 0, 'reg_time' => $this->times, 'reg_ip' => $this->ip, 'reg_udid' => $_POST['udid'], 'appid' => $this->app['id']];

        if ($this->app['reg_time_ip'] > 0) {//获取IP重复注册间隔
            $ip_time = time() - $this->app['reg_time_ip'] * 3600;//小时单位
            $ip_res = $this->db->where('reg_ip = ? and appid = ? and reg_time > ?', [$this->ip, $this->app['id'], $ip_time])->fetch();//寻找相同IP
            if ($ip_res) $this->out->e(121);//该IP已注册
        }

        if ($this->app['reg_time_mc'] > 0 && !empty($_POST['udid'])) {//获取机器码重复注册间隔
            $in_time = time() - $this->app['reg_time_mc'] * 3600;//小时单位
            $in_res = $this->db->where('reg_mc = ? and appid = ? and reg_time > ?', [$_POST['udid'], $this->app['id'], $in_time])->fetch();//寻找相同机器码
            if ($in_res) $this->out->e(121);//该机器码已注册
        }

        if ($this->app['reg_way'] == 'phone' || $this->app['reg_way'] == 'email') {
            if (!isset($_POST['code']) || empty($_POST['code'])) $this->out->e(118);//验证码为空
            $dtime = time() - (60 * $this->app['vc_time']);//验证码有效期
            $vcDB = db('vcode');
            $res_code = $vcDB->where('eorp = ? and code = ? and type = ? and usable = ? and time > ? and appid = ?', [$_POST['account'], $_POST['code'], 'reg', 'y', $dtime, $this->app['id']])->update(['usable' => 'n']);
            if (!$res_code || $vcDB->rowCount() < 1) $this->out->e(119);//验证码不正确
        }

        if ($this->app['reg_award_val'] > 0) {//奖励事件
            if ($this->app['reg_award'] == 'vip') {
                $regData['vip'] = time() + $this->app['reg_award_val'];
            } else {
                $regData['fen'] += $this->app['reg_award_val'];
            }
        }

        if (isset($_POST['invid']) && !empty($_POST['invid'])) {//邀请奖励事件
            $inv_res = $this->db->where('id = ? and appid = ?', [$_POST['invid'], $this->app['id']])->fetch();//查询邀请者ID
            if (!$inv_res) $this->out->e(122);//邀请人不存在
            $regData['inviter_id'] = $_POST['invid'];

            if ($this->app['inviter_award_val'] > 0) {//邀请者奖励数
                $data = [];
                $logData = [];
                if ($this->app['inviter_award'] == 'vip') {
                    $logData['vip'] = '+' . $this->app['inviter_award_val'];
                    if ($inv_res['vip'] != 9999999999) {//奖励类型是VIP
                        if ($inv_res['vip'] > time()) {//VIP没有过期
                            $data['vip'] = $inv_res['vip'] + $this->app['inviter_award_val'];
                        } else {//VIP已过期
                            $data['vip'] = time() + $this->app['inviter_award_val'];
                        }
                    } else {
                        $data['vip'] = $inv_res['vip'];
                    }
                } else {
                    $logData['fen'] = '+' . $this->app['inviter_award_val'];
                    $data['fen'] = $inv_res['fen'] + $this->app['inviter_award_val'];
                }

                $res = $this->db->where('id = ? ', [$_POST['invid']])->update($data);//更新邀请人VIP数据
                if ($res) {
                    $this->__log($inv_res['id'], 'inviter_award', 200, $logData);
                } else {
                    $this->__log($inv_res['id'], 'inviter_award', 201, $logData);
                }
            }

            if ($this->app['invitee_award_val'] > 0) {//受邀者奖励事件
                if ($this->app['invitee_award'] == 'vip') {
                    if ($regData['vip'] > time()) {
                        $regData['vip'] += $this->app['invitee_award_val'];
                    } else {
                        $regData['vip'] = time() + $this->app['invitee_award_val'];
                    }
                } else {
                    $regData['fen'] += $this->app['invitee_award_val'];
                }
            }
        }
        $res = $this->db->add($regData);
        if (!$res) $this->out->e(201, '注册失败，请重试');
        $this->out->e(200, '注册成功');
    }

    public function __getCode()
    {//获取验证码
        $db = db('vcode');
        $checkRules = [
            'account' => ['email,phone', '5,32', '收信账号有误'],
            'type' => ['sameone', 'reg,repwd,ubind,remc', '验证码类型有误']//注册、重置密码、绑定账号、换绑机器码
        ];
        $dataChecker = t('dataChecker', $_POST, $checkRules);
        $res = $dataChecker->check();
        if (!$res) $this->out->e(201, $dataChecker->error);
        if ($this->app['vc_length'])
            $code = getNumbercode($this->app['vc_length']);

        $vcnum = $db->where('ip = ? and time between ? and ?', [$this->ip, timeRange(), timeRange(0, 1)])->count();
        if ($vcnum >= 10) $this->out->e(117);

        $vcRes = $db->where('eorp = ? and time > ?', [$_POST['account'], time() - 120])->fetch();
        if ($vcRes) $this->out->e(116);

        if (strpos($_POST['account'], '@')) {//邮箱
            if ($this->app['smtp_state'] != 'on' || empty($this->app['smtp_host']) || empty($this->app['smtp_user']) || empty($this->app['smtp_pass']) || empty($this->app['smtp_port'])) $this->out->e(104);
            $mailer = t('mailer');
            $mail_config = ['Host' => $this->app['smtp_host'], 'Port' => $this->app['smtp_port'], 'FromName' => $this->app['app_name'], 'Username' => $this->app['smtp_user'], 'Password' => $this->app['smtp_pass']];
            $type = ['reg' => '注册账号', 'repwd' => '重置密码', 'ubind' => '绑定账号', 'remc' => '设备换绑'];

            $title = $type[$_POST['type']] . ' - ' . $this->app['app_name'];
            $send_res = $mailer->send($mail_config, [$_POST['account']], $title, "您本次操作的验证码是：<b>{$code}</b>,有效期为{$this->app['vc_time']}分钟，请尽快完成验证");
            if ($send_res) {
                $db->add(['eorp' => $_POST['account'], 'type' => $_POST['type'], 'code' => $code, 'time' => time(), 'ip' => $this->ip, 'appid' => $this->app['id']]);
                $this->out->e(200, '验证码发送成功');
            } else {
                $this->out->e(201, '验证码发送失败');
            }
        } else {
            if ($this->app['sms_state'] != 'on') $this->out->e(105);
            $sms_config = json_decode($this->app['sms_config'], true);
            if (!is_array($sms_config)) $this->out->e(105);
            $sms = t('sms')->send($_POST['account'], $code, $this->app['vc_time'], $this->app['sms_type'], $sms_config);
            if (!$sms) $this->out->e(201, '验证码发送失败');
            if ($sms['code'] == 200) {
                $db->add(['eorp' => $_POST['account'], 'type' => $_POST['type'], 'code' => $code, 'time' => time(), 'ip' => $this->ip, 'appid' => $this->app['id']]);
                $this->out->e(200, '验证码发送成功');
            } else {
                $this->out->e(201, $sms['msg']);
            }
        }

    }

    public function __ini()
    {//获取配置
        $data = ['bb' => $this->app['ver']['ver_val'], 'new_content' => $this->app['ver']['ver_new_content'], 'new_url' => $this->app['ver']['ver_new_url']];
        $notice_res = db('app_notice')->where('appid = ? or appid is null', [$this->app['id']])->order('id desc')->fetch('content,time');//获取最新的通知

        $exten = [];
        $app_exten = [];
        $app_exten_res = db('app_extend')->where('appid = ? or appid is null', [$this->app['id']])->order('id desc')->fetchAll();//获取扩展配置

        foreach ($app_exten_res as $k => $v) {
            $rows = $app_exten_res[$k];
            isset($app_exten[$rows['var_key']]) || $app_exten[$rows['var_key']] = [];
            $app_exten[$rows['var_key']][] = [$rows['var_key'] => $rows['var_val']];
        }
        foreach ($app_exten as $k => $v) {
            if (count($app_exten[$k]) > 1) {
                $exten = array_merge($exten, [$k => $v]);
            } else {
                $value = $app_exten[$k][0];
                $exten = array_merge($exten, [$k => $value[$k]]);
            }
        }
        if (count($app_exten) > 0) {
            $data = array_merge($data, ['exten' => $exten]);
        }
        if (!empty($notice_res)) {
            $data = array_merge($data, ['notice' => $notice_res]);
        }
        $this->out->setData($data)->e(200);
    }

    public function index()
    {
        if (!U_POST) {
            $_POST = $_GET;
        }//如果不是POST请求，就吧GET请求传给POST
        if (count($this->gets) < 3) $this->out->e(201, 'api error');
        $appid = $this->gets[0];
        $ver = $this->gets[1];
        $this->m = $this->gets[2];
        $method = "__" . $this->m;
        if (!method_exists($this, $method)) $this->out->e(201, "api:{$this->m} error");
        $this->app = $this->__app($appid, $ver);
        $this->out = $this->out->setVer($this->app['ver'], $this->m);
        $this->__dataCheck();
        if ($this->app['app_state'] == 'off') $this->out->e(100, $this->app['app_off_msg']);
        if ($this->app['ver']['ver_state'] == 'off') $this->out->e(101, $this->app['ver']['ver_off_msg']);
        $this->$method();
    }

    protected function __app($id, $ver)
    {
        $appRes = db('app')->where('id = ?', [$id])->fetch();
        if (!$appRes) $this->out->e(201, "appid error");
        $verRes = db('app_ver')->where('appid = ? and ver_key = ?', [$id, $ver])->fetch();
        if (!$verRes) $this->out->e(201, "ver error");
        unset($verRes['id']);
        unset($verRes['appid']);
        $appRes['ver'] = $verRes;
        return $appRes;
    }

    protected function __dataCheck()
    {
        $encryption = !in_array($this->m, explode(",", $this->appConfig['API_WHITE'])) ? true : false;
        if ($_POST && $encryption) {
            $sign = isset($_POST['sign']) ? $_POST['sign'] : '';
            if ($this->app['ver']['mi_state'] == 'on') {
                if (!isset($_POST['data']) || empty($_POST['data'])) $this->out->e(111);
                if (empty($this->app['ver']['mi_key'])) $this->out->e(112);
                $mi_key = json_decode($this->app['ver']['mi_key'], true);
                if (!isset($mi_key[$this->app['ver']['mi_type']])) $this->out->e(112);

                $keyConfig = $mi_key[$this->app['ver']['mi_type']];
                if ($this->app['ver']['mi_type'] == 'rc4') {
                    $dedata = t('Rc4')->mi($_POST['data'], $keyConfig, 1);
                    if (empty($dedata)) $this->out->e(113);
                    unset($_POST['data']);
                    $_POST = txtArr($dedata);
                } elseif ($this->app['ver']['mi_type'] == 'aes') {
                    if (!isset($keyConfig['key']) || !isset($keyConfig['iv'])) $this->out->e(112);
                    $aes = t('Aes', $keyConfig['key'], $keyConfig['iv']);
                    $dedata = $aes->decode($_POST['data']);
                    if (empty($dedata)) $this->out->e(113);
                    unset($_POST['data']);
                    $_POST = txtArr($dedata);
                } elseif ($this->app['ver']['mi_type'] == 'rsa') {
                    if (!isset($keyConfig['private'])) $this->out->e(112);
                    $Rsa = t('Rsa');//实例化对象
                    $dedata = $Rsa->privateDecrypt($_POST['data'], $keyConfig['private']);
                    if (empty($dedata)) $this->out->e(113);
                    unset($_POST['data']);
                    $_POST = txtArr($dedata);
                } else {
                    $this->out->e(114);
                }
            }

            if ($this->app['ver']['mi_time'] > 0) {
                if (!isset($_POST['time']) || (time() - intval($_POST['time'])) > $this->app['ver']['mi_time']) $this->out->e(110);
            }

            if ($this->app['ver']['mi_sign'] == 'on') {
                if (empty($sign) || $sign != arrSign($_POST, $this->app['app_key'])) $this->out->e(109);
            }
        }
    }

    public function __query()
    {//查询订单支付状态
        $checkRules = [
            'token' => ['Jwt', '', 'Token令牌有误'],
            'order' => ['int', '19,19', '订单号有误'],
        ];
        $dataChecker = t('dataChecker', $_POST, $checkRules);
        $res = $dataChecker->check();
        if (!$res) $this->out->e(201, $dataChecker->error);

        $Ures = $this->__TokenCheck();
        $gDB = db('order');
        $list = $gDB->where('uid = ? and appid = ? and order_no = ?', [$Ures['id'], $this->app['id'], $_POST['order']])->order('id desc')->fetch('order_no,trade_no,name,money,ptype,add_time,end_time,state');

        $this->out->setData(json_encode($list))->e(200, "查询成功");
    }

    public function __notice()
    {//获取通知列表
        $checkRules = [
            'token' => ['Jwt', '', 'Token令牌有误'],
        ];
        $dataChecker = t('dataChecker', $_POST, $checkRules);
        $res = $dataChecker->check();
        if (!$res) $this->out->e(201, $dataChecker->error);

        $Ures = $this->__TokenCheck();
        $gDB = db('app_notice');
        $gDB = $gDB->where('appid = ? or appid is null', [$this->app['id']]);
        $list = $gDB->order('id desc')->fetchAll();
        $lists = array('公告' => $list);
        $this->out->setData(json_encode($lists))->e(200, "查询成功");
    }

    public function __Filelist()
    {//获取文件列表
        $checkRules = [
            'token' => ['Jwt', '', 'Token令牌有误'],
        ];
        $dataChecker = t('dataChecker', $_POST, $checkRules);
        $res = $dataChecker->check();
        if (!$res) $this->out->e(201, $dataChecker->error);

        $Ures = $this->__TokenCheck();
        $gDB = db('file');
        $gDB = $gDB->where('appid = ? or appid is null', [$this->app['id']]);
        $list = $gDB->order('id desc')->fetchAll();
        $this->out->setData(['list' => $list])->e(200, '获取成功');

    }


    public function __imgs()
    {//获取图片地址
        $checkRules = [
            'token' => ['Jwt', '', 'Token令牌有误'],
            'pid' => ['int', '1,11', '操作ID有误']
        ];
        $dataChecker = t('dataChecker', $_POST, $checkRules);
        $res = $dataChecker->check();
        if (!$res) $this->out->e(201, $dataChecker->error);
        $Ures = $this->__TokenCheck();
        $gDB = db('img_list');
        $list = $gDB->where('appid = ? and id = ?', [$this->app['id'], $_POST['pid']])->order('id desc')->fetch('img_url,img_state,img_off_msg');

        if ($list != null) {

            if ($list['img_state'] === 'on') {
                $lists = "http://" . $_SERVER['HTTP_HOST'] . $list["img_url"];
                $this->out->setData($lists)->e(200, '查询成功');

            } else {
                $this->out->setData($list['img_off_msg'])->e(201, '查询失败');
            }

        } else {
            $this->out->setData("请检查参数是否正确")->e(201, '查询失败');
        }

    }

    public function __getFile()
    {//获取文章详情
        $checkRules = [
            'token' => ['Jwt', '', 'Token令牌有误'],
            'id' => ['int', '1,11', '文章ID有误']
        ];
        $dataChecker = t('dataChecker', $_POST, $checkRules);
        $res = $dataChecker->check();
        if (!$res) $this->out->e(201, $dataChecker->error);
        $Ures = $this->__TokenCheck();
        $gDB = db('file');
        $list = $gDB->where('appid = ? and id = ?', [$this->app['id'], $_POST['id']])->order('id desc')->fetch('filetitle,filecontent,reg_time,up_time');

        if ($list != null) {
            $this->out->setData($list)->e(200, '查询成功');

        } else {
            $this->out->setData("请检查参数是否正确")->e(201, '查询失败');
        }

    }


    public function __setFile()
    {//修改文章标题和内容
        $checkRules = [
            'token' => ['Jwt', '', 'Token令牌有误'],
            'id' => ['int', '1,11', '操作ID有误'],
            'title' => ['string', '1,999999', '文章标题有误'],
            'content' => ['string', ',999999', '文章内容有误']
        ];

        $dataChecker = t('dataChecker', $_POST, $checkRules);
        $res = $dataChecker->check();
        if (!$res) $this->out->e(201, $dataChecker->error);
        $Ures = $this->__TokenCheck();
        $gDB = db('file');
        $upRes = $gDB->where('appid = ? and id = ?', [$this->app['id'], $_POST['id']])->update(['filetitle' => $_POST['title'], 'filecontent' => $_POST['content'], 'up_time' => time()]);
        if (!$upRes) {
            $this->__log($Ures['id'], $this->m, 201);
            $this->out->e(201, "更新失败");
        }
        $this->__log($Ures['id'], $this->m);
        $this->out->e(200, "更新成功");
    }


    public function __UpCount()
    {//记录IP访问次数
        $checkRules = [
            'token' => ['Jwt', '', 'Token令牌有误'],
        ];
        $dataChecker = t('dataChecker', $_POST, $checkRules);
        $res = $dataChecker->check();
        if (!$res) $this->out->e(201, $dataChecker->error);
        $Ures = $this->__TokenCheck();
        $gDB = db('counts');
        $tDB = db('counts_today');
        // 统计访问次数和访问人数
        $ip = $this->ip;  // 获取访问者的IP地址
        $today = date('Y-m-d');  // 获取当前日期
        // 检查IP是否已存在于数据库中
        $result = $gDB->where('appid = ? and ip = ?', [$this->app['id'], $ip])->fetch();

        if (!$result) {
            // IP不存在，插入新的记录
            $addData = ['appid' => $this->app['id'], 'ip' => $ip, 'count' => '1', 'date' => $today];
            $upRes = $gDB->add($addData);
        } else {
            //IP已存在，更新访问次数和日期
            $upRes = $gDB->where('appid = ? and ip = ?', [$this->app['id'], $ip])->update(['count' => $result['count'] + 1]);
        }

        // 检查今日访问记录是否已存在
        $result = $tDB->where('appid = ? and date = ?', [$this->app['id'], $today])->fetch();

        if ($result) {
            // 今日访问记录已存在，更新访问人数
            $visitorsArray = explode(",", $result['visitors']);
            if (!in_array($ip, $visitorsArray)) {
                // IP不在今日访客列表中，添加IP并更新记录
                array_push($visitorsArray, $ip);
                $visitors = implode(",", $visitorsArray);
                $tDB->where('appid = ? and date = ?', [$this->app['id'], $today])->update(['visitors' => $visitors]);
            }
        } else {
            // 今日访问记录不存在，插入新的记录
            $visitors = $ip;
            $tDB->add(['appid' => $this->app['id'], 'date' => $today, 'visitors' => $visitors]);
        }

        if (!$upRes) {
            $this->__log($Ures['id'], $this->m, 201);
            $this->out->e(201, "操作失败");
        }

        // 统计总访问次数和总访问人数
        $totalVisits = $gDB->where('appid = ?', [$this->app['id']])->fetch("SUM(count) as total_visits");
        $totalVisitors = $gDB->where('appid = ?', [$this->app['id']])->count("DISTINCT ip");

        // 统计当日访问次数和当日访问人数
        $todayVisits = $gDB->where('appid = ? and date = ?', [$this->app['id'], $today])->fetch("SUM(count) as today_visits");
        $todayVisitors = $tDB->where('appid = ? and date = ?', [$this->app['id'], $today])->fetch("COUNT(DISTINCT visitors) as today_visitors");

        // 将统计数据加入$data数组
        $data['visits'] = [
            'total_visits' => $totalVisits ? $totalVisits['total_visits'] : 0,          //总访问次数
            'total_visitors' => $totalVisitors,                                         //总访问人数
            'today_visits' => $todayVisits ? $todayVisits['today_visits'] : 0,          //当日访问次数
            'today_visitors' => $todayVisitors ? $todayVisitors['today_visitors'] : 0   //当日访问人数
        ];

        $this->__log($Ures['id'], $this->m);
        $this->out->setData($data)->e(200, "操作成功");

    }


    public function __GetNotice()
    { // 获取通知内容
        $checkRules = [
            'token' => ['Jwt', '', 'Token令牌有误'],
            'id' => ['int', '1,11', '操作ID有误'],
        ];
        $dataChecker = t('dataChecker', $_POST, $checkRules);
        $res = $dataChecker->check();
        if (!$res) $this->out->e(201, $dataChecker->error);

        $Ures = $this->__TokenCheck();
        $userId = $Ures['id']; // 获取当前用户的ID
        $noticeId = $_POST['id']; // 获取公告ID

        $gDB = db('app_notice');
        $notice = $gDB->where('id = ?', [$noticeId])->fetch();

        if ($notice) {
            // 检查用户是否已经阅读过这条公告
            $userNoticesDB = db('user_notices');
            $userNotice = $userNoticesDB->where('user_id = ? AND notice_id = ?', [$userId, $noticeId])->fetch();

            // 如果用户没有阅读过，则标记为已读并增加visit计数
            if (!$userNotice) {
                // 插入已读记录
                $userNoticesDB->add([
                    'user_id' => $userId,
                    'notice_id' => $noticeId,
                    'has_read' => 1
                ]);
                // 更新公告的visit计数
                $gDB->where('id = ?', [$noticeId])->update(['visit' => $notice['visit'] + 1]);
            }

            // 记录日志并返回公告内容
            $this->__log($Ures['id'], $this->m);
            $this->out->setData($notice)->e(200, '获取成功');
        } else {
            $this->__log($Ures['id'], $this->m, 201);
            $this->out->setData("请检查参数是否正确")->e(201, '查询失败');
        }
    }


}