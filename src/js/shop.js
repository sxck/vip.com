import './library/jquery.js';
import { cookie } from './library/cookie.js';
import './library/jquery.lazyload.js';


let shop = cookie.get('shop');
if (shop) {
    shop = JSON.parse(shop); // 有cookie数据才需要转换
    $('.center').css('display', 'none');
    $('.shop-list').css('display', 'block');
    let idList = shop.map(elm => elm.id).join(); // 获得所有id

    $.ajax({
        type: "get",
        url: "../../interface/getItems.php",
        data: {
            idList
        },
        dataType: "json",
        success: function(res) {
            let temp = '';
            res.forEach((elm, i) => {
                let picture = JSON.parse(elm.picture);
                // 让ajax获得的数据结果id与cookie中的id  一一对应
                // 索引不同
                // 从购物车的cookie数据中去选择当前遍历的数据
                let arr = shop.filter(val => val.id == elm.id);
                temp += ` 
                <div class="b3-b1"><ul class="list">
                    <li><input type="checkbox" name="" id="" class="all"></li>
                    <li class="img">
                        <a href="produc.html?id=${elm.id}"><img src="../img/${picture[0].src}" alt=""></a>
                    </li>
                    <li class="sp">
                        <p>
                            <a href="produc.html?id=${elm.id}">${elm.title}</a>
                        </p>
                        <p>尺码：【标配】i7-10510U/16G/512G/独显/14英寸</p>
                        <span>7天退换</span><span>退换无忧</span></li>
                </li>
                <li class="jg">￥<span>${parseFloat(elm.price).toFixed(2)}</span></li>
                <li class="num">
                    <div class="num-btn">
                            <span>-</span>
                            <input type="text" value="${arr[0].num}" max="${elm.num}">
                            <span>+</span>
                        </div>
                </li>
                <li class="_del"><a href="" class="del"  data-id="${elm.id}">删除</a></li>
                </ul>
                </div>
                `;
            });

            $('.box3').append(temp).find('.del').on('click', function() {
                let shop2 = shop.filter(el => el.id != $(this).attr('data-id')); // 获得id不匹配的元素
                cookie.set('shop', JSON.stringify(shop2), 1); // 将不匹配的元素从新写进cookie
                location.reload();
            });
            let other = $('.all');
            let num = Array.from($('.num-btn input'));
            $('.num-btn').on('click', function(ev) {
                let input = $(ev.target);
                let inp = input.siblings('input');
                let num2 = input.siblings('input').val();
                let max = parseInt(inp.attr('max'));
                if (input.html() == '-') {

                    if (num2 > 1) {
                        num2--;
                        inp.val(num2);
                    } else {
                        inp.val(1);
                    }


                } else if (input.html() == '+') {
                    if (num2 >= max) {
                        inp.val(max);
                    } else {
                        num2++;
                        inp.val(num2);
                    }
                    if ($(input).parent().parent().siblings('li:nth-of-type(1)').children('input').prop('checked') == true) {
                        let a = null;
                        let a1 = parseFloat($(ev.target).parent().parent().siblings('.jg').find('span').text());
                        let a2 = parseInt($(ev.target).siblings('input').val())
                        a = a1 * a2
                            // $('.zj span').html(a);
                    }
                }
            })

            $('.alls').on('click', function() {
                $('.all').prop('checked', $('.alls').prop('checked'));
                if ($('.alls').prop('checked') == true) {
                    let jg = Array.from($('.jg span'))
                    let jg1 = []
                    let num1 = []
                    jg.forEach(elm => {
                        jg1.push($(elm).html())
                    });
                    num.forEach(el => {
                        num1.push($(el).val())
                    })
                    let a = null;
                    for (let i = 0; i < jg1.length; i++) {
                        a += jg1[i] * num1[i]
                    }
                    $('.zj span').html(a);
                } else {
                    $('.zj span').html(0);
                }
            })
            other.on('click', function(ev) {
                let isAllcheck = Array.from(other).every(el => $(el).prop('checked'));
                isAllcheck ? $('.alls').prop('checked', true) : $('.alls').prop('checked', false);
                let jg;
                let jg1 = null;
                Array.from(other).some(elm => {
                    if ($(elm).prop('checked') == true) {
                        jg = parseFloat($(elm).parent().siblings('.jg').children('span').html()) * parseInt($(elm).parent().siblings('.num').find('input').val());
                        jg1 += parseFloat(jg);
                    }
                    $('.zj span').html(jg1);
                });

            })

            $(".lazy").lazyload({
                effect: "fadeIn",
            });
        }
    });
} else {
    $('.shop-list').css('display', 'none');
    $('.center').css('display', 'block');
}