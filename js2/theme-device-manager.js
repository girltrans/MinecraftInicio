// Theme and device management - MODIFIED FOR LOCAL USE
$(document).ready(function() {
    var _this = this;
    var currentTheme = window.currentTheme || 'light'; // Will be set by template
    var currentUser = "";
    console.log('current theme - ', currentTheme);
    
    // Check for saved theme in cookie and apply it
    var savedTheme = readCookie('dtheme');
    if (savedTheme) {
        currentTheme = savedTheme;
        $('body').removeClass('light-theme dark-theme').addClass(savedTheme + '-theme');
        if (savedTheme === 'dark') {
             $('#theme2').attr('src', 'images3/darksun_on.png'); // Assuming an 'on' state image
        } else {
             $('#theme2').attr('src', 'images3/darksun.png');
        }
    }

    // Theme switching functionality
    $('#theme2').on('click', function (ev) {
        if (currentTheme === 'light') {
            changeTheme('dark');
        } else {
            changeTheme('light');
        }
    });

    $('#dtheme').on('click', function (ev) {
        if (currentTheme === 'light') {
            changeTheme('dark');
        } else {
            changeTheme('light');
        }
    });

    // --- MODIFICATION 1: Theme change no longer reloads the page ---
    function changeTheme(theme) {
        createCookie('dtheme', theme, 365); // create new cookie
        currentTheme = theme; // update the current theme variable
        
        // Instead of reloading, dynamically change the theme by adding a class to the body
        if (theme === 'dark') {
            $('body').removeClass('light-theme').addClass('dark-theme');
            $('#theme2').attr('src', 'images/darksun_on.png'); // Optional: change the sun/moon icon
        } else {
            $('body').removeClass('dark-theme').addClass('light-theme');
            $('#theme2').attr('src', 'images/darksun.png');
        }
        console.log('Theme changed to: ', theme);
    }

    // Utility functions
    function inIframe () {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }

    function isIpadOS() {
        return navigator.maxTouchPoints &&
            navigator.maxTouchPoints > 2 &&
            /MacIntel/.test(navigator.platform);
    }

    let isIOS = /iPad/.test(navigator.platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    var isInIframe = inIframe();
    console.log('isInIframe ', isInIframe);

    var md = new MobileDetect(window.navigator.userAgent);
    var mql = window.matchMedia("(orientation: portrait)");

    var serverDevice = window.serverDevice || '0'; // Will be set by template
    var device;

    // Device detection and handling (kept as is)
    if (isIpadOS() || isIOS) {
        console.log('is IpadOS');
    }

    if (md.phone() || md.tablet()) {
        $(document).on('touchend', function (e) {
            $(this).focus();
        });
    }

    if (md.tablet()) {
        $('html').removeClass('mobile-view');
        $('.right-block-commerce').remove();
        $('.left-block-commerce').remove();
        $('.skins-similar .skin').last().show();
        $('.other-uploads .skin').last().show();
        console.log('is tablet');
    } else if (md.phone()) {
        $('html').addClass('mobile-view');
        $('.header__menu').css('visibility', 'hidden');
        if ($('.skins-similar .skin').length >= 5) {
            $('.skins-similar .skin').last().hide();
        }
        if ($('.other-uploads .skin').length >= 5) {
            $('.other-uploads .skin').last().hide();
        }
        mql.addListener(function (m) {
            if (!m.matches) {
                $(document).focus();
                $(_this).focus();
            }
        });
    }

    // Cookie management functions (kept as is)
    createCookie('history', '1', 7);

    function createCookie(name, value, days) {
        var expires, date;
        if (days) {
            date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        } else expires = "";
        document.cookie = name + "=" + value + expires + "; path=/";
    }

    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // --- MODIFICATION 2: Removed the interval that reloaded the page every 2 seconds ---
    /*
    var redirectInterval = setInterval(function () {
        var x = readCookie('history');
        if (!x || (localStorage.getItem('logout') !== null && $('.user-info').is(":visible"))) {
            if (!isInIframe) {
                eraseCookie('history');
                localStorage.removeItem('logout');
                clearInterval(redirectInterval);
                window.location.href = page_url;
            }
        }
    }, 2000);
    */

    // --- MODIFICATION 3: Removed login page redirection logic ---
    /*
    if (pathname === '/login') {
        $.ajax({
            type: 'get',
            url: window.getUsernameUrl || '/get-username', // Will be set by template
            success: function (data) {
                if (data.success === 'success') {
                    window.location.href = skindex_url;
                }
            },
            error: function (data) {
                console.log(data.error);
            }
        });
    }
    */
});