/*popper.min.js*/
!function (e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : e.Popper = t()
}(this, function () {
    "use strict";

    function i(e) {
        return e && "[object Function]" === {}.toString.call(e)
    }

    function y(e, t) {
        if (1 !== e.nodeType) return [];
        var n = e.ownerDocument.defaultView.getComputedStyle(e, null);
        return t ? n[t] : n
    }

    function h(e) {
        return "HTML" === e.nodeName ? e : e.parentNode || e.host
    }

    function m(e) {
        if (!e) return document.body;
        switch (e.nodeName) {
            case"HTML":
            case"BODY":
                return e.ownerDocument.body;
            case"#document":
                return e.body
        }
        var t = y(e), n = t.overflow, o = t.overflowX, r = t.overflowY;
        return /(auto|scroll|overlay)/.test(n + r + o) ? e : m(h(e))
    }

    function g(e) {
        return e && e.referenceNode ? e.referenceNode : e
    }

    function v(e) {
        return 11 === e ? q : 10 !== e && q || z
    }

    function w(e) {
        if (!e) return document.documentElement;
        for (var t = v(10) ? document.body : null, n = e.offsetParent || null; n === t && e.nextElementSibling;) n = (e = e.nextElementSibling).offsetParent;
        var o = n && n.nodeName;
        return o && "BODY" !== o && "HTML" !== o ? -1 !== ["TH", "TD", "TABLE"].indexOf(n.nodeName) && "static" === y(n, "position") ? w(n) : n : e ? e.ownerDocument.documentElement : document.documentElement
    }

    function l(e) {
        return null === e.parentNode ? e : l(e.parentNode)
    }

    function b(e, t) {
        if (!(e && e.nodeType && t && t.nodeType)) return document.documentElement;
        var n = e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING, o = n ? e : t, r = n ? t : e,
            i = document.createRange();
        i.setStart(o, 0), i.setEnd(r, 0);
        var s, f, a = i.commonAncestorContainer;
        if (e !== a && t !== a || o.contains(r)) return "BODY" === (f = (s = a).nodeName) || "HTML" !== f && w(s.firstElementChild) !== s ? w(a) : a;
        var p = l(e);
        return p.host ? b(p.host, t) : b(e, l(t).host)
    }

    function E(e, t) {
        var n = "top" === (1 < arguments.length && void 0 !== t ? t : "top") ? "scrollTop" : "scrollLeft",
            o = e.nodeName;
        if ("BODY" !== o && "HTML" !== o) return e[n];
        var r = e.ownerDocument.documentElement;
        return (e.ownerDocument.scrollingElement || r)[n]
    }

    function u(e, t) {
        var n = "x" === t ? "Left" : "Top", o = "Left" == n ? "Right" : "Bottom";
        return parseFloat(e["border" + n + "Width"]) + parseFloat(e["border" + o + "Width"])
    }

    function r(e, t, n, o) {
        return R(t["offset" + e], t["scroll" + e], n["client" + e], n["offset" + e], n["scroll" + e], v(10) ? parseInt(n["offset" + e]) + parseInt(o["margin" + ("Height" === e ? "Top" : "Left")]) + parseInt(o["margin" + ("Height" === e ? "Bottom" : "Right")]) : 0)
    }

    function x(e) {
        var t = e.body, n = e.documentElement, o = v(10) && getComputedStyle(n);
        return {height: r("Height", t, n, o), width: r("Width", t, n, o)}
    }

    function O(e) {
        return X({}, e, {right: e.left + e.width, bottom: e.top + e.height})
    }

    function L(e) {
        var t, n, o = {};
        try {
            v(10) ? (o = e.getBoundingClientRect(), t = E(e, "top"), n = E(e, "left"), o.top += t, o.left += n, o.bottom += t, o.right += n) : o = e.getBoundingClientRect()
        } catch (e) {
        }
        var r, i = {left: o.left, top: o.top, width: o.right - o.left, height: o.bottom - o.top},
            s = "HTML" === e.nodeName ? x(e.ownerDocument) : {}, f = s.width || e.clientWidth || i.width,
            a = s.height || e.clientHeight || i.height, p = e.offsetWidth - f, l = e.offsetHeight - a;
        return (p || l) && (p -= u(r = y(e), "x"), l -= u(r, "y"), i.width -= p, i.height -= l), O(i)
    }

    function T(e, t, n) {
        var o = 2 < arguments.length && void 0 !== n && n, r = v(10), i = "HTML" === t.nodeName, s = L(e), f = L(t),
            a = m(e), p = y(t), l = parseFloat(p.borderTopWidth), u = parseFloat(p.borderLeftWidth);
        o && i && (f.top = R(f.top, 0), f.left = R(f.left, 0));
        var d, c, h = O({top: s.top - f.top - l, left: s.left - f.left - u, width: s.width, height: s.height});
        return h.marginTop = 0, h.marginLeft = 0, !r && i && (d = parseFloat(p.marginTop), c = parseFloat(p.marginLeft), h.top -= l - d, h.bottom -= l - d, h.left -= u - c, h.right -= u - c, h.marginTop = d, h.marginLeft = c), (r && !o ? t.contains(a) : t === a && "BODY" !== a.nodeName) && (h = function (e, t, n) {
            var o = 2 < arguments.length && void 0 !== n && n, r = E(t, "top"), i = E(t, "left"), s = o ? -1 : 1;
            return e.top += r * s, e.bottom += r * s, e.left += i * s, e.right += i * s, e
        }(h, t)), h
    }

    function D(e) {
        if (!e || !e.parentElement || v()) return document.documentElement;
        for (var t = e.parentElement; t && "none" === y(t, "transform");) t = t.parentElement;
        return t || document.documentElement
    }

    function c(e, t, n, o, r) {
        var i, s, f, a, p, l = 4 < arguments.length && void 0 !== r && r, u = {top: 0, left: 0},
            d = l ? D(e) : b(e, g(t));
        "viewport" === o ? u = function (e, t) {
            var n = 1 < arguments.length && void 0 !== t && t, o = e.ownerDocument.documentElement, r = T(e, o),
                i = R(o.clientWidth, window.innerWidth || 0), s = R(o.clientHeight, window.innerHeight || 0),
                f = n ? 0 : E(o), a = n ? 0 : E(o, "left");
            return O({top: f - r.top + r.marginTop, left: a - r.left + r.marginLeft, width: i, height: s})
        }(d, l) : ("scrollParent" === o ? "BODY" === (i = m(h(t))).nodeName && (i = e.ownerDocument.documentElement) : i = "window" === o ? e.ownerDocument.documentElement : o, s = T(i, d, l), "HTML" !== i.nodeName || function e(t) {
            var n = t.nodeName;
            if ("BODY" === n || "HTML" === n) return !1;
            if ("fixed" === y(t, "position")) return !0;
            var o = h(t);
            return !!o && e(o)
        }(d) ? u = s : (a = (f = x(e.ownerDocument)).height, p = f.width, u.top += s.top - s.marginTop, u.bottom = a + s.top, u.left += s.left - s.marginLeft, u.right = p + s.left));
        var c = "number" == typeof (n = n || 0);
        return u.left += c ? n : n.left || 0, u.top += c ? n : n.top || 0, u.right -= c ? n : n.right || 0, u.bottom -= c ? n : n.bottom || 0, u
    }

    function f(e, t, o, n, r, i) {
        var s = 5 < arguments.length && void 0 !== i ? i : 0;
        if (-1 === e.indexOf("auto")) return e;
        var f = c(o, n, s, r), a = {
            top: {width: f.width, height: t.top - f.top},
            right: {width: f.right - t.right, height: f.height},
            bottom: {width: f.width, height: f.bottom - t.bottom},
            left: {width: t.left - f.left, height: f.height}
        }, p = Object.keys(a).map(function (e) {
            return X({key: e}, a[e], {area: (t = a[e]).width * t.height});
            var t
        }).sort(function (e, t) {
            return t.area - e.area
        }), l = p.filter(function (e) {
            var t = e.width, n = e.height;
            return t >= o.clientWidth && n >= o.clientHeight
        }), u = 0 < l.length ? l[0].key : p[0].key, d = e.split("-")[1];
        return u + (d ? "-" + d : "")
    }

    function a(e, t, n, o) {
        var r = 3 < arguments.length && void 0 !== o ? o : null;
        return T(n, r ? D(t) : b(t, g(n)), r)
    }

    function N(e) {
        var t = e.ownerDocument.defaultView.getComputedStyle(e),
            n = parseFloat(t.marginTop || 0) + parseFloat(t.marginBottom || 0),
            o = parseFloat(t.marginLeft || 0) + parseFloat(t.marginRight || 0);
        return {width: e.offsetWidth + o, height: e.offsetHeight + n}
    }

    function F(e) {
        var t = {left: "right", right: "left", bottom: "top", top: "bottom"};
        return e.replace(/left|right|bottom|top/g, function (e) {
            return t[e]
        })
    }

    function k(e, t, n) {
        n = n.split("-")[0];
        var o = N(e), r = {width: o.width, height: o.height}, i = -1 !== ["right", "left"].indexOf(n),
            s = i ? "top" : "left", f = i ? "left" : "top", a = i ? "height" : "width", p = i ? "width" : "height";
        return r[s] = t[s] + t[a] / 2 - o[a] / 2, r[f] = n === f ? t[f] - o[p] : t[F(f)], r
    }

    function H(e, t) {
        return Array.prototype.find ? e.find(t) : e.filter(t)[0]
    }

    function C(e, n, t) {
        return (void 0 === t ? e : e.slice(0, function (e, t, n) {
            if (Array.prototype.findIndex) return e.findIndex(function (e) {
                return e[t] === n
            });
            var o = H(e, function (e) {
                return e[t] === n
            });
            return e.indexOf(o)
        }(e, "name", t))).forEach(function (e) {
            e.function && console.warn("`modifier.function` is deprecated, use `modifier.fn`!");
            var t = e.function || e.fn;
            e.enabled && i(t) && (n.offsets.popper = O(n.offsets.popper), n.offsets.reference = O(n.offsets.reference), n = t(n, e))
        }), n
    }

    function e(e, n) {
        return e.some(function (e) {
            var t = e.name;
            return e.enabled && t === n
        })
    }

    function B(e) {
        for (var t = [!1, "ms", "Webkit", "Moz", "O"], n = e.charAt(0).toUpperCase() + e.slice(1), o = 0; o < t.length; o++) {
            var r = t[o], i = r ? "" + r + n : e;
            if (void 0 !== document.body.style[i]) return i
        }
        return null
    }

    function s(e) {
        var t = e.ownerDocument;
        return t ? t.defaultView : window
    }

    function t(e, t, n, o) {
        n.updateBound = o, s(e).addEventListener("resize", n.updateBound, {passive: !0});
        var r = m(e);
        return function e(t, n, o, r) {
            var i = "BODY" === t.nodeName, s = i ? t.ownerDocument.defaultView : t;
            s.addEventListener(n, o, {passive: !0}), i || e(m(s.parentNode), n, o, r), r.push(s)
        }(r, "scroll", n.updateBound, n.scrollParents), n.scrollElement = r, n.eventsEnabled = !0, n
    }

    function n() {
        var e, t;
        this.state.eventsEnabled && (cancelAnimationFrame(this.scheduleUpdate), this.state = (e = this.reference, t = this.state, s(e).removeEventListener("resize", t.updateBound), t.scrollParents.forEach(function (e) {
            e.removeEventListener("scroll", t.updateBound)
        }), t.updateBound = null, t.scrollParents = [], t.scrollElement = null, t.eventsEnabled = !1, t))
    }

    function p(e) {
        return "" !== e && !isNaN(parseFloat(e)) && isFinite(e)
    }

    function d(n, o) {
        Object.keys(o).forEach(function (e) {
            var t = "";
            -1 !== ["width", "height", "top", "right", "bottom", "left"].indexOf(e) && p(o[e]) && (t = "px"), n.style[e] = o[e] + t
        })
    }

    function A(e, t) {
        function n(e) {
            return e
        }

        var o = e.offsets, r = o.popper, i = o.reference, s = I, f = s(i.width), a = s(r.width),
            p = -1 !== ["left", "right"].indexOf(e.placement), l = -1 !== e.placement.indexOf("-"),
            u = t ? p || l || f % 2 == a % 2 ? s : j : n, d = t ? s : n;
        return {
            left: u(1 == f % 2 && 1 == a % 2 && !l && t ? r.left - 1 : r.left),
            top: d(r.top),
            bottom: d(r.bottom),
            right: u(r.right)
        }
    }

    function M(e, t, n) {
        var o, r = H(e, function (e) {
            return e.name === t
        }), i = !!r && e.some(function (e) {
            return e.name === n && e.enabled && e.order < r.order
        });
        return i || (o = "`" + t + "`", console.warn("`" + n + "` modifier is required by " + o + " modifier in order to work, be sure to include it before " + o + "!")), i
    }

    function o(e, t) {
        var n = 1 < arguments.length && void 0 !== t && t, o = Q.indexOf(e), r = Q.slice(o + 1).concat(Q.slice(0, o));
        return n ? r.reverse() : r
    }

    function P(e, r, i, t) {
        var s = [0, 0], f = -1 !== ["right", "left"].indexOf(t), n = e.split(/(\+|\-)/).map(function (e) {
            return e.trim()
        }), o = n.indexOf(H(n, function (e) {
            return -1 !== e.search(/,|\s/)
        }));
        n[o] && -1 === n[o].indexOf(",") && console.warn("Offsets separated by white space(s) are deprecated, use a comma (,) instead.");
        var a = /\s*,\s*|\s+/;
        return (-1 === o ? [n] : [n.slice(0, o).concat([n[o].split(a)[0]]), [n[o].split(a)[1]].concat(n.slice(o + 1))]).map(function (e, t) {
            var n = (1 === t ? !f : f) ? "height" : "width", o = !1;
            return e.reduce(function (e, t) {
                return "" === e[e.length - 1] && -1 !== ["+", "-"].indexOf(t) ? (e[e.length - 1] = t, o = !0, e) : o ? (e[e.length - 1] += t, o = !1, e) : e.concat(t)
            }, []).map(function (e) {
                return function (e, t, n, o) {
                    var r, i = e.match(/((?:\-|\+)?\d*\.?\d*)(.*)/), s = +i[1], f = i[2];
                    if (!s) return e;
                    if (0 !== f.indexOf("%")) return "vh" !== f && "vw" !== f ? s : ("vh" === f ? R(document.documentElement.clientHeight, window.innerHeight || 0) : R(document.documentElement.clientWidth, window.innerWidth || 0)) / 100 * s;
                    switch (f) {
                        case"%p":
                            r = n;
                            break;
                        case"%":
                        case"%r":
                        default:
                            r = o
                    }
                    return O(r)[t] / 100 * s
                }(e, n, r, i)
            })
        }).forEach(function (n, o) {
            n.forEach(function (e, t) {
                p(e) && (s[o] += e * ("-" === n[t - 1] ? -1 : 1))
            })
        }), s
    }

    function S(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[t] = n, e
    }

    var W = Math.min, j = Math.floor, I = Math.round, R = Math.max,
        U = "undefined" != typeof window && "undefined" != typeof document && "undefined" != typeof navigator,
        Y = function () {
            for (var e = ["Edge", "Trident", "Firefox"], t = 0; t < e.length; t += 1) if (U && 0 <= navigator.userAgent.indexOf(e[t])) return 1;
            return 0
        }(), V = U && window.Promise ? function (e) {
            var t = !1;
            return function () {
                t || (t = !0, window.Promise.resolve().then(function () {
                    t = !1, e()
                }))
            }
        } : function (e) {
            var t = !1;
            return function () {
                t || (t = !0, setTimeout(function () {
                    t = !1, e()
                }, Y))
            }
        }, q = U && !(!window.MSInputMethodContext || !document.documentMode), z = U && /MSIE 10/.test(navigator.userAgent),
        G = function (e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }, _ = function (e, t, n) {
            return t && oe(e.prototype, t), n && oe(e, n), e
        }, X = Object.assign || function (e) {
            for (var t, n = 1; n < arguments.length; n++) for (var o in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
            return e
        }, J = U && /Firefox/i.test(navigator.userAgent),
        K = ["auto-start", "auto", "auto-end", "top-start", "top", "top-end", "right-start", "right", "right-end", "bottom-end", "bottom", "bottom-start", "left-end", "left", "left-start"],
        Q = K.slice(3), Z = "flip", $ = "clockwise", ee = "counterclockwise", te = (_(ne, [{
            key: "update", value: function () {
                return function () {
                    var e;
                    this.state.isDestroyed || ((e = {
                        instance: this,
                        styles: {},
                        arrowStyles: {},
                        attributes: {},
                        flipped: !1,
                        offsets: {}
                    }).offsets.reference = a(this.state, this.popper, this.reference, this.options.positionFixed), e.placement = f(this.options.placement, e.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding), e.originalPlacement = e.placement, e.positionFixed = this.options.positionFixed, e.offsets.popper = k(this.popper, e.offsets.reference, e.placement), e.offsets.popper.position = this.options.positionFixed ? "fixed" : "absolute", e = C(this.modifiers, e), this.state.isCreated ? this.options.onUpdate(e) : (this.state.isCreated = !0, this.options.onCreate(e)))
                }.call(this)
            }
        }, {
            key: "destroy", value: function () {
                return function () {
                    return this.state.isDestroyed = !0, e(this.modifiers, "applyStyle") && (this.popper.removeAttribute("x-placement"), this.popper.style.position = "", this.popper.style.top = "", this.popper.style.left = "", this.popper.style.right = "", this.popper.style.bottom = "", this.popper.style.willChange = "", this.popper.style[B("transform")] = ""), this.disableEventListeners(), this.options.removeOnDestroy && this.popper.parentNode.removeChild(this.popper), this
                }.call(this)
            }
        }, {
            key: "enableEventListeners", value: function () {
                return function () {
                    this.state.eventsEnabled || (this.state = t(this.reference, this.options, this.state, this.scheduleUpdate))
                }.call(this)
            }
        }, {
            key: "disableEventListeners", value: function () {
                return n.call(this)
            }
        }]), ne);

    function ne(e, t) {
        var n = this, o = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : {};
        G(this, ne), this.scheduleUpdate = function () {
            return requestAnimationFrame(n.update)
        }, this.update = V(this.update.bind(this)), this.options = X({}, ne.Defaults, o), this.state = {
            isDestroyed: !1,
            isCreated: !1,
            scrollParents: []
        }, this.reference = e && e.jquery ? e[0] : e, this.popper = t && t.jquery ? t[0] : t, this.options.modifiers = {}, Object.keys(X({}, ne.Defaults.modifiers, o.modifiers)).forEach(function (e) {
            n.options.modifiers[e] = X({}, ne.Defaults.modifiers[e] || {}, o.modifiers ? o.modifiers[e] : {})
        }), this.modifiers = Object.keys(this.options.modifiers).map(function (e) {
            return X({name: e}, n.options.modifiers[e])
        }).sort(function (e, t) {
            return e.order - t.order
        }), this.modifiers.forEach(function (e) {
            e.enabled && i(e.onLoad) && e.onLoad(n.reference, n.popper, n.options, e, n.state)
        }), this.update();
        var r = this.options.eventsEnabled;
        r && this.enableEventListeners(), this.state.eventsEnabled = r
    }

    function oe(e, t) {
        for (var n, o = 0; o < t.length; o++) (n = t[o]).enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
    }

    return te.Utils = ("undefined" == typeof window ? global : window).PopperUtils, te.placements = K, te.Defaults = {
        placement: "bottom", positionFixed: !1, eventsEnabled: !0, removeOnDestroy: !1, onCreate: function () {
        }, onUpdate: function () {
        }, modifiers: {
            shift: {
                order: 100, enabled: !0, fn: function (e) {
                    var t, n, o, r, i, s, f, a = e.placement, p = a.split("-")[0], l = a.split("-")[1];
                    return l && (n = (t = e.offsets).reference, o = t.popper, s = (r = -1 !== ["bottom", "top"].indexOf(p)) ? "width" : "height", f = {
                        start: S({}, i = r ? "left" : "top", n[i]),
                        end: S({}, i, n[i] + n[s] - o[s])
                    }, e.offsets.popper = X({}, o, f[l])), e
                }
            }, offset: {
                order: 200, enabled: !0, fn: function (e, t) {
                    var n = t.offset, o = e.placement, r = e.offsets, i = r.popper, s = r.reference,
                        f = o.split("-")[0], a = p(+n) ? [+n, 0] : P(n, i, s, f);
                    return "left" === f ? (i.top += a[0], i.left -= a[1]) : "right" === f ? (i.top += a[0], i.left += a[1]) : "top" === f ? (i.left += a[0], i.top -= a[1]) : "bottom" === f && (i.left += a[0], i.top += a[1]), e.popper = i, e
                }, offset: 0
            }, preventOverflow: {
                order: 300, enabled: !0, fn: function (e, o) {
                    var t = o.boundariesElement || w(e.instance.popper);
                    e.instance.reference === t && (t = w(t));
                    var n = B("transform"), r = e.instance.popper.style, i = r.top, s = r.left, f = r[n];
                    r.top = "", r.left = "", r[n] = "";
                    var a = c(e.instance.popper, e.instance.reference, o.padding, t, e.positionFixed);
                    r.top = i, r.left = s, r[n] = f, o.boundaries = a;
                    var p = o.priority, l = e.offsets.popper, u = {
                        primary: function (e) {
                            var t = l[e];
                            return l[e] < a[e] && !o.escapeWithReference && (t = R(l[e], a[e])), S({}, e, t)
                        }, secondary: function (e) {
                            var t = "right" === e ? "left" : "top", n = l[t];
                            return l[e] > a[e] && !o.escapeWithReference && (n = W(l[t], a[e] - ("right" === e ? l.width : l.height))), S({}, t, n)
                        }
                    };
                    return p.forEach(function (e) {
                        var t = -1 === ["left", "top"].indexOf(e) ? "secondary" : "primary";
                        l = X({}, l, u[t](e))
                    }), e.offsets.popper = l, e
                }, priority: ["left", "right", "top", "bottom"], padding: 5, boundariesElement: "scrollParent"
            }, keepTogether: {
                order: 400, enabled: !0, fn: function (e) {
                    var t = e.offsets, n = t.popper, o = t.reference, r = e.placement.split("-")[0], i = j,
                        s = -1 !== ["top", "bottom"].indexOf(r), f = s ? "right" : "bottom", a = s ? "left" : "top",
                        p = s ? "width" : "height";
                    return n[f] < i(o[a]) && (e.offsets.popper[a] = i(o[a]) - n[p]), n[a] > i(o[f]) && (e.offsets.popper[a] = i(o[f])), e
                }
            }, arrow: {
                order: 500, enabled: !0, fn: function (e, t) {
                    var n;
                    if (!M(e.instance.modifiers, "arrow", "keepTogether")) return e;
                    var o = t.element;
                    if ("string" == typeof o) {
                        if (!(o = e.instance.popper.querySelector(o))) return e
                    } else if (!e.instance.popper.contains(o)) return console.warn("WARNING: `arrow.element` must be child of its popper element!"), e;
                    var r = e.placement.split("-")[0], i = e.offsets, s = i.popper, f = i.reference,
                        a = -1 !== ["left", "right"].indexOf(r), p = a ? "height" : "width", l = a ? "Top" : "Left",
                        u = l.toLowerCase(), d = a ? "left" : "top", c = a ? "bottom" : "right", h = N(o)[p];
                    f[c] - h < s[u] && (e.offsets.popper[u] -= s[u] - (f[c] - h)), f[u] + h > s[c] && (e.offsets.popper[u] += f[u] + h - s[c]), e.offsets.popper = O(e.offsets.popper);
                    var m = f[u] + f[p] / 2 - h / 2, g = y(e.instance.popper), v = parseFloat(g["margin" + l]),
                        b = parseFloat(g["border" + l + "Width"]), w = m - e.offsets.popper[u] - v - b,
                        w = R(W(s[p] - h, w), 0);
                    return e.arrowElement = o, e.offsets.arrow = (S(n = {}, u, I(w)), S(n, d, ""), n), e
                }, element: "[x-arrow]"
            }, flip: {
                order: 600,
                enabled: !0,
                fn: function (g, v) {
                    if (e(g.instance.modifiers, "inner")) return g;
                    if (g.flipped && g.placement === g.originalPlacement) return g;
                    var b = c(g.instance.popper, g.instance.reference, v.padding, v.boundariesElement, g.positionFixed),
                        w = g.placement.split("-")[0], y = F(w), E = g.placement.split("-")[1] || "", x = [];
                    switch (v.behavior) {
                        case Z:
                            x = [w, y];
                            break;
                        case $:
                            x = o(w);
                            break;
                        case ee:
                            x = o(w, !0);
                            break;
                        default:
                            x = v.behavior
                    }
                    return x.forEach(function (e, t) {
                        if (w !== e || x.length === t + 1) return g;
                        w = g.placement.split("-")[0], y = F(w);
                        var n, o = g.offsets.popper, r = g.offsets.reference, i = j,
                            s = "left" === w && i(o.right) > i(r.left) || "right" === w && i(o.left) < i(r.right) || "top" === w && i(o.bottom) > i(r.top) || "bottom" === w && i(o.top) < i(r.bottom),
                            f = i(o.left) < i(b.left), a = i(o.right) > i(b.right), p = i(o.top) < i(b.top),
                            l = i(o.bottom) > i(b.bottom),
                            u = "left" === w && f || "right" === w && a || "top" === w && p || "bottom" === w && l,
                            d = -1 !== ["top", "bottom"].indexOf(w),
                            c = !!v.flipVariations && (d && "start" === E && f || d && "end" === E && a || !d && "start" === E && p || !d && "end" === E && l),
                            h = !!v.flipVariationsByContent && (d && "start" === E && a || d && "end" === E && f || !d && "start" === E && l || !d && "end" === E && p),
                            m = c || h;
                        (s || u || m) && (g.flipped = !0, (s || u) && (w = x[t + 1]), m && (E = "end" === (n = E) ? "start" : "start" === n ? "end" : n), g.placement = w + (E ? "-" + E : ""), g.offsets.popper = X({}, g.offsets.popper, k(g.instance.popper, g.offsets.reference, g.placement)), g = C(g.instance.modifiers, g, "flip"))
                    }), g
                },
                behavior: "flip",
                padding: 5,
                boundariesElement: "viewport",
                flipVariations: !1,
                flipVariationsByContent: !1
            }, inner: {
                order: 700, enabled: !1, fn: function (e) {
                    var t = e.placement, n = t.split("-")[0], o = e.offsets, r = o.popper, i = o.reference,
                        s = -1 !== ["left", "right"].indexOf(n), f = -1 === ["top", "left"].indexOf(n);
                    return r[s ? "left" : "top"] = i[n] - (f ? r[s ? "width" : "height"] : 0), e.placement = F(t), e.offsets.popper = O(r), e
                }
            }, hide: {
                order: 800, enabled: !0, fn: function (e) {
                    if (!M(e.instance.modifiers, "hide", "preventOverflow")) return e;
                    var t = e.offsets.reference, n = H(e.instance.modifiers, function (e) {
                        return "preventOverflow" === e.name
                    }).boundaries;
                    if (t.bottom < n.top || t.left > n.right || t.top > n.bottom || t.right < n.left) {
                        if (!0 === e.hide) return e;
                        e.hide = !0, e.attributes["x-out-of-boundaries"] = ""
                    } else {
                        if (!1 === e.hide) return e;
                        e.hide = !1, e.attributes["x-out-of-boundaries"] = !1
                    }
                    return e
                }
            }, computeStyle: {
                order: 850, enabled: !0, fn: function (e, t) {
                    var n = t.x, o = t.y, r = e.offsets.popper, i = H(e.instance.modifiers, function (e) {
                        return "applyStyle" === e.name
                    }).gpuAcceleration;
                    void 0 !== i && console.warn("WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!");
                    var s, f, a = void 0 === i ? t.gpuAcceleration : i, p = w(e.instance.popper), l = L(p),
                        u = {position: r.position}, d = A(e, window.devicePixelRatio < 2 || !J),
                        c = "bottom" === n ? "top" : "bottom", h = "right" === o ? "left" : "right", m = B("transform"),
                        g = "bottom" == c ? "HTML" === p.nodeName ? -p.clientHeight + d.bottom : -l.height + d.bottom : d.top,
                        v = "right" == h ? "HTML" === p.nodeName ? -p.clientWidth + d.right : -l.width + d.right : d.left;
                    a && m ? (u[m] = "translate3d(" + v + "px, " + g + "px, 0)", u[c] = 0, u[h] = 0, u.willChange = "transform") : (s = "bottom" == c ? -1 : 1, f = "right" == h ? -1 : 1, u[c] = g * s, u[h] = v * f, u.willChange = c + ", " + h);
                    var b = {"x-placement": e.placement};
                    return e.attributes = X({}, b, e.attributes), e.styles = X({}, u, e.styles), e.arrowStyles = X({}, e.offsets.arrow, e.arrowStyles), e
                }, gpuAcceleration: !0, x: "bottom", y: "right"
            }, applyStyle: {
                order: 900, enabled: !0, fn: function (e) {
                    return d(e.instance.popper, e.styles), t = e.instance.popper, n = e.attributes, Object.keys(n).forEach(function (e) {
                        !1 === n[e] ? t.removeAttribute(e) : t.setAttribute(e, n[e])
                    }), e.arrowElement && Object.keys(e.arrowStyles).length && d(e.arrowElement, e.arrowStyles), e;
                    var t, n
                }, onLoad: function (e, t, n, o, r) {
                    var i = a(r, t, e, n.positionFixed),
                        s = f(n.placement, i, t, e, n.modifiers.flip.boundariesElement, n.modifiers.flip.padding);
                    return t.setAttribute("x-placement", s), d(t, {position: n.positionFixed ? "fixed" : "absolute"}), n
                }, gpuAcceleration: void 0
            }
        }
    }, te
});
/*bootstrap.min*/
!function (t, e) {
    "object" == typeof exports && "undefined" != typeof module ? e(exports, require("jquery"), require("popper.js")) : "function" == typeof define && define.amd ? define(["exports", "jquery", "popper.js"], e) : e((t = t || self).bootstrap = {}, t.jQuery, t.Popper)
}(this, function (t, g, u) {
    "use strict";

    function i(t, e) {
        for (var n = 0; n < e.length; n++) {
            var i = e[n];
            i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
        }
    }

    function s(t, e, n) {
        return e && i(t.prototype, e), n && i(t, n), t
    }

    function e(e, t) {
        var n, i = Object.keys(e);
        return Object.getOwnPropertySymbols && (n = Object.getOwnPropertySymbols(e), t && (n = n.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable
        })), i.push.apply(i, n)), i
    }

    function r(o) {
        for (var t = 1; t < arguments.length; t++) {
            var s = null != arguments[t] ? arguments[t] : {};
            t % 2 ? e(Object(s), !0).forEach(function (t) {
                var e, n, i;
                e = o, i = s[n = t], n in e ? Object.defineProperty(e, n, {
                    value: i,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0
                }) : e[n] = i
            }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(o, Object.getOwnPropertyDescriptors(s)) : e(Object(s)).forEach(function (t) {
                Object.defineProperty(o, t, Object.getOwnPropertyDescriptor(s, t))
            })
        }
        return o
    }

    g = g && Object.prototype.hasOwnProperty.call(g, "default") ? g.default : g, u = u && Object.prototype.hasOwnProperty.call(u, "default") ? u.default : u;
    var m = {
        TRANSITION_END: "bsTransitionEnd", getUID: function (t) {
            for (; t += ~~(1e6 * Math.random()), document.getElementById(t);) ;
            return t
        }, getSelectorFromElement: function (t) {
            var e, n = t.getAttribute("data-target");
            n && "#" !== n || (n = (e = t.getAttribute("href")) && "#" !== e ? e.trim() : "");
            try {
                return document.querySelector(n) ? n : null
            } catch (t) {
                return null
            }
        }, getTransitionDurationFromElement: function (t) {
            if (!t) return 0;
            var e = g(t).css("transition-duration"), n = g(t).css("transition-delay"), i = parseFloat(e),
                o = parseFloat(n);
            return i || o ? (e = e.split(",")[0], n = n.split(",")[0], 1e3 * (parseFloat(e) + parseFloat(n))) : 0
        }, reflow: function (t) {
            return t.offsetHeight
        }, triggerTransitionEnd: function (t) {
            g(t).trigger("transitionend")
        }, supportsTransitionEnd: function () {
            return Boolean("transitionend")
        }, isElement: function (t) {
            return (t[0] || t).nodeType
        }, typeCheckConfig: function (t, e, n) {
            for (var i in n) if (Object.prototype.hasOwnProperty.call(n, i)) {
                var o = n[i], s = e[i],
                    r = s && m.isElement(s) ? "element" : null === s || void 0 === s ? "" + s : {}.toString.call(s).match(/\s([a-z]+)/i)[1].toLowerCase();
                if (!new RegExp(o).test(r)) throw new Error(t.toUpperCase() + ': Option "' + i + '" provided type "' + r + '" but expected type "' + o + '".')
            }
        }, findShadowRoot: function (t) {
            if (!document.documentElement.attachShadow) return null;
            if ("function" != typeof t.getRootNode) return t instanceof ShadowRoot ? t : t.parentNode ? m.findShadowRoot(t.parentNode) : null;
            var e = t.getRootNode();
            return e instanceof ShadowRoot ? e : null
        }, jQueryDetection: function () {
            if (void 0 === g) throw new TypeError("Bootstrap's JavaScript requires jQuery. jQuery must be included before Bootstrap's JavaScript.");
            var t = g.fn.jquery.split(" ")[0].split(".");
            if (t[0] < 2 && t[1] < 9 || 1 === t[0] && 9 === t[1] && t[2] < 1 || 4 <= t[0]) throw new Error("Bootstrap's JavaScript requires at least jQuery v1.9.1 but less than v4.0.0")
        }
    };
    m.jQueryDetection(), g.fn.emulateTransitionEnd = function (t) {
        var e = this, n = !1;
        return g(this).one(m.TRANSITION_END, function () {
            n = !0
        }), setTimeout(function () {
            n || m.triggerTransitionEnd(e)
        }, t), this
    }, g.event.special[m.TRANSITION_END] = {
        bindType: "transitionend",
        delegateType: "transitionend",
        handle: function (t) {
            if (g(t.target).is(this)) return t.handleObj.handler.apply(this, arguments)
        }
    };
    var n, o = "alert", a = g.fn[o], l = ((n = c.prototype).close = function (t) {
        var e = this._element;
        t && (e = this._getRootElement(t)), this._triggerCloseEvent(e).isDefaultPrevented() || this._removeElement(e)
    }, n.dispose = function () {
        g.removeData(this._element, "bs.alert"), this._element = null
    }, n._getRootElement = function (t) {
        var e = m.getSelectorFromElement(t), n = !1;
        return e && (n = document.querySelector(e)), n = n || g(t).closest(".alert")[0]
    }, n._triggerCloseEvent = function (t) {
        var e = g.Event("close.bs.alert");
        return g(t).trigger(e), e
    }, n._removeElement = function (e) {
        var t, n = this;
        g(e).removeClass("show"), g(e).hasClass("fade") ? (t = m.getTransitionDurationFromElement(e), g(e).one(m.TRANSITION_END, function (t) {
            return n._destroyElement(e, t)
        }).emulateTransitionEnd(t)) : this._destroyElement(e)
    }, n._destroyElement = function (t) {
        g(t).detach().trigger("closed.bs.alert").remove()
    }, c._jQueryInterface = function (n) {
        return this.each(function () {
            var t = g(this), e = t.data("bs.alert");
            e || (e = new c(this), t.data("bs.alert", e)), "close" === n && e[n](this)
        })
    }, c._handleDismiss = function (e) {
        return function (t) {
            t && t.preventDefault(), e.close(this)
        }
    }, s(c, null, [{
        key: "VERSION", get: function () {
            return "4.5.0"
        }
    }]), c);

    function c(t) {
        this._element = t
    }

    g(document).on("click.bs.alert.data-api", '[data-dismiss="alert"]', l._handleDismiss(new l)), g.fn[o] = l._jQueryInterface, g.fn[o].Constructor = l, g.fn[o].noConflict = function () {
        return g.fn[o] = a, l._jQueryInterface
    };
    var h, d = g.fn.button, f = ((h = p.prototype).toggle = function () {
        var t, e, n = !0, i = !0, o = g(this._element).closest('[data-toggle="buttons"]')[0];
        !o || (t = this._element.querySelector('input:not([type="hidden"])')) && ("radio" === t.type && (t.checked && this._element.classList.contains("active") ? n = !1 : (e = o.querySelector(".active")) && g(e).removeClass("active")), n && ("checkbox" !== t.type && "radio" !== t.type || (t.checked = !this._element.classList.contains("active")), g(t).trigger("change")), t.focus(), i = !1), this._element.hasAttribute("disabled") || this._element.classList.contains("disabled") || (i && this._element.setAttribute("aria-pressed", !this._element.classList.contains("active")), n && g(this._element).toggleClass("active"))
    }, h.dispose = function () {
        g.removeData(this._element, "bs.button"), this._element = null
    }, p._jQueryInterface = function (e) {
        return this.each(function () {
            var t = g(this).data("bs.button");
            t || (t = new p(this), g(this).data("bs.button", t)), "toggle" === e && t[e]()
        })
    }, s(p, null, [{
        key: "VERSION", get: function () {
            return "4.5.0"
        }
    }]), p);

    function p(t) {
        this._element = t
    }

    g(document).on("click.bs.button.data-api", '[data-toggle^="button"]', function (t) {
        var e = t.target, n = e;
        if (g(e).hasClass("btn") || (e = g(e).closest(".btn")[0]), !e || e.hasAttribute("disabled") || e.classList.contains("disabled")) t.preventDefault(); else {
            var i = e.querySelector('input:not([type="hidden"])');
            if (i && (i.hasAttribute("disabled") || i.classList.contains("disabled"))) return void t.preventDefault();
            "LABEL" === n.tagName && i && "checkbox" === i.type && t.preventDefault(), f._jQueryInterface.call(g(e), "toggle")
        }
    }).on("focus.bs.button.data-api blur.bs.button.data-api", '[data-toggle^="button"]', function (t) {
        var e = g(t.target).closest(".btn")[0];
        g(e).toggleClass("focus", /^focus(in)?$/.test(t.type))
    }), g(window).on("load.bs.button.data-api", function () {
        for (var t = [].slice.call(document.querySelectorAll('[data-toggle="buttons"] .btn')), e = 0, n = t.length; e < n; e++) {
            var i = t[e], o = i.querySelector('input:not([type="hidden"])');
            o.checked || o.hasAttribute("checked") ? i.classList.add("active") : i.classList.remove("active")
        }
        for (var s = 0, r = (t = [].slice.call(document.querySelectorAll('[data-toggle="button"]'))).length; s < r; s++) {
            var a = t[s];
            "true" === a.getAttribute("aria-pressed") ? a.classList.add("active") : a.classList.remove("active")
        }
    }), g.fn.button = f._jQueryInterface, g.fn.button.Constructor = f, g.fn.button.noConflict = function () {
        return g.fn.button = d, f._jQueryInterface
    };
    var _, v = "carousel", b = g.fn[v],
        y = {interval: 5e3, keyboard: !0, slide: !1, pause: "hover", wrap: !0, touch: !0}, E = {
            interval: "(number|boolean)",
            keyboard: "boolean",
            slide: "(boolean|string)",
            pause: "(string|boolean)",
            wrap: "boolean",
            touch: "boolean"
        }, w = {TOUCH: "touch", PEN: "pen"}, T = ((_ = C.prototype).next = function () {
            this._isSliding || this._slide("next")
        }, _.nextWhenVisible = function () {
            !document.hidden && g(this._element).is(":visible") && "hidden" !== g(this._element).css("visibility") && this.next()
        }, _.prev = function () {
            this._isSliding || this._slide("prev")
        }, _.pause = function (t) {
            t || (this._isPaused = !0), this._element.querySelector(".carousel-item-next, .carousel-item-prev") && (m.triggerTransitionEnd(this._element), this.cycle(!0)), clearInterval(this._interval), this._interval = null
        }, _.cycle = function (t) {
            t || (this._isPaused = !1), this._interval && (clearInterval(this._interval), this._interval = null), this._config.interval && !this._isPaused && (this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval))
        }, _.to = function (t) {
            var e = this;
            this._activeElement = this._element.querySelector(".active.carousel-item");
            var n = this._getItemIndex(this._activeElement);
            if (!(t > this._items.length - 1 || t < 0)) if (this._isSliding) g(this._element).one("slid.bs.carousel", function () {
                return e.to(t)
            }); else {
                if (n === t) return this.pause(), void this.cycle();
                var i = n < t ? "next" : "prev";
                this._slide(i, this._items[t])
            }
        }, _.dispose = function () {
            g(this._element).off(".bs.carousel"), g.removeData(this._element, "bs.carousel"), this._items = null, this._config = null, this._element = null, this._interval = null, this._isPaused = null, this._isSliding = null, this._activeElement = null, this._indicatorsElement = null
        }, _._getConfig = function (t) {
            return t = r(r({}, y), t), m.typeCheckConfig(v, t, E), t
        }, _._handleSwipe = function () {
            var t, e = Math.abs(this.touchDeltaX);
            e <= 40 || (t = e / this.touchDeltaX, (this.touchDeltaX = 0) < t && this.prev(), t < 0 && this.next())
        }, _._addEventListeners = function () {
            var e = this;
            this._config.keyboard && g(this._element).on("keydown.bs.carousel", function (t) {
                return e._keydown(t)
            }), "hover" === this._config.pause && g(this._element).on("mouseenter.bs.carousel", function (t) {
                return e.pause(t)
            }).on("mouseleave.bs.carousel", function (t) {
                return e.cycle(t)
            }), this._config.touch && this._addTouchEventListeners()
        }, _._addTouchEventListeners = function () {
            var t, e, n = this;
            this._touchSupported && (t = function (t) {
                n._pointerEvent && w[t.originalEvent.pointerType.toUpperCase()] ? n.touchStartX = t.originalEvent.clientX : n._pointerEvent || (n.touchStartX = t.originalEvent.touches[0].clientX)
            }, e = function (t) {
                n._pointerEvent && w[t.originalEvent.pointerType.toUpperCase()] && (n.touchDeltaX = t.originalEvent.clientX - n.touchStartX), n._handleSwipe(), "hover" === n._config.pause && (n.pause(), n.touchTimeout && clearTimeout(n.touchTimeout), n.touchTimeout = setTimeout(function (t) {
                    return n.cycle(t)
                }, 500 + n._config.interval))
            }, g(this._element.querySelectorAll(".carousel-item img")).on("dragstart.bs.carousel", function (t) {
                return t.preventDefault()
            }), this._pointerEvent ? (g(this._element).on("pointerdown.bs.carousel", t), g(this._element).on("pointerup.bs.carousel", e), this._element.classList.add("pointer-event")) : (g(this._element).on("touchstart.bs.carousel", t), g(this._element).on("touchmove.bs.carousel", function (t) {
                var e;
                (e = t).originalEvent.touches && 1 < e.originalEvent.touches.length ? n.touchDeltaX = 0 : n.touchDeltaX = e.originalEvent.touches[0].clientX - n.touchStartX
            }), g(this._element).on("touchend.bs.carousel", e)))
        }, _._keydown = function (t) {
            if (!/input|textarea/i.test(t.target.tagName)) switch (t.which) {
                case 37:
                    t.preventDefault(), this.prev();
                    break;
                case 39:
                    t.preventDefault(), this.next()
            }
        }, _._getItemIndex = function (t) {
            return this._items = t && t.parentNode ? [].slice.call(t.parentNode.querySelectorAll(".carousel-item")) : [], this._items.indexOf(t)
        }, _._getItemByDirection = function (t, e) {
            var n = "next" === t, i = "prev" === t, o = this._getItemIndex(e), s = this._items.length - 1;
            if ((i && 0 === o || n && o === s) && !this._config.wrap) return e;
            var r = (o + ("prev" === t ? -1 : 1)) % this._items.length;
            return -1 == r ? this._items[this._items.length - 1] : this._items[r]
        }, _._triggerSlideEvent = function (t, e) {
            var n = this._getItemIndex(t), i = this._getItemIndex(this._element.querySelector(".active.carousel-item")),
                o = g.Event("slide.bs.carousel", {relatedTarget: t, direction: e, from: i, to: n});
            return g(this._element).trigger(o), o
        }, _._setActiveIndicatorElement = function (t) {
            var e, n;
            this._indicatorsElement && (e = [].slice.call(this._indicatorsElement.querySelectorAll(".active")), g(e).removeClass("active"), (n = this._indicatorsElement.children[this._getItemIndex(t)]) && g(n).addClass("active"))
        }, _._slide = function (t, e) {
            var n, i, o, s, r, a = this, l = this._element.querySelector(".active.carousel-item"),
                c = this._getItemIndex(l), h = e || l && this._getItemByDirection(t, l), u = this._getItemIndex(h),
                d = Boolean(this._interval),
                f = "next" === t ? (n = "carousel-item-left", i = "carousel-item-next", "left") : (n = "carousel-item-right", i = "carousel-item-prev", "right");
            h && g(h).hasClass("active") ? this._isSliding = !1 : !this._triggerSlideEvent(h, f).isDefaultPrevented() && l && h && (this._isSliding = !0, d && this.pause(), this._setActiveIndicatorElement(h), o = g.Event("slid.bs.carousel", {
                relatedTarget: h,
                direction: f,
                from: c,
                to: u
            }), g(this._element).hasClass("slide") ? (g(h).addClass(i), m.reflow(h), g(l).addClass(n), g(h).addClass(n), (s = parseInt(h.getAttribute("data-interval"), 10)) ? (this._config.defaultInterval = this._config.defaultInterval || this._config.interval, this._config.interval = s) : this._config.interval = this._config.defaultInterval || this._config.interval, r = m.getTransitionDurationFromElement(l), g(l).one(m.TRANSITION_END, function () {
                g(h).removeClass(n + " " + i).addClass("active"), g(l).removeClass("active " + i + " " + n), a._isSliding = !1, setTimeout(function () {
                    return g(a._element).trigger(o)
                }, 0)
            }).emulateTransitionEnd(r)) : (g(l).removeClass("active"), g(h).addClass("active"), this._isSliding = !1, g(this._element).trigger(o)), d && this.cycle())
        }, C._jQueryInterface = function (i) {
            return this.each(function () {
                var t = g(this).data("bs.carousel"), e = r(r({}, y), g(this).data());
                "object" == typeof i && (e = r(r({}, e), i));
                var n = "string" == typeof i ? i : e.slide;
                if (t || (t = new C(this, e), g(this).data("bs.carousel", t)), "number" == typeof i) t.to(i); else if ("string" == typeof n) {
                    if (void 0 === t[n]) throw new TypeError('No method named "' + n + '"');
                    t[n]()
                } else e.interval && e.ride && (t.pause(), t.cycle())
            })
        }, C._dataApiClickHandler = function (t) {
            var e, n, i, o = m.getSelectorFromElement(this);
            !o || (e = g(o)[0]) && g(e).hasClass("carousel") && (n = r(r({}, g(e).data()), g(this).data()), (i = this.getAttribute("data-slide-to")) && (n.interval = !1), C._jQueryInterface.call(g(e), n), i && g(e).data("bs.carousel").to(i), t.preventDefault())
        }, s(C, null, [{
            key: "VERSION", get: function () {
                return "4.5.0"
            }
        }, {
            key: "Default", get: function () {
                return y
            }
        }]), C);

    function C(t, e) {
        this._items = null, this._interval = null, this._activeElement = null, this._isPaused = !1, this._isSliding = !1, this.touchTimeout = null, this.touchStartX = 0, this.touchDeltaX = 0, this._config = this._getConfig(e), this._element = t, this._indicatorsElement = this._element.querySelector(".carousel-indicators"), this._touchSupported = "ontouchstart" in document.documentElement || 0 < navigator.maxTouchPoints, this._pointerEvent = Boolean(window.PointerEvent || window.MSPointerEvent), this._addEventListeners()
    }

    g(document).on("click.bs.carousel.data-api", "[data-slide], [data-slide-to]", T._dataApiClickHandler), g(window).on("load.bs.carousel.data-api", function () {
        for (var t = [].slice.call(document.querySelectorAll('[data-ride="carousel"]')), e = 0, n = t.length; e < n; e++) {
            var i = g(t[e]);
            T._jQueryInterface.call(i, i.data())
        }
    }), g.fn[v] = T._jQueryInterface, g.fn[v].Constructor = T, g.fn[v].noConflict = function () {
        return g.fn[v] = b, T._jQueryInterface
    };
    var S, D = "collapse", k = g.fn[D], N = {toggle: !0, parent: ""},
        A = {toggle: "boolean", parent: "(string|element)"}, I = ((S = O.prototype).toggle = function () {
            g(this._element).hasClass("show") ? this.hide() : this.show()
        }, S.show = function () {
            var t, e, n, i, o, s, r = this;
            this._isTransitioning || g(this._element).hasClass("show") || (this._parent && 0 === (t = [].slice.call(this._parent.querySelectorAll(".show, .collapsing")).filter(function (t) {
                return "string" == typeof r._config.parent ? t.getAttribute("data-parent") === r._config.parent : t.classList.contains("collapse")
            })).length && (t = null), t && (e = g(t).not(this._selector).data("bs.collapse")) && e._isTransitioning) || (n = g.Event("show.bs.collapse"), g(this._element).trigger(n), n.isDefaultPrevented() || (t && (O._jQueryInterface.call(g(t).not(this._selector), "hide"), e || g(t).data("bs.collapse", null)), i = this._getDimension(), g(this._element).removeClass("collapse").addClass("collapsing"), this._element.style[i] = 0, this._triggerArray.length && g(this._triggerArray).removeClass("collapsed").attr("aria-expanded", !0), this.setTransitioning(!0), o = "scroll" + (i[0].toUpperCase() + i.slice(1)), s = m.getTransitionDurationFromElement(this._element), g(this._element).one(m.TRANSITION_END, function () {
                g(r._element).removeClass("collapsing").addClass("collapse show"), r._element.style[i] = "", r.setTransitioning(!1), g(r._element).trigger("shown.bs.collapse")
            }).emulateTransitionEnd(s), this._element.style[i] = this._element[o] + "px"))
        }, S.hide = function () {
            var t = this;
            if (!this._isTransitioning && g(this._element).hasClass("show")) {
                var e = g.Event("hide.bs.collapse");
                if (g(this._element).trigger(e), !e.isDefaultPrevented()) {
                    var n = this._getDimension();
                    this._element.style[n] = this._element.getBoundingClientRect()[n] + "px", m.reflow(this._element), g(this._element).addClass("collapsing").removeClass("collapse show");
                    var i = this._triggerArray.length;
                    if (0 < i) for (var o = 0; o < i; o++) {
                        var s = this._triggerArray[o], r = m.getSelectorFromElement(s);
                        null !== r && (g([].slice.call(document.querySelectorAll(r))).hasClass("show") || g(s).addClass("collapsed").attr("aria-expanded", !1))
                    }
                    this.setTransitioning(!0), this._element.style[n] = "";
                    var a = m.getTransitionDurationFromElement(this._element);
                    g(this._element).one(m.TRANSITION_END, function () {
                        t.setTransitioning(!1), g(t._element).removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")
                    }).emulateTransitionEnd(a)
                }
            }
        }, S.setTransitioning = function (t) {
            this._isTransitioning = t
        }, S.dispose = function () {
            g.removeData(this._element, "bs.collapse"), this._config = null, this._parent = null, this._element = null, this._triggerArray = null, this._isTransitioning = null
        }, S._getConfig = function (t) {
            return (t = r(r({}, N), t)).toggle = Boolean(t.toggle), m.typeCheckConfig(D, t, A), t
        }, S._getDimension = function () {
            return g(this._element).hasClass("width") ? "width" : "height"
        }, S._getParent = function () {
            var t, n = this;
            m.isElement(this._config.parent) ? (t = this._config.parent, void 0 !== this._config.parent.jquery && (t = this._config.parent[0])) : t = document.querySelector(this._config.parent);
            var e = '[data-toggle="collapse"][data-parent="' + this._config.parent + '"]',
                i = [].slice.call(t.querySelectorAll(e));
            return g(i).each(function (t, e) {
                n._addAriaAndCollapsedClass(O._getTargetFromElement(e), [e])
            }), t
        }, S._addAriaAndCollapsedClass = function (t, e) {
            var n = g(t).hasClass("show");
            e.length && g(e).toggleClass("collapsed", !n).attr("aria-expanded", n)
        }, O._getTargetFromElement = function (t) {
            var e = m.getSelectorFromElement(t);
            return e ? document.querySelector(e) : null
        }, O._jQueryInterface = function (i) {
            return this.each(function () {
                var t = g(this), e = t.data("bs.collapse"),
                    n = r(r(r({}, N), t.data()), "object" == typeof i && i ? i : {});
                if (!e && n.toggle && "string" == typeof i && /show|hide/.test(i) && (n.toggle = !1), e || (e = new O(this, n), t.data("bs.collapse", e)), "string" == typeof i) {
                    if (void 0 === e[i]) throw new TypeError('No method named "' + i + '"');
                    e[i]()
                }
            })
        }, s(O, null, [{
            key: "VERSION", get: function () {
                return "4.5.0"
            }
        }, {
            key: "Default", get: function () {
                return N
            }
        }]), O);

    function O(e, t) {
        this._isTransitioning = !1, this._element = e, this._config = this._getConfig(t), this._triggerArray = [].slice.call(document.querySelectorAll('[data-toggle="collapse"][href="#' + e.id + '"],[data-toggle="collapse"][data-target="#' + e.id + '"]'));
        for (var n = [].slice.call(document.querySelectorAll('[data-toggle="collapse"]')), i = 0, o = n.length; i < o; i++) {
            var s = n[i], r = m.getSelectorFromElement(s),
                a = [].slice.call(document.querySelectorAll(r)).filter(function (t) {
                    return t === e
                });
            null !== r && 0 < a.length && (this._selector = r, this._triggerArray.push(s))
        }
        this._parent = this._config.parent ? this._getParent() : null, this._config.parent || this._addAriaAndCollapsedClass(this._element, this._triggerArray), this._config.toggle && this.toggle()
    }

    g(document).on("click.bs.collapse.data-api", '[data-toggle="collapse"]', function (t) {
        "A" === t.currentTarget.tagName && t.preventDefault();
        var n = g(this), e = m.getSelectorFromElement(this), i = [].slice.call(document.querySelectorAll(e));
        g(i).each(function () {
            var t = g(this), e = t.data("bs.collapse") ? "toggle" : n.data();
            I._jQueryInterface.call(t, e)
        })
    }), g.fn[D] = I._jQueryInterface, g.fn[D].Constructor = I, g.fn[D].noConflict = function () {
        return g.fn[D] = k, I._jQueryInterface
    };
    var j, P = "dropdown", x = g.fn[P], L = new RegExp("38|40|27"), R = {
        offset: 0,
        flip: !0,
        boundary: "scrollParent",
        reference: "toggle",
        display: "dynamic",
        popperConfig: null
    }, q = {
        offset: "(number|string|function)",
        flip: "boolean",
        boundary: "(string|element)",
        reference: "(string|element)",
        display: "string",
        popperConfig: "(null|object)"
    }, F = ((j = Q.prototype).toggle = function () {
        var t;
        this._element.disabled || g(this._element).hasClass("disabled") || (t = g(this._menu).hasClass("show"), Q._clearMenus(), t || this.show(!0))
    }, j.show = function (t) {
        if (void 0 === t && (t = !1), !(this._element.disabled || g(this._element).hasClass("disabled") || g(this._menu).hasClass("show"))) {
            var e = {relatedTarget: this._element}, n = g.Event("show.bs.dropdown", e),
                i = Q._getParentFromElement(this._element);
            if (g(i).trigger(n), !n.isDefaultPrevented()) {
                if (!this._inNavbar && t) {
                    if (void 0 === u) throw new TypeError("Bootstrap's dropdowns require Popper.js (https://popper.js.org/)");
                    var o = this._element;
                    "parent" === this._config.reference ? o = i : m.isElement(this._config.reference) && (o = this._config.reference, void 0 !== this._config.reference.jquery && (o = this._config.reference[0])), "scrollParent" !== this._config.boundary && g(i).addClass("position-static"), this._popper = new u(o, this._menu, this._getPopperConfig())
                }
                "ontouchstart" in document.documentElement && 0 === g(i).closest(".navbar-nav").length && g(document.body).children().on("mouseover", null, g.noop), this._element.focus(), this._element.setAttribute("aria-expanded", !0), g(this._menu).toggleClass("show"), g(i).toggleClass("show").trigger(g.Event("shown.bs.dropdown", e))
            }
        }
    }, j.hide = function () {
        var t, e, n;
        this._element.disabled || g(this._element).hasClass("disabled") || !g(this._menu).hasClass("show") || (t = {relatedTarget: this._element}, e = g.Event("hide.bs.dropdown", t), n = Q._getParentFromElement(this._element), g(n).trigger(e), e.isDefaultPrevented() || (this._popper && this._popper.destroy(), g(this._menu).toggleClass("show"), g(n).toggleClass("show").trigger(g.Event("hidden.bs.dropdown", t))))
    }, j.dispose = function () {
        g.removeData(this._element, "bs.dropdown"), g(this._element).off(".bs.dropdown"), this._element = null, (this._menu = null) !== this._popper && (this._popper.destroy(), this._popper = null)
    }, j.update = function () {
        this._inNavbar = this._detectNavbar(), null !== this._popper && this._popper.scheduleUpdate()
    }, j._addEventListeners = function () {
        var e = this;
        g(this._element).on("click.bs.dropdown", function (t) {
            t.preventDefault(), t.stopPropagation(), e.toggle()
        })
    }, j._getConfig = function (t) {
        return t = r(r(r({}, this.constructor.Default), g(this._element).data()), t), m.typeCheckConfig(P, t, this.constructor.DefaultType), t
    }, j._getMenuElement = function () {
        var t;
        return this._menu || (t = Q._getParentFromElement(this._element)) && (this._menu = t.querySelector(".dropdown-menu")), this._menu
    }, j._getPlacement = function () {
        var t = g(this._element.parentNode), e = "bottom-start";
        return t.hasClass("dropup") ? e = g(this._menu).hasClass("dropdown-menu-right") ? "top-end" : "top-start" : t.hasClass("dropright") ? e = "right-start" : t.hasClass("dropleft") ? e = "left-start" : g(this._menu).hasClass("dropdown-menu-right") && (e = "bottom-end"), e
    }, j._detectNavbar = function () {
        return 0 < g(this._element).closest(".navbar").length
    }, j._getOffset = function () {
        var e = this, t = {};
        return "function" == typeof this._config.offset ? t.fn = function (t) {
            return t.offsets = r(r({}, t.offsets), e._config.offset(t.offsets, e._element) || {}), t
        } : t.offset = this._config.offset, t
    }, j._getPopperConfig = function () {
        var t = {
            placement: this._getPlacement(),
            modifiers: {
                offset: this._getOffset(),
                flip: {enabled: this._config.flip},
                preventOverflow: {boundariesElement: this._config.boundary}
            }
        };
        return "static" === this._config.display && (t.modifiers.applyStyle = {enabled: !1}), r(r({}, t), this._config.popperConfig)
    }, Q._jQueryInterface = function (e) {
        return this.each(function () {
            var t = g(this).data("bs.dropdown");
            if (t || (t = new Q(this, "object" == typeof e ? e : null), g(this).data("bs.dropdown", t)), "string" == typeof e) {
                if (void 0 === t[e]) throw new TypeError('No method named "' + e + '"');
                t[e]()
            }
        })
    }, Q._clearMenus = function (t) {
        if (!t || 3 !== t.which && ("keyup" !== t.type || 9 === t.which)) for (var e = [].slice.call(document.querySelectorAll('[data-toggle="dropdown"]')), n = 0, i = e.length; n < i; n++) {
            var o, s, r = Q._getParentFromElement(e[n]), a = g(e[n]).data("bs.dropdown"), l = {relatedTarget: e[n]};
            t && "click" === t.type && (l.clickEvent = t), a && (o = a._menu, !g(r).hasClass("show") || t && ("click" === t.type && /input|textarea/i.test(t.target.tagName) || "keyup" === t.type && 9 === t.which) && g.contains(r, t.target) || (s = g.Event("hide.bs.dropdown", l), g(r).trigger(s), s.isDefaultPrevented() || ("ontouchstart" in document.documentElement && g(document.body).children().off("mouseover", null, g.noop), e[n].setAttribute("aria-expanded", "false"), a._popper && a._popper.destroy(), g(o).removeClass("show"), g(r).removeClass("show").trigger(g.Event("hidden.bs.dropdown", l)))))
        }
    }, Q._getParentFromElement = function (t) {
        var e, n = m.getSelectorFromElement(t);
        return n && (e = document.querySelector(n)), e || t.parentNode
    }, Q._dataApiKeydownHandler = function (t) {
        if (!(/input|textarea/i.test(t.target.tagName) ? 32 === t.which || 27 !== t.which && (40 !== t.which && 38 !== t.which || g(t.target).closest(".dropdown-menu").length) : !L.test(t.which)) && !this.disabled && !g(this).hasClass("disabled")) {
            var e = Q._getParentFromElement(this), n = g(e).hasClass("show");
            if (n || 27 !== t.which) {
                if (t.preventDefault(), t.stopPropagation(), !n || n && (27 === t.which || 32 === t.which)) return 27 === t.which && g(e.querySelector('[data-toggle="dropdown"]')).trigger("focus"), void g(this).trigger("click");
                var i,
                    o = [].slice.call(e.querySelectorAll(".dropdown-menu .dropdown-item:not(.disabled):not(:disabled)")).filter(function (t) {
                        return g(t).is(":visible")
                    });
                0 !== o.length && (i = o.indexOf(t.target), 38 === t.which && 0 < i && i--, 40 === t.which && i < o.length - 1 && i++, i < 0 && (i = 0), o[i].focus())
            }
        }
    }, s(Q, null, [{
        key: "VERSION", get: function () {
            return "4.5.0"
        }
    }, {
        key: "Default", get: function () {
            return R
        }
    }, {
        key: "DefaultType", get: function () {
            return q
        }
    }]), Q);

    function Q(t, e) {
        this._element = t, this._popper = null, this._config = this._getConfig(e), this._menu = this._getMenuElement(), this._inNavbar = this._detectNavbar(), this._addEventListeners()
    }

    g(document).on("keydown.bs.dropdown.data-api", '[data-toggle="dropdown"]', F._dataApiKeydownHandler).on("keydown.bs.dropdown.data-api", ".dropdown-menu", F._dataApiKeydownHandler).on("click.bs.dropdown.data-api keyup.bs.dropdown.data-api", F._clearMenus).on("click.bs.dropdown.data-api", '[data-toggle="dropdown"]', function (t) {
        t.preventDefault(), t.stopPropagation(), F._jQueryInterface.call(g(this), "toggle")
    }).on("click.bs.dropdown.data-api", ".dropdown form", function (t) {
        t.stopPropagation()
    }), g.fn[P] = F._jQueryInterface, g.fn[P].Constructor = F, g.fn[P].noConflict = function () {
        return g.fn[P] = x, F._jQueryInterface
    };
    var B, H = g.fn.modal, U = {backdrop: !0, keyboard: !0, focus: !0, show: !0},
        M = {backdrop: "(boolean|string)", keyboard: "boolean", focus: "boolean", show: "boolean"},
        W = ((B = V.prototype).toggle = function (t) {
            return this._isShown ? this.hide() : this.show(t)
        }, B.show = function (t) {
            var e, n = this;
            this._isShown || this._isTransitioning || (g(this._element).hasClass("fade") && (this._isTransitioning = !0), e = g.Event("show.bs.modal", {relatedTarget: t}), g(this._element).trigger(e), this._isShown || e.isDefaultPrevented() || (this._isShown = !0, this._checkScrollbar(), this._setScrollbar(), this._adjustDialog(), this._setEscapeEvent(), this._setResizeEvent(), g(this._element).on("click.dismiss.bs.modal", '[data-dismiss="modal"]', function (t) {
                return n.hide(t)
            }), g(this._dialog).on("mousedown.dismiss.bs.modal", function () {
                g(n._element).one("mouseup.dismiss.bs.modal", function (t) {
                    g(t.target).is(n._element) && (n._ignoreBackdropClick = !0)
                })
            }), this._showBackdrop(function () {
                return n._showElement(t)
            })))
        }, B.hide = function (t) {
            var e, n, i, o = this;
            t && t.preventDefault(), this._isShown && !this._isTransitioning && (e = g.Event("hide.bs.modal"), g(this._element).trigger(e), this._isShown && !e.isDefaultPrevented() && (this._isShown = !1, (n = g(this._element).hasClass("fade")) && (this._isTransitioning = !0), this._setEscapeEvent(), this._setResizeEvent(), g(document).off("focusin.bs.modal"), g(this._element).removeClass("show"), g(this._element).off("click.dismiss.bs.modal"), g(this._dialog).off("mousedown.dismiss.bs.modal"), n ? (i = m.getTransitionDurationFromElement(this._element), g(this._element).one(m.TRANSITION_END, function (t) {
                return o._hideModal(t)
            }).emulateTransitionEnd(i)) : this._hideModal()))
        }, B.dispose = function () {
            [window, this._element, this._dialog].forEach(function (t) {
                return g(t).off(".bs.modal")
            }), g(document).off("focusin.bs.modal"), g.removeData(this._element, "bs.modal"), this._config = null, this._element = null, this._dialog = null, this._backdrop = null, this._isShown = null, this._isBodyOverflowing = null, this._ignoreBackdropClick = null, this._isTransitioning = null, this._scrollbarWidth = null
        }, B.handleUpdate = function () {
            this._adjustDialog()
        }, B._getConfig = function (t) {
            return t = r(r({}, U), t), m.typeCheckConfig("modal", t, M), t
        }, B._triggerBackdropTransition = function () {
            var t = this;
            if ("static" === this._config.backdrop) {
                var e = g.Event("hidePrevented.bs.modal");
                if (g(this._element).trigger(e), e.defaultPrevented) return;
                this._element.classList.add("modal-static");
                var n = m.getTransitionDurationFromElement(this._element);
                g(this._element).one(m.TRANSITION_END, function () {
                    t._element.classList.remove("modal-static")
                }).emulateTransitionEnd(n), this._element.focus()
            } else this.hide()
        }, B._showElement = function (t) {
            var e = this, n = g(this._element).hasClass("fade"),
                i = this._dialog ? this._dialog.querySelector(".modal-body") : null;

            function o() {
                e._config.focus && e._element.focus(), e._isTransitioning = !1, g(e._element).trigger(r)
            }

            this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE || document.body.appendChild(this._element), this._element.style.display = "block", this._element.removeAttribute("aria-hidden"), this._element.setAttribute("aria-modal", !0), g(this._dialog).hasClass("modal-dialog-scrollable") && i ? i.scrollTop = 0 : this._element.scrollTop = 0, n && m.reflow(this._element), g(this._element).addClass("show"), this._config.focus && this._enforceFocus();
            var s, r = g.Event("shown.bs.modal", {relatedTarget: t});
            n ? (s = m.getTransitionDurationFromElement(this._dialog), g(this._dialog).one(m.TRANSITION_END, o).emulateTransitionEnd(s)) : o()
        }, B._enforceFocus = function () {
            var e = this;
            g(document).off("focusin.bs.modal").on("focusin.bs.modal", function (t) {
                document !== t.target && e._element !== t.target && 0 === g(e._element).has(t.target).length && e._element.focus()
            })
        }, B._setEscapeEvent = function () {
            var e = this;
            this._isShown ? g(this._element).on("keydown.dismiss.bs.modal", function (t) {
                e._config.keyboard && 27 === t.which ? (t.preventDefault(), e.hide()) : e._config.keyboard || 27 !== t.which || e._triggerBackdropTransition()
            }) : this._isShown || g(this._element).off("keydown.dismiss.bs.modal")
        }, B._setResizeEvent = function () {
            var e = this;
            this._isShown ? g(window).on("resize.bs.modal", function (t) {
                return e.handleUpdate(t)
            }) : g(window).off("resize.bs.modal")
        }, B._hideModal = function () {
            var t = this;
            this._element.style.display = "none", this._element.setAttribute("aria-hidden", !0), this._element.removeAttribute("aria-modal"), this._isTransitioning = !1, this._showBackdrop(function () {
                g(document.body).removeClass("modal-open"), t._resetAdjustments(), t._resetScrollbar(), g(t._element).trigger("hidden.bs.modal")
            })
        }, B._removeBackdrop = function () {
            this._backdrop && (g(this._backdrop).remove(), this._backdrop = null)
        }, B._showBackdrop = function (t) {
            var e, n, i = this, o = g(this._element).hasClass("fade") ? "fade" : "";
            if (this._isShown && this._config.backdrop) {
                if (this._backdrop = document.createElement("div"), this._backdrop.className = "modal-backdrop", o && this._backdrop.classList.add(o), g(this._backdrop).appendTo(document.body), g(this._element).on("click.dismiss.bs.modal", function (t) {
                    i._ignoreBackdropClick ? i._ignoreBackdropClick = !1 : t.target === t.currentTarget && i._triggerBackdropTransition()
                }), o && m.reflow(this._backdrop), g(this._backdrop).addClass("show"), !t) return;
                if (!o) return void t();
                var s = m.getTransitionDurationFromElement(this._backdrop);
                g(this._backdrop).one(m.TRANSITION_END, t).emulateTransitionEnd(s)
            } else !this._isShown && this._backdrop ? (g(this._backdrop).removeClass("show"), e = function () {
                i._removeBackdrop(), t && t()
            }, g(this._element).hasClass("fade") ? (n = m.getTransitionDurationFromElement(this._backdrop), g(this._backdrop).one(m.TRANSITION_END, e).emulateTransitionEnd(n)) : e()) : t && t()
        }, B._adjustDialog = function () {
            var t = this._element.scrollHeight > document.documentElement.clientHeight;
            !this._isBodyOverflowing && t && (this._element.style.paddingLeft = this._scrollbarWidth + "px"), this._isBodyOverflowing && !t && (this._element.style.paddingRight = this._scrollbarWidth + "px")
        }, B._resetAdjustments = function () {
            this._element.style.paddingLeft = "", this._element.style.paddingRight = ""
        }, B._checkScrollbar = function () {
            var t = document.body.getBoundingClientRect();
            this._isBodyOverflowing = Math.round(t.left + t.right) < window.innerWidth, this._scrollbarWidth = this._getScrollbarWidth()
        }, B._setScrollbar = function () {
            var t, e, n, i, o = this;
            this._isBodyOverflowing && (t = [].slice.call(document.querySelectorAll(".fixed-top, .fixed-bottom, .is-fixed, .sticky-top")), e = [].slice.call(document.querySelectorAll(".sticky-top")), g(t).each(function (t, e) {
                var n = e.style.paddingRight, i = g(e).css("padding-right");
                g(e).data("padding-right", n).css("padding-right", parseFloat(i) + o._scrollbarWidth + "px")
            }), g(e).each(function (t, e) {
                var n = e.style.marginRight, i = g(e).css("margin-right");
                g(e).data("margin-right", n).css("margin-right", parseFloat(i) - o._scrollbarWidth + "px")
            }), n = document.body.style.paddingRight, i = g(document.body).css("padding-right"), g(document.body).data("padding-right", n).css("padding-right", parseFloat(i) + this._scrollbarWidth + "px")), g(document.body).addClass("modal-open")
        }, B._resetScrollbar = function () {
            var t = [].slice.call(document.querySelectorAll(".fixed-top, .fixed-bottom, .is-fixed, .sticky-top"));
            g(t).each(function (t, e) {
                var n = g(e).data("padding-right");
                g(e).removeData("padding-right"), e.style.paddingRight = n || ""
            });
            var e = [].slice.call(document.querySelectorAll(".sticky-top"));
            g(e).each(function (t, e) {
                var n = g(e).data("margin-right");
                void 0 !== n && g(e).css("margin-right", n).removeData("margin-right")
            });
            var n = g(document.body).data("padding-right");
            g(document.body).removeData("padding-right"), document.body.style.paddingRight = n || ""
        }, B._getScrollbarWidth = function () {
            var t = document.createElement("div");
            t.className = "modal-scrollbar-measure", document.body.appendChild(t);
            var e = t.getBoundingClientRect().width - t.clientWidth;
            return document.body.removeChild(t), e
        }, V._jQueryInterface = function (n, i) {
            return this.each(function () {
                var t = g(this).data("bs.modal"),
                    e = r(r(r({}, U), g(this).data()), "object" == typeof n && n ? n : {});
                if (t || (t = new V(this, e), g(this).data("bs.modal", t)), "string" == typeof n) {
                    if (void 0 === t[n]) throw new TypeError('No method named "' + n + '"');
                    t[n](i)
                } else e.show && t.show(i)
            })
        }, s(V, null, [{
            key: "VERSION", get: function () {
                return "4.5.0"
            }
        }, {
            key: "Default", get: function () {
                return U
            }
        }]), V);

    function V(t, e) {
        this._config = this._getConfig(e), this._element = t, this._dialog = t.querySelector(".modal-dialog"), this._backdrop = null, this._isShown = !1, this._isBodyOverflowing = !1, this._ignoreBackdropClick = !1, this._isTransitioning = !1, this._scrollbarWidth = 0
    }

    g(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', function (t) {
        var e, n = this, i = m.getSelectorFromElement(this);
        i && (e = document.querySelector(i));
        var o = g(e).data("bs.modal") ? "toggle" : r(r({}, g(e).data()), g(this).data());
        "A" !== this.tagName && "AREA" !== this.tagName || t.preventDefault();
        var s = g(e).one("show.bs.modal", function (t) {
            t.isDefaultPrevented() || s.one("hidden.bs.modal", function () {
                g(n).is(":visible") && n.focus()
            })
        });
        W._jQueryInterface.call(g(e), o, this)
    }), g.fn.modal = W._jQueryInterface, g.fn.modal.Constructor = W, g.fn.modal.noConflict = function () {
        return g.fn.modal = H, W._jQueryInterface
    };
    var z = ["background", "cite", "href", "itemtype", "longdesc", "poster", "src", "xlink:href"],
        K = /^(?:(?:https?|mailto|ftp|tel|file):|[^#&/:?]*(?:[#/?]|$))/gi,
        X = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i;

    function Y(t, s, e) {
        if (0 === t.length) return t;
        if (e && "function" == typeof e) return e(t);
        for (var n = (new window.DOMParser).parseFromString(t, "text/html"), r = Object.keys(s), a = [].slice.call(n.body.querySelectorAll("*")), i = 0, o = a.length; i < o; i++) !function (t) {
            var e = a[t], n = e.nodeName.toLowerCase();
            if (-1 === r.indexOf(e.nodeName.toLowerCase())) return e.parentNode.removeChild(e);
            var i = [].slice.call(e.attributes), o = [].concat(s["*"] || [], s[n] || []);
            i.forEach(function (t) {
                !function (t, e) {
                    var n = t.nodeName.toLowerCase();
                    if (-1 !== e.indexOf(n)) return -1 === z.indexOf(n) || Boolean(t.nodeValue.match(K) || t.nodeValue.match(X));
                    for (var i = e.filter(function (t) {
                        return t instanceof RegExp
                    }), o = 0, s = i.length; o < s; o++) if (n.match(i[o])) return 1
                }(t, o) && e.removeAttribute(t.nodeName)
            })
        }(i);
        return n.body.innerHTML
    }

    var $, J = "tooltip", G = g.fn[J], Z = new RegExp("(^|\\s)bs-tooltip\\S+", "g"),
        tt = ["sanitize", "whiteList", "sanitizeFn"], et = {
            animation: "boolean",
            template: "string",
            title: "(string|element|function)",
            trigger: "string",
            delay: "(number|object)",
            html: "boolean",
            selector: "(string|boolean)",
            placement: "(string|function)",
            offset: "(number|string|function)",
            container: "(string|element|boolean)",
            fallbackPlacement: "(string|array)",
            boundary: "(string|element)",
            sanitize: "boolean",
            sanitizeFn: "(null|function)",
            whiteList: "object",
            popperConfig: "(null|object)"
        }, nt = {AUTO: "auto", TOP: "top", RIGHT: "right", BOTTOM: "bottom", LEFT: "left"}, it = {
            animation: !0,
            template: '<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
            trigger: "hover focus",
            title: "",
            delay: 0,
            html: !1,
            selector: !1,
            placement: "top",
            offset: 0,
            container: !1,
            fallbackPlacement: "flip",
            boundary: "scrollParent",
            sanitize: !0,
            sanitizeFn: null,
            whiteList: {
                "*": ["class", "dir", "id", "lang", "role", /^aria-[\w-]*$/i],
                a: ["target", "href", "title", "rel"],
                area: [],
                b: [],
                br: [],
                col: [],
                code: [],
                div: [],
                em: [],
                hr: [],
                h1: [],
                h2: [],
                h3: [],
                h4: [],
                h5: [],
                h6: [],
                i: [],
                img: ["src", "srcset", "alt", "title", "width", "height"],
                li: [],
                ol: [],
                p: [],
                pre: [],
                s: [],
                small: [],
                span: [],
                sub: [],
                sup: [],
                strong: [],
                u: [],
                ul: []
            },
            popperConfig: null
        }, ot = {
            HIDE: "hide.bs.tooltip",
            HIDDEN: "hidden.bs.tooltip",
            SHOW: "show.bs.tooltip",
            SHOWN: "shown.bs.tooltip",
            INSERTED: "inserted.bs.tooltip",
            CLICK: "click.bs.tooltip",
            FOCUSIN: "focusin.bs.tooltip",
            FOCUSOUT: "focusout.bs.tooltip",
            MOUSEENTER: "mouseenter.bs.tooltip",
            MOUSELEAVE: "mouseleave.bs.tooltip"
        }, st = (($ = rt.prototype).enable = function () {
            this._isEnabled = !0
        }, $.disable = function () {
            this._isEnabled = !1
        }, $.toggleEnabled = function () {
            this._isEnabled = !this._isEnabled
        }, $.toggle = function (t) {
            if (this._isEnabled) if (t) {
                var e = this.constructor.DATA_KEY, n = g(t.currentTarget).data(e);
                n || (n = new this.constructor(t.currentTarget, this._getDelegateConfig()), g(t.currentTarget).data(e, n)), n._activeTrigger.click = !n._activeTrigger.click, n._isWithActiveTrigger() ? n._enter(null, n) : n._leave(null, n)
            } else {
                if (g(this.getTipElement()).hasClass("show")) return void this._leave(null, this);
                this._enter(null, this)
            }
        }, $.dispose = function () {
            clearTimeout(this._timeout), g.removeData(this.element, this.constructor.DATA_KEY), g(this.element).off(this.constructor.EVENT_KEY), g(this.element).closest(".modal").off("hide.bs.modal", this._hideModalHandler), this.tip && g(this.tip).remove(), this._isEnabled = null, this._timeout = null, this._hoverState = null, this._activeTrigger = null, this._popper && this._popper.destroy(), this._popper = null, this.element = null, this.config = null, this.tip = null
        }, $.show = function () {
            var e = this;
            if ("none" === g(this.element).css("display")) throw new Error("Please use show on visible elements");
            var t = g.Event(this.constructor.Event.SHOW);
            if (this.isWithContent() && this._isEnabled) {
                g(this.element).trigger(t);
                var n = m.findShadowRoot(this.element),
                    i = g.contains(null !== n ? n : this.element.ownerDocument.documentElement, this.element);
                if (t.isDefaultPrevented() || !i) return;
                var o = this.getTipElement(), s = m.getUID(this.constructor.NAME);
                o.setAttribute("id", s), this.element.setAttribute("aria-describedby", s), this.setContent(), this.config.animation && g(o).addClass("fade");
                var r = "function" == typeof this.config.placement ? this.config.placement.call(this, o, this.element) : this.config.placement,
                    a = this._getAttachment(r);
                this.addAttachmentClass(a);
                var l = this._getContainer();
                g(o).data(this.constructor.DATA_KEY, this), g.contains(this.element.ownerDocument.documentElement, this.tip) || g(o).appendTo(l), g(this.element).trigger(this.constructor.Event.INSERTED), this._popper = new u(this.element, o, this._getPopperConfig(a)), g(o).addClass("show"), "ontouchstart" in document.documentElement && g(document.body).children().on("mouseover", null, g.noop);
                var c, h = function () {
                    e.config.animation && e._fixTransition();
                    var t = e._hoverState;
                    e._hoverState = null, g(e.element).trigger(e.constructor.Event.SHOWN), "out" === t && e._leave(null, e)
                };
                g(this.tip).hasClass("fade") ? (c = m.getTransitionDurationFromElement(this.tip), g(this.tip).one(m.TRANSITION_END, h).emulateTransitionEnd(c)) : h()
            }
        }, $.hide = function (t) {
            function e() {
                "show" !== i._hoverState && o.parentNode && o.parentNode.removeChild(o), i._cleanTipClass(), i.element.removeAttribute("aria-describedby"), g(i.element).trigger(i.constructor.Event.HIDDEN), null !== i._popper && i._popper.destroy(), t && t()
            }

            var n, i = this, o = this.getTipElement(), s = g.Event(this.constructor.Event.HIDE);
            g(this.element).trigger(s), s.isDefaultPrevented() || (g(o).removeClass("show"), "ontouchstart" in document.documentElement && g(document.body).children().off("mouseover", null, g.noop), this._activeTrigger.click = !1, this._activeTrigger.focus = !1, this._activeTrigger.hover = !1, g(this.tip).hasClass("fade") ? (n = m.getTransitionDurationFromElement(o), g(o).one(m.TRANSITION_END, e).emulateTransitionEnd(n)) : e(), this._hoverState = "")
        }, $.update = function () {
            null !== this._popper && this._popper.scheduleUpdate()
        }, $.isWithContent = function () {
            return Boolean(this.getTitle())
        }, $.addAttachmentClass = function (t) {
            g(this.getTipElement()).addClass("bs-tooltip-" + t)
        }, $.getTipElement = function () {
            return this.tip = this.tip || g(this.config.template)[0], this.tip
        }, $.setContent = function () {
            var t = this.getTipElement();
            this.setElementContent(g(t.querySelectorAll(".tooltip-inner")), this.getTitle()), g(t).removeClass("fade show")
        }, $.setElementContent = function (t, e) {
            "object" != typeof e || !e.nodeType && !e.jquery ? this.config.html ? (this.config.sanitize && (e = Y(e, this.config.whiteList, this.config.sanitizeFn)), t.html(e)) : t.text(e) : this.config.html ? g(e).parent().is(t) || t.empty().append(e) : t.text(g(e).text())
        }, $.getTitle = function () {
            return this.element.getAttribute("data-original-title") || ("function" == typeof this.config.title ? this.config.title.call(this.element) : this.config.title)
        }, $._getPopperConfig = function (t) {
            var e = this;
            return r(r({}, {
                placement: t,
                modifiers: {
                    offset: this._getOffset(),
                    flip: {behavior: this.config.fallbackPlacement},
                    arrow: {element: ".arrow"},
                    preventOverflow: {boundariesElement: this.config.boundary}
                },
                onCreate: function (t) {
                    t.originalPlacement !== t.placement && e._handlePopperPlacementChange(t)
                },
                onUpdate: function (t) {
                    return e._handlePopperPlacementChange(t)
                }
            }), this.config.popperConfig)
        }, $._getOffset = function () {
            var e = this, t = {};
            return "function" == typeof this.config.offset ? t.fn = function (t) {
                return t.offsets = r(r({}, t.offsets), e.config.offset(t.offsets, e.element) || {}), t
            } : t.offset = this.config.offset, t
        }, $._getContainer = function () {
            return !1 === this.config.container ? document.body : m.isElement(this.config.container) ? g(this.config.container) : g(document).find(this.config.container)
        }, $._getAttachment = function (t) {
            return nt[t.toUpperCase()]
        }, $._setListeners = function () {
            var i = this;
            this.config.trigger.split(" ").forEach(function (t) {
                var e, n;
                "click" === t ? g(i.element).on(i.constructor.Event.CLICK, i.config.selector, function (t) {
                    return i.toggle(t)
                }) : "manual" !== t && (e = "hover" === t ? i.constructor.Event.MOUSEENTER : i.constructor.Event.FOCUSIN, n = "hover" === t ? i.constructor.Event.MOUSELEAVE : i.constructor.Event.FOCUSOUT, g(i.element).on(e, i.config.selector, function (t) {
                    return i._enter(t)
                }).on(n, i.config.selector, function (t) {
                    return i._leave(t)
                }))
            }), this._hideModalHandler = function () {
                i.element && i.hide()
            }, g(this.element).closest(".modal").on("hide.bs.modal", this._hideModalHandler), this.config.selector ? this.config = r(r({}, this.config), {}, {
                trigger: "manual",
                selector: ""
            }) : this._fixTitle()
        }, $._fixTitle = function () {
            var t = typeof this.element.getAttribute("data-original-title");
            !this.element.getAttribute("title") && "string" == t || (this.element.setAttribute("data-original-title", this.element.getAttribute("title") || ""), this.element.setAttribute("title", ""))
        }, $._enter = function (t, e) {
            var n = this.constructor.DATA_KEY;
            (e = e || g(t.currentTarget).data(n)) || (e = new this.constructor(t.currentTarget, this._getDelegateConfig()), g(t.currentTarget).data(n, e)), t && (e._activeTrigger["focusin" === t.type ? "focus" : "hover"] = !0), g(e.getTipElement()).hasClass("show") || "show" === e._hoverState ? e._hoverState = "show" : (clearTimeout(e._timeout), e._hoverState = "show", e.config.delay && e.config.delay.show ? e._timeout = setTimeout(function () {
                "show" === e._hoverState && e.show()
            }, e.config.delay.show) : e.show())
        }, $._leave = function (t, e) {
            var n = this.constructor.DATA_KEY;
            (e = e || g(t.currentTarget).data(n)) || (e = new this.constructor(t.currentTarget, this._getDelegateConfig()), g(t.currentTarget).data(n, e)), t && (e._activeTrigger["focusout" === t.type ? "focus" : "hover"] = !1), e._isWithActiveTrigger() || (clearTimeout(e._timeout), e._hoverState = "out", e.config.delay && e.config.delay.hide ? e._timeout = setTimeout(function () {
                "out" === e._hoverState && e.hide()
            }, e.config.delay.hide) : e.hide())
        }, $._isWithActiveTrigger = function () {
            for (var t in this._activeTrigger) if (this._activeTrigger[t]) return !0;
            return !1
        }, $._getConfig = function (t) {
            var e = g(this.element).data();
            return Object.keys(e).forEach(function (t) {
                -1 !== tt.indexOf(t) && delete e[t]
            }), "number" == typeof (t = r(r(r({}, this.constructor.Default), e), "object" == typeof t && t ? t : {})).delay && (t.delay = {
                show: t.delay,
                hide: t.delay
            }), "number" == typeof t.title && (t.title = t.title.toString()), "number" == typeof t.content && (t.content = t.content.toString()), m.typeCheckConfig(J, t, this.constructor.DefaultType), t.sanitize && (t.template = Y(t.template, t.whiteList, t.sanitizeFn)), t
        }, $._getDelegateConfig = function () {
            var t = {};
            if (this.config) for (var e in this.config) this.constructor.Default[e] !== this.config[e] && (t[e] = this.config[e]);
            return t
        }, $._cleanTipClass = function () {
            var t = g(this.getTipElement()), e = t.attr("class").match(Z);
            null !== e && e.length && t.removeClass(e.join(""))
        }, $._handlePopperPlacementChange = function (t) {
            this.tip = t.instance.popper, this._cleanTipClass(), this.addAttachmentClass(this._getAttachment(t.placement))
        }, $._fixTransition = function () {
            var t = this.getTipElement(), e = this.config.animation;
            null === t.getAttribute("x-placement") && (g(t).removeClass("fade"), this.config.animation = !1, this.hide(), this.show(), this.config.animation = e)
        }, rt._jQueryInterface = function (n) {
            return this.each(function () {
                var t = g(this).data("bs.tooltip"), e = "object" == typeof n && n;
                if ((t || !/dispose|hide/.test(n)) && (t || (t = new rt(this, e), g(this).data("bs.tooltip", t)), "string" == typeof n)) {
                    if (void 0 === t[n]) throw new TypeError('No method named "' + n + '"');
                    t[n]()
                }
            })
        }, s(rt, null, [{
            key: "VERSION", get: function () {
                return "4.5.0"
            }
        }, {
            key: "Default", get: function () {
                return it
            }
        }, {
            key: "NAME", get: function () {
                return J
            }
        }, {
            key: "DATA_KEY", get: function () {
                return "bs.tooltip"
            }
        }, {
            key: "Event", get: function () {
                return ot
            }
        }, {
            key: "EVENT_KEY", get: function () {
                return ".bs.tooltip"
            }
        }, {
            key: "DefaultType", get: function () {
                return et
            }
        }]), rt);

    function rt(t, e) {
        if (void 0 === u) throw new TypeError("Bootstrap's tooltips require Popper.js (https://popper.js.org/)");
        this._isEnabled = !0, this._timeout = 0, this._hoverState = "", this._activeTrigger = {}, this._popper = null, this.element = t, this.config = this._getConfig(e), this.tip = null, this._setListeners()
    }

    g.fn[J] = st._jQueryInterface, g.fn[J].Constructor = st, g.fn[J].noConflict = function () {
        return g.fn[J] = G, st._jQueryInterface
    };
    var at = "popover", lt = g.fn[at], ct = new RegExp("(^|\\s)bs-popover\\S+", "g"), ht = r(r({}, st.Default), {}, {
        placement: "right",
        trigger: "click",
        content: "",
        template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'
    }), ut = r(r({}, st.DefaultType), {}, {content: "(string|element|function)"}), dt = {
        HIDE: "hide.bs.popover",
        HIDDEN: "hidden.bs.popover",
        SHOW: "show.bs.popover",
        SHOWN: "shown.bs.popover",
        INSERTED: "inserted.bs.popover",
        CLICK: "click.bs.popover",
        FOCUSIN: "focusin.bs.popover",
        FOCUSOUT: "focusout.bs.popover",
        MOUSEENTER: "mouseenter.bs.popover",
        MOUSELEAVE: "mouseleave.bs.popover"
    }, ft = function (t) {
        var e, n;

        function i() {
            return t.apply(this, arguments) || this
        }

        n = t, (e = i).prototype = Object.create(n.prototype), (e.prototype.constructor = e).__proto__ = n;
        var o = i.prototype;
        return o.isWithContent = function () {
            return this.getTitle() || this._getContent()
        }, o.addAttachmentClass = function (t) {
            g(this.getTipElement()).addClass("bs-popover-" + t)
        }, o.getTipElement = function () {
            return this.tip = this.tip || g(this.config.template)[0], this.tip
        }, o.setContent = function () {
            var t = g(this.getTipElement());
            this.setElementContent(t.find(".popover-header"), this.getTitle());
            var e = this._getContent();
            "function" == typeof e && (e = e.call(this.element)), this.setElementContent(t.find(".popover-body"), e), t.removeClass("fade show")
        }, o._getContent = function () {
            return this.element.getAttribute("data-content") || this.config.content
        }, o._cleanTipClass = function () {
            var t = g(this.getTipElement()), e = t.attr("class").match(ct);
            null !== e && 0 < e.length && t.removeClass(e.join(""))
        }, i._jQueryInterface = function (n) {
            return this.each(function () {
                var t = g(this).data("bs.popover"), e = "object" == typeof n ? n : null;
                if ((t || !/dispose|hide/.test(n)) && (t || (t = new i(this, e), g(this).data("bs.popover", t)), "string" == typeof n)) {
                    if (void 0 === t[n]) throw new TypeError('No method named "' + n + '"');
                    t[n]()
                }
            })
        }, s(i, null, [{
            key: "VERSION", get: function () {
                return "4.5.0"
            }
        }, {
            key: "Default", get: function () {
                return ht
            }
        }, {
            key: "NAME", get: function () {
                return at
            }
        }, {
            key: "DATA_KEY", get: function () {
                return "bs.popover"
            }
        }, {
            key: "Event", get: function () {
                return dt
            }
        }, {
            key: "EVENT_KEY", get: function () {
                return ".bs.popover"
            }
        }, {
            key: "DefaultType", get: function () {
                return ut
            }
        }]), i
    }(st);
    g.fn[at] = ft._jQueryInterface, g.fn[at].Constructor = ft, g.fn[at].noConflict = function () {
        return g.fn[at] = lt, ft._jQueryInterface
    };
    var gt, mt = "scrollspy", pt = g.fn[mt], _t = {offset: 10, method: "auto", target: ""},
        vt = {offset: "number", method: "string", target: "(string|element)"},
        bt = ((gt = yt.prototype).refresh = function () {
            var e = this, t = this._scrollElement === this._scrollElement.window ? "offset" : "position",
                o = "auto" === this._config.method ? t : this._config.method,
                s = "position" === o ? this._getScrollTop() : 0;
            this._offsets = [], this._targets = [], this._scrollHeight = this._getScrollHeight(), [].slice.call(document.querySelectorAll(this._selector)).map(function (t) {
                var e, n = m.getSelectorFromElement(t);
                if (n && (e = document.querySelector(n)), e) {
                    var i = e.getBoundingClientRect();
                    if (i.width || i.height) return [g(e)[o]().top + s, n]
                }
                return null
            }).filter(function (t) {
                return t
            }).sort(function (t, e) {
                return t[0] - e[0]
            }).forEach(function (t) {
                e._offsets.push(t[0]), e._targets.push(t[1])
            })
        }, gt.dispose = function () {
            g.removeData(this._element, "bs.scrollspy"), g(this._scrollElement).off(".bs.scrollspy"), this._element = null, this._scrollElement = null, this._config = null, this._selector = null, this._offsets = null, this._targets = null, this._activeTarget = null, this._scrollHeight = null
        }, gt._getConfig = function (t) {
            var e;
            return "string" != typeof (t = r(r({}, _t), "object" == typeof t && t ? t : {})).target && m.isElement(t.target) && ((e = g(t.target).attr("id")) || (e = m.getUID(mt), g(t.target).attr("id", e)), t.target = "#" + e), m.typeCheckConfig(mt, t, vt), t
        }, gt._getScrollTop = function () {
            return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop
        }, gt._getScrollHeight = function () {
            return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
        }, gt._getOffsetHeight = function () {
            return this._scrollElement === window ? window.innerHeight : this._scrollElement.getBoundingClientRect().height
        }, gt._process = function () {
            var t = this._getScrollTop() + this._config.offset, e = this._getScrollHeight(),
                n = this._config.offset + e - this._getOffsetHeight();
            if (this._scrollHeight !== e && this.refresh(), n <= t) {
                var i = this._targets[this._targets.length - 1];
                this._activeTarget !== i && this._activate(i)
            } else {
                if (this._activeTarget && t < this._offsets[0] && 0 < this._offsets[0]) return this._activeTarget = null, void this._clear();
                for (var o = this._offsets.length; o--;) this._activeTarget !== this._targets[o] && t >= this._offsets[o] && (void 0 === this._offsets[o + 1] || t < this._offsets[o + 1]) && this._activate(this._targets[o])
            }
        }, gt._activate = function (e) {
            this._activeTarget = e, this._clear();
            var t = this._selector.split(",").map(function (t) {
                return t + '[data-target="' + e + '"],' + t + '[href="' + e + '"]'
            }), n = g([].slice.call(document.querySelectorAll(t.join(","))));
            n.hasClass("dropdown-item") ? (n.closest(".dropdown").find(".dropdown-toggle").addClass("active"), n.addClass("active")) : (n.addClass("active"), n.parents(".nav, .list-group").prev(".nav-link, .list-group-item").addClass("active"), n.parents(".nav, .list-group").prev(".nav-item").children(".nav-link").addClass("active")), g(this._scrollElement).trigger("activate.bs.scrollspy", {relatedTarget: e})
        }, gt._clear = function () {
            [].slice.call(document.querySelectorAll(this._selector)).filter(function (t) {
                return t.classList.contains("active")
            }).forEach(function (t) {
                return t.classList.remove("active")
            })
        }, yt._jQueryInterface = function (e) {
            return this.each(function () {
                var t = g(this).data("bs.scrollspy");
                if (t || (t = new yt(this, "object" == typeof e && e), g(this).data("bs.scrollspy", t)), "string" == typeof e) {
                    if (void 0 === t[e]) throw new TypeError('No method named "' + e + '"');
                    t[e]()
                }
            })
        }, s(yt, null, [{
            key: "VERSION", get: function () {
                return "4.5.0"
            }
        }, {
            key: "Default", get: function () {
                return _t
            }
        }]), yt);

    function yt(t, e) {
        var n = this;
        this._element = t, this._scrollElement = "BODY" === t.tagName ? window : t, this._config = this._getConfig(e), this._selector = this._config.target + " .nav-link," + this._config.target + " .list-group-item," + this._config.target + " .dropdown-item", this._offsets = [], this._targets = [], this._activeTarget = null, this._scrollHeight = 0, g(this._scrollElement).on("scroll.bs.scrollspy", function (t) {
            return n._process(t)
        }), this.refresh(), this._process()
    }

    g(window).on("load.bs.scrollspy.data-api", function () {
        for (var t = [].slice.call(document.querySelectorAll('[data-spy="scroll"]')), e = t.length; e--;) {
            var n = g(t[e]);
            bt._jQueryInterface.call(n, n.data())
        }
    }), g.fn[mt] = bt._jQueryInterface, g.fn[mt].Constructor = bt, g.fn[mt].noConflict = function () {
        return g.fn[mt] = pt, bt._jQueryInterface
    };
    var Et, wt = g.fn.tab, Tt = ((Et = Ct.prototype).show = function () {
        var t, e, n, i, o, s, r, a, l = this;
        this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && g(this._element).hasClass("active") || g(this._element).hasClass("disabled") || (e = g(this._element).closest(".nav, .list-group")[0], n = m.getSelectorFromElement(this._element), e && (i = "UL" === e.nodeName || "OL" === e.nodeName ? "> li > .active" : ".active", o = (o = g.makeArray(g(e).find(i)))[o.length - 1]), s = g.Event("hide.bs.tab", {relatedTarget: this._element}), r = g.Event("show.bs.tab", {relatedTarget: o}), o && g(o).trigger(s), g(this._element).trigger(r), r.isDefaultPrevented() || s.isDefaultPrevented() || (n && (t = document.querySelector(n)), this._activate(this._element, e), a = function () {
            var t = g.Event("hidden.bs.tab", {relatedTarget: l._element}),
                e = g.Event("shown.bs.tab", {relatedTarget: o});
            g(o).trigger(t), g(l._element).trigger(e)
        }, t ? this._activate(t, t.parentNode, a) : a()))
    }, Et.dispose = function () {
        g.removeData(this._element, "bs.tab"), this._element = null
    }, Et._activate = function (t, e, n) {
        function i() {
            return s._transitionComplete(t, r, n)
        }

        var o, s = this,
            r = (!e || "UL" !== e.nodeName && "OL" !== e.nodeName ? g(e).children(".active") : g(e).find("> li > .active"))[0],
            a = n && r && g(r).hasClass("fade");
        r && a ? (o = m.getTransitionDurationFromElement(r), g(r).removeClass("show").one(m.TRANSITION_END, i).emulateTransitionEnd(o)) : i()
    }, Et._transitionComplete = function (t, e, n) {
        var i, o, s;
        e && (g(e).removeClass("active"), (i = g(e.parentNode).find("> .dropdown-menu .active")[0]) && g(i).removeClass("active"), "tab" === e.getAttribute("role") && e.setAttribute("aria-selected", !1)), g(t).addClass("active"), "tab" === t.getAttribute("role") && t.setAttribute("aria-selected", !0), m.reflow(t), t.classList.contains("fade") && t.classList.add("show"), t.parentNode && g(t.parentNode).hasClass("dropdown-menu") && ((o = g(t).closest(".dropdown")[0]) && (s = [].slice.call(o.querySelectorAll(".dropdown-toggle")), g(s).addClass("active")), t.setAttribute("aria-expanded", !0)), n && n()
    }, Ct._jQueryInterface = function (n) {
        return this.each(function () {
            var t = g(this), e = t.data("bs.tab");
            if (e || (e = new Ct(this), t.data("bs.tab", e)), "string" == typeof n) {
                if (void 0 === e[n]) throw new TypeError('No method named "' + n + '"');
                e[n]()
            }
        })
    }, s(Ct, null, [{
        key: "VERSION", get: function () {
            return "4.5.0"
        }
    }]), Ct);

    function Ct(t) {
        this._element = t
    }

    g(document).on("click.bs.tab.data-api", '[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]', function (t) {
        t.preventDefault(), Tt._jQueryInterface.call(g(this), "show")
    }), g.fn.tab = Tt._jQueryInterface, g.fn.tab.Constructor = Tt, g.fn.tab.noConflict = function () {
        return g.fn.tab = wt, Tt._jQueryInterface
    };
    var St, Dt = g.fn.toast, kt = {animation: "boolean", autohide: "boolean", delay: "number"},
        Nt = {animation: !0, autohide: !0, delay: 500}, At = ((St = It.prototype).show = function () {
            var t, e, n = this, i = g.Event("show.bs.toast");
            g(this._element).trigger(i), i.isDefaultPrevented() || (this._config.animation && this._element.classList.add("fade"), t = function () {
                n._element.classList.remove("showing"), n._element.classList.add("show"), g(n._element).trigger("shown.bs.toast"), n._config.autohide && (n._timeout = setTimeout(function () {
                    n.hide()
                }, n._config.delay))
            }, this._element.classList.remove("hide"), m.reflow(this._element), this._element.classList.add("showing"), this._config.animation ? (e = m.getTransitionDurationFromElement(this._element), g(this._element).one(m.TRANSITION_END, t).emulateTransitionEnd(e)) : t())
        }, St.hide = function () {
            var t;
            this._element.classList.contains("show") && (t = g.Event("hide.bs.toast"), g(this._element).trigger(t), t.isDefaultPrevented() || this._close())
        }, St.dispose = function () {
            clearTimeout(this._timeout), this._timeout = null, this._element.classList.contains("show") && this._element.classList.remove("show"), g(this._element).off("click.dismiss.bs.toast"), g.removeData(this._element, "bs.toast"), this._element = null, this._config = null
        }, St._getConfig = function (t) {
            return t = r(r(r({}, Nt), g(this._element).data()), "object" == typeof t && t ? t : {}), m.typeCheckConfig("toast", t, this.constructor.DefaultType), t
        }, St._setListeners = function () {
            var t = this;
            g(this._element).on("click.dismiss.bs.toast", '[data-dismiss="toast"]', function () {
                return t.hide()
            })
        }, St._close = function () {
            function t() {
                n._element.classList.add("hide"), g(n._element).trigger("hidden.bs.toast")
            }

            var e, n = this;
            this._element.classList.remove("show"), this._config.animation ? (e = m.getTransitionDurationFromElement(this._element), g(this._element).one(m.TRANSITION_END, t).emulateTransitionEnd(e)) : t()
        }, It._jQueryInterface = function (n) {
            return this.each(function () {
                var t = g(this), e = t.data("bs.toast");
                if (e || (e = new It(this, "object" == typeof n && n), t.data("bs.toast", e)), "string" == typeof n) {
                    if (void 0 === e[n]) throw new TypeError('No method named "' + n + '"');
                    e[n](this)
                }
            })
        }, s(It, null, [{
            key: "VERSION", get: function () {
                return "4.5.0"
            }
        }, {
            key: "DefaultType", get: function () {
                return kt
            }
        }, {
            key: "Default", get: function () {
                return Nt
            }
        }]), It);

    function It(t, e) {
        this._element = t, this._config = this._getConfig(e), this._timeout = null, this._setListeners()
    }

    g.fn.toast = At._jQueryInterface, g.fn.toast.Constructor = At, g.fn.toast.noConflict = function () {
        return g.fn.toast = Dt, At._jQueryInterface
    }, t.Alert = l, t.Button = f, t.Carousel = T, t.Collapse = I, t.Dropdown = F, t.Modal = W, t.Popover = ft, t.Scrollspy = bt, t.Tab = Tt, t.Toast = At, t.Tooltip = st, t.Util = m, Object.defineProperty(t, "__esModule", {value: !0})
});
/*tinycolor-min.js*/
!function (u) {
    function c(t, e) {
        if (e = e || {}, (t = t || "") instanceof c) return t;
        if (!(this instanceof c)) return new c(t, e);
        var r, n, a, i, s, o, f, h, l = (n = {
            r: 0,
            g: 0,
            b: 0
        }, o = s = i = null, h = f = !(a = 1), "string" == typeof (r = t) && (r = function (t) {
            t = t.replace(F, "").replace(C, "").toLowerCase();
            var e, r = !1;
            if (j[t]) t = j[t], r = !0; else if ("transparent" == t) return {r: 0, g: 0, b: 0, a: 0, format: "name"};
            return (e = P.rgb.exec(t)) ? {r: e[1], g: e[2], b: e[3]} : (e = P.rgba.exec(t)) ? {
                r: e[1],
                g: e[2],
                b: e[3],
                a: e[4]
            } : (e = P.hsl.exec(t)) ? {h: e[1], s: e[2], l: e[3]} : (e = P.hsla.exec(t)) ? {
                h: e[1],
                s: e[2],
                l: e[3],
                a: e[4]
            } : (e = P.hsv.exec(t)) ? {h: e[1], s: e[2], v: e[3]} : (e = P.hsva.exec(t)) ? {
                h: e[1],
                s: e[2],
                v: e[3],
                a: e[4]
            } : (e = P.hex8.exec(t)) ? {
                r: x(e[1]),
                g: x(e[2]),
                b: x(e[3]),
                a: H(e[4]),
                format: r ? "name" : "hex8"
            } : (e = P.hex6.exec(t)) ? {
                r: x(e[1]),
                g: x(e[2]),
                b: x(e[3]),
                format: r ? "name" : "hex"
            } : (e = P.hex4.exec(t)) ? {
                r: x(e[1] + "" + e[1]),
                g: x(e[2] + "" + e[2]),
                b: x(e[3] + "" + e[3]),
                a: H(e[4] + "" + e[4]),
                format: r ? "name" : "hex8"
            } : !!(e = P.hex3.exec(t)) && {
                r: x(e[1] + "" + e[1]),
                g: x(e[2] + "" + e[2]),
                b: x(e[3] + "" + e[3]),
                format: r ? "name" : "hex"
            }
        }(r)), "object" == typeof r && (R(r.r) && R(r.g) && R(r.b) ? (n = function (t, e, r) {
            return {r: 255 * y(t, 255), g: 255 * y(e, 255), b: 255 * y(r, 255)}
        }(r.r, r.g, r.b), f = !0, h = "%" === String(r.r).substr(-1) ? "prgb" : "rgb") : R(r.h) && R(r.s) && R(r.v) ? (i = w(r.s), s = w(r.v), n = function (t, e, r) {
            t = 6 * y(t, 360), e = y(e, 100), r = y(r, 100);
            var n = u.floor(t), a = t - n, i = r * (1 - e), s = r * (1 - a * e), o = r * (1 - (1 - a) * e), f = n % 6;
            return {r: 255 * [r, s, i, i, o, r][f], g: 255 * [o, r, r, s, i, i][f], b: 255 * [i, i, o, r, r, s][f]}
        }(r.h, i, s), f = !0, h = "hsv") : R(r.h) && R(r.s) && R(r.l) && (i = w(r.s), o = w(r.l), n = function (t, e, r) {
            function n(t, e, r) {
                return r < 0 && (r += 1), 1 < r && --r, r < 1 / 6 ? t + 6 * (e - t) * r : r < .5 ? e : r < 2 / 3 ? t + 6 * (e - t) * (2 / 3 - r) : t
            }

            var a, i, s, o, f;
            return t = y(t, 360), e = y(e, 100), r = y(r, 100), 0 === e ? a = i = s = r : (a = n(f = 2 * r - (o = r < .5 ? r * (1 + e) : r + e - r * e), o, t + 1 / 3), i = n(f, o, t), s = n(f, o, t - 1 / 3)), {
                r: 255 * a,
                g: 255 * i,
                b: 255 * s
            }
        }(r.h, i, o), f = !0, h = "hsl"), r.hasOwnProperty("a") && (a = r.a)), a = v(a), {
            ok: f,
            format: r.format || h,
            r: I(255, L(n.r, 0)),
            g: I(255, L(n.g, 0)),
            b: I(255, L(n.b, 0)),
            a: a
        });
        this._originalInput = t, this._r = l.r, this._g = l.g, this._b = l.b, this._a = l.a, this._roundA = M(100 * this._a) / 100, this._format = e.format || l.format, this._gradientType = e.gradientType, this._r < 1 && (this._r = M(this._r)), this._g < 1 && (this._g = M(this._g)), this._b < 1 && (this._b = M(this._b)), this._ok = l.ok, this._tc_id = q++
    }

    function a(t, e, r) {
        t = y(t, 255), e = y(e, 255), r = y(r, 255);
        var n, a = L(t, e, r), i = I(t, e, r), s = (a + i) / 2;
        if (a == i) n = f = 0; else {
            var o = a - i, f = .5 < s ? o / (2 - a - i) : o / (a + i);
            switch (a) {
                case t:
                    n = (e - r) / o + (e < r ? 6 : 0);
                    break;
                case e:
                    n = (r - t) / o + 2;
                    break;
                case r:
                    n = (t - e) / o + 4
            }
            n /= 6
        }
        return {h: n, s: f, l: s}
    }

    function i(t, e, r) {
        t = y(t, 255), e = y(e, 255), r = y(r, 255);
        var n, a = L(t, e, r), i = I(t, e, r), s = a, o = a - i, f = 0 === a ? 0 : o / a;
        if (a == i) n = 0; else {
            switch (a) {
                case t:
                    n = (e - r) / o + (e < r ? 6 : 0);
                    break;
                case e:
                    n = (r - t) / o + 2;
                    break;
                case r:
                    n = (t - e) / o + 4
            }
            n /= 6
        }
        return {h: n, s: f, v: s}
    }

    function e(t, e, r, n) {
        var a = [k(M(t).toString(16)), k(M(e).toString(16)), k(M(r).toString(16))];
        return n && a[0].charAt(0) == a[0].charAt(1) && a[1].charAt(0) == a[1].charAt(1) && a[2].charAt(0) == a[2].charAt(1) ? a[0].charAt(0) + a[1].charAt(0) + a[2].charAt(0) : a.join("")
    }

    function s(t, e, r, n) {
        return [k(S(n)), k(M(t).toString(16)), k(M(e).toString(16)), k(M(r).toString(16))].join("")
    }

    function t(t, e) {
        e = 0 === e ? 0 : e || 10;
        var r = c(t).toHsl();
        return r.s -= e / 100, r.s = A(r.s), c(r)
    }

    function r(t, e) {
        e = 0 === e ? 0 : e || 10;
        var r = c(t).toHsl();
        return r.s += e / 100, r.s = A(r.s), c(r)
    }

    function n(t) {
        return c(t).desaturate(100)
    }

    function o(t, e) {
        e = 0 === e ? 0 : e || 10;
        var r = c(t).toHsl();
        return r.l += e / 100, r.l = A(r.l), c(r)
    }

    function f(t, e) {
        e = 0 === e ? 0 : e || 10;
        var r = c(t).toRgb();
        return r.r = L(0, I(255, r.r - M(-e / 100 * 255))), r.g = L(0, I(255, r.g - M(-e / 100 * 255))), r.b = L(0, I(255, r.b - M(-e / 100 * 255))), c(r)
    }

    function h(t, e) {
        e = 0 === e ? 0 : e || 10;
        var r = c(t).toHsl();
        return r.l -= e / 100, r.l = A(r.l), c(r)
    }

    function l(t, e) {
        var r = c(t).toHsl(), n = (r.h + e) % 360;
        return r.h = n < 0 ? 360 + n : n, c(r)
    }

    function g(t) {
        var e = c(t).toHsl();
        return e.h = (e.h + 180) % 360, c(e)
    }

    function b(t) {
        var e = c(t).toHsl(), r = e.h;
        return [c(t), c({h: (r + 120) % 360, s: e.s, l: e.l}), c({h: (r + 240) % 360, s: e.s, l: e.l})]
    }

    function d(t) {
        var e = c(t).toHsl(), r = e.h;
        return [c(t), c({h: (r + 90) % 360, s: e.s, l: e.l}), c({
            h: (r + 180) % 360,
            s: e.s,
            l: e.l
        }), c({h: (r + 270) % 360, s: e.s, l: e.l})]
    }

    function _(t) {
        var e = c(t).toHsl(), r = e.h;
        return [c(t), c({h: (r + 72) % 360, s: e.s, l: e.l}), c({h: (r + 216) % 360, s: e.s, l: e.l})]
    }

    function p(t, e, r) {
        e = e || 6, r = r || 30;
        var n = c(t).toHsl(), a = 360 / r, i = [c(t)];
        for (n.h = (n.h - (a * e >> 1) + 720) % 360; --e;) n.h = (n.h + a) % 360, i.push(c(n));
        return i
    }

    function m(t, e) {
        e = e || 6;
        for (var r = c(t).toHsv(), n = r.h, a = r.s, i = r.v, s = [], o = 1 / e; e--;) s.push(c({
            h: n,
            s: a,
            v: i
        })), i = (i + o) % 1;
        return s
    }

    function v(t) {
        return t = parseFloat(t), (isNaN(t) || t < 0 || 1 < t) && (t = 1), t
    }

    function y(t, e) {
        var r;
        "string" == typeof (r = t) && -1 != r.indexOf(".") && 1 === parseFloat(r) && (t = "100%");
        var n, a = "string" == typeof (n = t) && -1 != n.indexOf("%");
        return t = I(e, L(0, parseFloat(t))), a && (t = parseInt(t * e, 10) / 100), u.abs(t - e) < 1e-6 ? 1 : t % e / parseFloat(e)
    }

    function A(t) {
        return I(1, L(0, t))
    }

    function x(t) {
        return parseInt(t, 16)
    }

    function k(t) {
        return 1 == t.length ? "0" + t : "" + t
    }

    function w(t) {
        return t <= 1 && (t = 100 * t + "%"), t
    }

    function S(t) {
        return u.round(255 * parseFloat(t)).toString(16)
    }

    function H(t) {
        return x(t) / 255
    }

    function R(t) {
        return P.CSS_UNIT.exec(t)
    }

    var F = /^\s+/, C = /\s+$/, q = 0, M = u.round, I = u.min, L = u.max, N = u.random;
    c.prototype = {
        isDark: function () {
            return this.getBrightness() < 128
        }, isLight: function () {
            return !this.isDark()
        }, isValid: function () {
            return this._ok
        }, getOriginalInput: function () {
            return this._originalInput
        }, getFormat: function () {
            return this._format
        }, getAlpha: function () {
            return this._a
        }, getBrightness: function () {
            var t = this.toRgb();
            return (299 * t.r + 587 * t.g + 114 * t.b) / 1e3
        }, getLuminance: function () {
            var t = this.toRgb(), e = t.r / 255, r = t.g / 255, n = t.b / 255;
            return .2126 * (e <= .03928 ? e / 12.92 : u.pow((.055 + e) / 1.055, 2.4)) + .7152 * (r <= .03928 ? r / 12.92 : u.pow((.055 + r) / 1.055, 2.4)) + .0722 * (n <= .03928 ? n / 12.92 : u.pow((.055 + n) / 1.055, 2.4))
        }, setAlpha: function (t) {
            return this._a = v(t), this._roundA = M(100 * this._a) / 100, this
        }, toHsv: function () {
            var t = i(this._r, this._g, this._b);
            return {h: 360 * t.h, s: t.s, v: t.v, a: this._a}
        }, toHsvString: function () {
            var t = i(this._r, this._g, this._b), e = M(360 * t.h), r = M(100 * t.s), n = M(100 * t.v);
            return 1 == this._a ? "hsv(" + e + ", " + r + "%, " + n + "%)" : "hsva(" + e + ", " + r + "%, " + n + "%, " + this._roundA + ")"
        }, toHsl: function () {
            var t = a(this._r, this._g, this._b);
            return {h: 360 * t.h, s: t.s, l: t.l, a: this._a}
        }, toHslString: function () {
            var t = a(this._r, this._g, this._b), e = M(360 * t.h), r = M(100 * t.s), n = M(100 * t.l);
            return 1 == this._a ? "hsl(" + e + ", " + r + "%, " + n + "%)" : "hsla(" + e + ", " + r + "%, " + n + "%, " + this._roundA + ")"
        }, toHex: function (t) {
            return e(this._r, this._g, this._b, t)
        }, toHexString: function (t) {
            return "#" + this.toHex(t)
        }, toHex8: function (t) {
            return e = this._r, r = this._g, n = this._b, a = this._a, i = t, s = [k(M(e).toString(16)), k(M(r).toString(16)), k(M(n).toString(16)), k(S(a))], i && s[0].charAt(0) == s[0].charAt(1) && s[1].charAt(0) == s[1].charAt(1) && s[2].charAt(0) == s[2].charAt(1) && s[3].charAt(0) == s[3].charAt(1) ? s[0].charAt(0) + s[1].charAt(0) + s[2].charAt(0) + s[3].charAt(0) : s.join("");
            var e, r, n, a, i, s
        }, toHex8String: function (t) {
            return "#" + this.toHex8(t)
        }, toRgb: function () {
            return {r: M(this._r), g: M(this._g), b: M(this._b), a: this._a}
        }, toRgbString: function () {
            return 1 == this._a ? "rgb(" + M(this._r) + ", " + M(this._g) + ", " + M(this._b) + ")" : "rgba(" + M(this._r) + ", " + M(this._g) + ", " + M(this._b) + ", " + this._roundA + ")"
        }, toPercentageRgb: function () {
            return {
                r: M(100 * y(this._r, 255)) + "%",
                g: M(100 * y(this._g, 255)) + "%",
                b: M(100 * y(this._b, 255)) + "%",
                a: this._a
            }
        }, toPercentageRgbString: function () {
            return 1 == this._a ? "rgb(" + M(100 * y(this._r, 255)) + "%, " + M(100 * y(this._g, 255)) + "%, " + M(100 * y(this._b, 255)) + "%)" : "rgba(" + M(100 * y(this._r, 255)) + "%, " + M(100 * y(this._g, 255)) + "%, " + M(100 * y(this._b, 255)) + "%, " + this._roundA + ")"
        }, toName: function () {
            return 0 === this._a ? "transparent" : !(this._a < 1) && O[e(this._r, this._g, this._b, !0)] || !1
        }, toFilter: function (t) {
            var e, r = "#" + s(this._r, this._g, this._b, this._a), n = r,
                a = this._gradientType ? "GradientType = 1, " : "";
            return t && (n = "#" + s((e = c(t))._r, e._g, e._b, e._a)), "progid:DXImageTransform.Microsoft.gradient(" + a + "startColorstr=" + r + ",endColorstr=" + n + ")"
        }, toString: function (t) {
            var e = !!t;
            t = t || this._format;
            var r = !1, n = this._a < 1 && 0 <= this._a;
            return !e && n && ("hex" === t || "hex6" === t || "hex3" === t || "hex4" === t || "hex8" === t || "name" === t) ? "name" === t && 0 === this._a ? this.toName() : this.toRgbString() : ("rgb" === t && (r = this.toRgbString()), "prgb" === t && (r = this.toPercentageRgbString()), "hex" !== t && "hex6" !== t || (r = this.toHexString()), "hex3" === t && (r = this.toHexString(!0)), "hex4" === t && (r = this.toHex8String(!0)), "hex8" === t && (r = this.toHex8String()), "name" === t && (r = this.toName()), "hsl" === t && (r = this.toHslString()), "hsv" === t && (r = this.toHsvString()), r || this.toHexString())
        }, clone: function () {
            return c(this.toString())
        }, _applyModification: function (t, e) {
            var r = t.apply(null, [this].concat([].slice.call(e)));
            return this._r = r._r, this._g = r._g, this._b = r._b, this.setAlpha(r._a), this
        }, lighten: function () {
            return this._applyModification(o, arguments)
        }, brighten: function () {
            return this._applyModification(f, arguments)
        }, darken: function () {
            return this._applyModification(h, arguments)
        }, desaturate: function () {
            return this._applyModification(t, arguments)
        }, saturate: function () {
            return this._applyModification(r, arguments)
        }, greyscale: function () {
            return this._applyModification(n, arguments)
        }, spin: function () {
            return this._applyModification(l, arguments)
        }, _applyCombination: function (t, e) {
            return t.apply(null, [this].concat([].slice.call(e)))
        }, analogous: function () {
            return this._applyCombination(p, arguments)
        }, complement: function () {
            return this._applyCombination(g, arguments)
        }, monochromatic: function () {
            return this._applyCombination(m, arguments)
        }, splitcomplement: function () {
            return this._applyCombination(_, arguments)
        }, triad: function () {
            return this._applyCombination(b, arguments)
        }, tetrad: function () {
            return this._applyCombination(d, arguments)
        }
    }, c.fromRatio = function (t, e) {
        if ("object" == typeof t) {
            var r = {};
            for (var n in t) t.hasOwnProperty(n) && (r[n] = "a" === n ? t[n] : w(t[n]));
            t = r
        }
        return c(t, e)
    }, c.equals = function (t, e) {
        return !(!t || !e) && c(t).toRgbString() == c(e).toRgbString()
    }, c.random = function () {
        return c.fromRatio({r: N(), g: N(), b: N()})
    }, c.mix = function (t, e, r) {
        r = 0 === r ? 0 : r || 50;
        var n = c(t).toRgb(), a = c(e).toRgb(), i = r / 100;
        return c({
            r: (a.r - n.r) * i + n.r,
            g: (a.g - n.g) * i + n.g,
            b: (a.b - n.b) * i + n.b,
            a: (a.a - n.a) * i + n.a
        })
    }, c.readability = function (t, e) {
        var r = c(t), n = c(e);
        return (u.max(r.getLuminance(), n.getLuminance()) + .05) / (u.min(r.getLuminance(), n.getLuminance()) + .05)
    }, c.isReadable = function (t, e, r) {
        var n, a, i, s, o = c.readability(t, e), f = !1;
        switch ("AA" !== (i = ((a = (a = r) || {
            level: "AA",
            size: "small"
        }).level || "AA").toUpperCase()) && "AAA" !== i && (i = "AA"), "small" !== (s = (a.size || "small").toLowerCase()) && "large" !== s && (s = "small"), (n = {
            level: i,
            size: s
        }).level + n.size) {
            case"AAsmall":
            case"AAAlarge":
                f = 4.5 <= o;
                break;
            case"AAlarge":
                f = 3 <= o;
                break;
            case"AAAsmall":
                f = 7 <= o
        }
        return f
    }, c.mostReadable = function (t, e, r) {
        for (var n, a = null, i = 0, s = (r = r || {}).includeFallbackColors, o = r.level, f = r.size, h = 0; h < e.length; h++) i < (n = c.readability(t, e[h])) && (i = n, a = c(e[h]));
        return c.isReadable(t, a, {
            level: o,
            size: f
        }) || !s ? a : (r.includeFallbackColors = !1, c.mostReadable(t, ["#fff", "#000"], r))
    };
    var z, E, T, j = c.names = {
            aliceblue: "f0f8ff",
            antiquewhite: "faebd7",
            aqua: "0ff",
            aquamarine: "7fffd4",
            azure: "f0ffff",
            beige: "f5f5dc",
            bisque: "ffe4c4",
            black: "000",
            blanchedalmond: "ffebcd",
            blue: "00f",
            blueviolet: "8a2be2",
            brown: "a52a2a",
            burlywood: "deb887",
            burntsienna: "ea7e5d",
            cadetblue: "5f9ea0",
            chartreuse: "7fff00",
            chocolate: "d2691e",
            coral: "ff7f50",
            cornflowerblue: "6495ed",
            cornsilk: "fff8dc",
            crimson: "dc143c",
            cyan: "0ff",
            darkblue: "00008b",
            darkcyan: "008b8b",
            darkgoldenrod: "b8860b",
            darkgray: "a9a9a9",
            darkgreen: "006400",
            darkgrey: "a9a9a9",
            darkkhaki: "bdb76b",
            darkmagenta: "8b008b",
            darkolivegreen: "556b2f",
            darkorange: "ff8c00",
            darkorchid: "9932cc",
            darkred: "8b0000",
            darksalmon: "e9967a",
            darkseagreen: "8fbc8f",
            darkslateblue: "483d8b",
            darkslategray: "2f4f4f",
            darkslategrey: "2f4f4f",
            darkturquoise: "00ced1",
            darkviolet: "9400d3",
            deeppink: "ff1493",
            deepskyblue: "00bfff",
            dimgray: "696969",
            dimgrey: "696969",
            dodgerblue: "1e90ff",
            firebrick: "b22222",
            floralwhite: "fffaf0",
            forestgreen: "228b22",
            fuchsia: "f0f",
            gainsboro: "dcdcdc",
            ghostwhite: "f8f8ff",
            gold: "ffd700",
            goldenrod: "daa520",
            gray: "808080",
            green: "008000",
            greenyellow: "adff2f",
            grey: "808080",
            honeydew: "f0fff0",
            hotpink: "ff69b4",
            indianred: "cd5c5c",
            indigo: "4b0082",
            ivory: "fffff0",
            khaki: "f0e68c",
            lavender: "e6e6fa",
            lavenderblush: "fff0f5",
            lawngreen: "7cfc00",
            lemonchiffon: "fffacd",
            lightblue: "add8e6",
            lightcoral: "f08080",
            lightcyan: "e0ffff",
            lightgoldenrodyellow: "fafad2",
            lightgray: "d3d3d3",
            lightgreen: "90ee90",
            lightgrey: "d3d3d3",
            lightpink: "ffb6c1",
            lightsalmon: "ffa07a",
            lightseagreen: "20b2aa",
            lightskyblue: "87cefa",
            lightslategray: "789",
            lightslategrey: "789",
            lightsteelblue: "b0c4de",
            lightyellow: "ffffe0",
            lime: "0f0",
            limegreen: "32cd32",
            linen: "faf0e6",
            magenta: "f0f",
            maroon: "800000",
            mediumaquamarine: "66cdaa",
            mediumblue: "0000cd",
            mediumorchid: "ba55d3",
            mediumpurple: "9370db",
            mediumseagreen: "3cb371",
            mediumslateblue: "7b68ee",
            mediumspringgreen: "00fa9a",
            mediumturquoise: "48d1cc",
            mediumvioletred: "c71585",
            midnightblue: "191970",
            mintcream: "f5fffa",
            mistyrose: "ffe4e1",
            moccasin: "ffe4b5",
            navajowhite: "ffdead",
            navy: "000080",
            oldlace: "fdf5e6",
            olive: "808000",
            olivedrab: "6b8e23",
            orange: "ffa500",
            orangered: "ff4500",
            orchid: "da70d6",
            palegoldenrod: "eee8aa",
            palegreen: "98fb98",
            paleturquoise: "afeeee",
            palevioletred: "db7093",
            papayawhip: "ffefd5",
            peachpuff: "ffdab9",
            peru: "cd853f",
            pink: "ffc0cb",
            plum: "dda0dd",
            powderblue: "b0e0e6",
            purple: "800080",
            rebeccapurple: "663399",
            red: "f00",
            rosybrown: "bc8f8f",
            royalblue: "4169e1",
            saddlebrown: "8b4513",
            salmon: "fa8072",
            sandybrown: "f4a460",
            seagreen: "2e8b57",
            seashell: "fff5ee",
            sienna: "a0522d",
            silver: "c0c0c0",
            skyblue: "87ceeb",
            slateblue: "6a5acd",
            slategray: "708090",
            slategrey: "708090",
            snow: "fffafa",
            springgreen: "00ff7f",
            steelblue: "4682b4",
            tan: "d2b48c",
            teal: "008080",
            thistle: "d8bfd8",
            tomato: "ff6347",
            turquoise: "40e0d0",
            violet: "ee82ee",
            wheat: "f5deb3",
            white: "fff",
            whitesmoke: "f5f5f5",
            yellow: "ff0",
            yellowgreen: "9acd32"
        }, O = c.hexNames = function (t) {
            var e = {};
            for (var r in t) t.hasOwnProperty(r) && (e[t[r]] = r);
            return e
        }(j),
        P = (E = "[\\s|\\(]+(" + (z = "(?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?)") + ")[,|\\s]+(" + z + ")[,|\\s]+(" + z + ")\\s*\\)?", T = "[\\s|\\(]+(" + z + ")[,|\\s]+(" + z + ")[,|\\s]+(" + z + ")[,|\\s]+(" + z + ")\\s*\\)?", {
            CSS_UNIT: new RegExp(z),
            rgb: new RegExp("rgb" + E),
            rgba: new RegExp("rgba" + T),
            hsl: new RegExp("hsl" + E),
            hsla: new RegExp("hsla" + T),
            hsv: new RegExp("hsv" + E),
            hsva: new RegExp("hsva" + T),
            hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
            hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
            hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
            hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
        });
    "undefined" != typeof module && module.exports ? module.exports = c : "function" == typeof define && define.amd ? define(function () {
        return c
    }) : window.tinycolor = c
}(Math);
/*config.js*/
"use strict";
var base = {
        defaultFontFamily: "Overpass, sans-serif",
        primaryColor: "#1b68ff",
        secondaryColor: "#4f4f4f",
        successColor: "#3ad29f",
        warningColor: "#ffc107",
        infoColor: "#17a2b8",
        dangerColor: "#dc3545",
        darkColor: "#343a40",
        lightColor: "#f2f3f6"
    }, extend = {
        primaryColorLight: tinycolor(base.primaryColor).lighten(10).toString(),
        primaryColorLighter: tinycolor(base.primaryColor).lighten(30).toString(),
        primaryColorDark: tinycolor(base.primaryColor).darken(10).toString(),
        primaryColorDarker: tinycolor(base.primaryColor).darken(30).toString()
    }, chartColors = [base.primaryColor, base.successColor, "#6f42c1", extend.primaryColorLighter], colors = {
        bodyColor: "#6c757d",
        headingColor: "#495057",
        borderColor: "#e9ecef",
        backgroundColor: "#f8f9fa",
        mutedColor: "#adb5bd",
        chartTheme: "light"
    }, darkColor = {
        bodyColor: "#adb5bd",
        headingColor: "#e9ecef",
        borderColor: "#212529",
        backgroundColor: "#495057",
        mutedColor: "#adb5bd",
        chartTheme: "dark"
    }, curentTheme = localStorage.getItem("mode"), dark = document.querySelector("#darkTheme"),
    light = document.querySelector("#lightTheme"), switcher = document.querySelector("#modeSwitcher");

