<?php include_once 'header.php'; ?>

<div class="row" id="img_list">

</div>


<div class="modal fade" id="modal_ver" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static"
     data-keyboard="false">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modal_title">
                    添加图片
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form>
                    <input type="number" class="form-control" id="img_id" placeholder="1001" hidden>
                    <div class="form-group row">
                        <label class="col-sm-3 col-form-label">图片分组</label>
                        <div class="col-sm-8">
                            <select class="form-control" id="img_group"></select>
                        </div>
                        <a href="javascript:get_img(true);" id="add_img_refresh">刷新</a>
                    </div>
                    <div class="form-group row">
                        <label class="col-sm-3 col-form-label">图片名称</label>
                        <div class="col-sm-8">
                            <input type="text" class="form-control" id="img_name" placeholder="首页头图">
                        </div>
                    </div>
<!--                    <div class="form-group row">
                        <label class="col-sm-3 col-form-label">图片分组</label>
                        <div class="col-sm-8">
                            <input type="text" class="form-control" id="img_group" placeholder="默认">
                        </div>
                    </div>-->

                    <div class="form-group row">
                        <label class="col-sm-3 col-form-label">上传图片</label>
                        <div class="avatar avatar-lg">
                            <a href="javascript:upload_logo();">
                                <img id="img_url"
                                     src="/<? echo !empty($this->app['img_url']) && file_exists($this->app['img_url']) ? $this->app['img_url'] : 'assets/images/add.png'; ?>"
                                     class="avatar-img img-add">
                            </a>
                            <input style="display: none" id="app_img" type="file" onchange="showlogo(this);"
                                   accept="image/*" multiple/>
                            <input style="display: none" id="img_base64" type="text"/>
                        </div>
                    </div>

                    <div id="modal_edit_img_state" hidden>
                        <div class="form-group row">
                            <label class="col-9 col-form-label">图片开关</label>
                            <div class="col-3">
                                <div class="float-right">
                                    <div class="custom-switch">
                                        <input type="checkbox" class="custom-control-input success" id="img_state"
                                               onclick="checked_state('img_off_msg_div',this.checked);">
                                        <label class="custom-control-label success" for="img_state"></label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-group row" id="img_off_msg_div" hidden>
                            <label class="col-sm-4">图片关闭提示</label>
                            <div class="col-sm-8">
                                    <textarea class="form-control" id="img_off_msg" rows="4"
                                              placeholder="如：当前图片维护中"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="form-group mb-2">
                        <button type="submit" class="btn btn-primary btn-block" id="submit">提交</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div id="del_ver" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-sm">
        <div class="modal-content">
            <div class="modal-body p-4">
                <div class="text-center">
                    <h4 class="mt-2">删除警告</h4>
                    <p class="mt-3">确认删除版本：<strong class="text-danger me-1" id="del_name">null</strong> ？<br>删除后不可恢复！请慎重操作
                    </p>
                    <input type="number" class="form-control" id="del_id" placeholder="1" hidden>
                    <button type="button" class="btn btn-danger mr-2 my-2" id="del_submit">确认删除</button>
                    <button type="button" class="btn btn-light" data-dismiss="modal">取消删除</button>
                </div>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div><!-- /.modal -->

