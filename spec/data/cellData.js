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

// constrain some cells
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
    cells[0], cells[1], cells[2],
    cells[9], cells[10], cells[11],
    cells[18], cells[19], cells[20]
  ],
  [
    cells[3], cells[4], cells[5],
    cells[12], cells[13], cells[14],
    cells[21], cells[22], cells[23]
  ],
  [
    cells[6], cells[7], cells[8],
    cells[15], cells[16], cells[17],
    cells[24], cells[25], cells[26]
  ],
  [
    cells[27], cells[28], cells[29],
    cells[36], cells[37], cells[38],
    cells[45], cells[46], cells[47]
  ],
  [
    cells[30], cells[31], cells[32],
    cells[39], cells[40], cells[41],
    cells[48], cells[49], cells[50]
  ],
  [
    cells[33], cells[34], cells[35],
    cells[42], cells[43], cells[44],
    cells[51], cells[52], cells[53]
  ],
  [
    cells[54], cells[55], cells[56],
    cells[63], cells[64], cells[65],
    cells[72], cells[73], cells[74]
  ],
  [
    cells[57], cells[58], cells[59],
    cells[66], cells[67], cells[68],
    cells[75], cells[76], cells[77]
  ],
  [
    cells[60], cells[61], cells[62],
    cells[69], cells[70], cells[71],
    cells[78], cells[79], cells[80]
  ]
];

module.exports = {
  bound: [{x:3, y:4}, {x:5, y:5}, {x:2, y:6}, {x:8, y:7}],
  boxes: boxes,
  cells: cells,
  mostConstrained: [{x:4, y:4}, {x:5, y:6}, {x:2, y:8}]
};


