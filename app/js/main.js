$(function(){
    $('.menu__link').on('click', function(){
        $('.menu__link').removeClass('menu__link--active'),
        $(this).addClass('menu__link--active');
    });

    $(window).on('scroll', function(){
        $('.header').toggleClass('header--active', $(this).scrollTop() > $('.header').height());
    });

    $(".menu a").on("click", function (ev) {              
        ev.preventDefault();       
        var id = $(this).attr('href'),   
         top = $(id).offset().top;               
        $('body,html').animate({scrollTop: top}, 500);
    });

    $('.menu__link').on('click', function(){
        $('.menu').toggleClass('menu--active');
    })
    
    $('.header__btn').on('click', function(){
        $('.header__btn').toggleClass('header__btn--active');
        $('.menu').toggleClass('menu--active')
    })

    $('.classes-left__link').on('click', function(e){
        e.preventDefault();
        $('.classes-left__link').removeClass('classes-left__link--active');
        $(this).addClass('classes-left__link--active');

        $('.shedule__data').removeClass('shedule__data--active');
        $($(this).attr('href')).addClass('shedule__data--active');
    })

    $('.team__names-title').on('click', function(event){
        event.preventDefault();
        $('.team__names-title').removeClass('team__names-title--active');
        $(this).addClass('team__names-title--active');

        $('.team__description').removeClass('team__description--active');
        $($(this).attr('href')).addClass('team__description--active');
    })
});

