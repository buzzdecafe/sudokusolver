var R = require('ramda');
var Cell = require('./Cell');
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
  var grid = this;
  
  this.matrix = m;
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
  }, [], m); 
  
};

Grid.rehydrate = function(jsonGrid) {
  var dryGrid = JSON.parse(jsonGrid);
  var g = new Grid([]);
  g.matrix = dryGrid.matrix;
  g.cells = R.map(function(c) { return new Cell(c.x, c.y, c.domain); }, dryGrid.cells);
  return g;
};

Grid.prototype = {
  constructor: Grid,

  getFirstUnboundCell: function() {
    return R.find(R.where({domain: isUnbound}), this.cells);
  },

  getAllUnboundCells: function() {
    return R.filter(R.where({domain: isUnbound}), this.cells);
  },

  getMostConstrainedCells: function() {
    var unbound = this.getAllUnboundCells();
    var minDom = R.minWith(function(a, b) { return a.domain.length - b.domain.length; }, unbound);
    return (minDom && minDom.domain) ? R.filter(function(c) { return c.domain.length === minDom.domain.length; }, unbound) : [];
  },

  getRow: function(y) {
    return R.filter(R.where({y: y}), this.cells);
  },

  getBoundByRow: function(y) {
    return R.filter(R.where({ y: y, domain: isBound }), this.cells);
  },

  getColumn: function(x) {
    return R.filter(R.where({x: x}), this.cells);
  },

  getBoundByColumn: function(x) {
    return R.filter(R.where({ x: x, domain: isBound }), this.cells);
  },

  getBox: function(cell) {
    function inBox(n) {
      return Math.floor(n/3) * 3;
    }

    var boxCoords = {
      x: inBox(cell.x),
      y: inBox(cell.y),
    };

    return R.filter(R.where({
      x: function(x) { return inBox(x) === boxCoords.x; },
      y: function(y) { return inBox(y) === boxCoords.y; }
    }), this.cells);

  },

  getBoundByBox: function(cell) {
    return R.filter(R.where({domain: isBound}), this.getBox(cell));
  },

  getUnboundRelatives: function(cell) {
    return R.filter(function(c) { return c.x !== cell.x && c.isUnbound(); }, this.getRow(cell.y)).concat(
      R.filter(function(c) { return c.y !== cell.y && c.isUnbound(); }, this.getColumn(cell.x))).concat(
      R.filter(function(c) { return c.x !== cell.x && c.y !== cell.y && c.isUnbound(); }, this.getBox(cell)));
  },

  update: function(cell, value) {
    cell.bind(value);
  },

  toMatrix: function() {
    var grid = this;
    return R.map(function(yIndex) {
      return R.map(function(c) { 
        return c.isBound() ? c.domain[0] : 0; 
      }, R.filter(R.where({y: yIndex}), grid.cells).sort(function(a, b) { return a.x - b.x; }));
    }, R.range(0,9));
  },

  isValid: function() {
    
    var grid = this;
    var range = R.range(0,9);

    // assert no empty domains && all bound cells have unique values
    function validCellArray(cells) {
      return R.all(function(c) { return c.isValid(); }, cells) &&
             R.isSet(R.map(function(c) { return R.car(c.domain); }, R.filter(R.where({domain: isBound}), cells)));
    }
    
    // assert all domains are sets
    
    return R.all(validCellArray, R.map(function(n) { return grid.getRow(n); }, range)) &&
           R.all(validCellArray, R.map(function(n) { return grid.getColumn(n); }, range)) &&
           R.all(validCellArray, R.map(function(n) { return grid.getBox({x: Math.floor(n/3) * 3, y: (n % 3) * 3 }); }, range));      
  },

  clone: function() {
    return new Grid(R.map(R.clone, this.matrix));
  }

};


module.exports = Grid;


