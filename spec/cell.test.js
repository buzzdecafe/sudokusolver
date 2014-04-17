var Cell = require('../src/js/Cell');

describe("Cell object", function() {
  it("has the expected interface", function() {
    expect(typeof Cell).toBe('function');
  });

  it("constructs objects with x, y, and domain properties", function() {
    var c = new Cell(1, 2, [3,4,5]);
    expect(c.x).toBe(1);
    expect(c.y).toBe(2);
    expect(c.domain).toEqual([3,4,5]);
  });

});

