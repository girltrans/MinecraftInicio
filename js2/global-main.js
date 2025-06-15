// Global main functionality
$(document).ready(function() {
    var md = new MobileDetect(window.navigator.userAgent);

    var isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
               navigator.userAgent &&
               navigator.userAgent.indexOf('CriOS') == -1 &&
               navigator.userAgent.indexOf('FxiOS') == -1 &&
               !navigator.userAgent.match(/iPhone/i)

    console.log('isSafari', isSafari);

    if (md.tablet() || isSafari) {
        $('.header__menu-outer').css({position:"relative"});
    }

    // detect visibility of page
    var vis = (function () {
        var stateKey, eventKey, keys = {
            hidden: "visibilitychange",
            webkitHidden: "webkitvisibilitychange",
            mozHidden: "mozvisibilitychange",
            msHidden: "msvisibilitychange"
        };
        for (stateKey in keys) {
            if (stateKey in document) {
                eventKey = keys[stateKey];
                break;
            }
        }
        return function (c) {
            if (c) document.addEventListener(eventKey, c);
            return !document[stateKey];
        }
    })();

    // get sort direction
    var dir = $('.sortDirection').html();
    $('.' + dir + 'Sort').css('font-weight', 'bold');

    /**
     * Like/Dislike voting
     * @param el
     * @param num
     */
    function voteAction(skin_id, num) {
        voteSkin(num, skin_id);
    }

    /**
     * Function adding K or M for large values
     * @param val
     */
    var likesFilter = function (val) {
        var likes;
        if (val >= 9999) {
            likes = 9999;
        } else if (val <= -9999) {
            likes = -9999;
        } else {
            likes = val;
        }
        return likes;
    };

    /** Vote for skin
     * @param vote
     * @param skin_id
     */
    function voteSkin(vote, skin_id) {
        var likesCount = $('[data-id="' + skin_id + '"]').find('.js-likes-count');
        var profileLikes = $('.profile-btns').find('[data-role="total-amount-of-upvotes-all-skins"]');
        if (likesCount.length == 0) {
            var likesCount = $('.js-limit-likes');
        }
        if ((vote < 0 && parseInt(likesCount.html()) <= 9999) || parseInt(likesCount.html()) < 9999) {
            $.ajax({
                type: 'post',
                url: window.addVoteUrl || '/add-vote',
                data: {
                    skin_id: skin_id,
                    vote: vote
                },
                success: function (data) {
                    if (data.success) {
                        $('[data-id="' + skin_id + '"]').find('.js-like-dislike').removeClass('negative-vote').removeClass('positive-vote');
                        if (vote > 0 && parseInt(likesCount.html()) < 9999) {
                            var _newLikesCount = parseInt(likesCount.html()) + 1;
                            likesCount.html(likesFilter(_newLikesCount));
                            $('.sid-likes span').html(parseInt($('.sid-likes span').html()) + 1);
                            $('[data-id="' + skin_id + '"]').find('[data-role="like-button"]').addClass('positive-vote');
                        } else if (vote < 0 && parseInt(likesCount.html()) > -9999) {
                            var _newLikesCount = parseInt(likesCount.html()) - 1;
                            likesCount.html(likesFilter(_newLikesCount));
                            $('.sid-likes span').html(parseInt($('.sid-likes span').html()) - 1);
                            $('[data-id="' + skin_id + '"]').find('[data-role="dislike-button"]').addClass('negative-vote');
                        }
                    } else {
                        if (data.error === 'not login') {
                            showNotify('Please <a href="' + (window.registerUrl || '/register') + '">Register</a> or <a href="' + (window.loginUrl || '/login') + '">Sign in</a> to vote');
                        } else {
                            showNotify(data.error);
                        }
                        $('div[data-role="skin-page-like-button"]').addClass('already-vote');
                    }
                },
                complete: function (data) {
                    var data = data.responseJSON;
                    if (data.success) {
                        $.ajax({
                            type: 'post',
                            url: window.addRankUrl || '/add-rank',
                            data: {
                                skin_id: data.skin_id,
                                upload_date: data.upload_date,
                                gravity: data.gravity,
                                vote: data.vote
                            },
                            success: function (data) {
                                console.log('success');
                            }
                        });
                    }
                }
            });
        }
    }

    /**
     * Show notification
     * @param message
     */
    function showNotify(message) {
        $.jGrowl(message, {
            life: 8000,
            position: 'bottom-right',
            animateOpen: {
                height: 'show'
            },
            animateClose: {
                height: 'hide'
            }
        });
    }

    /**
     * Unfollow user
     * @param user_id
     */
    function unfollowUser(user_id) {
        var d = $.Deferred();
        var data = {
            user_id: user_id
        };
        $.ajax({
            type: 'post',
            url: window.unfollowUserUrl || '/profile-unfollow-user',
            data: data,
            success: function (data) {
                if (data.success) {
                    d.resolve(data);
                } else {
                    showNotify(data.message);
                }
            },
            error: function (data) {
                d.reject(data);
            }
        });
        return d;
    }

    /**
     * Get count of votes
     * @param skin_id
     */
    function getVoteCount(skin_id) {
        $.ajax({
            type: 'post',
            url: window.getVoteCountUrl || '/skin-get-number-of-votes',
            data: {
                skin_id: skin_id
            },
            success: function (data) {
                if (data.success === true) {
                    $('[data-id="' + skin_id + '"]').find('.js-likes-count').html(data.cnt);
                    $('.sid-likes').html(data.cnt);
                } else {
                    showNotify(data.message);
                }
            }
        })
    }

    /**
     * Set timeout to prevent multiply overlay
     */
    $('a.like-btn').on('click', function () {
        var like = $(this);
        if (like.not('.clicked-like')) {
            like.addClass('clicked-like');
            setTimeout(function () {
                like.removeClass('clicked-like');
            }, 10000)
        }
    });

    $('a.dislike-btn').on('click', function () {
        var like = $(this);
        if (like.not('.clicked-like')) {
            like.addClass('clicked-like');
            setTimeout(function () {
                like.removeClass('clicked-like');
            }, 10000)
        }
    });

    /**
     * Show modal info
     * @param ob
     */
    function showInfoModal(ob) {
        var $modal = $('#profile_information_modal');
        $modal.find('.js-header-information-modal').html(ob.header);
        $modal.modal('show');
    }

    /**
     * Trim title
     */
    function trimTitles() {
        var titles = $('span[class^=title]');
        if (titles.length) {
            [].forEach.call(titles, function (item) {
                $(item).attr('data-height', $(item).height());
                if ($(item).height() < 21) {
                    $(item).html('<br />' + $(item).html());
                    $(item).parents('.js-skin-title').addClass('no-grad');
                }
                var delta = 0,
                    flag = 1;
                checkOverflow(item, flag, delta);
            });
            $('.skin-title').css('visibility', 'visible');
        } else {
            return false;
        }
    };

    trimTitles();

    /**
     * Get String length and cut off letters
     * @param item
     * @param flag
     * @param delta
     */
    function checkOverflow(item, flag, delta) {
        if (flag && $(item).height() > 40) {
            $(item).html($(item).html().substring(0, 40 - delta) + '...');
            delta += 3;
            checkOverflow(item, flag, delta);
        }
        flag = 0;
        return false;
    }

    function createUrl(value) {
        return value == undefined ? '' : value.replace(/[^a-z0-9_]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
    }

    // Prevent scroll content under popup
    function stopBodyScrolling (bool) {
        if (bool === true) {
            document.ontouchmove = function(e){ e.preventDefault(), true }
        } else {
            document.ontouchmove = function(e){ e.stopImmediatePropagation(), true }
        }
    }

    stopBodyScrolling(false);

    // Search functionality
    $('#search_btn').on('click', function (e) {
        var searchType = $('.select2-selection__rendered').text();
        var searchInputVal = createUrl($(".search input").val());
        var formUrl = searchType === 'Skins' ? '/search/skin/' + searchInputVal + '/1/' : '/search/author/' + searchInputVal + '/1/' ;
        console.log(formUrl);
        $('#search_form').attr('action', formUrl);
        $('#search_form').submit();
    });

    $(".search input").on('keypress', function(e) {
        if (e.which == 13) {
            e.preventDefault();
            var searchType = $('.select2-selection__rendered').text();
            var searchInputVal = createUrl($(this).val());
            var formUrl = searchType === 'Skins' ? '/search/skin/' + searchInputVal + '/1/' : '/search/author/' + searchInputVal + '/1/' ;
            console.log('enter ', formUrl);
            $('#search_form').attr('action', formUrl);
            $('#search_form').submit();
        }
    });

    $('select').on('select2:select', function (e) {
        var data = e.params.data;
        console.log(data);
        $(".search input").focus();
        var searchInputVal = createUrl($(".search input").val());
        var formUrl = data.id === 'skins' ? '/search/skin/' + searchInputVal + '/1/' : '/search/author/' + searchInputVal + '/1/' ;
        console.log(formUrl);
        $('#search_form').attr('action', formUrl);
    });

    // Prevent shifting content when popup shown
    $('div img[src*=cpm]').addClass('popup-shown');

    // SlideUp user info block
    $(document).on('click', function (e) {
        $('.open-menu .logo a').on('click', function (e) {
            $( 'html' ).hasClass( "open-menu" ) ? e.preventDefault() : "";
        });

        $('.open-menu .footer').on('click', function (e) {
            $( 'html' ).hasClass( "open-menu" ) ? e.preventDefault() : "";
        });

        $('.modal').on('show.bs.modal', function () {
            stopBodyScrolling(true);
            console.log('scroll block');
        });

        $('.modal').on('hidden.bs.modal', function () {
            stopBodyScrolling(false);
            console.log('scroll true');
        });

        var scrollTopRealTime = $('html').attr('data-scroll-top');
        // ScrollTop & prevent scrolling background contrnt when mobile menu open
        if ( (document.body.classList.contains('open-menu')) || (document.body.classList.contains('modal-open')) ) {
            $('body').scrollTop(scrollTopRealTime);
        }

        var target = $(e.target);
        if (!$(e.target).is('.user-info') && !$(e.target).is('.auth-dropdown a') && $(e.target).parents('.user-info').length == 0) {
            if ($('.auth-dropdown').is(':visible')) {
                e.preventDefault();
                $('.auth-dropdown').slideUp();
                return false;
            }
        }

        if ($('.header__menu').is('.open-menu')) {
            if (target.parents(".mobile__menu").length == 0 && !target.is('.mobile-menu') && target.parents(".user-info").length == 0 && !target.is('.profile-log.open-menu') && !target.is('.auth-dropdown li') && !target.is('.user-info') && !
                    target.is('.header__menu.open-menu') && !target.is(".header__menu.open-menu li") && target.parents(".mobile__menu").length == 0 && !target.is(".header__menu.open-menu .change-resolution-todesktop")) {
                $('.header').removeClass('open-menu');
                $('.wrapper').removeClass('open-menu');
                $('html').removeClass('open-menu');
                $('.header__menu').removeClass('open-menu');
                $('.footer').removeClass('open-menu');
                $('.site-overlay').removeClass('shadow');
                $('.content').removeClass('open-menu');
                $('body').removeClass('open-menu');
                $('.auth, .profile-log').removeClass('open-menu');
                $(window).scrollTop(scrollTopRealTime);
            }
        }
    });

    if ($('.header__menu-outer > ul > li:first-child > a').hasClass('selected_menu_item')) {
        $('.header__menu-outer ul li:first-child').addClass('red-border');
    }

    // Document 'Click' event for showing user info
    $(document).on('click', '.user-info', function () {
        $('.auth-dropdown ').slideToggle();
    });

    // Send like
    $(document).on('click', '[data-role="like-button"]', function (e) {
        e.preventDefault();
        var skin_id = $(this).parents('[data-role="skin-wrapper"]').data('id');
        voteAction(skin_id, 1);
    });

    // Send dislike
    $(document).on('click', '[data-role="dislike-button"]', function (e) {
        e.preventDefault();
        var skin_id = $(this).parents('[data-role="skin-wrapper"]').data('id');
        voteAction(skin_id, -1);
    });

    // Select2 initialization
    $(".js-example-basic-single").select2();
    $('select.js-example-basic-single').select2({
        minimumResultsForSearch: -1
    });

    // Modal positioning and scrolling prevention
    var scrollTopRealTime;
    $('.modal').on('shown.bs.modal', function () {
        scrollTopRealTime = $(window).scrollTop();

        if ($('html').attr('data-modal-opened') == 'false' || !$('html').attr('data-modal-opened')) {
            $('html').attr('data-modal-opened', true);
            var scrolled = $(window).scrollTop();
            $('html').addClass('modal-open');
            $('html').addClass('modal-open');
        }

        var $modal = $(this);
        var h = $modal.find('.modal-content').outerHeight();
        var currentHeight = ($(window).height());
        var modalTopMargin = ( (currentHeight / 2) - (h / 2) );

        if (modalTopMargin < 0) {
            modalTopMargin = 0;
            $modal.css('z-index', 9999999);
        }

        if (modalTopMargin < 50 && modalTopMargin != 0) {
            modalTopMargin = 60;
        }
        $modal.find('.modal-content').css("top", modalTopMargin + 'px');
    });

    $(window).on('orientationchange', function () {
        var $modal = $('.modal.in');
        if (navigator.userAgent.match(/iPhone|iPad/i)) {
            var h_modal = $modal.find('.modal-content').outerHeight();
            if ($(window).innerHeight() > $(window).innerWidth()) {
                var currentHeightIphone = ($(window).innerHeight());
            } else {
                var currentHeightIphone = ($(window).innerWidth());
            }

            var modalTopMarginIphone = ( (currentHeightIphone / 2) - (h_modal / 2) );

            if (modalTopMarginIphone < 0) {
                modalTopMarginIphone = 0;
                $modal.css('z-index', 9999999);
            }

            if (modalTopMarginIphone < 50 && modalTopMarginIphone != 0) {
                modalTopMarginIphone = 60;
            }

            $modal.find('.modal-content').css("top", modalTopMarginIphone + 'px');
        } else {
            var h = $modal.find('.modal-content').outerHeight();
            var currentHeight = ($(window).height());
            var modalTopMargin = ( (currentHeight / 2) - (h / 2) );

            if (modalTopMargin < 0) {
                modalTopMargin = 0;
                $modal.css('z-index', 9999999);
            }

            if (modalTopMargin < 50 && modalTopMargin != 0) {
                modalTopMargin = 60;
            }
            $modal.find('.modal-content').css("top", modalTopMargin + 'px');
        }
    });

    $('.modal').on('hidden.bs.modal', function () {
        $(window).scrollTop(scrollTopRealTime);

        if ($('.modal.in').length >= 1) {
            $('body').css('padding-right', 17);
        } else {
            $('html').attr('data-modal-opened', false);
            $('html').removeClass('modal-open');
            $('html').css('position', 'relative');
            $('html').css('margin-top', 0);
            $('body').css('padding-right', 0);
        }
    });

    // Window resize handling
    var resizeTimer;
    $(window).on('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            var $modal = $('.modal.in');
            if (navigator.userAgent.match(/iPhone|iPad/i)) {
                var h_modal = $modal.find('.modal-content').outerHeight();

                if ($(window).innerHeight() > $(window).innerWidth()) {
                    var currentHeightIphone = ($(window).innerHeight());
                } else {
                    var currentHeightIphone = ($(window).innerWidth());
                }
                var modalTopMarginIphone = ( (currentHeightIphone / 2) - (h_modal / 2) );

                if (modalTopMarginIphone < 0) {
                    modalTopMarginIphone = 0;
                    $modal.css('z-index', 9999999);
                }

                if (modalTopMarginIphone < 50 && modalTopMarginIphone != 0) {
                    modalTopMarginIphone = 60;
                }

                $modal.find('.modal-content').css("top", modalTopMarginIphone + 'px');
            } else {
                var h = $modal.find('.modal-content').outerHeight();
                var currentHeight = ($(window).height());
                var modalTopMargin = ( (currentHeight / 2) - (h / 2) );

                if (modalTopMargin < 0) {
                    modalTopMargin = 0;
                    $modal.css('z-index', 9999999);
                }

                if (modalTopMargin < 50 && modalTopMargin != 0) {
                    modalTopMargin = 60;
                }
                $modal.find('.modal-content').css("top", modalTopMargin + 'px');
            }

            if ($('#editorP').is(':visible')) {
                localStorage.setItem('editorWidth', $('#editorP').width());
                if ($('#editorP').width() > '540') {
                    var editorWidth = $('#editorP').width();
                    var modelWidth = $('#model-preview').width();
                    var newMargin = (editorWidth - modelWidth) / 2;
                }
            }
        }, 250);
    });

    // Commerce blocks positioning
    setTimeout(function() {
        if ($('.profile-top').length > 0) {
            var positionTop = $('.profile-top').offset().top;
            $('.right-block-commerce-inner').css('top', positionTop - 128).show();
            $('.left-block-commerce-inner').css('top', positionTop - 128).show();
        } else if ($('#editorP').length > 0) {
            var positionTop = $('.content').offset().top;
            $('.right-block-commerce-inner').css('top', positionTop - 128).show();
            $('.left-block-commerce-inner').css('top', positionTop - 128).show();
        } else {
            if ($('.content h1').length > 0) {
                var positionTop = $('.content h1').offset().top;
                $('.right-block-commerce-inner').css('top', positionTop - 70).show();
                $('.left-block-commerce-inner').css('top', positionTop - 70).show();
            }

            if ($('.top-ads').innerHeight() > 0) {
                var topAdsHeight = $('.top-ads').innerHeight() + 20;
                $('.left-block-commerce-inner').css("top", topAdsHeight);
                $('.right-block-commerce-inner').css('top', topAdsHeight);
            }
        }
    }, 3500);

    // Sidebar scrolling behavior
    if (window.location.pathname !== './index3.html/') {
        $(window).scroll(function () {
            var headerHeight = $('.header').innerHeight();
            var contentHeight = $('.content').innerHeight();
            if ($('.right-block-commerce-inner').length > 0) {
                var sidebarHeight = $('.right-block-commerce-inner').height();
            } else {
                var sidebarHeight = $('.left-block-commerce-inner').height();
            }
            var sidebarBottomPos = contentHeight - sidebarHeight;
            var trigger = $(window).scrollTop() - headerHeight;
            
            if ($(window).scrollTop() >= (headerHeight*2)) {
                $('.right-block-commerce-inner').addClass('fixed');
                $('.left-block-commerce-inner').addClass('fixed');
            } else {
                $('.right-block-commerce-inner').removeClass('fixed');
                $('.left-block-commerce-inner').removeClass('fixed');
            }
            if (trigger >= sidebarBottomPos) {
                $('.right-block-commerce-inner').addClass('bottom');
                $('.left-block-commerce-inner').addClass('bottom');
            } else {
                $('.right-block-commerce-inner').removeClass('bottom');
                $('.left-block-commerce-inner').removeClass('bottom');
            }
        });
    }

    // Expose functions globally
    window.voteAction = voteAction;
    window.showNotify = showNotify;
    window.getVoteCount = getVoteCount;
    window.showInfoModal = showInfoModal;
    window.trimTitles = trimTitles;
    window.checkOverflow = checkOverflow;
    window.createUrl = createUrl;
    window.stopBodyScrolling = stopBodyScrolling;
    window.unfollowUser = unfollowUser;
});