var R = require('ramda');

// a collection of functions for dealing with an array of variables (cells)
// as though they were a 9x9 grid

function matrixToCells(matrix) {
  var dom = R.range(0, 9);
  return R.foldl.idx(function(acc, row, yIndex) {
    return acc.concat(R.map.idx(function(cell, xIndex) {
      return { x: xIndex, y: yIndex, domain: (cell ? [cell] : dom) };
    }, row));
  }, [], matrix);
}

function getRow(cell, cells) {
  return R.filter(function(c) { return c.y === cell.y; }, cells);
}

function getColumn(cell, cells) {
  return R.filter(function(c) { return c.x === cell.x; }, cells);
}

function getBox(cell, cells) {
  var boxXY = {
    x: Math.floor(cell.x/3) * 3,
    y: Math.floor(cell.y/3) * 3
  };

  return R.filter(function(c) {
    return Math.floor(c.x/3) * 3 === boxXY.x && Math.floor(c.y/3) * 3 === boxXY.y; 
  }, cells);
}

function cloneCells(cells) {
  return map(function(c) {
    return { x: c.x, y: c.y, domain: R.clone(c.domain) };
  }, cells);
}

function makeCandidate(candidate, cell, value) {
  var nextCandidate = cloneCells(cells);
  var cellIndex = R.findIndex(R.where({x: cell.x, y: cell.y}), nextCandidate);
  nextCandidate[cellIndex].domain = [value];
  return nextCandidate;
}

// a candidate is an array of cells that may or may not be all bound,
// and may or may not be a satisfying assignment.
function makeNextFn(candidate) {
  var index = 0;
  var cell = getNextUnboundCell(candidate);

  return function next() {
    var nextCandidate; 
    if (index < cell.domain.length) {
      nextCandidate = makeCandidate(candidate, cell, cell.domain[index]);
      index++;
      return {
        value: nextCandidate,
        done: false
      };
    }
    return { done: true };
  };

}

function isBound(cell) {
  return cell.domain.length === 1;
}

function isUnbound(cell) {
  return cell.domain.length > 1;
}

var getUnboundCell = R.find(isUnbound);

var isFullyBound = R.all(isBound);


var getMostConstrainedCell = R.find(R.sort(function(a, b) {
  return a.domain.length - b.domain.length;
}));


function isValid() {
    
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
}


module.exports = {
  getBox: getBox,
  getColumn: getColumn,
  getMostConstrainedCell: getMostConstrainedCell,
  getRow: getRow,
  getUnboundCell: getUnboundCell,
  isBound: isBound,
  isFullyBound: isFullyBound,
  isUnbound: isUnbound,
  isValid: isValid,
  makeCandidate: makeCandidate,
  makeNextFn: makeNextFn,
  matrixToCells: matrixToCells
};

