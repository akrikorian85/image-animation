# Animated image JS library
## Example
    $(function () {
      var options = {
        'width': 813,
        'height': 614,
        'id': 'some-id',
        'frames': [
          {
            'imagesrc': 'images/chart-bg.jpg',
            'position': {
              x: 0,
              y: 0
            },
            'width': 813,
            'height': 614,
            'animationType': 'none',
            'duration': 1000
          }, {
            'imagesrc': 'images/gray-line-1.png',
            'position': {
              x: 164,
              y: 94
            },
            'width': 221,
            'height': 212,
            'animationType': 'reveal',
            'duration': 1000
          }, {
            'imagesrc': 'images/orange-line-1.png',
            'position': {
              x: 164,
              y: 90
            },
            'width': 221,
            'height': 125,
            'animationType': 'reveal',
            'duration': 1000
          }
        ]
      };

      var a = new Animation(options);

      a.init();
    });
## How to use

Pass a CSS selector and an object to the function.

The animation's container will be appended inside the selected element.

The object should have `width`, `height`, and `frames` and optional `id` properties. Width and height should be set to the desired width and height of the container of images.

The `frames` property should be an array of objects. Each frame in the frames array is an object with it's own properties and is treated as one animated part of the of the whole animation. Frames are used in the order they are set in the array. `frames[i]` starts and then finishes it's animation, then `frames[i+1]` animation is called and finished, all the way up to ...`frames[n]`.

Each frame's properties should be set:
  `width`, `height`, `animationType`, `duration`, `position` and `imagesrc`

### Some notes:

  `animationType` can be set to `reveal`, `fadeIn`, or `none`.
  `imagesrc` is the source path to the image. This should be the path from the HTML file that this library is being used on.
  `position` is an object that has an `x` and `y` property. This is to set the absolute positioning within the containing element.
  Retina images can be used. Just cut the image at double the desired width and height.

### Dependencies

jQuery 1.0+

### Changelog

1.0.1 - 10-09-2017
#### Added
- set an id on the container element for styling

## To Do
