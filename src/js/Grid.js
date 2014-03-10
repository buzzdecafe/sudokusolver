var R = require('ramda');
var EMPTY = 0;

function isBound(dom) {
  return dom.length === 1;
}

function isUnbound(dom) {
  return dom.length > 1;
}

function Grid(m, useDomainBoard) {
  if (!(this instanceof Grid)) {
    return new Grid(m);
  }
  this.vars = this.initVars(m);
};

Grid.prototype = {
  constructor: Grid,

  initVars: function(mtx) {
    return R.foldl.idx(function(acc, row, y) {
      return acc.concat(R.map(function(n) {
        var domain;
        if (n === 0) {
          domain = this.constrain(x, y);
        } else {
          domain = [n];
        }
        return new Cell(x, y, domain);
      }, row));
    }, [], mtx);

  },

  findUnboundCell: function() {
    return R.find(where({domain: isUnbound}), this.vars);
  },

  getAllUnboundCells: function() {
    return R.filter(where({domain: isUnbound}), this.vars);
  },

  getMostConstrainedCells: function() {
    var unbound = this.getAllUnboundCells();
    var minDom = R.min(function(a, b) { return a.domain.length > b.domain.length; }, unbound);
    return R.filter(function(c) { return c.domain.length === minDom; }, unbound);
  },

  getRow: function(y) {
    return R.filter(where({y: y}), this.vars);
  },

  getBoundByRow: function(y) {
    return R.filter(where({
      y: y,
      domain: isBound
    }), this.vars);
  },

  getColumn: function(x) {
    return R.filter(where({x: x}), this.vars);
  },

  getBoundByColumn: function(x) {
    return R.filter(where({
      x: x,
      domain: isBound
    }), this.vars);
  },

  getBox: function(cell) {
    var boxCoords = {
      x: Math.floor(cell.x / 3),
      y: Math.floor(cell.y / 3),
    };

    return R.filter(where({
      x: function(x) { return Math.floor(x/3) === boxCoords.x; },
      y: function(y) { return Math.floor(y/3) === boxCoords.y; }
    }), this.vars);

  },

  getBoundByBox: function(cell) {
    return R.filter(where({domain: isBound}), this.getBox(cell));
  },

  constrain: function(cell) {
    var rowWise = R.difference(R.range(1,10), this.getRow(cell.y));
    var colWise = R.difference(rowWise, this.getColumn(cell.x));
    return R.difference(colWise, this.getBox(cell));
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


