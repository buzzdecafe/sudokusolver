var R = require('ramda');

function makeIterator(nextFn) {
  return function iterator() {
   
    return {
      next: nextFn
    };
  };
}

module.exports = makeIterator;

