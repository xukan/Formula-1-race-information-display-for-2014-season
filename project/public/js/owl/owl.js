$(function(){
    $('#owl-demo').owlCarousel({
        items: 1,
        navigation: true,
        navigationText: ["Pre","Next"],
        autoPlay: true,
        stopOnHover: true,
        afterInit: function () {
            var $t = $('.owl-pagination span');
            $t.each(function (i) {
                $(this).before('<img src="img/owl/t' + (i + 1) + '.jpg">');
            })
        }
    });
});
