var Animation = function (options, animArr) {
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
        func = function (id, cb) {
          $('div#' + id).fadeIn(animation.duration, function () {
            if (typeof cb === 'function') {
              cb();
            }
          });
        };
        break;
      case 'reveal':
        func = function (id, cb) {
          $('div#' + id).show();
          $('div#' + id).animate({'width': animation.width}, animation.duration, function () {
            if (typeof cb === 'function') {
              cb();
            }
          });
        };
        break;
      default: func = function (id, cb) {
        $('div#' + id).show(0, function () {
          if (typeof cb === 'function') {
            cb();
          }
        });
      };
    }

    return func;
  }

  function prepAnimationLoaderOptions() {
    var animationLoaderOptions = {
      click: false,
      animations: []
    };

    if (options.click) {
      animationLoaderOptions.click = true;
    }

    animArr.forEach(function (animation) {
      animationLoaderOptions.animations.push({
        'imagesrc': animation.imagesrc,
        'getCssProps': function (zIndex) {
          var props = {
            'background-image': 'url(' + animation.imagesrc + ')',
            'background-size': animation.width + 'px ' + animation.height + 'px',
            'background-repeat': 'no-repeat',
            'position': 'absolute',
            'width': animation.width,
            'height': animation.height,
            'top': animation.position.y,
            'left': animation.position.x,
            'zIndex': zIndex,
            'display': 'none'
          };

          switch (animation.type) {
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
        'animation': setAnimationFunc(animation, this.id),
        'delay': (typeof animation.delay === 'number') ? animation.delay : 0
      });
    });
    return animationLoaderOptions;
  }

  return prepAnimationLoaderOptions();
}

var AnimationLoader = function (selector, options) {
  var index = 0
  var containerEl = document.createElement('DIV');
  var event = new Event('animationdone');

  containerEl.id = options.id;

  $(containerEl).css({
    'position': 'relative',
    'width': options.width,
    'height': options.height
  });

  // generates and appends the HTML

  return {
    // initializer
    'init': function () {
      var loaded = 0,
          images = [],
          that = this;

      options.animationSets.forEach(function (set) {
        set.animations.forEach(function (image) {
          images.push(image.imagesrc);
        })
      });

      that.appendHTML();
      for (var i = 0; i < images.length; i++) {
        var image = new Image();

        // preload images
        image.addEventListener('load', function () {
          loaded++;

          if (loaded === images.length) {
            that.startAnimation();
          } else {
            // console.log(loaded + '/' + totalImages);
          }
        });

        image.src = images[i];
      }

    },
    'appendHTML': function () {
      options.animationSets.forEach(function (set, zIndex) {
        var className = 'animation-group-' + (zIndex + 1);

        set.animations.forEach(function (animation) {
          var div = document.createElement('DIV');

          div.id = animation.id;
          div.className = className;
          $(div).css(animation.getCssProps(zIndex));
          $(containerEl).append(div);
        });
      });

      $(selector).append(containerEl);
    },
    'startAnimation': function (index = 0) {
      var currentSetLength,
        animationsCompleteInCurrentSet = 0,
        that = this;

      if (typeof options.animationSets[index] === 'undefined') {
        return;
      }

      currentSetLength = options.animationSets[index].animations.length;

      // run first set of animations
      // when an animation in the set is done, iterate the counter
      // when counter equals the length of the animations in the set
      // run the next set
      function handleAnimationDone() {
        animationsCompleteInCurrentSet++;
        if (animationsCompleteInCurrentSet === currentSetLength) {
          that.startAnimation(++index);
        }
      }

      function runAnimationSet () {
        options.animationSets[index].animations.forEach(function (a) {
          setTimeout(function () {
            a.animation(a.id, handleAnimationDone);
          }, a.delay);
        });
      }

      // wait for click or keep running?
      if (options.animationSets[index].click) {
        $('#' + options.id).on('click', function () {
          // remove click handler immediately, then run animation
          $('#' + options.id).off('click');
          runAnimationSet();
        });
      } else {
        runAnimationSet();
      }
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