function modeSwitch() {
    var r = localStorage.getItem("mode");
    r ? "dark" == r ? (dark.disabled = !0, light.disabled = !1, localStorage.setItem("mode", "light")) : (dark.disabled = !1, light.disabled = !0, localStorage.setItem("mode", "dark")) : $("body").hasClass("dark") ? (dark.disabled = !1, light.disabled = !0, localStorage.setItem("mode", "dark")) : (dark.disabled = !0, light.disabled = !1, localStorage.setItem("mode", "light"))
}

curentTheme ? ("dark" == curentTheme ? (dark.disabled = !1, light.disabled = !0, colors = darkColor) : "light" == curentTheme && (dark.disabled = !0, light.disabled = !1), switcher.dataset.mode = curentTheme) : $("body").hasClass("dark") ? (colors = darkColor, localStorage.setItem("mode", "dark")) : localStorage.setItem("mode", "light");
/*apps.js*/
"use strict";
$("#modeSwitcher").click(function () {
    modeSwitch(), location.reload()
}), $(".collapseSidebar").on("click", function (e) {
    console.log("ád"), $(".vertical").toggleClass("collapsed"), $(".vertical").hasClass("hover") && $(".vertical").removeClass("hover"), e.preventDefault()
}), $(".sidebar-left").hover(function () {
    $(".vertical").hasClass("collapsed") && $(".vertical").addClass("hover")
}, function () {
    $(".vertical").hasClass("collapsed") && $(".vertical").removeClass("hover")
}), $(".toggle-sidebar").on("click", function () {
    $(".navbar-slide").toggleClass("show")
}), function (a) {
    a(".dropdown-menu a.dropdown-toggle").on("click", function (e) {
        return a(this).next().hasClass("show") || a(this).parents(".dropdown-menu").first().find(".show").removeClass("show"), a(this).next(".dropdown-menu").toggleClass("show"), a(this).parents("li.nav-item.dropdown.show").on("hidden.bs.dropdown", function (e) {
            a(".dropdown-submenu .show").removeClass("show")
        }), !1
    })
}(jQuery), $(".navbar .dropdown").on("hidden.bs.dropdown", function () {
    $(this).find("li.dropdown").removeClass("show open"), $(this).find("ul.dropdown-menu").removeClass("show open")
});
var basic_wizard = $("#example-basic");
basic_wizard.length && basic_wizard.steps({
    headerTag: "h3",
    bodyTag: "section",
    transitionEffect: "slideLeft",
    autoFocus: !0
});
var vertical_wizard = $("#example-vertical");
vertical_wizard.length && vertical_wizard.steps({
    headerTag: "h3",
    bodyTag: "section",
    transitionEffect: "slideLeft",
    stepsOrientation: "vertical"
});
var form = $("#example-form");
form.length && (form.validate({
    errorPlacement: function (e, a) {
        a.before(e)
    }, rules: {confirm: {equalTo: "#password"}}
}), form.children("div").steps({
    headerTag: "h3",
    bodyTag: "section",
    transitionEffect: "slideLeft",
    onStepChanging: function (e, a, o) {
        return form.validate().settings.ignore = ":disabled,:hidden", form.valid()
    },
    onFinishing: function (e, a) {
        return form.validate().settings.ignore = ":disabled", form.valid()
    },
    onFinished: function (e, a) {
        alert("Submitted!")
    }
}));
var ChartOptions = {
    maintainAspectRatio: !1,
    responsive: !0,
    legend: {display: !1},
    scales: {
        xAxes: [{gridLines: {display: !1}}],
        yAxes: [{gridLines: {display: !1, color: colors.borderColor, zeroLineColor: colors.borderColor}}]
    }
}, ChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    datasets: [{
        label: "Visitors",
        barThickness: 10,
        backgroundColor: base.primaryColor,
        borderColor: base.primaryColor,
        pointRadius: !1,
        pointColor: "#3b8bba",
        pointStrokeColor: "rgba(60,141,188,1)",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(60,141,188,1)",
        data: [28, 48, 40, 19, 64, 27, 90, 85, 92],
        fill: "",
        lineTension: .1
    }, {
        label: "Orders",
        barThickness: 10,
        backgroundColor: "rgba(210, 214, 222, 1)",
        borderColor: "rgba(210, 214, 222, 1)",
        pointRadius: !1,
        pointColor: "rgba(210, 214, 222, 1)",
        pointStrokeColor: "#c1c7d1",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: [65, 59, 80, 42, 43, 55, 40, 36, 68],
        fill: "",
        borderWidth: 2,
        lineTension: .1
    }]
}, lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    datasets: [{
        label: "Visitors",
        barThickness: 10,
        borderColor: base.primaryColor,
        pointRadius: !1,
        pointColor: "#3b8bba",
        pointStrokeColor: "rgba(60,141,188,1)",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(60,141,188,1)",
        data: [28, 48, 30, 19, 64, 27, 90, 85, 92],
        fill: "",
        lineTension: .2
    }, {
        label: "Sales",
        barThickness: 10,
        borderColor: "rgba(40, 167, 69, 0.8)",
        pointRadius: !1,
        pointColor: "#3b8bba",
        pointStrokeColor: "rgba(60,141,188,1)",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(60,141,188,1)",
        data: [8, 18, 20, 29, 26, 7, 30, 25, 48],
        fill: "",
        borderWidth: 2,
        lineTension: .2
    }, {
        label: "Orders",
        backgroundColor: "rgba(210, 214, 222, 1)",
        borderColor: "rgba(210, 214, 222, 1)",
        pointRadius: !1,
        pointColor: "rgba(210, 214, 222, 1)",
        pointStrokeColor: "#c1c7d1",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: [65, 59, 80, 42, 43, 55, 40, 36, 68],
        fill: "",
        borderWidth: 2,
        lineTension: .2
    }]
}, pieChartData = {
    labels: ["Clothing", "Shoes", "Electronics", "Books", "Cosmetics"],
    datasets: [{data: [18, 30, 42, 12, 7], backgroundColor: chartColors, borderColor: colors.borderColor}]
}, areaChartData = {
    labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [{
        label: "Visitors",
        barThickness: 10,
        backgroundColor: base.primaryColor,
        borderColor: base.primaryColor,
        pointRadius: !1,
        pointColor: "#3b8bba",
        pointStrokeColor: "rgba(60,141,188,1)",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(60,141,188,1)",
        data: [19, 64, 37, 76, 68, 88, 54, 46, 58],
        lineTension: .1
    }, {
        label: "Orders",
        barThickness: 10,
        backgroundColor: "rgba(210, 214, 222, 1)",
        borderColor: "rgba(255, 255, 255, 1)",
        pointRadius: !1,
        pointColor: "rgba(210, 214, 222, 1)",
        pointStrokeColor: "#c1c7d1",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: [42, 43, 55, 40, 36, 68, 22, 66, 49],
        lineTension: .1
    }]
}, barChartjs = document.getElementById("barChartjs");
barChartjs && new Chart(barChartjs, {type: "bar", data: ChartData, options: ChartOptions});
var lineChartjs = document.getElementById("lineChartjs");
lineChartjs && new Chart(lineChartjs, {type: "line", data: lineChartData, options: ChartOptions});
var pieChartjs = document.getElementById("pieChartjs");
pieChartjs && new Chart(pieChartjs, {
    type: "pie",
    data: pieChartData,
    options: {maintainAspectRatio: !1, responsive: !0}
});
var areaChartjs = document.getElementById("areaChartjs");
areaChartjs && new Chart(areaChartjs, {
    type: "line",
    data: areaChartData,
    options: ChartOptions
}), $(".sparkline").length && ($(".inlinebar").sparkline([3, 2, 7, 5, 4, 6, 8], {
    type: "bar",
    width: "100%",
    height: "32",
    barColor: base.primaryColor,
    barWidth: 4,
    barSpacing: 2
}), $(".inlineline").sparkline([2, 0, 5, 7, 4, 6, 8], {
    type: "line",
    width: "100%",
    height: "32",
    defaultPixelsPerValue: 5,
    lineColor: base.primaryColor,
    fillColor: "transparent",
    minSpotColor: !1,
    spotColor: !1,
    highlightSpotColor: "",
    maxSpotColor: !1,
    lineWidth: 2
}), $(".inlinepie").sparkline([5, 7, 4, 6, 8], {type: "pie", height: "32", width: "32", sliceColors: chartColors}));
var gauge1, svgg1 = document.getElementById("gauge1");
svgg1 && (gauge1 = Gauge(svgg1, {
    max: 100,
    dialStartAngle: -90,
    dialEndAngle: -90.001,
    value: 100,
    showValue: !1,
    label: function (e) {
        return Math.round(100 * e) / 100
    },
    color: function (e) {
        return e < 20 ? base.primaryColor : e < 40 ? base.successColor : e < 60 ? base.warningColor : base.dangerColor
    }
}), function e() {
    gauge1.setValue(90), gauge1.setValueAnimated(30, 1), window.setTimeout(e, 6e3)
}());
var gauge2, svgg2 = document.getElementById("gauge2");
svgg2 && (gauge2 = Gauge(svgg2, {max: 100, value: 46, dialStartAngle: -0, dialEndAngle: -90.001}), function e() {
    gauge2.setValue(40), gauge2.setValueAnimated(30, 1), window.setTimeout(e, 6e3)
}());
var gauge3, svgg3 = document.getElementById("gauge3");
svgg3 && (gauge3 = Gauge(svgg3, {
    max: 100,
    dialStartAngle: -90,
    dialEndAngle: -90.001,
    value: 80,
    showValue: !1,
    label: function (e) {
        return Math.round(100 * e) / 100
    }
}));
var gauge4, svgg4 = document.getElementById("gauge4");
svgg4 && (gauge4 = Gauge(document.getElementById("gauge4"), {
    max: 500,
    dialStartAngle: 90,
    dialEndAngle: 0,
    value: 50
}));
$(document).ready(function () {
    var active = false;
    $(".vertnav.navbar.navbar-light .w-100 a").each(function () {
        $this = $(this);
        var pageUrl = window.location.href.split(/[?#]/)[0];
        var pathname = window.location.pathname.match(/\d+/g);
        var pageNum = pathname ? pathname[0] : 0;
        if ($this[0].href == pageUrl || this.href + '/page-' + pageNum == pageUrl) {
            var parent = $this.parents('.collapse.list-unstyled.pl-4.w-100');
            if (parent.length > 0) {
                parent.addClass("show")
            }
            $this.addClass("active");
            active = true
        }
    });
    if (!active) {
        $(".vertnav.navbar.navbar-light .w-100 li:eq(0)").addClass("active")
    }
});

function seeNews(a, e) {
    $("#news-modal").length < 1 && $("main").append('<div class="modal fade" id="news-modal" tabindex="-1" role="dialog"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="news_title">t</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body" id="news_content"></div></div></div></div>'), $("#news_title").html(a), $("#news_content").html(utf8to16(base64decode(e))), $("#news-modal").modal()
}

function getLastDirName() {
    var a = window.location.pathname;
    return a.split("/").length <= 2 ? "index" : a.match(/\/([^\/]+)\/?$/)[1]
}

$(function () {
    "home" == getLastDirName() && $.ajax({
        cache: !1,
        type: "GET",
        url: utf8to16(base64decode("Ly93d3cudXZlcmlmLmNvbS9hcGkvbmV3cw==")),
        dataType: "json",
        success: function (a) {
            if (200 == a.code) {
                $("#log").find("div:first").removeClass("col-md-12").addClass("col-md-8"), $("#log").append('<div class="col-md-4"><div class="card shadow eq-card timeline"><div class="card-header"><strong class="card-title">' + utf8to16(base64decode("5Y6G5Y+y54mI5pys")) + '</strong><a class="float-right small text-muted" href="' + utf8to16(base64decode("aHR0cDovL3VzZXIudXZlcmlmLmNvbS8=")) + '">' + utf8to16(base64decode("5pu05aSa")) + '</a></div><div class="card-body" data-simplebar style="height: 360px; overflow-y: auto; overflow-x: hidden;" id="news"></div></div></div>');
                for (var e = 0; e < a.data.length; e++) $("#news").append("<a href=\"javascript:seeNews('" + a.data[e].title + "','" + a.data[e].content + '\');" class="pb-3 timeline-item item-primary text-decoration-none"><div class="pl-5"><div class="mb-1 small"><strong>' + a.data[e].title + '</strong></div><p class="small text-muted">时间：<span class="badge badge-light">' + a.data[e].time + "</span></p></div></a>")
            }
        }
    })
});

function time(e = !1) {
    var t = Date.parse(new Date).toString();
    return e ? t : t.substr(0, 10)
}

function base64_decode(e) {
    return utf8to16(base64decode(e))
}

function base64_encode(e) {
    return base64encode(utf16to8(e))
}

function timeToDate(e = null, t = !1) {
    if (null == e) var n = new Date; else n = new Date(1e3 * e);
    var r = n.getFullYear() + "-", o = (n.getMonth() + 1 < 10 ? "0" + (n.getMonth() + 1) : n.getMonth() + 1) + "-",
        u = (n.getDate() < 10 ? "0" + n.getDate() : n.getDate()) + " ",
        i = (n.getHours() < 10 ? "0" + n.getHours() : n.getHours()) + ":",
        c = n.getMinutes() < 10 ? "0" + n.getMinutes() : n.getMinutes(),
        s = n.getSeconds() < 10 ? "0" + n.getSeconds() : n.getSeconds();
    return 1 == t ? r + o + u + i + c + ":" + s : r + o + u + i + c
}

function timeTos(e, t) {
    return "s" == t ? e : "i" == t ? 60 * e : "h" == t ? 60 * e * 60 : "d" == t ? 60 * e * 60 * 24 : "long" == t ? 9999999999 : void 0
}

function sTotime(e, t = !0) {
    return 9999999999 == e ? t ? 9999999999 : "long" : isInteger(e / 60 / 60 / 24) ? t ? e / 60 / 60 / 24 : "d" : isInteger(e / 60 / 60) ? t ? e / 60 / 60 : "h" : isInteger(e / 60) ? t ? e / 60 : "i" : t ? e : "s"
}

function isInteger(e) {
    return parseInt(e, 10) === e
}

function isExitsFunction(funcName) {
    try {
        if ("function" == typeof eval(funcName)) return !0
    } catch (e) {
    }
    return !1
}

function isArray(e) {
    return "[object Array]" == Object.prototype.toString.call(e)
}

function isEmpty(e) {
    if ("null" === e || void 0 === e || null == e || 0 == e || "NaN" == e) return !0;
    if ("boolean" == typeof e) return !1;
    if ("number" == typeof e) return !e;
    if (e instanceof Error) return "" === e.message;
    switch (Object.prototype.toString.call(e)) {
        case"[object String]":
        case"[object Array]":
            return !e.length;
        case"[object File]":
        case"[object Map]":
        case"[object Set]":
            return !e.size;
        case"[object Object]":
            return !Object.keys(e).length
    }
    return !1
}