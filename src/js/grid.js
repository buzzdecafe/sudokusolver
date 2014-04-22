var R = require('ramda');
var Cell = require('./Cell');
var where = R.where;
var DOMAIN = R.range(1,10);
var SIZE = R.range(0, 9);

// a collection of functions for dealing with an array of variables (cells)
// as though they were a 9x9 grid

function matrixToCells(matrix) {
  var dom = R.clone(DOMAIN);
  return R.foldl.idx(function(acc, row, yIndex) {
    return acc.concat(R.map.idx(function(cell, xIndex) {
      return new Cell(xIndex, yIndex, (cell ? [cell] : dom));
    }, row));
  }, [], matrix);
}

function getRow(cell, cells) {
  return R.filter(where({y: cell.y}), cells);
}

function getRows(cells) {
  return R.map(function(n) { return getRow({y: n}, cells); }, SIZE);
}

function getColumn(cell, cells) {
  return R.filter(where({x: cell.x}), cells);
}

function getColumns(cells) {
  return R.map(function(n) { return getColumn({x: n}, cells); }, SIZE);
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

function getBoxes(cells) {
  return R.map(function(n) { return getBox(toCoords(n), cells); }, SIZE);
}

var cloneCells = R.map(function(c) { return Cell.clone(c); });

function makeCandidate(candidate, cell, value) {
  var nextCandidate = cloneCells(candidate);
  var cellIndex = R.findIndex(where({x: cell.x, y: cell.y}), nextCandidate);
  var affected = R.filter(isUnbound, getRow(cell, nextCandidate).concat(getColumn(cell, nextCandidate)).concat(getBox(cell, nextCandidate)));
  
  // icky side-effects! should be ok, since we have cloned the cells.
  nextCandidate[cellIndex].domain = [value];
  R.each(function(c) {
    var constrainedCell = constrain(c, nextCandidate);
    var idx = R.findIndex(where({x: c.x, y: c.y}), nextCandidate);
    nextCandidate[idx] = constrainedCell;
  }, affected);

  return nextCandidate;
}

// a candidate is an array of cells that may or may not be all bound,
// and may or may not be a satisfying assignment.
function makeNextFn(candidate) {
  var index = 0;
  var cell = getMostConstrainedCell(candidate);

  return function next() {
    var nextCandidate; 
    if (index < cell.domain.length) {
      console.log('binding (' + cell.x + ', ' + cell.y + ') to ' + cell.domain[index]);
      nextCandidate = makeCandidate(candidate, cell, cell.domain[index]);
      if (isValid(nextCandidate)) {
        index++;
        return {
          value: nextCandidate,
          done: false
        };
      }
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

function isNotEmpty(domain) {
  return domain && domain.length > 0;
}

var getUnboundCell = R.find(isUnbound);

var isFullyBound = R.all(isBound);

var getMostConstrainedCell = function(cells) {
  return R.car(R.sort(function(a, b) { 
    return a.domain.length - b.domain.length; 
  }, R.filter(isUnbound, cells)));
}

function mergeDomains(acc, cell) {
  return acc.concat(cell.domain);
}

function noDupes(cells) {
  return isSet(cells): 
}

function isValid(cells) {
  return R.all(where({domain: isNotEmpty})) &&
    R.all(noDupes, R.filter(isBound, getRows(cells))) && 
    R.all(noDupes, R.filter(isBound, getColumns(cells))) && 
    R.all(noDupes, R.filter(isBound, getBoxes(cells)))); 
}

function satisfies(cells) {
  return isFullyBound(cells) && 
    R.difference(DOMAIN, R.foldl(mergeDomains, [], cells)).length === 0; 
}

function toCoords(n) {
  return {
    x: (n % 3) * 3,
    y: Math.floor(n/3)
  };
}

function isSolved(cells) {
  return R.all(satisfies, R.map(function(n) { return getRow({y: n}, cells); }, SIZE)) &&
    R.all(satisfies, R.map(function(n) { return getColumn({x: n}, cells); }, SIZE)) &&
    R.all(satisfies, R.map(function(n) { return getBox(toCoords(n), cells); }, SIZE));
}


function boundValues(fn, cell, cells) {
  return R.foldl(mergeDomains, [], R.filter(isBound, fn(cell, cells)));
}

// remove any bound values from neighbor cells' domains
function constrain(cell, cells) {
  var cell2 = Cell.clone(cell);
  if (isBound(cell)) {
    return cell2;
  }
  var rowBound = boundValues(getRow, cell, cells);
  var colBound = boundValues(getColumn, cell, cells);
  var boxBound = boundValues(getBox, cell, cells);

  cell2.domain = R.difference(cell.domain, rowBound.concat(colBound).concat(boxBound));
  return cell2;
}

// called before descending into the solver...
var constrainAll = R.map.idx(function(c, _, ls) { return constrain(c, ls); });


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

