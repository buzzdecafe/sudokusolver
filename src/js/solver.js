var R = require('ramda');
var makeIterator = require('./iterator');

function makeSolver(isLeaf, isGoal, makeNextFn) {
  return function solve(candidate, sideEffects) {
    var iter;
    var nextCandidate;
    sideEffects = sideEffects || R.alwaysTrue;

    if (isLeaf(candidate)) {
      return isGoal(candidate) && (sideEffects(candidate) || true);
    }

    // the iterator returns a new candidate solution for each value in the 
    // domain of the selected cell.
    iter = makeIterator(makeNextFn(candidate));
    nextCandidate = iter.next().value;
    while (nextCandidate) {
      sideEffects(nextCandidate);
      if (solve(nextCandidate, sideEffects)) {
        return true;
      }
      nextCandidate = iter.next().value;
    }
    
    return false; 
  };
}

module.exports = makeSolver;

