

// 插件封装  ：  1.0.0 

//  移动端适配。引用了别人的一个插件
/**
 * 来自简书
 * 作者：ThingLin
 * 博客：www.thinglin.cn
 */
window.xScroll = {

    "transitionTime": ".5",
    /**
     *
     * @param dom 执行侧滑的dom元素对象，额外添加属性 xScrollCoord = {"moveX": 0, "moveY": 0}; 记录当前滑动到的位置
     *              dom == jQuery对象时转为dom元素对象
     *              通过 dom.xInitParameters对象保存所有初始参数
     *              通过 dom.xScrollCoord 对象保存移动坐标参数
     * @param maxTranslate  滑动上限
     * @param minTranslate  滑动下限
     * @param isVertical  true上下滑动，false || undefined 左右滑动
     *            左右滑动例  ：  xScroll.scroll(dom,0,-300);
     *@param touchendCallBackFun call(this,e,orientation) -->> this触发事件dom元素对象，e触发事件对象，
     *          orientation滑动方向(如垂直（isVertical = true）则可通过该参数得到是下拉刷新还是上拉加载更多)
     *          isVertical ? orientation ？下拉至顶 ：上拉至底 : orientation ? 左滑到底 : 右滑到底
     *          orientation == undefined -->> 未滑至上限或者下限
     */
    scroll: function (dom, maxTranslate, minTranslate, isVertical, touchendCallBackFun) {

        if (!maxTranslate)
            maxTranslate = 0;

        if (!minTranslate)
            throw "minTranslate : " + minTranslate;

        if ("function" == typeof isVertical) {
            touchendCallBackFun = isVertical;
            isVertical = false;
        }

        if (dom.jquery) {
            dom = dom[0];
        }

        dom.xInitParameters = {
            "xstart": 0, "xdifference": 0, "xisMove": false, "xmaxTranslate": maxTranslate, "xminTranslate": minTranslate
            , "xisVertical": isVertical, "xtouchendCallBackFun": touchendCallBackFun
        };
        dom.xScrollCoord = { "moveX": 0, "moveY": 0 };

        dom.addEventListener("touchstart", function (e) {
            if (this.xInitParameters.xisVertical)
                this.xInitParameters.xstart = e.touches[0].clientY;
            else
                this.xInitParameters.xstart = e.touches[0].clientX;
        });

        dom.addEventListener("touchend", function (e) {
            if (!this.xInitParameters.xisMove) {
                return;
            }
            var orientation = undefined;

            if (this.xInitParameters.xisVertical) {
                if ((this.xScrollCoord.moveY + this.xInitParameters.xdifference) > this.xInitParameters.xmaxTranslate) {
                    this.xScrollCoord.moveY = this.xInitParameters.xmaxTranslate;
                    orientation = true;
                } else if ((this.xScrollCoord.moveY + this.xInitParameters.xdifference) < this.xInitParameters.xminTranslate) {
                    this.xScrollCoord.moveY = this.xInitParameters.xminTranslate;
                    orientation = false;
                } else {
                    this.xScrollCoord.moveY += this.xInitParameters.xdifference;
                }
                xScroll.xTrans.translateY(this, this.xScrollCoord.moveY);
            } else {
                if ((this.xScrollCoord.moveX + this.xInitParameters.xdifference) > this.xInitParameters.xmaxTranslate) {
                    this.xScrollCoord.moveX = this.xInitParameters.xmaxTranslate;
                    orientation = false;
                } else if ((this.xScrollCoord.moveX + this.xInitParameters.xdifference) < this.xInitParameters.xminTranslate) {
                    this.xScrollCoord.moveX = this.xInitParameters.xminTranslate;
                    orientation = true;
                } else {
                    this.xScrollCoord.moveX += this.xInitParameters.xdifference;
                }
                xScroll.xTrans.translateX(this, this.xScrollCoord.moveX);
            }
            xScroll.xTrans.addTransition(this, parseFloat(xScroll.transitionTime) + "s");
            this.xInitParameters.xisMove = false;

            if (this.xInitParameters.xtouchendCallBackFun && "function" == typeof this.xInitParameters.xtouchendCallBackFun)
                this.xInitParameters.xtouchendCallBackFun.call(this, e, orientation);
        });

        dom.addEventListener("touchmove", function (e) {
            this.xInitParameters.xisMove = true;
            xScroll.xTrans.removeTransition(this);
            if (this.xInitParameters.xisVertical) {
                var clientY = e.touches[0].clientY;
                this.xInitParameters.xdifference = clientY - this.xInitParameters.xstart;
                xScroll.xTrans.translateY(this, this.xScrollCoord.moveY + this.xInitParameters.xdifference);
            } else {
                var clientX = e.touches[0].clientX;
                this.xInitParameters.xdifference = clientX - this.xInitParameters.xstart;
                xScroll.xTrans.translateX(this, this.xScrollCoord.moveX + this.xInitParameters.xdifference);
            }
            e.stopPropagation();
        });
    },
    xTrans: {
        translateX: function (dom, x) {
            dom.style["transform"] = "translateX(" + x + "px)";
            dom.style["webkitTransform"] = "translateX(" + x + "px)";
        },

        translateY: function (dom, y) {
            dom.style["transform"] = "translateY(" + y + "px)";
            dom.style["webkitTransform"] = "translateY(" + y + "px)";
        },

        removeTransition: function (dom) {
            dom.style.transition = "none";
            dom.style.webkitTransition = "none";
        },

        addTransition: function (dom, timer) {
            dom.style.transition = timer;
            dom.style.webkitTransition = timer;
        },
    },

    /**
     * 快速点击
     * @param dom
     * @param clallBackFun
     */
    onTip: function (dom, clallBackFun) {
        if (dom && typeof dom == "object") {
            dom.xonTipParameters = { "isMove": false, "timer": 0, "clallBackFun": clallBackFun };
            dom.addEventListener("touchstart", function (e) {
                this.xonTipParameters.timer = Date.now();
                this.xonTipParameters.isMove = false;
            });

            dom.addEventListener("touchmove", function (e) {
                this.xonTipParameters.isMove = true;
            });

            dom.addEventListener("touchend", function (e) {
                if (!this.xonTipParameters.isMove && Date.now() - this.xonTipParameters.timer < 80 && this.xonTipParameters.clallBackFun && "function" == typeof this.xonTipParameters.clallBackFun) {
                    this.xonTipParameters.clallBackFun.call(this, e);
                }
            });
        }
    }

}

