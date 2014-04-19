var R = require('ramda');
var Cell = require('./Cell');

// a collection of functions for dealing with an array of variables (cells)
// as though they were a 9x9 grid

function matrixToCells(matrix) {
  var dom = R.range(1, 10);
  return R.foldl.idx(function(acc, row, yIndex) {
    return acc.concat(R.map.idx(function(cell, xIndex) {
      return new Cell(xIndex, yIndex, (cell ? [cell] : dom));
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

var cloneCells = R.map(function(c) { return Cell.clone(c); });

function makeCandidate(candidate, cell, value) {
  var nextCandidate = cloneCells(candidate);
  var cellIndex = R.findIndex(R.where({x: cell.x, y: cell.y}), nextCandidate);
  nextCandidate[cellIndex].domain = [value];
  return nextCandidate;
}

// a candidate is an array of cells that may or may not be all bound,
// and may or may not be a satisfying assignment.
function makeNextFn(candidate) {
  var index = 0;
  var cell = getUnboundCell(candidate);

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

var getMostConstrainedCell = function(cells) {
  return R.car(R.sort(function(a, b) { 
    return a.domain.length - b.domain.length; 
  }, R.filter(isUnbound, cells)));
}

function satisfies(arr) {
  if (!isFullyBound(arr)) {
    return false;
  }
  var bindings = R.foldl(function(acc, c) { return acc.concat(c.domain); }, [], arr);
  return (bindings.length === arr.length) && 
    R.difference(bindings, R.range(1, 10)).length === 0; 
}

function isSolved(cells) {

  function toCoords(n) {
    return {
      x: (n % 3) * 3,
      y: Math.floor(n/3)
    };
  }
  var size = R.range(0, 9);
  var rows = R.map(function(n) { return getRow({y: n}, cells); }, size);
  var cols = R.map(function(n) { return getColumn({x: n}, cells); }, size);
  var boxes = R.map(function(n) { return getBox(toCoords(n), cells); }, size);

  return R.all(satisfies, rows) && R.all(satisfies, cols) && R.all(satisfies, boxes);
}

// remove any bound values from neighbor cells' domains
function constrain(cell, cells) {
  var cell2 = Cell.clone(cell);
  function mergeDomain(acc, cell) {
    return acc.concat(cell.domain);
  }
  if (isBound(cell)) {
    return cell2;
  }
  var rowBound = R.foldl(mergeDomain, [], R.filter(isBound, getRow(cell, cells))); 
  var colBound = R.foldl(mergeDomain, [], R.filter(isBound, getColumn(cell, cells))); 
  var boxBound = R.foldl(mergeDomain, [], R.filter(isBound, getBox(cell, cells))); 

  cell2.domain = R.difference(cell.domain, rowBound.concat(colBound).concat(boxBound));
  return (cell2.domain.length > 0) ? cell2 : null;
}

var constrainAll = R.map.idx(function(c, i, ls) { return constrain(c, ls); });


function forwardCheck(cell, cells) {
  if (!isBound(cell)) {
    return;
  }

  var cell2 = Cell.clone(cell);
  var rowUnbound = R.filter(isUnbound, getRow(cell2, cells)); 
  var colUnbound = R.filter(isUnbound, getColumn(cell2, cells)); 
  var boxUnbound = R.filter(isUnbound, getBox(cell2, cells)); 

  // constrain the unbound neighbors of the newly-bound cell. If any cell
  // becomes bound as a result, recurse on that cell.
}


module.exports = {
  constrain: constrain,
  constrainAll: constrainAll,
  getBox: getBox,
  getColumn: getColumn,
  getMostConstrainedCell: getMostConstrainedCell,
  getRow: getRow,
  getUnboundCell: getUnboundCell,
  isBound: isBound,
  isFullyBound: isFullyBound,
  isUnbound: isUnbound,
  isSolved: isSolved,
  makeCandidate: makeCandidate,
  makeNextFn: makeNextFn,
  matrixToCells: matrixToCells
};

