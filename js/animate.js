var Animation = function (animArr, click = false) {
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
          $('div#' + id).fadeIn(animation.duration, cb);
        };
        break;
      case 'reveal':
        func = function (id, cb) {
          $('div#' + id).show();
          $('div#' + id).animate({'width': animation.width}, animation.duration, cb);
        };
        break;
      case 'fadeOut':
        func = function (id, cb) {
          $('div#' + id).fadeOut(animation.duration, cb);
        };
        break;
      default: func = function (id, cb) {
        $('div#' + id).show(0, cb);
      };
    }

    return func;
  }

  function prepAnimationLoaderOptions() {
    var animationLoaderOptions = {
      click: click,
      animations: []
    };

    animArr.forEach(function (animation) {
      // set Id to imagesrc on this type to initiate animations on previously animated elements. Need to think of a better way
      if (animation.type === 'fadeOut') {
        if (typeof animation.id === 'undefined') {
          throw 'Error: id of animation type "fadeOut" missing';
        }
        animationLoaderOptions.animations.push({
          'animation': setAnimationFunc(animation),
          'delay': (typeof animation.delay === 'number') ? animation.delay : 0,
          'type': (animation.type) ? animation.type : '',
          'id': animation.id
        });
        return;
      }
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
        'id': (typeof animation.id !== 'undefined' && animation.id !== '') ? animation.id : guid(),
        'animation': setAnimationFunc(animation),
        'delay': (typeof animation.delay === 'number') ? animation.delay : 0,
        'type': (animation.type) ? animation.type : ''
      });
    });
    return animationLoaderOptions;
  }

  return prepAnimationLoaderOptions();
}

var AnimationLoader = function (selector, options) {
  var index = 0
  var containerEl = document.createElement('DIV');

  containerEl.id = options.id;

  $(containerEl).css({
    'position': 'relative',
    'width': options.width,
    'height': options.height
  });

  return {
    // initializer
    'init': function () {
      var loaded = 0,
          images = [],
          that = this;

      options.animationSets.forEach(function (set) {
        set.animations.forEach(function (animation) {
          if (animation.imagesrc) {
            images.push(animation.imagesrc);
          }
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

          if (animation.type === 'fadeOut') return;

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
    }
  }
};


