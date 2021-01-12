import './library/jquery.lazyload';
$(function() {
    $("img").lazyload({
        effect: "fadeIn"
    });
});
export { lazy }