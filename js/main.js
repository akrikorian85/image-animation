$(function () {
  var options = {
    'width': 813,
    'height': 614,
    'id': 'some-id',
    'animations': [
      new Animation({
        'imagesrc': 'images/chart-bg.jpg',
        'position': {
          x: 0,
          y: 0
        },
        'width': 813,
        'height': 614,
        'duration': 500
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
        'duration': 500
      }),
      new Animation({
        'imagesrc': 'images/gray-explanation.png',
        'position': {
          x: 170,
          y: 321
        },
        'width': 179,
        'height': 100,
        'type': 'fadeIn',
        'duration': 500
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
        'duration': 500,
        'click': true
      }),
      new Animation({
        'imagesrc': 'images/orange-explanation.png',
        'position': {
          x: 634,
          y: 150
        },
        'width': 179,
        'height': 100,
        'type': 'fadeIn',
        'duration': 500
      }),
      new Animation({
        'imagesrc': 'images/2-lines.png',
        'position': {
          x: 385,
          y: 214
        },
        'width': 244,
        'height': 153,
        'type': 'reveal',
        'duration': 500,
        'click': true
      })
    ]
  };

  var a = new AnimationLoader('body', options);

  a.init();
});