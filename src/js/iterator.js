var R = require('ramda');

function makeIterator = function(nextFn) {
  return function iterator() {
   
   return {
     next: nextFn
   };
  };
}

module.exports = makeIterator;

