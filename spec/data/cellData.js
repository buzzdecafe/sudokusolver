// a test 
var R = require('ramda');
var Cell = require('../../src/js/Cell');

var where = R.where;
var domain = R.range(1, 10)
var cells = R.map(function(n) { return new Cell((n % 9), (Math.floor(n/9)), domain); }, R.range(0, 81));

function setDom(x, y, d) {
  R.find(where({x: x, y: y}), cells).domain = d;
}

// bind some cells:
setDom(3, 4, [6]);
setDom(5, 5, [3]);
setDom(2, 6, [9]);
setDom(8, 7, [3]);

// constraine some cells
setDom(0, 1, [3,4,5,8,9]);
setDom(7, 2, [1,3,5,6]);
setDom(6, 3, [3,4,5,8,9]);
setDom(4, 4, [1,2,3]);
setDom(8, 5, [6,7,8,9]);
setDom(5, 6, [4,5,9]);
setDom(3, 7, [3,4,5,8,9]);
setDom(2, 8, [3,6,9]);
setDom(1, 0, [2,4,6,8]);

var boxes = [
  [
    {x:0, y:0}, {x:1, y:0}, {x:2, y:0},
    {x:0, y:1}, {x:1, y:1}, {x:2, y:1},
    {x:0, y:2}, {x:1, y:2}, {x:2, y:2}
  ],
  [
    {x:3, y:0}, {x:4, y:0}, {x:5, y:0},
    {x:3, y:1}, {x:4, y:1}, {x:5, y:1},
    {x:3, y:2}, {x:4, y:2}, {x:5, y:2}
  ],
  [
    {x:6, y:0}, {x:7, y:0}, {x:8, y:0},
    {x:6, y:1}, {x:7, y:1}, {x:8, y:1},
    {x:6, y:2}, {x:7, y:2}, {x:8, y:2}
  ],
  [
    {x:0, y:3}, {x:1, y:3}, {x:2, y:3},
    {x:0, y:4}, {x:1, y:4}, {x:2, y:4},
    {x:0, y:5}, {x:1, y:5}, {x:2, y:5}
  ],
  [
    {x:3, y:3}, {x:4, y:3}, {x:5, y:3},
    {x:3, y:4}, {x:4, y:4}, {x:5, y:4},
    {x:3, y:5}, {x:4, y:5}, {x:5, y:5}
  ],
  [
    {x:6, y:3}, {x:7, y:3}, {x:8, y:3},
    {x:6, y:4}, {x:7, y:4}, {x:8, y:4},
    {x:6, y:5}, {x:7, y:5}, {x:8, y:5}
  ],
  [
    {x:0, y:6}, {x:1, y:6}, {x:2, y:6},
    {x:0, y:7}, {x:1, y:7}, {x:2, y:7},
    {x:0, y:8}, {x:1, y:8}, {x:2, y:8}
  ],
  [
    {x:3, y:6}, {x:4, y:6}, {x:5, y:6},
    {x:3, y:7}, {x:4, y:7}, {x:5, y:7},
    {x:3, y:8}, {x:4, y:8}, {x:5, y:8}
  ],
  [
    {x:6, y:6}, {x:7, y:6}, {x:8, y:6},
    {x:6, y:7}, {x:7, y:7}, {x:8, y:7},
    {x:6, y:8}, {x:7, y:8}, {x:8, y:8}
  ]
];

module.exports = {
  bound: [{x:3, y:4}, {x:5, y:5}, {x:2, y:6}, {x:8, y:7}],
  boxes: boxes,
  cells: cells,
  mostConstrained: [{x:4, y:4}, {x:5, y:6}, {x:2, y:8}]
};