/**
 * 插件作者：yni63
 * 作者博客：www.yni63.win
 * GitHub：https://github.com/Yin63
 * 
 * 
 * scrollY(parent, child, content, agg, c, ok, viewportll)
 * 不做过多赘述，关于scrollY,scrollX的区别大家一定都懂。
 * parent   ：滚动条外层盒子（滚动条容器）
 * child    ：滚动条内部盒子    （鼠标拖拽滑动的盒子）
 * content  ：要滚动的主要内容
 * agg      ：主内容区域滚动速度（不填默认为“4”）
 * c        ：滚动条滚动速度（不填默认为“1”）
 * ok       ：此插件提供了两种运动模式  OK = true 缓冲动画模式 || false 经典模式 
 * viewportll ：视口宽度/高度 ，也就是content的父级盒子高度，（非必填 不填默认为浏览器宽度/高度）存在一个小bug,见下方附录一
 */

//  附录1 ：
// 存在参数覆盖:若页面中存在多个滚动条，
// 有且仅有一个viewportll不传值的存在
//（viewportll不传值默认为innerheight/innerWidth）
// 且此函数调用应放在所有滚动条函数最底部，避免参数覆盖。


function scrollY(parent, child, content, agg, c, ok, viewportll) {

    if (viewportll) {

        viewport = viewportll;
        var viewportwod = viewportll;

    } else {

        viewport = window.innerHeight;

    }

    window.onresize = function () {     //  滚动条随窗口大小变化而变化

        if (!viewportll) { viewport = window.innerHeight; };

        var opheight = content.offsetHeight;
        var f = viewport / opheight;
        child.style.height = f * parent.offsetHeight + 'px';
    }

    window.onresize();

    child.onmousedown = function (e) {

        var atop = e.clientY - child.offsetTop;

        var z = e.clientX;

        document.onmousemove = function (e) {

            var t = e.clientY - atop;

            var oatop = child.offsetTop;

            child.style.top = t + 'px';

            if (child.offsetTop < 0) {
                child.style.top = 0 + 'px';
            }

            var b = parent.offsetHeight - child.offsetHeight;

            if (child.offsetTop > b) {
                child.style.top = b + 'px';
            }

            var c = child.offsetTop / parent.offsetHeight;
            var d = content.offsetHeight * c;
            content.style.top = - d + 'px';

            if (e.clientX > z + 200 || e.clientX < z - 200) {
                document.onmousemove = null;    //  限定鼠标距离滚动条作用距离
            }
        }
    }

    var timer = null;

    var coke = null;

    agg ? agg : agg = 4;
    c ? c : c = 1;

    //   移动端适配
    (function mobileY() {

        if (viewportll) {
            var viewport = viewportll;
        } else {
            var viewport = window.innerHeight;
        }
        var minTranslate = - content.offsetHeight + viewport;

        window.xScroll.scroll(content, 0, minTranslate, true);
    })();


    if (document.addEventListener) {    // 兼容火狐浏览器

        content.addEventListener('DOMMouseScroll', function (e) {

            var off = e.deltaY > 0 ? true : false;

            chrome(off);

            e.stopPropagation();    // 阻止事件冒泡

        }, false);
    }

    content.onmousewheel = function (e) {

        if (e.deltaY) {     // ie 适配
            var off = e.deltaY > 0 ? true : false;
        } else {
            var off = e.wheelDeltaY > 0 ? false : true;
        }
        chrome(off, e);

        e.stopPropagation();    // 阻止事件冒泡
    }


    function chrome(off) {

        timer && clearInterval(timer);      // 函数节流

        var heig;

        if (viewportll) {       // 移动步长适配
            heig = viewportwod / 2;
        } else {
            heig = viewport / 2;
        }

        var bili = heig / content.offsetHeight;

        var opheig = Math.floor(parent.offsetHeight * bili);
        var owid = parent.offsetHeight - child.offsetHeight;
        var pwid = content.offsetHeight - viewport;

        if (viewportll) {   //  主内容区域最大top值，适配onsize
            pwid = content.offsetHeight - viewportwod;
        }

        var sum = 0;

        var acent;

        var ocent;

        if (off) {

            var op = content.offsetTop - heig;
            var oal = child.offsetTop + opheig;

        } else {

            var op = content.offsetTop + heig;
            var oal = child.offsetTop - opheig;

        }

        if (ok) {       //  控制模式  动画/极简
            timer = setInterval(play, 20);
        } else {

            if (off) {

                acent = content.offsetTop - agg;
                ocent = child.offsetTop + c;

                if (acent < - pwid) {
                    acent = - pwid;
                };

                if (ocent > owid) {
                    ocent = owid;
                };

                content.style.top = acent + 'px';
                child.style.top = ocent + 'px';



            } else {

                acent = content.offsetTop + agg;
                ocent = child.offsetTop - c;

                if (acent > 0) {
                    acent = 0;
                };

                if (ocent < 0) {
                    ocent = 0;
                };

                content.style.top = acent + 'px';
                child.style.top = ocent + 'px';

            }
        }


        function play() {

            sum++;

            if (off) {

                var optop = content.offsetTop < op ? op : content.offsetTop;

                var oatop = child.offsetTop > oal ? oal : child.offsetTop;

            } else {
                var optop = content.offsetTop > op ? op : content.offsetTop;

                var oatop = child.offsetTop < oal ? oal : child.offsetTop;
            }

            if (optop == op && oatop == oal) {

                clearInterval(timer);
            }

            if (optop < - pwid && off) {

                optop = - pwid;

            } else if (optop > 0 && !off) {

                optop = 0;

            }

            if (oatop > owid && off) {

                oatop = owid;

            } else if (oatop < 0 && !off) {

                oatop = 0;
            }

            if (optop <= - pwid && off && oatop >= owid) {

                clearInterval(timer); return;

            } else if (optop >= 0 && !off && oatop <= 0) {

                clearInterval(timer); return;

            }

            if (off) {

                content.style.top = optop - agg + 'px';
                child.style.top = oatop + c + 'px';
            } else {

                content.style.top = optop + agg + 'px';
                child.style.top = oatop - c + 'px';
            }
        }
    }

    document.onmouseup = function () {
        document.onmousemove = null;
    }
}

