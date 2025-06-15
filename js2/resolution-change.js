function currentOrientation() {
    if (navigator.userAgent.match(/iPhone|iPad/i)) {

        if ((Math.abs(window.orientation) === 90) || (Math.abs(window.orientation) === -90)) {
            // Landscape
            var metawidth = (screen.height / 1024);
        } else {
            // Portrait
            var metawidth = (screen.width / 1024);
        }
    } else {
        var metawidth = (screen.width / 1024);
    }
    return metawidth;
}

function iosXDetect() {
    // Really basic check for the ios platform
    // https://stackoverflow.com/questions/9038625/detect-if-device-is-ios
    var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    // Get the device pixel ratio
    var ratio = window.devicePixelRatio || 1;

    // Define the users device screen dimensions
    var screen_d = {
        width: window.screen.width * ratio,
        height: window.screen.height * ratio
    };
    var metaview_ios_xs = 'initial-scale=1, viewport-fit=cover';
    // iPhone X Detection
    /* 1792x828px at 326ppi  XR*/
    /* 2436x1125px at 458ppi XS */
    /* 2688x1242px at 458ppi XS MAX*/
    if ((iOS && screen_d.width == 1125 && screen_d.height === 2436) || (iOS && screen_d.width == 1242 && screen_d.height === 2688) || (iOS && screen_d.width == 326 && screen_d.height === 1792)) {
        $('meta[name="viewport"]').attr('content', metaview_ios_xs);

    }
}

function changeRes() {

    iosXDetect();
    var metawidth = currentOrientation();
    var metaview = 'width=device-width, initial-scale=1, user-scalable=no';
    var metaview_desktop = 'width=1024, initial-scale=' + metawidth + ', minimum-scale=' + metawidth + ', maximum-scale=' + metawidth * 2 + ',  user-scalable=1';
    var metaview_admin = 'width=device-width, initial-scale=' + metawidth + ', minimum-scale=' + metawidth + ', maximum-scale=1,  user-scalable=1';
    var metaview_ios = 'width=1024, initial-scale=0.75';


    var current_resolution = localStorage.getItem('desktop');

    if (document.documentElement.clientWidth >= 767) {
        $('.search').css('display', 'block');
    } else {
        if ($('.search').data('mobile-visible')) {
            $('.search').css('display', 'block');
        } else {
            $('.search').hide();
        }
    }

    // other blocks

    if (screen.width >= 767 && screen.width <= 1024) {
        var path = window.location.pathname;
        var pathArray = window.location.pathname.split('/');
        var avatarMakerPath = pathArray[3];


        if (navigator.userAgent.match(/iPhone|iPad/i)) {

            if (window.innerWidth == 369 && window.innerHeight === 1024) {

            } else {

                if ((Math.abs(window.orientation) === 90) || (Math.abs(window.orientation) === -90)) {
                    // Landscape
                    var metaview_desktop = 'width=1024, initial-scale=' + metawidth + ', minimum-scale=' + metawidth + ', maximum-scale=' + metawidth * 2 + ',  user-scalable=1';

                } else {
                    //var metaview_desktop = 'width=1024, initial-scale=' + metawidth + ', minimum-scale=' + metawidth + ', maximum-scale=' + metawidth * 2 + ',  user-scalable=1';
                    //$('meta[name="viewport"]').attr('content', metaview_desktop);
                    // Portrait
                    $('meta[name="viewport"]').attr('content', metaview_ios);

                }
            }

        } else {

            if (pathArray[1] == 'admin') {
                if (path == avatarMakerPath) {
                    $('meta[name="viewport"]').attr('content', metaview_desktop);
                } else {
                    $('meta[name="viewport"]').attr('content', metaview_admin);
                }
            } else {

                $('meta[name="viewport"]').attr('content', metaview_desktop);

            }
        }


    } else {
        $('meta[name="viewport"]').attr('content', metaview);
    }


}


function CommerceMargin() {
    console.log('1');
    if ($('.cmp_ads').length && $('.cmp_ads').html().trim() === '') {
        if ((window).innerWidth <= 1600) {
            if ($('.right-block-commerce-inner').is(':visible')) {
                $('.wrapper').addClass('right-commerce');
            } else if ($('.left-block-commerce-inner').is(':visible')) {
                $('.wrapper').addClass('left-commerce');
            }
        } else {
            if ($('.right-block-commerce-inner').is(':visible')) {
                $('.wrapper').removeClass('right-commerce');
            } else if ($('.left-block-commerce-inner').is(':visible')) {
                $('.wrapper').removeClass('left-commerce');
            }
        }
    } else {
        $('.wrapper').removeClass('left-commerce');
        $('.wrapper').removeClass('right-commerce');
    }
}

    //CommerceMargin();

