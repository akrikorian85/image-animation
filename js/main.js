$(function () {
  var options = {
    'width': 813,
    'height': 614,
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
      }, {
        'imagesrc': 'images/2-lines.png',
        'position': {
          x: 385,
          y: 214
        },
        'width': 244,
        'height': 153,
        'animationType': 'reveal',
        'duration': 1000
      }, {
        'imagesrc': 'images/gray-explanation.png',
        'position': {
          x: 170,
          y: 321
        },
        'width': 179,
        'height': 100,
        'animationType': 'fadeIn',
        'duration': 1000
      }, {
        'imagesrc': 'images/orange-explanation.png',
        'position': {
          x: 634,
          y: 150
        },
        'width': 179,
        'height': 100,
        'animationType': 'fadeIn',
        'duration': 1000
      }
    ]
  };

  var a = new Animation('body', options);

  a.init();
});