# Animated image JS library
## Example
    $(function () {
      var options = {
        'width': 813,
        'height': 614,
        'id': 'some-id',
        'click': true,
        'animations': [
          new Animation({
            'imagesrc': 'images/chart-bg.jpg',
            'position': {
              x: 0,
              y: 0
            },
            'width': 813,
            'height': 614,
            'duration': 1000
          }),
          new Animation({
            'imagesrc': 'images/gray-line-1.png',
            'position': {
              x: 164,
              y: 94
            },
            'width': 221,
            'height': 212,
            'type': 'reveal',
            'duration': 1000
          }),
          new Animation({
            'imagesrc': 'images/orange-line-1.png',
            'position': {
              x: 164,
              y: 90
            },
            'width': 221,
            'height': 125,
            'type': 'reveal',
            'duration': 1000
          })
        ]
      };

      var a = new AnimationLoader('body', options);

      a.init();
    });
## How to use

Pass a CSS selector and an object to the function.

The animation's container will be appended inside the selected element.

The object should have `width`, `height`, and `animations` and optional `id` properties. Width and height should be set to the desired width and height of the container of images. You can also have each animation trigger on click/tap by setting the `click` property to `true`.

The `animations` property should be an array of `Animation` objects. Each item in the animations array should be passed an object with its own properties. The animations play in the order they are set in the array. Once `animations[i]` finishes it's animation, `animations[i+1]` is called, all the way up to ...`animations[n]`.

Each Animation object to be passed an object with properties:
  `width`, `height`, `type`, `duration`, `position` and `imagesrc`

### Some notes:

  `type` can be set to `reveal` or `fadeIn`. If the type is not set, the image will show from a hidden state when it is its turn in the queue.
  `imagesrc` is the source path to the image. This should be the path from the HTML file that this library is being used on.
  `position` is an object that has an `x` and `y` property. This is to set the absolute positioning within the containing element.
  Retina images can be used. Just cut the image at double the desired width and height.
  `duration` is the length in time in milliseconds for the animation to complete.

### Dependencies

jQuery 1.0+

### Changelog

1.0.2 - 10-16-2017
#### Added
- made more appropriate variable names
- added click feature to have the images animate on click

1.0.1 - 10-09-2017
#### Added
- set an id on the container element for styling

## To Do
