var R = require('ramda');
var EMPTY = 0;

function Grid(m) {
  if (!(this instanceof Grid)) {
    return new Grid(m);
  }
  this.matrix = m;
};

Grid.prototype = {
  constructor: Grid,

  findEmptyCell: function() {
    var cell = {};
    cell.y = R.findIndex(function(r) { return R.contains(EMPTY, r); }, this.matrix);
    if (cell.y !== false) {
      cell.x = R.findIndex(function(c) { return c === EMPTY; }, this.matrix[cell.y]);
    }
    return (cell.y !== false && cell.x !== false) ? cell : false;
  },

  getAllEmptyCells: function() {
    return R.foldl.idx(function(acc, row, yIndex) {
      return acc.concat(R.foldl.idx(function(innerAcc, value, xIndex) {
        if (value === 0) {
          innerAcc.push({x: xIndex, y: yIndex});
        }
        return innerAcc; 
      }, [], row));
    }, [], this.matrix);
  },

  constrain: function(cell) {
    var rowWise = R.difference(R.range(1,10), this.matrix[cell.y]);
    var colWise = R.difference(rowWise, this.colToArray(cell.x));
    return R.difference(colWise, this.boxToArray(cell));
  },

  update: function(cell, value) {
    this.matrix[cell.y][cell.x] = value;
  },

  colToArray: function(x) {
    return R.pluck(x, this.matrix);
  },

  getBox: function(cell) {
    return {
      x: Math.floor(cell.x/3) * 3,
      y: Math.floor(cell.y/3) * 3
    };
  },

  boxToArray: function(cell) {
    var box = this.getBox(cell); 
    return R.reduce(function(acc, row) {  
      return acc.concat(R.map(R.I, row.slice(box.x, box.x + 3)));
    }, [], this.matrix.slice(box.y, box.y + 3));
  }

};

module.exports = Grid;


