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

  it("can create a new cell statically from an existing cell", function() {
    var cell1 = new Cell(1, 2, [3,4,5]);
    var cell2 = Cell.clone(cell1);
    expect(cell2 instanceof Cell).toBe(true);
    expect(cell2).not.toBe(cell1);
    expect(cell1.x).toEqual(cell2.x);
    expect(cell1.y).toEqual(cell2.y);
    expect(cell1.domain).toEqual(cell2.domain);
    expect(cell1.domain).not.toBe(cell2.domain);
  });
});

