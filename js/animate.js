var Animation = function (selector, options) {
  var frames = [];
  var index = 0;

  // generates and appends the HTML
  function appendHTML() {
    var containerEl = document.createElement('DIV');

    $(containerEl).css({
      'position': 'relative',
      'width': options.width,
      'height': options.height
    });

    frames.forEach(function (frame) {
      var div = document.createElement('DIV');

      div.id = frame.id;
      $(div).css(frame.cssProps);
      $(containerEl).append(div);
    });

    $(selector).append(containerEl);
  }

  // helper function to set the id of the divs
  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  // returns an animation function to run depending on the type param
  // the returned function runs an animation and then runs the next frame's animation as a callback
  var getAnimationFunc = function (type, duration) {
    switch (type) {
      case 'fadeIn':
        return function (frame) {
          $('div#' + frame.id).fadeIn(duration, function () {startAnimation(frames[index++])});
        };
      case 'reveal':
        return function (frame) {
          $('div#' + frame.id).show();
          $('div#' + frame.id).animate({'width': frame.initialWidth}, duration, function () {startAnimation(frames[index++])});
        };
      default: return function (frame) {
        $('div#' + frame.id).show(0, function () {startAnimation(frames[index++])});
      }
    }
  }

  var startAnimation = function () {
    if (frames[index]) {
      frames[index].animation(frames[index])
    }
  }

  // returns CSS properties object depending on the animation
  // frameNum is just to set the z-index. Each frame has a higher z-index than
  // the frame preceding it
  var getInitialCssProps = function (frame, frameNum) {
    var props = {
      'background-image': 'url(' + frame.imagesrc + ')',
      'background-size': frame.width + 'px ' + frame.height + 'px',
      'background-repeat': 'no-repeat',
      'position': 'absolute',
      'width': frame.width,
      'height': frame.height,
      'top': frame.position.y,
      'left': frame.position.x,
      'zIndex': frameNum + 1,
      'display': 'none'
    };

    switch (frame.animationType) {
      case 'fadeIn':
        break;
      case 'reveal':
        props['width'] = 0;
        break;
      default:
    }

    return props;
  };

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
          // add options
          frames.push({
            'id': guid(),
            'src': options.frames[loaded].imagesrc,
            'duration': options.frames[loaded].duration,
            'animation': getAnimationFunc(options.frames[loaded].animationType, options.frames[loaded].duration),
            'cssProps': getInitialCssProps(options.frames[loaded], loaded),
            'initialWidth': options.frames[loaded].width
          });

          loaded++;

          if (loaded === totalImages) {
            appendHTML();
            startAnimation();
          } else {
            console.log(loaded + '/' + totalImages);
          }
        });

        image.src = options.frames[i].imagesrc;
      }
    }
  };
};


