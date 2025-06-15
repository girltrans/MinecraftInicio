// Mobile menu and UI interactions
$(document).ready(function() {
    $(".mobile-menu, .mobile-menu i").on('click', function (e) {
        e.preventDefault();

        $('.header__menu').css('visibility', 'visible');

        // get scrollHeight before open menu
        if (!$('.header__menu').is('.open-menu')) {
            var scrollTopRealTime = $(window).scrollTop();
            var scrollTopRealTime = $(window).scrollTop();
            $('html').attr('data-scroll-top', scrollTopRealTime);

        }

        $('.header__menu').toggleClass('open-menu');
        $('.site-overlay').toggleClass('shadow');
        $('.wrapper').toggleClass('open-menu');
        $('.content').toggleClass('open-menu');
        $('html').toggleClass('open-menu');
        $('body').toggleClass('open-menu');
        $('.footer').toggleClass('open-menu');
        $('.header').toggleClass('open-menu');
        $('.auth, .profile-log').toggleClass('open-menu');
        $('.auth-dropdown').slideUp();

        // set scrollTop position after closing menu
        if (!$('.header__menu').is('.open-menu')) {
            scrollTopRealTime = $('html').attr('data-scroll-top');
            $(window).scrollTop(scrollTopRealTime);
        }
    });

    $('.mobile-search').on('click', function () {
        $('.search').slideToggle();
        $(".search input").focus();
        $('.main > .content').toggleClass('search-open');
        $('.top-banner-large').toggleClass('search-open');

        var _mobileVisible = $('.search').data('mobile-visible');
        $('.search').data('mobile-visible', !_mobileVisible);
    });

    $('.slide-leftbar > .icon-pencil').on('click', function (e) {
        e.preventDefault();
        $('.left-toolbar').toggleClass('open-leftbar');
        $('.content').toggleClass('open-leftbar');
        $('body').toggleClass('open-menu');
    });
    
    $('.slide-rightbar > .icon-settings').on('click', function (e) {
        e.preventDefault();
        $('.right-toolbar').toggleClass('open-rightbar');
        $('.content').toggleClass('open-rightbar');
        $('body').toggleClass('open-menu');
    });
});