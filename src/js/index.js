import './library/jquery.js';
import './library/jquery.lazyload.js';


$(".lazy").lazyload({
    effect: "fadeIn",
});


(function($) {
    console.log();
    $.fn.extend({

        slider: function() {
            let defaults = {
                speed: 500, // 动画执行时间
                delay: 3000 // 图片停留时间
            };
            let index = 0;
            let timer = null
            let aa = 0;
            let lfSpan = $(this.find('.btn-left'));
            let bottom_line = $(".bottom-line");
            console.log((".bottom-line").attr('left'))
            let riSpan = $(this.find('.banner-btn .btn-right'));
            $(".bottom-list li").on("mouseover mouseout", function(event) {
                let b = this.id;
                if (event.type == "mouseover") {
                    if (b == 0) {
                        $(".bottom-line").css({
                            "left": ('289px')
                        })
                    } else if (b == 1) {
                        $(".bottom-line").css({
                            "left": ('484px')
                        })
                    }
                    $(`.banner-list li:eq(${b})`).fadeIn(500).css('z-index', '9');
                    $(`.banner-list li:eq(${b})`).siblings(this).fadeOut(500).css('z-index', '0');
                    stop();
                } else if (event.type == "mouseout") {
                    main();
                }
            });
            lfSpan.on('click', function() {
                console.log(1);
                $(`.banner-list li:eq(${aa})`).fadeIn(500).removeAttr('display').css('z-index', '1');
                $(`.banner-list li:eq(${aa})`).siblings(this).fadeOut(500).removeAttr('display').css('z-index', '9');

            })

            let stop = function() {
                clearInterval(timer);
            }

            function start() {

                $(".bottom-line").css({
                    "left": '289px'
                })

                $(".bottom-line").css({
                    "left": '484px'
                })
            }

            function main() {
                timer = setInterval(start, 500);
            }
            // main()
        }
    });
})(jQuery);

$('.banner-img').slider();