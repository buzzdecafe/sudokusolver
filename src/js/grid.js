var R = require('ramda');

// a collection of functions for dealing with an array of variables (cells)
// as though they were a 9x9 grid

function matrixToCells(matrix) {
  var cells = [];
  return cells;
}

function getNextUnboundCell(cells) {
  var cell;
  return cell;
}


function makeCandidate(candidate, cell, value) {
  
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

var getFirstUnboundCell = R.find(isUnbound);

var isFullyBound = R.all(isBound);

var getMostConstrainedCell = R.find();


 var isValid: function() {
    
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


module.exports = {

};

