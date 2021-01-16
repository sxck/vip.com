import './library/jquery.js';

(function() {
    $('.top').on('click', function(ev) {
        $(ev.target).addClass('color').siblings().removeClass('color');
        if ($(ev.target).hasClass('zhdl')) {
            $('.text').css('display', 'block');
            $('.ewm').css('display', 'none')
        } else if ($(ev.target).hasClass('smdl')) {
            $('.text').css('display', 'none');
            $('.ewm').css('display', 'block')
        }
    })
    $('.more1').on('click', function() {
        if ($(this).text() == '收起') {
            $(this).text('更多');
            let temp = `<span class ="xia"></span>`;
            $(this).append(temp);
            $('.more-list2').css('display', 'none')
        } else if ($(this).text() == '更多') {
            let temp = `<span class ="shang"></span>`;
            $(this).text('收起');
            $(this).append(temp);
            $('.more-list2').css('display', 'flex')
        }

    })
})()