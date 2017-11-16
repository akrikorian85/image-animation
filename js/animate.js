var Animation = function (animArr) {
  // helper function to set the id of each image
  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
  function setAnimationFunc(animation) {
    var func;

    switch (animation.type) {
      case 'fadeIn':
        func = function (id) {
          $('div#' + id).fadeIn(animation.duration);
        };
        break;
      case 'reveal':
        func = function (id) {
          $('div#' + id).show();
          $('div#' + id).animate({'width': animation.width}, animation.duration);
        };
        break;
      default: func = function (id) {
        $('div#' + id).show(0);
      };
    }

    return func;
  }

  function prepAnimationLoaderOptions() {
    var animationLoaderOptions = [];

    animArr.forEach(function (options) {
      animationLoaderOptions.push({
        'imagesrc': options.imagesrc,
        'getCssProps': function (zIndex) {
          var props = {
            'background-image': 'url(' + options.imagesrc + ')',
            'background-size': options.width + 'px ' + options.height + 'px',
            'background-repeat': 'no-repeat',
            'position': 'absolute',
            'width': options.width,
            'height': options.height,
            'top': options.position.y,
            'left': options.position.x,
            'zIndex': zIndex,
            'display': 'none'
          };

          switch (options.type) {
            case 'fadeIn':
              break;
            case 'reveal':
              props['width'] = 0;
              break;
            default:
          }

          return props;
        },
        'id': guid(),
        'animation': setAnimationFunc(options, this.id),
        'click': !!options.click,
        'delay': (typeof options.delay === 'number') ? options.delay : 0
      });
    });
    return animationLoaderOptions;
  }

    // 'imagesrc': options.imagesrc,
    // 'getCssProps': function (zIndex) {
    //   var props = {
    //     'background-image': 'url(' + options.imagesrc + ')',
    //     'background-size': options.width + 'px ' + options.height + 'px',
    //     'background-repeat': 'no-repeat',
    //     'position': 'absolute',
    //     'width': options.width,
    //     'height': options.height,
    //     'top': options.position.y,
    //     'left': options.position.x,
    //     'zIndex': zIndex,
    //     'display': 'none'
    //   };

    //   switch (options.type) {
    //     case 'fadeIn':
    //       break;
    //     case 'reveal':
    //       props['width'] = 0;
    //       break;
    //     default:
    //   }

    //   return props;
    // },
    // 'getId': function () {
    //   return id;
    // },

    // 'click': !!options.click,
    // 'delay': (typeof options.delay === 'number') ? options.delay : 0

    return prepAnimationLoaderOptions();
}

var AnimationLoader = function (selector, options) {
  var index = 0;

  // generates and appends the HTML

  return {
    // initializer
    'init': function () {
      var loaded = 0,
          images = [],
          that = this;

      options.animations.forEach(function (animation) {
        animation.forEach(function (image) {
          images.push(image.imagesrc);
        })
      });

      for (var i = 0; i < images.length; i++) {
        var image = new Image();

        // preload images
        image.addEventListener('load', function () {
          loaded++;

          if (loaded === images.length) {
            that.appendHTML();
            that.startAnimation();
          } else {
            // console.log(loaded + '/' + totalImages);
          }
        });

        image.src = images[i];
      }
    },
    'appendHTML': function () {
      var containerEl = document.createElement('DIV');

      containerEl.id = options.id;

      $(containerEl).css({
        'position': 'relative',
        'width': options.width,
        'height': options.height
      });

      options.animations.forEach(function (animation, zIndex) {
        var className = 'animation-group-' + (zIndex + 1);

        animation.forEach(function (part) {
          var div = document.createElement('DIV');

          div.id = part.id;
          div.className = className;
          $(div).css(part.getCssProps(zIndex));
          $(containerEl).append(div);
        });
      });

      $(selector).append(containerEl);
    },
    'startAnimation': function () {
      // if (!options.animations[index]) {
      //   return;
      // }

      // // wait for click or keep running?
      // if (options.animations[index].click) {
      //   $('#' + options.id).on('click', function () {
      //     // remove click handler immediately, then run animation
      //     $('#' + options.id).off('click');
      //     options.animations[index].animation(function () {
      //       // runs next animation when the current one ends
      //       // console.log('done');
      //       options.animations[index++];
      //       startAnimation();
      //     });
      //   });
      // }
      // else {
      //   setTimeout(function () {
      //     options.animations[index].animation(function () {
      //       // console.log('done');
      //       options.animations[index++];
      //       startAnimation();
      //     });
      //   }, options.animations[index].delay);
      // }
      console.dir(options);
      console.dir($('.animation-group-1'));
    },
    'clickAnimation': function () {
      var busy = false;

      $('#' + options.id).on('click', function (e) {
        e.preventDefault();

        if (busy) {
          // console.log('busy...');
          return;
        }

        if (options.animations[index]) {
          // console.log(index);
          busy = true;
          options.animations[index].animation(function () {
            index++;
            busy = false;
          });
        }
      });
    }
  }
};


