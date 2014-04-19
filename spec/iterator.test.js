var makeIter = require('../src/js/iterator');

describe("iterator", function() {
  it("takes a `next` function and returns an iterator function", function() {
    var fibIterator = makeIter((function() { 
      var seed = [0,1]; 
      return function next() { 
        seed = [seed[1], seed[0] + seed[1]];
        return {value: seed[1], done: false};
      };
    }()));

    expect(typeof fibIterator).toBe('object');
    expect(fibIterator.next()).toEqual({value: 1, done: false});
    expect(fibIterator.next()).toEqual({value: 2, done: false});
    expect(fibIterator.next()).toEqual({value: 3, done: false});
    expect(fibIterator.next()).toEqual({value: 5, done: false});
    expect(fibIterator.next()).toEqual({value: 8, done: false});
  });


});

