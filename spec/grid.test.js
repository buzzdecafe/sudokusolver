// test Grid
var R = require('ramda');
var g = require('../src/js/grid.js');
var mx = require('./data/matrices.js');
var cellData = require('./data/cellData');

var cells = cellData.cells;
var box = cellData.boxes;
var find = R.find;
var where = R.where;
var pick = R.pick;

function cellAt(x, y) {
  return find(where({x:x, y:y}), cells);
}

describe("grid functions ::", function() {

  beforeEach(function() {
    this.addMatchers({
      toHaveTheSameCoordsAs: function(expected) {
        var actual = this.actual;
        console.log({a: actual, e: expected});
        return R.filter.idx(function(c, idx) { return c.x === actual[idx].x && c.y === actual[idx].y; }, expected).length === actual.length;
      }
    });
  });

  it("hasCorrectInterface", function() {
    expect(typeof g.getBox).toBe('function');
    expect(typeof g.getColumn).toBe('function');
    expect(typeof g.getMostConstrainedCell).toBe('function');
    expect(typeof g.getRow).toBe('function');
    expect(typeof g.getUnboundCell).toBe('function');
    expect(typeof g.isBound).toBe('function');
    expect(typeof g.isFullyBound).toBe('function');
    expect(typeof g.isUnbound).toBe('function');
    expect(typeof g.isValid).toBe('function');
    expect(typeof g.makeCandidate).toBe('function');
    expect(typeof g.makeNextFn).toBe('function');
    expect(typeof g.matrixToCells).toBe('function');
  });
  
  describe("getBox ::", function() {
    it("returns an array of cells in the box of the given cell", function() {
      expect(g.getBox(cellAt(0,0), cells)).toHaveTheSameCoordsAs(box[0]);
      expect(g.getBox(cellAt(5,1), cells)).toHaveTheSameCoordsAs(box[1]);
      expect(g.getBox(cellAt(7,2), cells)).toHaveTheSameCoordsAs(box[2]);
      expect(g.getBox(cellAt(8,3), cells)).toHaveTheSameCoordsAs(box[3]);
      expect(g.getBox(cellAt(1,4), cells)).toHaveTheSameCoordsAs(box[4]);
      expect(g.getBox(cellAt(3,5), cells)).toHaveTheSameCoordsAs(box[5]);
      expect(g.getBox(cellAt(4,6), cells)).toHaveTheSameCoordsAs(box[6]);
      expect(g.getBox(cellAt(6,7), cells)).toHaveTheSameCoordsAs(box[7]);
      expect(g.getBox(cellAt(2,8), cells)).toHaveTheSameCoordsAs(box[8]);
    });
  });


});


