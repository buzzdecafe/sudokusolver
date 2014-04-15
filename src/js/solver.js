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
    do {
      nextCandidate = iter.next();
      sideEffects(nextCandidate);
      if (solve(nextCandidate)) {
        return true;
      }
    } while(!nextCandidate.done);
    
    return false; 
}

module.exports = makeSolver;