<script>
    function init(i, n = {}) {
        return initSubmit = i, $.ajax({
            cache: !1, type: "POST", data: i, dataType: "json", success: function (i) {
                initSuccess(i, n)
            }, error: function (i, t, c) {
                initError(t, n)
            }
        }), get_img();
            !1
    }


    function upload_logo() {
        $("#app_img").click()
    }

    function showlogo(a) {
        var e = a.files[0];
        if (!e) return $("#img_url").attr("src", "/assets/images/add.png"), $("#img_url").removeClass("show"), !1;
        if (e.size > 1048576) return cocoMessage.warning("上传图片大小不可超过1MB", 2e3), !1;
        var p = new FileReader;
        p.onload = function (a) {
            console.log(a),
                $("#img_url").attr("src", a.target.result),
                $("#img_base64").val(a.target.result),
                $("#img_url").addClass("show")
        }, p.readAsDataURL(e)
    }


    function add_list(e, i = !1) {
        i && $("#img_list").empty();
        for (var a = 0; a < e.length; a++) {
            var t = '<div class="card shadow"><div class="card-header mt-1"><span class="card-title h6">' + e[a].img_name + "  | " + e[a].img_group + '</span><div class="float-right"><div class="dropdown"><a class="text-muted ml-1 text-decoration-none" href="javascript:;" id="dr1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fe fe-edit-2 fe-16"></i></a><div class="dropdown-menu dropdown-menu-right" aria-labelledby="dr1"><a class="dropdown-item" href="javascript:edit_list(\'' + base64_encode(JSON.stringify(e[a])) + '\');">编辑</a><a class="dropdown-item" href="javascript:del_list(' + e[a].id + ",'" + e[a].img_name + '\');">删除</a></div></div></div></div><div class="card-body my-n2"><div class="row align-items-center"><div class="col-12" style="white-space: nowrap;"><div class="mb-2"><p class="text-muted d-inline">图片开关：</p><div class="float-right"><div class="custom-switch"><input type="checkbox" class="custom-control-input success" id="img_state_' + e[a].id + '" ' + ("on" == e[a].img_state ? "checked" : "") + ' onclick="edit_switch(' + e[a].id + ',\'img_state\');"><label class="custom-control-label success" for="img_state_' + e[a].id + '"></label></div></div></div></div><div class="card-body my-n2" style="height: 205px; display: flex; align-items: center; justify-content: center;"><div class="avatar avatar-xl mb-2" style="display: inline-block; vertical-align: middle;"><img src="' + e[a].img_url + '" class="avatar-img" style="max-width: 100%; max-height: 100%; vertical-align: middle;"></div></div></div></div>';
            $("#ver_" + e[a].id).length > 0 ? $("#ver_" + e[a].id).html(t) : i ? $("#img_list").append('<div class="col-md-6 col-lg-4 col-xl-3 mb-4" id="ver_' + e[a].id + '">' + t + "</div>") : $("#img_list").prepend('<div class="col-md-6 col-lg-4 col-xl-3 mb-4" id="ver_' + e[a].id + '">' + t + "</div>")
        }
        $("#img_list").children().length >= 13 ? $("#add_ver").attr("hidden", !0) : $("#add_ver").length < 1 && $("#img_list").append('<div class="col-md-6 col-lg-4 col-xl-3 mb-4" onclick="modal_show()" id="add_ver"><div class="card shadow" style="cursor: pointer;"><div class="card-body my-n2" style="height: 310px;"><div class="avatar avatar-lg mb-2" style="padding-top: 120px;margin-left: calc(50% - 32px);"><img src="/assets/images/plus.svg" class="avatar-img"></div><p class="text-muted text-center mb-0">添加图片</p></div></div></div>')
    }

    function edit_list(e) {
        var i = base64_decode(e), a = JSON.parse(i.replace(/\n/g, "\\n").replace(/\r/g, "\\r"));
        $("#modal_title").html("编辑图片"), $("#modal_edit_img_state").attr("hidden", !1), $("#img_id").val(a.id), $("#img_group").val(a.img_group), $("#img_name").val(a.img_name), $("#img_url").attr("src", a.img_url), $("#img_state").prop("checked", "on" == a.img_state), $("#modal_ver").modal("show");
    }

    function edit_switch(e, i) {
        $("#" + i + "_" + e).attr("disabled", !0);
        var a = {act: "edit_state"};
        return a.id = e, a[i] = $("#" + i + "_" + e).prop("checked") ? "on" : "off", $.ajax({
            cache: !1,
            type: "POST",
            data: a,
            dataType: "json",
            success: function (a) {
                $("#" + i + "_" + e).attr("disabled", !1), 200 == a.code ? cocoMessage.success("编辑成功", 2e3) : (cocoMessage.error(a.msg, 2e3), $("#" + i + "_" + e).prop("checked") ? $("#" + i + "_" + e).prop("checked", !1) : $("#" + i + "_" + e).prop("checked", !0))
            },
            error: function (a, t, s) {
                $("#" + i + "_" + e).attr("disabled", !1), cocoMessage.error(t, 2e3), $("#" + i + "_" + e).prop("checked") ? $("#" + i + "_" + e).prop("checked", !1) : $("#" + i + "_" + e).prop("checked", !0)
            }
        }), !1
    }

    function checked_state(e, i) {
        $("#" + e).attr("hidden", i)
    }

    function modal_show() {
        $("#modal_edit_img_state").attr("hidden", !0),
            $("#ver_id").val(""),
            $("#modal_title").html("添加图片"),
            $("#img_group").val(""),
            $("#img_name").val(""),
            $("#img_url").val(""),
            $("#img_state").prop("checked", !1),
            $("#modal_ver").modal("show")
    }

    function del_list(e, i) {
        $("#del_name").html(i), $("#del_id").val(e), $("#del_ver").modal("show")
    }


    function sy_copy(e) {
        const i = document.createElement("input");
        i.setAttribute("value", e), document.body.appendChild(i), i.select(), document.execCommand("copy"), document.body.removeChild(i), cocoMessage.success("复制成功", 2e3)
    }

    var iniimg = !1;

    function get_img(t = !1) {
        return !(!t && iniimg) && ($("#add_img_refresh").html('<i class="spinner-ui fe fe-rotate-cw fe-12 mr-2"></i>刷新中'), $.ajax({
            cache: !1,
            type: "POST",
            data: {act: "get_img"},
            dataType: "json",
            success: function (t) {
                if (200 == t.code) {
                    var e = t.data.list;
                    if (e.length >= 1) {
                        $("#img_group").empty();
                        for (var d = 0; d < e.length; d++) $("#img_group").append('<option value="' + e[d].id + '">' + e[d].name + "</option>");
                        iniimg = !0
                    } else $("#img_group").append('<option value="0">请先添加图片组</option>')
                }
                $("#add_img_refresh").html("刷新")
            },
            error: function (t, e, d) {
                $("#add_img_refresh").html("刷新")
            }
        }), !1)
    }


    $("#submit").click(function () {
        var e = {};

        return e.act = "编辑图片" == $("#modal_title").html() ? "edit" : "add",
        "edit" == e.act && (e.id = $("#img_id").val(),
            e.img_state = $("#img_state").prop("checked") ? "on" : "off",
            e.img_off_msg = $("#img_off_msg").val()),
            e.img_group = $("#img_group").text(),
            e.img_pgid = $("#img_group").val(),
            e.img_name = $("#img_name").val(),
            e.img_url = $("#img_base64").val(),
            $("#submit").html('<i class="spinner-ui fe fe-rotate-cw fe-12 mr-2"></i>正在提交'),
            $("#submit").attr("disabled", !0),
            $.ajax({
                cache: !1,
                type: "POST",
                data: e,
                dataType: "json",
                success: function (i) {
                    $("#submit").html("提交"),
                        $("#submit").attr("disabled", !1),
                        200 == i.code ? ("edit" == e.act ? (cocoMessage.success("更新成功", 2e3),
                            add_list(i.data.list)) : (cocoMessage.success("添加成功", 2e3),
                            add_list(i.data.list)),
                            $("#modal_ver").modal("hide")) : cocoMessage.error(i.msg, 2e3)
                },
                error: function (e, i, a) {
                    cocoMessage.error("系统发生错误，请打开浏览器调试模式查看具体原因", 2e3), $("#submit").html("提交"), $("#submit").attr("disabled", !1)
                }
            }), !1
    }), $("#del_submit").click(function () {
        var e = $("#del_id").val();
        return $("#del_submit").html('<i class="spinner-ui fe fe-rotate-cw fe-12 mr-2"></i>正在删除'), $("#del_submit").attr("disabled", !0), $.ajax({
            cache: !1,
            type: "POST",
            data: {act: "del", id: e},
            dataType: "json",
            success: function (i) {
                if ($("#del_submit").html("确认删除"), $("#del_submit").attr("disabled", !1), 200 == i.code) if ($("#ver_" + e).remove(), cocoMessage.success(i.msg, 2e3), $("#del_ver").modal("hide"), $("#img_list").children().length >= 13) $("#add_ver").attr("hidden", !0); else $("#add_ver").attr("hidden", !1); else cocoMessage.error(i.msg, 2e3)
            }
        }), !1
    });




    function base64ToBlob(base64Data, contentType) {
        contentType = contentType || '';
        var sliceSize = 1024;
        var byteCharacters = atob(base64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, {type: contentType});
    }


</script>
<?php include_once 'footer.php'; ?>



