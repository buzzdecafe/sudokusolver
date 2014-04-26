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
  var affected;
  
  nextCandidate[cellIndex].domain = [value];
  affected = R.filter(Cell.isUnbound, getRow(cell, nextCandidate).concat(getColumn(cell, nextCandidate)).concat(getBox(cell, nextCandidate)));
  
  // icky side-effects! should be ok, since we have cloned the cells.
  R.each(function(c) {
    var constrainedCell = constrain(c, candidate);
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
    if (cell && index < cell.domain.length) {
      console.log('binding (' + cell.x + ', ' + cell.y + ') to ' + cell.domain[index]);
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

var isFullyBound = R.all(Cell.isBound);

var getMostConstrainedCell = function(cells) {
  return R.car(R.sort(function(a, b) { 
    return a.domain.length - b.domain.length; 
  }, R.filter(Cell.isUnbound, cells)));
}

function mergeDomains(acc, cell) {
  return acc.concat(cell.domain);
}

function validate(cellArr) {
  return R.all(where(Cell.isNotEmpty), cellArr) && R.isSet(R.foldl(mergeDomains, [], R.filter(Cell.isBound, cellArr)));
}

function isValid(cells) {

  return R.all(validate, getRows(cells)) &&
    R.all(validate, getColumns(cells)) &&
    R.all(validate, getBoxes(cells));
}

function satisfies(cells) {
  return isFullyBound(cells) && R.difference(DOMAIN, R.foldl(mergeDomains, [], cells)).length === 0; 
}

function toCoords(n) {
  return {
    x: (n % 3) * 3,
    y: Math.floor(n/3)
  };
}

function isSolved(cells) {
  return R.all(satisfies, getRows(cells)) &&
    R.all(satisfies, getColumns(cells)) &&
    R.all(satisfies, getBoxes(cells));
}

function boundValues(fn, cell, cells) {
  return R.foldl(mergeDomains, [], R.filter(Cell.isBound, fn(cell, cells)));
}

// remove any bound values from neighbor cells' domains
function constrain(cell, cells) {
  var cell2 = Cell.clone(cell);
  if (Cell.isBound(cell)) {
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
  if (!Cell.isBound(cell)) {
    return;
  }

  var cell2 = Cell.clone(cell);
  var rowUnbound = R.filter(Cell.isUnbound, getRow(cell2, cells)); 
  var colUnbound = R.filter(Cell.isUnbound, getColumn(cell2, cells)); 
  var boxUnbound = R.filter(Cell.isUnbound, getBox(cell2, cells)); 

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
  isFullyBound: isFullyBound,
  isSolved: isSolved,
  isValid: isValid,
  makeCandidate: makeCandidate,
  makeNextFn: makeNextFn,
  matrixToCells: matrixToCells
};

