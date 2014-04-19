var R = require('ramda');

function makeIterator(nextFn) {
  return {
    next: nextFn
  };
}

module.exports = makeIterator;

