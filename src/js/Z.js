(function() {
    'use strict';


    // 就绪事件
    const ready = callback => {
        // DOMContentLoaded  HTML5  当DOM结构加载完毕后执行
        // 特点 比window.onload快
        document.addEventListener('DOMContentLoaded', function fn() {
            document.removeEventListener('DOMContentLoaded', fn); // 触发后就移除事件
            callback();
        });
    }


    const init = (selector, context) => {
        if (typeof selector === 'function') { // init接收到一个函数作为参数时 调用ready函数 添加就绪事件
            ready(selector);
            return;
        }
        return new Z(selector, context);
    }

    class Z extends Array {
        constructor(selector, context) {

            // 将数组或类数组对象转成Z对象
            if (Array.isArray(selector) || selector.__proto__.constructor.name === 'NodeList') {
                super(...selector);
                return;
            }

            if (selector.nodeType === 1) { // 判断传 入的是否是DOM对象
                super(selector); // 如果是DOM对象  将DOM对象放入数组
            } else {
                // context 上下文对象 它可以是一个DOM对象 它规定了我们选择元素的范围
                let elms = context ? context.querySelectorAll(selector) : document.querySelectorAll(selector);
                super(...elms);
            }
        }


        on(type, callback) {
            if (typeof type === 'string' && typeof callback === 'function') {
                this.forEach(elm => { // 遍历数组
                    elm.addEventListener(type, callback); // 为每一个被选元素 添加事件
                });
            } else if (type.constructor.name === 'Object') {
                for (let key in type) { // 遍历对象 获得key和value (key是事件类型,value是事件函数)
                    this.forEach(elm => { // 遍历每一个被选择的元素
                        elm.addEventListener(key, type[key]); // 为元素添加事件
                    });
                }
            }
        }

        css(style, value) {
            if (typeof style === 'string' && typeof value === 'string') {
                this.forEach(elm => {
                    elm.style[style] = value;
                });
            } else if (style.constructor.name === 'Object') {
                for (let key in style) {
                    this.forEach(elm => {
                        elm.style[key] = style[key];
                    })
                }
            }

            return this; // 返回的是Z创建的对象 支持链式调用
        }


        addClass(className) { // 为所有被选元素添加类名
            if (typeof className === 'string' && className) {
                this.forEach(elm => {
                    elm.classList.add(className);
                });
            }
            return this;
        }

        removeClass(className) {
            if (typeof className === 'string' && className) {
                this.forEach(elm => {
                    elm.classList.remove(className);
                });
            }
            return this;
        }

        toggleClass(className) {
            if (typeof className === 'string' && className) {
                this.forEach(elm => {
                    elm.classList.toggle(className);
                });
            }
            return this;
        }

        replaceClass(oldClass, newClass) {
            if (typeof oldClass === 'string' && typeof newClass === 'string' && oldClass && newClass) {
                this.forEach(elm => {
                    elm.classList.replace(oldClass, newClass);
                });
            }
            return this;
        }

        attr(attrName, value) {
            if (typeof attrName === 'string') {
                switch (typeof value) {
                    case 'undefined':
                        // 当value是undefined时说明没有传入第二个参数
                        return this[0].getAttribute(attrName);
                        break;
                    case 'string':
                        // value是字符串说明需要给所有被选元素添加或设置属性值
                        this.forEach(elm => {
                            elm.setAttribute(attrName, value);
                        });
                        break;
                    case 'function':
                        // 当value是函数时  
                        // 为每一个被选元素执行一个回调函数
                        this.forEach((elm, i) => {
                            let attr = value(elm.getAttribute(attrName), i);
                            elm.setAttribute(attrName, attr);
                        });
                        break;
                }
            }
        }

        removeAttr(attrName) { // 为所有被选元素删除指定属性
            if (typeof attrName === 'string' && attrName) {
                this.forEach(elm => {
                    elm.hasAttribute(attrName) && elm.removeAttribute(attrName);
                });
            }
            return this;

        }

        // -----------------------
        // 文档筛选

        find(selector) {
            if (typeof selector === 'string' && selector) {
                let nodeList = []; // 申明一个数组
                this.forEach(elm => { // 遍历所有被选元素
                    // 在每一个被选元素中查找后代元素
                    nodeList.push(...elm.querySelectorAll(selector));
                });
                // 数组去重 应为选择到了重复的元素
                nodeList = [...new Set(nodeList)];
                return init(nodeList);
            }
        }


        eq(index) {
            if (typeof index === 'number' && index === parseInt(index) && !isNaN(index) && index >= 0) {
                return init(this[index]);
            }
        }


        siblings(selector) {
            let result = [];
            this.forEach(elm => { // 遍历所有被选元素
                let sibling = Array.from(elm.parentNode.children); // 拿到包含自身的所有兄弟元素
                let _index = sibling.findIndex(el => el === elm); // 获得自身的索引
                sibling.splice(_index, 1); // 删除自身

                if (typeof selector === 'string' && selector) {
                    let selected = Array.from(elm.parentNode.querySelectorAll(selector)); //通过选择器选择被选元素的父元素找后代元素
                    // 找出(筛选)两个数组中相同的值
                    sibling = sibling.filter(item => selected.indexOf(item) > -1);
                }
                result.push(...sibling);
            });
            result = [...new Set(result)];
            return init(result);
        }


        children(selector) {
            let result = [];
            this.forEach(elm => {
                let domList;
                if (typeof selector === 'string' && selector) {
                    domList = Array.from(elm.querySelectorAll(selector));
                    domList = domList.filter(el => el.parentNode === elm); // 从子元素和后代元素的集合中筛选出子元素
                    result.push(...domList);
                } else {
                    domList = Array.from(elm.children);
                    result.push(...domList);
                }
            });

            return init(result);
        }


        index(elm) {
            // findIndex 在数组中查找与表达式匹配的第一个元素的 索引值
            // 如果没有匹配到结果则返回 -1
            return this.findIndex(el => elm === el);
        }

        tabs(options) {
            let defaults = {
                ev: 'click', // 默认事件
                active: 'active', // 默认按钮类名
                display: 'show' // 默认div类名
            };

            Object.assign(defaults, options); // 合并对象

            // 选择元素
            let btns = this.find('[data-type="tabs-btn"]>li');
            let div = this.find('[data-type="tabs-div"]');

            btns.on(defaults.ev, function() {
                let _index = btns.index(this);

                $(this).addClass(defaults.active).siblings().removeClass(defaults.active);
                div.eq(_index).addClass(defaults.display).siblings().removeClass(defaults.display);
            });
        }

        offset() {
            // 返回第一个被选元素的 大小和位置
            return {
                left: this[0].offsetLeft,
                top: this[0].offsetTop,
                width: this[0].offsetWidth,
                height: this[0].offsetHeight
            }
        }

        // 获得或设置被选元素的html内容
        html(htmlText) {
            // 获取第一个被选元素的html内容
            if (typeof htmlText === 'undefined') {
                return this[0].innerHTML;
            } else if (typeof htmlText === 'string') {
                this.forEach(el => {
                    el.innerHTML = htmlText;
                });
            } else if (typeof htmlText === 'function') {
                this.forEach((el, i) => {
                    el.innerHTML = htmlText(el.innerHTML, i);
                });
            }
        }

        load(url, callback) {
            // 为所有被选择的元素加载一个模板
            const xhr = new XMLHttpRequest();
            xhr.open('get', url);
            xhr.send();
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    // 将请求结果放入页面
                    this.forEach(el => {
                        $(el).html(xhr.responseText);
                    });

                    callback && callback();
                }
            }.bind(this);
        }


    }


    window.$ = init;
})();