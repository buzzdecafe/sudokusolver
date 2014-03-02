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
    if (cell.y !== null) {
      cell.x = R.findIndex(function(c) { return c === EMPTY; }, this.matrix[cell.y]);
    }
    return (cell.y !== null && cell.x !== null) ? cell : false;
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

  getCellsByDomain: function() {
    var grid = this;
    return R.foldl(function(acc, cell) {
      var key = grid.constrain(cell).length;
      acc[key] = acc[key] || [];
      acc[key].push(cell);
      return acc;
    }, {}, this.getAllEmptyCells());
  },

  getMostConstrainedCells: function() {
    var counts = this.getCellsByDomain();
    return counts[Math.min.apply(Math, R.keys(counts))];
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
  },

  isValid: function() {
    
    function validate(arr) {
      var nums = R.filter(function(n) { return n !== 0; }, arr);
      return R.uniq(nums).length === nums.length;
    }
    
    var rows = this.matrix;
    var cols = R.map(this.colToArray.bind(this), R.range(0, 9));
    var boxes = R.map(this.boxToArray.bind(this), R.foldl(function(acc, val) {
        var cell;
        if (val < 3) {
          cell = {x: 0, y: (val * 3)};
        } else if (val < 6) {
          cell = {x: 3, y : ((val % 3) * 3)};
        } else if (val < 9) {
          cell = {x: 6, y : ((val % 3) * 3)};
        }
        return acc.concat(cell);
      }, [], R.range(0, 9)));
    return R.all(validate, rows) && R.all(validate, cols) && R.all(validate, boxes);
  }

};

module.exports = Grid;


