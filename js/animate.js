var Frame = function (options) {
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
    switch (options.animationType) {
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

      switch (options.animationType) {
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
    'animation': setAnimationFunc()
  };
}

var Animation = function (selector, options) {
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

    options.frames.forEach(function (frame, index) {
      var div = document.createElement('DIV');

      div.id = frame.getId();
      $(div).css(frame.getCssProps(index));
      $(containerEl).append(div);
    });

    $(selector).append(containerEl);
  }

  var startAnimation = function () {
    if (!options.frames[index]) {
      return;
    }
    options.frames[index].animation(function () {
      startAnimation(options.frames[index++]);
    });
  }
  var clickAnimation = function () {
    var busy = false;

    $('#' + options.id).on('click', function (e) {
      e.preventDefault();

      if (busy) {
        return;
      }

      if (options.frames[index]) {
        console.log(index);
        busy = true;
        options.frames[index].animation(function () {
          index++;
          busy = false;
        });
      }
    });
  }
  return {
    // initializer
    // loads the image first, then pushes the frame to the frames array
    'init': function () {
      var loaded = 0,
          totalImages = options.frames.length;

      for (var i = 0; i < totalImages; i++) {
        var image = new Image();

        // preload images
        image.addEventListener('load', function () {
          loaded++;

          if (loaded === totalImages) {
            appendHTML();
            if (options.click) {
              clickAnimation();
            } else {
              startAnimation();
            }
          } else {
            console.log(loaded + '/' + totalImages);
          }
        });

        image.src = options.frames[i].imagesrc;
      }
    }
  };
};


