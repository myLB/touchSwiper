class swiper {
    constructor(options) {
        this.style = document.documentElement.style;
        this.document = document;
        this.events = {};//存储自定义事件
        this.inform = {};//存储node信息
        this.func = {};//存储监听事件
        this.client = {
            PX: 0,
            PY: 0,
            MX: 0,
            MY: 0,
            startDate: 0,
            endDate: 0,
            left: 0,
            mv: 0
        };//储存鼠标的信息
        if (Object.prototype.toString.call(options) === "[object Object]") {
            this.optionsDefault = {//默认值
                el: '.lb-swiper',//特定节点
                speed: 2000,//多少毫秒完成动画
                spaceTime: 1000,//动画间隔时间
                welt: 100,//小于多少贴边，大于则开启动画到下一个li
                pagination: true,//是否需要分页器
                pageClick: false,//分页器是否可以点击
                pre: false,//向左移动
                next: false//向右移动
            }
            this.options = Object.assign(this.optionsDefault, options);//合并参数
            this.node();//获取各个节点的信息
            this.tran();//确定兼容性
            this.init(this.inform.bodDivWidth);//初始化样式
            this.carousel();//用来存储监听事件的方法
            this.transform();//监听动画并且开始动画
            if (this.isPC() === 'pc') {
                this.emit('mousedown', this.inform.bodDiv, this.func['mousedown']);//给ul增加鼠标事件监听
            } else {
                this.emit('touchstart', this.inform.bodDiv, this.func['touchstart']);
            }
        }
    }
    examine() {
        var arr = ['webkit', 'O', 'ms', 'Moz'];
        for (let i in arr) {
            if (i + 'Transform' in this.style) {
                return i
            }
        }
        if ('transform' in this.style) {
            return 'transform'
        }
    }//1、检查是否支持动画或过渡
    tran() {
        if (this.examine() === 'transform') {
            this.inform.Transform = 'transform';
            this.inform.Transformend = 'transitionend';
            this.inform.Duration = 'transitionDuration';
        } else {
            this.inform.Transform = this.examine() + 'Transform';
            this.inform.Transformend = this.examine() + 'TransitionEnd';
            this.inform.Duration = this.examine() + 'TransitionDuration';
        }
    }//确定兼容性
    on(eventName, element) {
        if (document.createEventObject) {
            // IE浏览器
            this.events[eventName] = document.createEventObject();
            this.events[eventName].initEvent(eventName, true, true);//创建事件实例
            element.fireEvent('on' + eventName, this.events[eventName]);//直接触发事件，这样在哪里监听那么哪里就出发
        } else {
            // 其他标准浏览器
            this.events[eventName] = document.createEvent('CustomEvent');
            this.events[eventName].initCustomEvent(this.events[eventName], true, true, 'kk');
            element.dispatchEvent(this.events[eventName]);
        }
    }//创建并触发自定义事件
    emit(eventName, element, fn) {
        if (element.addEventListener) {
            element.addEventListener(eventName, fn, false);//这里的fn的this指向会变成element
        } else if (element.attachEvent) {
            element.attachEvent("on" + eventName, fn, false);
        } else {
            element['on' + eventName] = fn;
        }
    }//添加监听事件
    off(eventName, element, fn) {
        if (element.removeEventListener) {
            element.removeEventListener(eventName, fn, false);
        } else if (element.detachEvent) {
            element.detachEvent("on" + eventName, fn, false);
        } else {
            element['on' + eventName] = null;
        }
    }//移除监听事件
    node() {
        var s = this;
        var bodDiv = document.querySelectorAll(s.options.el)[0];//获取轮播根节点
        s.inform.bodDiv = bodDiv;//保存根节点
        s.inform.bodDiv.style.cssText = 'overflow:hidden;z-index:1;position:relative;';//设置根节点样式
        s.inform.bodDivWidth = bodDiv.offsetWidth;//获取最外面框的宽度
        var ul = bodDiv.querySelectorAll('.lb-ul')[0];//根节点下面的ul
        s.inform.ul = ul;
        var last = ul.lastElementChild.cloneNode(true);//克隆最后一个元素
        var first = ul.firstElementChild.cloneNode(true);//克隆第一个li元素
        ul.insertBefore(last, ul.firstChild);//添加进ul元素的第一个
        ul.appendChild(first);//添加ul的最后
        s.inform.uiChildrenLength = ul.children.length;//li的个数
        s.inform.uiIndex = 1;//通过数量的增加来改变位移
        if (s.options.pagination) {
            var pagina = document.createElement('ul');
            for (let i = 1; i < ul.children.length - 1; i++) {
                let paginaLi = document.createElement('li');
                if(s.options.pageClick) {
                    paginaLi.onclick = function () {
                        clearTimeout(s.inform.setId);
                        /*s.off(s.inform.Transformend, s.inform.ul, s.func['transed']);//结束动画结束监听事件*/
                        s.inform.uiIndex = i;
                        let width = -s.inform.bodDivWidth * s.inform.uiIndex;
                        s.setStyle(s.inform.ul, width, s.options.speed);//开始动画
                        s.inform.pagina.children[i - 1].style.backgroundColor = 'blue';
                        Array.from(s.inform.pagina.children).map((obj, index) => {
                            if (index == i - 1) return;
                            obj.style.backgroundColor = '#ccc';
                        })
                        /*s.emit(s.inform.Transformend, s.inform.ul, s.func['transed'])//监听过渡结束事件*/
                    }
                }
                paginaLi.style.cssText = `width:10px;height:10px;background-color:#ccc;border-radius:10px;margin:0 3px;`;
                pagina.appendChild(paginaLi);
            }
            pagina.style.cssText = `position:absolute;left:0;right:0;margin:0 auto;bottom:10%;z-index:2;width:${16 * ul.children.length - 2 + 20}px;height:12px;text-align:center;`;
            pagina.children[0].style.backgroundColor = 'blue';
            bodDiv.appendChild(pagina);
            s.inform.pagina = pagina;
            s.inform.children = pagina.children;
        }
        if (s.options.pre && s.options.next) {
            //创建左点击和右点击的节点
        }
    }//获取节点的信息和创建节点
    init(width) {
        var inform = this.inform;
        var style = this.examine();
        if (style) {//属性存在
            if (style === 'transform') {
                inform.ul.style.cssText = `width:${inform.bodDivWidth * inform.uiChildrenLength}px;transform:translate3d(${-width}px,0,0);transition-duration:0ms`
            } else {
                inform.ul.style.cssText = `width:${inform.bodDivWidth * inform.uiChildrenLength}px;-${style.toLowerCase()}-transform:translate3d(${-width}px,0,0);-${style.toLowerCase()}-transition-duration:0ms`
            }
        } else {
            throw '对不起暂时不支持该版本浏览器'
        }
    }//初始化ul样式
    getStyle(obj, name) {
        if (obj.currentStyle) {
            return obj.currentStyle[name];//ie,opera
        } else {
            return getComputedStyle(obj, false)[name];//ff,chrome,safair
        }
    }//获取样式
    setStyle(obj, width, time, cb) {
        obj.style[this.inform.Transform] = `translate3d(${width}px,0,0)`;
        obj.style[this.inform.Duration] = `${time}ms`;
        if (cb) cb();
    }//2、设置动画样式
    carousel() {
        var s = this;
        s.func['transed'] = function () {
            //为了解决监听事件的this指向问题，直接把方法保存在实例的某个对象中，
            // 并且把方法里面的this替换成实例的代替品s，这样方法里面的s就指向了实例,从而解决this的指向问题
            if (s.inform.uiIndex > s.inform.uiChildrenLength - 2) {//当时最后第二节点时，
                s.inform.uiIndex = 1;
                s.inform.pagina.children[0].style.backgroundColor = 'blue';
                /*s.inform.pagina.children[s.inform.uiChildrenLength - 3].style.backgroundColor = '#ccc';*/
                Array.from(s.inform.pagina.children).map((obj, index) => {
                    if (index === 0) return;
                    obj.style.backgroundColor = '#ccc';
                })
                s.init(s.inform.bodDivWidth);//超出则初始化动画
            } else if (s.inform.uiIndex > 1 && s.inform.uiIndex <= s.inform.uiChildrenLength - 2) {
                s.inform.pagina.children[s.inform.uiIndex - 1].style.backgroundColor = 'blue';
                Array.from(s.inform.pagina.children).map((obj, index) => {
                    if (index == s.inform.uiIndex - 1) return;
                    obj.style.backgroundColor = '#ccc';
                })
            }
            s.inform.setId = setTimeout(function () {
                ++s.inform.uiIndex;//向左位移setStyle
                let width = -s.inform.bodDivWidth * s.inform.uiIndex;
                s.setStyle(s.inform.ul, width, s.options.speed);//开始动画
            }, s.options.spaceTime)
            //形成一个闭环 uiChildrenLength-1 0 1 2 .... 0
        }//循环过渡来做到轮播
        s.func['mousedown'] = function (event) {//再点下鼠标的时候判断是否在第一和最后第一个li上
            s.client.MX = event.pageX;
            s.client.MY = event.pageY;
            s.client.startDate = Date.now();
            event.preventDefault();
            event.stopPropagation();
            /*s.off('mousemove',s.inform.ul,s.func['mousemove']);
             s.off('mouseup',s.inform.ul,s.func['mouseup']);//执行完成移除监听事件*/
            var str = s.getStyle(s.inform.ul, s.inform.Transform);//获取li的translate属性的值
            var ml = str.slice(7, str.length - 1).split(',')[4] - 0;//鼠标点下是ul当时的位移
            s.client.mv = ml - 0;
            if (s.inform.ul.setCapture) {//添加鼠标捕获
                s.emit('mousemove', s.document, s.func['mousemove']);
                s.emit('mouseup', s.document, s.func['mouseup']);
                s.inform.ul.setCapture();//兼容IE
            } else {
                s.emit('mousemove', s.document, s.func['mousemove']);
                s.emit('mouseup', s.document, s.func['mouseup']);
            }
            /*return false;*/
        }//鼠标点下事件
        s.func['mousemove'] = function (event) {
            clearTimeout(s.inform.setId);
            event.preventDefault();
            event.stopPropagation();
            var x = event.pageX - s.client.MX;
            if(Math.abs(x) > 5) {
                s.off(s.inform.Transformend, s.inform.ul, s.func['transed']);//结束动画结束监听事件
                touMove(x);
            }
        }//鼠标移动事件
        //1.首先获取他当时的位移
        //2.鼠标点下，快速向做左或右移动，并且到鼠标抬起的时候，用的时间不超过300ms的时候原轮播动画停止做新的动画
        //3.鼠标点下，不管你先向那，只要向左或右移动了，那么tranlate则随之改变
        s.func['mouseup'] = function (event) {
            s.client.endDate = Date.now();//鼠标放掉时的时间
            s.off('mousemove', s.document, s.func['mousemove']);
            s.off('mouseup', s.document, s.func['mouseup']);//执行完成移除监听事件
            if (s.inform.ul.releaseCapture) s.inform.ul.releaseCapture();//移除鼠标捕获
            event.preventDefault();
            event.stopPropagation();
            var x = event.pageX - s.client.MX;//从鼠标点下到拿起的位移
            touUp(x);
        }
        s.func['touchstart'] = function (event) {
            s.emit('touchmove', s.inform.bodDiv, s.func['touchmove']);
            s.emit('touchend', s.inform.bodDiv, s.func['touchend']);
            var touches = event.targetTouches[0];
            if (touches.identifier == 0) {
                s.client.MX = touches.pageX;
                s.client.MY = touches.pageY;
                s.client.startDate = Date.now();
                var str = s.getStyle(s.inform.ul, s.inform.Transform);//获取li的translate属性的值
                var ml = str.slice(7, str.length - 1).split(',')[4] - 0;//鼠标点下是ul当时的位移
                s.client.mv = ml - 0;
            }
        }//手指点下时
        s.func['touchmove'] = function (event) {
            clearTimeout(s.inform.setId);
            var touches = event.targetTouches[0];
            if (touches.identifier == 0) {
                event.preventDefault();
                event.stopPropagation();
                var x = touches.pageX - s.client.MX;
                if(Math.abs(x) > 5) {
                    s.off(s.inform.Transformend, s.inform.ul, s.func['transed']);//结束动画结束监听事件
                    touMove(x);
                }
            }
        }
        s.func['touchend'] = function (event) {
            var touches = event.changedTouches[0];
            s.off('touchmove', s.inform.bodDiv, s.func['touchmove']);
            s.off('touchend', s.inform.bodDiv, s.func['touchend']);
            if (touches.identifier == 0) {
                event.preventDefault();
                event.stopPropagation();
                s.client.endDate = Date.now();//鼠标放掉时的时间
                var x = touches.pageX - s.client.MX;//从鼠标点下到拿起的位移
                touUp(x);
            }
            //执行完成移除监听事件
        }
        function touUp(x) {
            if (Math.abs(x) > 5) {//只有位移了才会计算下面的
                var date = s.client.endDate - s.client.startDate;//相差时间
                var w = s.inform.bodDivWidth;//一个li的宽度
                var str = s.getStyle(s.inform.ul, s.inform.Transform);
                var MX = str.slice(7, str.length - 1).split(',')[4];//获取当时的位移X
                s.client.left = MX;//为了方便
                if (date <= 300) {//位移了并且时间小于300ms
                    console.log('时间小于300')
                    // s.off(s.inform.Transformend,s.inform.ul,s.func['transed']);
                    if (x > 0) {
                        var number = Math.floor(Math.abs(MX / w));//查看到是位移到了那一个li上,并且向下舍入
                        console.log(number)
                        s.inform.uiIndex = Math.floor(Math.abs(MX / w));
                        if (s.inform.uiIndex == 0 || s.inform.uiIndex == s.inform.uiChildrenLength - 2) {
                            s.inform.children[s.inform.children.length - 1].style.backgroundColor = 'blue';
                            Array.from(s.inform.children).map((obj, index) => {
                                if (index == s.inform.children.length - 1) return;
                                obj.style.backgroundColor = '#ccc';
                            })
                        } else if (s.inform.uiIndex <= s.inform.uiChildrenLength - 3) {
                            s.inform.children[s.inform.uiIndex - 1].style.backgroundColor = 'blue';
                            Array.from(s.inform.children).map((obj, index) => {
                                if (index == s.inform.uiIndex - 1) return;
                                obj.style.backgroundColor = '#ccc';
                            })
                        }
                    } else {
                        var number = Math.ceil(Math.abs(MX / w));//向上舍入，这样就必定会左位移一个li的距离
                        s.inform.uiIndex = Math.ceil(Math.abs(MX / w));
                        if (s.inform.uiIndex == s.inform.uiChildrenLength - 1 || s.inform.uiIndex == 1) {
                            s.inform.children[0].style.backgroundColor = 'blue';
                            Array.from(s.inform.children).map((obj, index) => {
                                if (index == 0) return;
                                obj.style.backgroundColor = '#ccc';
                            })
                        } else if (s.inform.uiIndex >= s.inform.uiChildrenLength - 3) {
                            s.inform.children[s.inform.uiIndex - 1].style['background-color'] = 'blue';
                            Array.from(s.inform.children).map((obj, index) => {
                                if (index == s.inform.uiIndex - 1) return;
                                obj.style.backgroundColor = '#ccc';
                            })
                        }
                    }
                    console.log(number + '时间小于300')
                    s.setStyle(s.inform.ul, -number * w, s.options.spaceTime);
                } else {
                    console.log('时间大于300')
                    var number = Math.abs(MX / w).toFixed(3);//当前处于第几个li
                    console.log(number)
                    if (x > 0) {//向右滑动
                        if (MX > 0) {//说明一下子拖过最前面的哪个li了，那么过渡到0,0
                            s.inform.uiIndex = 0;
                            s.inform.children[s.inform.children.length - 1].style.backgroundColor = 'blue';
                            Array.from(s.inform.children).map((obj, index) => {
                                if (index == s.inform.children.length - 1) return;
                                obj.style.backgroundColor = '#ccc';
                            })
                            s.setStyle(s.inform.ul, 0, s.options.spaceTime);
                        } else {
                            if ((Math.ceil(number) - number) <= s.options.welt / w) {//小于贴壁值，那么返回最近的li
                                var num = -Math.ceil(number) * w;
                                s.inform.uiIndex = Math.ceil(number);
                            } else {
                                var num = -Math.floor(number) * w;//大于贴壁值
                                s.inform.uiIndex = Math.floor(number);//只有确定要移动一格时才变化，否则不变
                                if (s.inform.uiIndex == 0 || s.inform.uiIndex == s.inform.uiChildrenLength - 2) {
                                    s.inform.children[s.inform.children.length - 1].style.backgroundColor = 'blue';
                                    Array.from(s.inform.children).map((obj, index) => {
                                        if (index == s.inform.children.length - 1) return;
                                        obj.style.backgroundColor = '#ccc';
                                    })
                                } else {
                                    s.inform.children[s.inform.uiIndex - 1].style.backgroundColor = 'blue';
                                    Array.from(s.inform.children).map((obj, index) => {
                                        if (index == s.inform.uiIndex - 1) return;
                                        obj.style.backgroundColor = '#ccc';
                                    })
                                }
                            }
                            s.setStyle(s.inform.ul, num, s.options.spaceTime);//执行过渡
                        }
                    } else {//向左滑动
                        if (MX < -w * (s.inform.uiChildrenLength - 1)) {//一次性超出了整个ul宽度的位移
                            var num = -w * (s.inform.uiChildrenLength - 1);
                            s.inform.uiIndex = s.inform.uiChildrenLength - 1;
                            s.inform.children[0].style.backgroundColor = 'blue';
                            Array.from(s.inform.children).map((obj, index) => {
                                if (index == 0) return;
                                obj.style.backgroundColor = '#ccc';
                            })
                            s.setStyle(s.inform.ul, num, s.options.spaceTime);
                        } else {
                            if (number - Math.floor(number) <= s.options.welt / w) {//当前位移值对于li的倍数-向下舍入的倍数
                                var num = -Math.floor(number) * w;
                                s.inform.uiIndex = Math.floor(number);
                            } else {
                                var num = -Math.ceil(number) * w;
                                s.inform.uiIndex = Math.ceil(number);//只有确定要移动一格时才变化，否则不变
                                if (s.inform.uiIndex == s.inform.uiChildrenLength - 1 || s.inform.uiIndex == 1) {
                                    //当s.inform.uiIndex为0时向右移动时的情况和当s.inform.uiIndex为最后个li时向左移动时的情况
                                    s.inform.children[0].style.backgroundColor = 'blue';
                                    Array.from(s.inform.children).map((obj, index) => {
                                        if (index == 0) return;
                                        obj.style.backgroundColor = '#ccc';
                                    })
                                } else {
                                    s.inform.children[s.inform.uiIndex - 1].style['background-color'] = 'blue';
                                    Array.from(s.inform.children).map((obj, index) => {
                                        if (index == s.inform.uiIndex - 1) return;
                                        obj.style.backgroundColor = '#ccc';
                                    })
                                }
                            }
                            s.setStyle(s.inform.ul, num, s.options.spaceTime);//执行过渡
                        }
                    }
                }
                s.emit(s.inform.Transformend, s.inform.ul, s.func['transed'])//监听过渡结束事件
            }
        }
        function touMove(x) {
            var str = s.getStyle(s.inform.ul, s.inform.Transform);//获取li的translate属性的值
            s.client.left = str.slice(7, str.length - 1).split(',')[4] - 0;//鼠标点下是ul当时的位移
            var left = s.client.left - 0;
            var width = s.inform.bodDivWidth;
            var length = s.inform.uiChildrenLength;
            //思路
            //1.判断是否是点在临界点那个li上
            //2.判断是往哪个方向拉
            //3.在最左边的，如果是往左拉并且拉过临界点就直接更新；向右拉则不变
            //4.在最右边的，如果是往右拉并且拉过临界点就直接更新；向左拉则不变
            if (s.client.mv > -width) {
                if (left > 0) {
                    s.setStyle(s.inform.ul, -width * (length - 2) + left, 0);
                    s.client.mv = -width * (length - 2) + left;
                } else {
                    s.setStyle(s.inform.ul, s.client.mv + x, 0);
                }
            } else if (s.client.mv < -width * (length - 2)) {
                if (left < -width * (length - 1)) {
                    s.setStyle(s.inform.ul, -width - (width + (width * length + left)), 0);
                    s.client.mv = -width - (width - (width * length + left));
                } else {
                    s.setStyle(s.inform.ul, s.client.mv + x, 0);
                }
            } else {
                s.setStyle(s.inform.ul, s.client.mv + x, 0);//不管向左向右都是加的
            }
        }
    }//过渡动画以及手势或者鼠标监听事件初始化
    transform() {
        var s = this;
        s.emit(s.inform.Transformend, s.inform.ul, s.func['transed'])//监听过渡结束事件
        s.func['transed']();//开始动画
    }//初始化无限循环的动画
    isPC() {
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
            return "phone"
        } else {
            return "pc"
        }
    }//移动端还是pc端
    left(event) {
        var s = this;
        clearTimeout(s.inform.setId);
        /*s.off(s.inform.Transformend, s.inform.ul, s.func['transed']);//结束动画结束监听事件*/
        event.preventDefault();
        event.stopPropagation();
        ++s.inform.uiIndex;
        if (s.inform.uiIndex > s.inform.uiChildrenLength - 1) {//过了临界点立马回到第二个li
            s.inform.uiIndex = 2;
            s.setStyle(s.inform.ul, -s.inform.bodDivWidth, 0);
        }
        var width = -s.inform.bodDivWidth * s.inform.uiIndex;
        s.setStyle(s.inform.ul, width, s.options.speed, function () {
            if (s.inform.uiIndex == s.inform.uiChildrenLength - 2) {
                s.inform.children[0].style.backgroundColor = 'blue';
                Array.from(s.inform.children).map((obj, index) => {
                    if (index == 0) return;
                    obj.style.backgroundColor = '#ccc';
                })
            } else {
                s.inform.children[s.inform.uiIndex - 1].style.backgroundColor = 'blue';
                Array.from(s.inform.children).map((obj, index) => {
                    if (index == s.inform.uiIndex - 1) return;
                    obj.style.backgroundColor = '#ccc';
                })
            }
        });
    }//左点击
    right(event) {
        var s = this;
        clearTimeout(s.inform.setId);
        event.preventDefault();
        event.stopPropagation();
        --s.inform.uiIndex;
        if (s.inform.uiIndex < 0) {//过了临界点立马回到第二个li
            s.inform.uiIndex = s.inform.uiChildrenLength - 3;
            s.setStyle(s.inform.ul, -s.inform.bodDivWidth * s.inform.uiChildrenLength - 2, 0);
        }
        var width = -s.inform.bodDivWidth * s.inform.uiIndex;
        s.setStyle(s.inform.ul, width, s.options.speed, function () {
            if (s.inform.uiIndex == 0) {
                s.inform.children[s.inform.children.length - 1].style.backgroundColor = 'blue';
                Array.from(s.inform.children).map((obj, index) => {
                    if (index == s.inform.children.length - 1) return;
                    obj.style.backgroundColor = '#ccc';
                })
            } else {
                s.inform.children[s.inform.uiIndex - 1].style.backgroundColor = 'blue';
                Array.from(s.inform.children).map((obj, index) => {
                    if (index == s.inform.uiIndex - 1) return;
                    obj.style.backgroundColor = '#ccc';
                })
            }
        });
    }//右点击
}
