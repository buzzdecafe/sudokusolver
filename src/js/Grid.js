
var R = require('./ramda.js');

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
    cell.y = R.findIndex(function(r) { return R.contains(EMPTY, r); }, g);
    if (cell.y !== false) {
      cell.x = R.findIndex(function(c) { return c === EMPTY; }, g[cell.y]);
    }
    return (cell.y !== false && cell.x !== false) ? cell : false;
  },

  constrain: function(cell) {
    var rowWise = R.difference(R.range(1,10), this.matrix[cell.y]);
    var colWise = R.difference(rowWise, this.colToArray(cell.x));
    return R.difference(colWise, this.boxToArray(cell));
  },

  update: function(cell, value) {
    this.matrix[cell.y][cell.x] = value;
  },

  colToArray function(x) {
    return R.pluck(x, this.matrix);
  },

  boxToArray function(cell) {
    var boxCol = Math.floor(cell.x/3) * 3;
    var boxRow = Math.floor(cell.y/3) * 3;
    
    return R.reduce(function(acc, row) {  
      return acc.concat(R.map(R.I, row.slice(boxCol, 3)));
    }, [], this.matrix.slice(boxRow, 3));
  }


};

module.exports = Grid;


