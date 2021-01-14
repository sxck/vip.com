import './library/jquery.js';
import { cookie } from './library/cookie.js';


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
            console.log(`${res.num}`);
            let temp = '';
            res.forEach((elm, i) => {
                console.log(`${elm.num}`);
                let picture = JSON.parse(elm.picture);

                // 让ajax获得的数据结果id与cookie中的id  一一对应
                // 索引不同

                // 从购物车的cookie数据中去选择当前遍历的数据
                let arr = shop.filter(val => val.id == elm.id);
                temp += ` 
                <div class="b3-b1"><ul class="list">
                    <li><input type="checkbox" name="" id="" class="all"></li>
                    <li class="img">
                        <a href=""><img src="../img/${picture[0].src}" alt=""></a>
                    </li>
                    <li class="sp">
                        <p>
                            <a href="">${elm.title}</a>
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
                <li class="_del"><a href="">删除</a></li>
                </ul>
                </div>
                `;
            });
            $('.box3').append(temp).find('.del').on('click', function() {
                let shop2 = shop.filter(el => el.id != $(this).attr('data-id')); // 获得id不匹配的元素
                cookie.set('shop', JSON.stringify(shop2), 1); // 将不匹配的元素从新写进cookie
                location.reload();
            });

            $('.num-btn').on('click', function(ev) {
                let input = $(ev.target);
                let inp = input.siblings('input');
                let num = input.siblings('input').val();
                let max = parseInt(inp.attr('max'));
                if (input.html() == '-') {
                    if (num > 1) {
                        num--;
                        inp.val(num);
                    } else {
                        inp.val(0);
                    }
                } else if (input.html() == '+') {
                    if (num >= max) {
                        inp.val(max);
                    } else {
                        num++;
                        inp.val(num);
                    }
                }
            })

            let other = $('.all');
            $('.alls').on('click', function() {
                $('.all').prop('checked', $('.alls').prop('checked'));
                $('')

            })

            other.on('click', function() {
                let isAllcheck = Array.from(other).every(el => $(el).prop('checked'));
                // console.log(isAllcheck)
                isAllcheck ? $('.alls').prop('checked', true) : $('.alls').prop('checked', false);
                Array.from(other).forEach(elm => console.log($(elm).prop('checked')));
            })

        }
    });
} else {
    $('.shop-list').css('display', 'none');
    $('.center').css('display', 'block');
}