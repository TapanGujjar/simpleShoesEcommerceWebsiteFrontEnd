$("document").ready(function(){

    var height=window.innerHeight;
    var width=window.innerWidth;

    $('.carousel').carousel({
        interval: 3000
    });

    $('.carousel').carousel('cycle');
});