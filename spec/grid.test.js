// test Grid
var R = require('ramda');
var g = require('../src/js/grid.js');
var Cell = require('../src/js/Cell.js');
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

  it("hasCorrectInterface", function() {
    expect(typeof g.getBox).toBe('function');
    expect(typeof g.getColumn).toBe('function');
    expect(typeof g.getMostConstrainedCell).toBe('function');
    expect(typeof g.getRow).toBe('function');
    expect(typeof g.getUnboundCell).toBe('function');
    expect(typeof g.isBound).toBe('function');
    expect(typeof g.isFullyBound).toBe('function');
    expect(typeof g.isUnbound).toBe('function');
    expect(typeof g.isSolved).toBe('function');
    expect(typeof g.makeCandidate).toBe('function');
    expect(typeof g.makeNextFn).toBe('function');
    expect(typeof g.matrixToCells).toBe('function');
  });
  
  describe("getBox ::", function() {
    it("returns an array of cells in the box of the given cell", function() {
      expect(g.getBox(cellAt(0,0), cells)).toEqual(box[0]);
      expect(g.getBox(cellAt(5,1), cells)).toEqual(box[1]);
      expect(g.getBox(cellAt(7,2), cells)).toEqual(box[2]);
      expect(g.getBox(cellAt(8,3), cells)).toEqual(box[5]);
      expect(g.getBox(cellAt(1,4), cells)).toEqual(box[3]);
      expect(g.getBox(cellAt(3,5), cells)).toEqual(box[4]);
      expect(g.getBox(cellAt(4,6), cells)).toEqual(box[7]);
      expect(g.getBox(cellAt(6,7), cells)).toEqual(box[8]);
      expect(g.getBox(cellAt(2,8), cells)).toEqual(box[6]);
    });
  });

  describe("getColumn ::", function() {
    it("returns all of the cells with the same `x` coordinate", function() {
      expect(g.getColumn(cells[8], cells)).toEqual([cells[8],  cells[17], cells[26],
                                                    cells[35], cells[44], cells[53],
                                                    cells[62], cells[71], cells[80]]);
      expect(g.getColumn(cells[16], cells)).toEqual([cells[7],  cells[16], cells[25],
                                                     cells[34], cells[43], cells[52],
                                                     cells[61], cells[70], cells[79]]);
      expect(g.getColumn(cells[24], cells)).toEqual([cells[6],  cells[15], cells[24],
                                                     cells[33], cells[42], cells[51],
                                                     cells[60], cells[69], cells[78]]);
      expect(g.getColumn(cells[32], cells)).toEqual([cells[5],  cells[14], cells[23],
                                                     cells[32], cells[41], cells[50],
                                                     cells[59], cells[68], cells[77]]);
      expect(g.getColumn(cells[40], cells)).toEqual([cells[4],  cells[13], cells[22],
                                                     cells[31], cells[40], cells[49],
                                                     cells[58], cells[67], cells[76]]);
      expect(g.getColumn(cells[48], cells)).toEqual([cells[3],  cells[12], cells[21],
                                                     cells[30], cells[39], cells[48],
                                                     cells[57], cells[66], cells[75]]);
      expect(g.getColumn(cells[56], cells)).toEqual([cells[2],  cells[11], cells[20],
                                                     cells[29], cells[38], cells[47],
                                                     cells[56], cells[65], cells[74]]);
      expect(g.getColumn(cells[64], cells)).toEqual([cells[1],  cells[10], cells[19],
                                                     cells[28], cells[37], cells[46],
                                                     cells[55], cells[64], cells[73]]);
      expect(g.getColumn(cells[72], cells)).toEqual([cells[0],  cells[9],  cells[18],
                                                     cells[27], cells[36], cells[45],
                                                     cells[54], cells[63], cells[72]]);
    });
  });

  describe("getRow ::", function() {
    it("returns all of the cells with the same `y` coordinate", function() {
      function cellRow(n) { return cells[n]; }
      expect(g.getRow(cells[2],  cells)).toEqual(R.map(cellRow, R.range(0,9)));
      expect(g.getRow(cells[10], cells)).toEqual(R.map(cellRow, R.range(9,18)));
      expect(g.getRow(cells[18], cells)).toEqual(R.map(cellRow, R.range(18,27)));

      expect(g.getRow(cells[32], cells)).toEqual(R.map(cellRow, R.range(27,36)));
      expect(g.getRow(cells[40], cells)).toEqual(R.map(cellRow, R.range(36,45)));
      expect(g.getRow(cells[48], cells)).toEqual(R.map(cellRow, R.range(45,54)));

      expect(g.getRow(cells[62], cells)).toEqual(R.map(cellRow, R.range(54,63)));
      expect(g.getRow(cells[70], cells)).toEqual(R.map(cellRow, R.range(63,72)));
      expect(g.getRow(cells[78], cells)).toEqual(R.map(cellRow, R.range(72,81)));
    });
  });

  describe("getMostConstrainedCell ::", function() {
    it("returns a cell with the smallest domain > 1", function() {
      expect(g.getMostConstrainedCell(cells)).toEqual({x:4, y:4, domain:[1,2,3]});
    });
  });

  describe("getUnboundCell ::", function() {
    it("returns a cell with domain > 1", function() {
      expect(g.getUnboundCell(cells)).toEqual({x:0, y:0, domain:[1,2,3,4,5,6,7,8,9]});
    });
  });

  describe("isBound ::", function() {
    it("returns true if a cell has one value in its domain", function() {
      expect(g.isBound({domain: [4]})).toBe(true);
      expect(g.isBound({domain: [1,2,3,4]})).toBe(false);
      expect(g.isBound({domain: []})).toBe(false);
    });
  });

  describe("isUnbound ::", function() {
    it("returns true if a cell has more than one value in its domain", function() {
      expect(g.isUnbound({domain: [4]})).toBe(false);
      expect(g.isUnbound({domain: [1,2,3,4]})).toBe(true);
      expect(g.isUnbound({domain: []})).toBe(false);
    });
  });

  describe("isFullyBound ::", function() {
    it("returns true if all cells have domain.length === 1", function() {
      expect(g.isFullyBound(cells)).toBe(false);
      expect(g.isFullyBound([{domain: [3]}, {domain: [7]}, {domain: [9]}, {domain: [0]}])).toBe(true);
      expect(g.isFullyBound([{domain: [3]}, {domain: [7]}, {domain: [9]}, {domain: [0,1]}])).toBe(false);
    });
  });

  
  describe("isSolved ::", function() {
    it("tests if a cells array is a satisfying assignment", function() {
      var solvedGrid = g.matrixToCells(mx.solved);
      var validUnsolved = g.matrixToCells(mx.valid);
      var invalidUnsolved = g.matrixToCells(mx.badRow);
      expect(g.isFullyBound(solvedGrid)).toBe(true);
      expect(g.isSolved(solvedGrid)).toBe(true); 
      expect(g.isSolved(validUnsolved)).toBe(false); 
      expect(g.isSolved(invalidUnsolved)).toBe(false); 
    });
  });

  describe("makeCandidate ::", function() {
    it("clones the input cells array and binds the specified cell to the specified value", function() {
      var testIdx = 10;
      var candidate = g.makeCandidate(cells, cells[testIdx], 8);
      expect(candidate[testIdx].domain).toEqual([8]);
      expect(candidate).not.toBe(cells);
    });

    it("constrains the domains of neighbors of the newly bound cell", function() {
      
    });

  });

  describe("makeNextFn ::", function() {
    it("returns the `next` function to use when iterating over a cell's domain generating candidates", function() {
      var nextFn = g.makeNextFn(cells);
      expect(typeof nextFn).toBe('function');
      expect(typeof nextFn()).toBe('object');

    });
  });

  describe("matrxiToCells ::", function() {
    var matrix = mx.valid;
    var cs = g.matrixToCells(matrix);

    it("converts a 2D numeric grid to a flat array of Cell objects", function() {
      function isCell(obj) { return obj instanceof Cell; }
      expect(cs instanceof Array).toBe(true);
      expect(cs.length).toBe(81);
      expect(R.all(isCell, cs)).toBe(true);
    });

    it("binds any cells that have non-zero values in the matrix", function() {
      var boundIndices = R.foldl.idx(function(acc, c, idx) { return g.isBound(c) ? acc.concat(idx) : acc; }, [], cs);
      var unboundIndices = R.difference(R.range(0,81), boundIndices); 
      expect(R.all(function(i) { return g.isBound(cs[i]); }, boundIndices));
      expect(R.all(function(i) { return !g.isBound(cs[i]); }, unboundIndices));
    });
  });

  describe("constrain ::", function() {
    it("reduces the domain of a given cell by eliminating bound values in its neighbors", function() {
      var cell = g.constrain(cells[30], cells);
      expect(cell).not.toBe(cells[30]);
      expect(cells[30].domain).toEqual([1,2,3,4,5,6,7,8,9]);
      expect(cell.domain).toEqual([1,2,4,5,7,8,9]);
    });
  });

  describe("constrainAll ::", function() {
    it("constrains the domains of all cells", function() {
      
    });
  });

});


