import './library/jquery.js';
import { cookie } from './library/cookie.js';
import './library/jquery.lazyload.js';


let id = location.search.split('=')[1];

$.ajax({
    type: "get",
    url: "../../interface/getItem.php",
    data: {
        id: id
    },
    dataType: "json",
    success: function(res) {

        let picture = JSON.parse(res.picture);
        let details = JSON.parse(res.details);
        let temp1 = `<div class="img-top">
        <img src="../img/${picture[0].src}" alt="">
        <div class="botimg">
        <span class="lt">&lt;</span>
            <ul class="list">
                <li>
                    <a href=""><img src="../img/${picture[1].src}" alt=""></a>
                </li>
                <li>
                    <a href=""><img src="../img/${picture[2].src}" alt=""></a>
                </li>
            </ul>
            
            <span class="gt">&gt;</span>
        </div>`
        $('.main .top .top-left').prepend(temp1);

        let temp = `
                    <h4>${res.title}</h4>
                    <div class="pricebg">
                    <img src="../img/1597801542667.png" alt="">
                        <span>￥</span>
                        <span class="yuan">${res.price}</span>
                        <span>5折起</span>
                        <span class="wpkq"><img src="../img/wpkq-font.png" alt=""></span>
                        <span>累计热卖1.7万件</span>
                        <span>券后${res.price}起</span>
                    </div>
                    <div class="city"><span>配送</span>
                        <p>请选择省市区 <span>∨</span></p>
                    </div>
                    <div class="yf">
                        <span>运费</span> 订单满88元免运费
                    </div>
                    <div class="color">
                        <span>颜色</span>
                        <span>黑色</span>
                    </div>
                    <div class="gg">
                        <span>规格</span>
                        <span>标配：R5-4600U/8G/256G固态/集显/14英寸</span>
                    </div>
                    <div class="num">
                        <span>数量</span>
                        <div class="num-btn">
                            <ul>
                                <li>-</li>
                                <li><input type="text" value="1"></li>
                                <li>+</li>
                            </ul>
                        </div>
                    </div>
                    <div class="addcar">
                    <a href="javascript:">￥${res.price}起 券后价 抢 &gt;</a>`

        $('.main .right').prepend(temp).find('.addcar').on('click', function() {
            addItem(res.id, res.price, $('.num input').val());
        });

        let temp2 = `<img class="lazy" src="../img/${details[0].src}" alt="">`;
        $('.particulars').append(temp2);

        let num = parseInt($('.num-btn input').val());
        $('.num-btn input').on('blur', function() {
            if (num >= `${res.num}`) {
                $('.num-btn input').val(`${res.num}`);
            } else if (num < 1) {
                $('.num-btn input').val(0);
            }
        })
        $('.num-btn li:first-child').on('click', function() {
            num--;
            if (num < 1) {
                $('.num-btn input').val(0);
            } else {
                $('.num-btn input').val(num);
            }
        })
        $('.num-btn li:last-child').on('click', function() {
            num = $('.num-btn input').val();
            num++;
            if (num >= `${res.num}`) {
                $('.num-btn input').val(`${res.num}`);
            } else {
                $('.num-btn input').val(num);
            }

        })

        let li = [];
        li = $('.botimg li');
        console.log(li);
        // $('.botimg li').forEach(elm => {
        //     console.log(elm)
        // })
    }
});



function addItem(id, price, num) {
    let shop = cookie.get('shop'); // 获得cookie数据
    let product = {
        id,
        price,
        num
    };
    console.log(shop)

    if (shop) { // 判断购物车是否有添加过数据
        shop = JSON.parse(shop); //将JSON字符串转回数组

        // 判断购物车中是否存在该商品
        if (shop.some(elm => elm.id == id)) {
            // 修改数量
            shop.forEach(el => {
                el.id == id ? el.num = num : null;
            });
        } else {
            shop.push(product);
        }

    } else {
        shop = []; // 初始没有数据 初始化一个空数组
        shop.push(product); // 将第一个商品添加进数组
    }


    cookie.set('shop', JSON.stringify(shop), 1);

}
$(".lazy").lazyload({
    effect: "fadeIn",
});