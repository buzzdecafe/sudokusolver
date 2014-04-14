var R = require('ramda');
var iterator = require('./iterator');

function makeSolver(isLeaf, isGoal, makeNextFn) {
  return function solve(candidate, sideEffects) {
    var iter;
    var nextCandidate;
    sideEffects = sideEffects || R.alwaysTrue;

    if (isLeaf(candidate)) {
      return isGoal(candidate) && sideEffects(candidate);
    }

    // the iterator returns a new candidate solution for each value in the 
    // domain of the selected cell.
    iter = makeIterator(makeNextFn(candidate));
    do {
      nextCandidate = iter.next();
      sideEffects(nextCandidate);
      solve(nextCandidate);
    } while(!nextCandidate.done);
    
    return false; 
}

