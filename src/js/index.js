import './library/jquery.js';
import './library/jquery.lazyload.js';


$(".lazy").lazyload({
    effect: "fadeIn",
});

(function($) {
    $.fn.extend({
        slider: function(options) {
            var aa = 1;
            var size = $(".banner_select>ul li").length; //5
            var img_size = $(".banner_wrap>ul li").length; //5
            for (var i = 0; i <= size - 1; i++) {
                $(".banner_select>ul li")[i].id = i;
                $(".banner_wrap>ul li")[i].id = i;
            }

            $(".banner_select>ul li").on("mouseover mouseout", function() {
                aa = this.id
                $(".J_trigger_line").css({
                    "left": (this.id * 195 + 290)
                })
                $(".banner_wrap>ul li").eq(this.id).addClass("on").siblings(this).removeClass("on");
                $(".banner_wrap>ul li").eq(this.id).fadeIn(500).siblings(this).fadeOut(500);
            });

            function move() {
                $(".J_trigger_line").css({
                    "left": (aa * 195 + 485)
                })
                $(".banner_wrap>ul li").eq(aa).addClass("on").siblings(aa).removeClass("on");
                $(".banner_wrap>ul li").eq(aa).fadeIn(500).siblings(aa).fadeOut(500);
            }

            var t = setInterval(lunbo, 5000);

            function lunbo() {
                if (aa == img_size) {
                    aa = 0;
                }
                move();
                aa++
            }
            $(".banner_wrap").hover(function() {
                clearInterval(t);
            }, function() {
                t = setInterval(lunbo, 5000);
            });
            $(".left").on('click', function() {
                if (aa <= 1) {
                    aa = 1;
                }
                aa -= 2;
                move();
                aa++;
            })
            $(".right").on('click', function() {
                if (aa == 1) {
                    aa = 0;
                }
                aa++;
                aa--;
                move();
                aa++;
            })
        }

    });
})(jQuery);
$(document).slider();

$.ajax({
    type: "get",
    url: "../../interface/getData.php",
    dataType: "json",
    success: function(response) {
        let temp = '';
        // console.log(response);
        response.forEach((elm, i) => {
            let picture = JSON.parse(elm.picture);

            console.log(response);
            temp += `<li>
            <a href="produc.html?id=${elm.id}">
            <div><img class="lazy" src="../img/${picture[0].src}" alt=""></div>
            <div>${elm.title.slice(0,5)+' ...'}</div>
            <div><span>￥</span>${elm.price}</div>
        </a>
        </li>`
        });

        $('.everyDay .bottom .list').append(temp);
    }
});