function scrollX(parent, child, content, agg, c, ok, viewportll) {

    if (viewportll) {

        viewport = viewportll;
        var viewportwod = viewportll;

    } else {

        viewport = window.innerWidth;

    }

    window.onresize = function () {

        if (!viewportll) { viewport = window.innerWidth; };

        var opWidth = content.offsetWidth;
        var f = viewport / opWidth;
        child.style.Width = f * parent.offsetWidth + 'px';
    }

    window.onresize();

    child.onmousedown = function (e) {

        var aleft = e.clientX - child.offsetLeft;

        var z = e.clientY;

        document.onmousemove = function (e) {

            var t = e.clientX - aleft;

            var oaleft = child.offsetLeft;

            child.style.left = t + 'px';

            if (child.offsetLeft < 0) {
                child.style.left = 0 + 'px';
            }

            var b = parent.offsetWidth - child.offsetWidth;

            if (child.offsetLeft > b) {
                child.style.left = b + 'px';
            }

            var c = child.offsetLeft / b;
            var d = content.offsetWidth * c;

            if (viewportll) {
                content.style.left = (- d + viewportwod) + 'px';
            } else {
                content.style.left = (- d + viewport) + 'px';
            }


            if (e.clientY > z + 200 || e.clientY < z - 200) {
                document.onmousemove = null;    //  限定鼠标距离滚动条作用距离
            }
        }
    }

    var timer = null;

    var coke = null;

    agg ? agg : agg = 4;
    c ? c : c = 1;

    //  移动端适配
    function mobileX() {

        if (viewportll) {
            var viewport = viewportll;
        } else {
            var viewport = window.innerWidth;
        }
        var minTranslate = - content.offsetWidth + viewport;

        window.xScroll.scroll(content,0,minTranslate,false);

    }

    mobileX();


    if (document.addEventListener) {    // 兼容火狐浏览器

        content.addEventListener('DOMMouseScroll', function (e) {

            var off = e.deltaY > 0 ? true : false;

            chrome(off);

            e.stopPropagation();    // 阻止事件冒泡

        }, false);

    }

    content.onmousewheel = function (e) {

        if (e.deltaY) {     // ie 适配
            var off = e.deltaY > 0 ? true : false;
        } else {
            var off = e.wheelDeltaY > 0 ? false : true;
        }

        chrome(off);

        e.stopPropagation();    // 阻止事件冒泡
    }

    function chrome(off) {

        timer && clearInterval(timer);      // 函数节流

        var heig;

        if (viewportll) {       // 移动步长适配
            heig = viewportwod / 2;
        } else {
            heig = viewport / 2;
        }

        var bili = heig / content.offsetWidth;

        var opheig = Math.floor(parent.offsetWidth * bili);

        var owid = parent.offsetWidth - child.offsetWidth;
        var pwid = content.offsetWidth - viewport;

        if (viewportll) {   //  主内容区域最大top值，适配onsize
            pwid = content.offsetWidth - viewportwod;
        }

        var sum = 0;

        var acent;

        var ocent;

        if (off) {

            var op = content.offsetLeft - heig;
            var oal = child.offsetLeft + opheig;

        } else {

            var op = content.offsetLeft + heig;
            var oal = child.offsetLeft - opheig;

        }

        if (ok) {       //  控制模式  动画/极简
            timer = setInterval(play, 20);
        } else {

            if (off) {

                acent = content.offsetLeft - agg;
                ocent = child.offsetLeft + c;

                if (acent < - pwid) {
                    acent = - pwid;
                };

                if (ocent > owid) {
                    ocent = owid;
                };

                content.style.left = acent + 'px';
                child.style.left = ocent + 'px';



            } else {

                acent = content.offsetLeft + agg;
                ocent = child.offsetLeft - c;

                if (acent > 0) {
                    acent = 0;
                };

                if (ocent < 0) {
                    ocent = 0;
                };

                content.style.left = acent + 'px';
                child.style.left = ocent + 'px';

            }
        }


        function play() {

            sum++;

            if (off) {

                var opleft = content.offsetLeft < op ? op : content.offsetLeft;

                var oaleft = child.offsetLeft > oal ? oal : child.offsetLeft;

            } else {
                var opleft = content.offsetLeft > op ? op : content.offsetLeft;

                var oaleft = child.offsetLeft < oal ? oal : child.offsetLeft;
            }

            if (opleft == op && oaleft == oal) {

                clearInterval(timer);
            }

            if (opleft < - pwid && off) {

                opleft = - pwid;

            } else if (opleft > 0 && !off) {

                opleft = 0;

            }

            if (oaleft > owid && off) {

                oaleft = owid;

            } else if (oaleft < 0 && !off) {

                oaleft = 0;
            }

            if (opleft <= - pwid && off && oaleft >= owid) {

                clearInterval(timer); return;

            } else if (opleft >= 0 && !off && oaleft <= 0) {

                clearInterval(timer); return;

            }

            if (off) {

                content.style.left = opleft - agg + 'px';
                child.style.left = oaleft + c + 'px';
            } else {

                content.style.left = opleft + agg + 'px';
                child.style.left = oaleft - c + 'px';
            }
        }
    }

    document.onmouseup = function () {
        document.onmousemove = null;
    }
}