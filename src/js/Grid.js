var R = require('ramda');
var Cell = require('./Cell.js');
var EMPTY = 0;

function isBound(dom) {
  return dom.length === 1;
}

function isUnbound(dom) {
  return dom.length > 1;
}

function Grid(m) {
  if (!(this instanceof Grid)) {
    return new Grid(m);
  }
  this.cells = this.initCells(m);
};

Grid.prototype = {
  constructor: Grid,

  initCells: function(mtx) {
    var grid = this;
    this.cells = R.foldl.idx(function(acc, row, y) {
      return acc.concat(R.map.idx(function(n, x) {
        var domain;
        if (n === 0) {
          domain = R.range(1,10);
        } else {
          domain = [n];
        }
        return new Cell(x, y, domain);
      }, row));
    }, [], mtx);

//    R.each(function(cell) {
//      cell.domain = grid.constrain(cell); 
//    }, this.getAllUnboundCells());

    return this.cells;
  },

  findUnboundCell: function() {
    return R.find(R.where({domain: isUnbound}), this.cells);
  },

  getAllUnboundCells: function() {
    return R.filter(R.where({domain: isUnbound}), this.cells);
  },

  getMostConstrainedCells: function() {
    var unbound = this.getAllUnboundCells();
    var minDom = R.min(function(a, b) { return a.domain.length > b.domain.length; }, unbound);
    return R.filter(function(c) { return c.domain.length === minDom; }, unbound);
  },

  getRow: function(y) {
    return R.filter(R.where({y: y}), this.cells);
  },

  getBoundByRow: function(y) {
    return R.filter(R.where({
      y: y,
      domain: isBound
    }), this.cells);
  },

  getColumn: function(x) {
    return R.filter(R.where({x: x}), this.cells);
  },

  getBoundByColumn: function(x) {
    return R.filter(R.where({
      x: x,
      domain: isBound
    }), this.cells);
  },

  getBox: function(cell) {
    var boxCoords = {
      x: Math.floor(cell.x / 3) * 3,
      y: Math.floor(cell.y / 3) * 3,
    };

    return R.filter(R.where({
      x: function(x) { return Math.floor(x/3) * 3 === boxCoords.x; },
      y: function(y) { return Math.floor(y/3) * 3 === boxCoords.y; }
    }), this.cells);

  },

  getBoundByBox: function(cell) {
    return R.filter(R.where({domain: isBound}), this.getBox(cell));
  },

  constrain: function(cell) {
    function boundValue(acc, cell) {
      return acc.concat(cell.domain); 
    }
    var rowBound = R.foldl(boundValue, [], this.getBoundByRow(cell.y));
    var colBound = R.foldl(boundValue, [], this.getBoundByColumn(cell.x));
    var boxBound = R.foldl(boundValue, [], this.getBoundByBox(cell.x));

    var rowWise = R.difference(cell.domain, rowBound);
    var colWise = R.difference(rowWise, colBound);
    return R.difference(colWise, boxBound);
  },

  isValid: function() {
    
    function validate(arr) {
      var nums = R.filter(function(n) { return n !== 0; }, arr);
      return R.uniq(nums).length === nums.length;
    }
    
    var rows = this.matrix;
    var cols = R.map(this.colToArray.bind(this), R.range(0, 9));
    var boxes = R.map(this.boxToArray.bind(this), R.foldl(function(acc, val) {
        var cell = {
          x: Math.floor(val/3) * 3,
          y: ((val % 3) * 3)
        };
        return acc.concat(cell);
      }, [], R.range(0, 9)));
    return R.all(validate, rows) && R.all(validate, cols) && R.all(validate, boxes);
  },

  clone: function() {
    return new Grid(R.map(R.clone, this.matrix), !!this.domainBoard);
  }

};


module.exports = Grid;


