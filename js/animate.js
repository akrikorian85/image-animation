var Animation = function (options) {
  var id = guid();

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
  function setAnimationFunc() {
    switch (options.type) {
      case 'fadeIn':
        return function (cb) {
          $('div#' + id).fadeIn(options.duration, function () {
            if (typeof cb === 'function') {
              cb();
            }
          });
        };
      case 'reveal':
        return function (cb) {
          $('div#' + id).show();
          $('div#' + id).animate({'width': options.width}, options.duration, function () {
            if (typeof cb === 'function') {
              cb();
            }
          });
        };
      default: return function (cb) {
        $('div#' + id).show(0, function () {
          if (typeof cb === 'function') {
            cb();
          }
        });
      }
    }
  }
  return {
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
    'getId': function () {
      return id;
    },
    'animation': setAnimationFunc(),
    'click': !!options.click
  };
}

var AnimationLoader = function (selector, options) {
  var index = 0;

  // generates and appends the HTML
  function appendHTML() {
    var containerEl = document.createElement('DIV');

    containerEl.id = options.id;

    $(containerEl).css({
      'position': 'relative',
      'width': options.width,
      'height': options.height
    });

    options.animations.forEach(function (animation, index) {
      var div = document.createElement('DIV'),
        zIndex = index;

      div.id = animation.getId();
      $(div).css(animation.getCssProps(zIndex));
      $(containerEl).append(div);
    });

    $(selector).append(containerEl);
  }

  var startAnimation = function () {
    if (!options.animations[index]) {
      return;
    }

    // wait for click?
    if (options.animations[index].click) {
      $('#' + options.id).on('click', function () {
        options.animations[index].animation(function () {
          startAnimation(options.animations[index++]);
        });
        $('#' + options.id).off('click');
      });
    }
    else {
      options.animations[index].animation(function () {
        startAnimation(options.animations[index++]);
      });
      // runAnimationQueue(options.animations[index].animation, function () {
      //   runAnimationQueue(options.animations[index].animation);
      // });
    }
  }
  // function runAnimationQueue(animationFunc, cb) {
  //   if (typeof cb === 'function') {
  //     animationFunc(cb)
  //   }
  // }
  var clickAnimation = function () {
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
  return {
    // initializer
    'init': function () {
      var loaded = 0,
          totalImages = options.animations.length;

      for (var i = 0; i < totalImages; i++) {
        var image = new Image();

        // preload images
        image.addEventListener('load', function () {
          loaded++;

          if (loaded === totalImages) {
            appendHTML();
            startAnimation();
          } else {
            // console.log(loaded + '/' + totalImages);
          }
        });

        image.src = options.animations[i].imagesrc;
      }
      console.dir(options);
    }
  };
};