// function CommercePositioning() {
//     var currentWinWidth = (window).innerWidth;
//     var contentWidth = $('.wrapper').width();
//     var commerceWidth = 300;
//     var freeSpace = currentWinWidth - contentWidth;
//     var marginToContent = (freeSpace - commerceWidth) / 2;
//     var marginToCommerce;
//
//
//     if (currentWinWidth / 2 > 790) {
//
//     } else {
//         if (currentWinWidth >= contentWidth + commerceWidth) {
//             console.log('greater');
//             //if ft 300
//             //currentWinWidth >= contentWidth - half width add to margin-left to ads
//             //currentWinWidth >= contentWidth + commerceWidth Half add ml to wrapper
//             console.log(marginToContent);
//             console.log(freeSpace);
//             console.log(marginToCommerce);
//
//
//             marginToCommerce = (800 - (commerceWidth / 2 ) + 20) * -1;
//
//             if ($('.right-block-commerce-inner').is(':visible')) {
//
//                 $('.wrapper').css('margin-left', marginToContent);
//                 console.log('right');
//                 $('.right-block-commerce-inner').css('margin-right', marginToCommerce);
//
//             } else if ($('.left-block-commerce-inner').is(':visible')) {
//                 $('.wrapper').css('margin-right', marginToContent);
//
//                 console.log('left');
//                 $('.left-block-commerce-inner').css('margin-left', marginToCommerce);
//
//             } else {
//
//             }
//
//         } else {
//             $('.wrapper').css('margin-left', 0);
//
//             if ($('.right-block-commerce-inner').is(':visible')) {
//
//                 console.log('right');
//                 $('.right-block-commerce-inner').css('margin-right', -630);
//
//             } else if ($('.left-block-commerce-inner').is(':visible')) {
//
//                 console.log('left');
//                 $('.left-block-commerce-inner').css('margin-left', -630);
//
//             } else {
//
//             }
//         }
//     }
// }

    var isInIframe = function inIframe () {
      try {
          return window.self !== window.top;
      } catch (e) {
          return true;
      }
    }

    $(document).ready(function () {

        if (!isInIframe) {
          CommerceMargin();
          // CommercePositioning();

          // var postionTop = $('.detail_image').offset().top;
          // $('.left-block-commerce-inner').css('top', postionTop - 128);


          iosXDetect();
          var checkExist = setInterval(function () {
              if ($('.navbar-fixed-top + .container-fluid #avatarPresetsBlock li').length) {

                  if ($('#avatarPresetsBlock li').length < 17) {
                      $('.presets li').css('margin-right', '12px');
                  } else {
                      $('.presets li').css('margin-right', '8px');
                  }

                  clearInterval(checkExist);
              }
          }, 100);


          var metawidth = currentOrientation();
          changeRes();
          var metaview = 'width=device-width, initial-scale=1, user-scalable=no';
          var metaview_desktop = 'width=1024, initial-scale=' + metawidth + ', minimum-scale=' + metawidth + ', maximum-scale=' + metawidth * 2 + ',  user-scalable=1';
          var metaview_admin = 'width=device-width, initial-scale=' + metawidth + ', minimum-scale=' + metawidth + ', maximum-scale=1,  user-scalable=1';
          var metaview_ios = 'width=1024, initial-scale=0.75';
          // var metaview_ios_xs = 'initial-scale=1, viewport-fit=cover';
          var limit = 2 * 3600 * 1000; // 2 hours
          var current_resolution = localStorage.getItem('desktop');


          var localStorageInitTime = localStorage.getItem('localStorageInitTime');
          if (localStorageInitTime === null) {
              localStorage.setItem('localStorageInitTime', +new Date());
          } else if (+new Date() - localStorageInitTime > limit) {
              localStorage.removeItem('desktop');
              localStorage.setItem('localStorageInitTime', +new Date());
          }


          if (screen.width >= 767 && screen.width <= 1024) {
              var path = window.location.pathname;
              var pathArray = window.location.pathname.split('/');
              var avatarMakerPath = pathArray[3];


              if (navigator.userAgent.match(/iPhone|iPad/i)) {

                  if (window.innerWidth == 375 && window.innerHeight === 812) {

                  } else {

                      if ((Math.abs(window.orientation) === 90) || (Math.abs(window.orientation) === -90)) {
                          // Landscape
                          var metaview_desktop = 'width=1024, initial-scale=' + metawidth + ', minimum-scale=' + metawidth + ', maximum-scale=' + metawidth * 2 + ',  user-scalable=1';

                      } else {
                          // Portrait
                          $('meta[name="viewport"]').attr('content', metaview_ios);

                      }
                  }

              } else {

                  if (pathArray[1] == 'admin') {
                      if (path == avatarMakerPath) {
                          $('meta[name="viewport"]').attr('content', metaview_desktop);
                      } else {
                          $('meta[name="viewport"]').attr('content', metaview_admin);
                      }
                  } else {

                      $('meta[name="viewport"]').attr('content', metaview_desktop);

                  }
              }

          } else {
              $('meta[name="viewport"]').attr('content', metaview);
          }

          $(window).resize(function () {
              // CommercePositioning();
              CommerceMargin();

              iosXDetect();
              if (!md.phone()) {
                  changeRes();
                  var metawidth = currentOrientation();
              }
          });

          $(window).on('orientationchange', function () {
              CommerceMargin();
              iosXDetect();
              if (!md.phone()) {
                  changeRes();
                  var metawidth = currentOrientation();
              }
          });
        } else {
          console.log('is in frame');
        }

    });
