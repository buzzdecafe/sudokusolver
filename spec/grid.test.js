// test Grid

var Grid = require('../src/js/Grid.js');

describe("Grid ::", function() {
  it("is a function", function() {
    expect(typeof Grid).toBe('function');
  });
  
  it("constructs a Grid object with a matrix property", function() {
    var m = [];
    var g = new Grid(m);
    expect(g instanceof Grid).toBe(true);
    expect(g.matrix).toEqual(m);
  });

  describe("Grid methods ::", function() {

    var grid;

    beforeEach(function() {
      grid = new Grid([
        [7, 8, 0,   0, 0, 3,   9, 0, 2],
        [9, 0, 5,   0, 1, 0,   0, 7, 0],
        [6, 0, 0,   5, 0, 9,   8, 1, 0],

        [0, 7, 0,   0, 0, 0,   2, 0, 0],
        [4, 0, 8,   0, 0, 0,   7, 0, 1],
        [0, 0, 2,   0, 0, 0,   0, 4, 0],
        
        [0, 4, 9,   8, 0, 5,   0, 0, 7],
        [0, 1, 0,   0, 6, 0,   5, 0, 9],
        [8, 0, 6,   1, 0, 0,   0, 2, 4],
      ]);
    });

    describe("findEmptyCell ::", function() {
      it("returns the first empty cell it finds", function() {
        var cell = grid.findEmptyCell();
        expect(cell).toEqual({x: 2, y: 0});
      });
    });  

    describe("constrain ::", function() {
      it("reduces the domain of a given cell", function() {
        expect(grid.constrain({x: 4, y: 4})).toEqual([2,3,5,9]);
        expect(grid.constrain({x: 2, y: 8})).toEqual([3,7]);
        expect(grid.constrain({x: 6, y: 0})).toEqual([4,6]);
      });
    });  

    describe("update ::", function() {
      it("updates given cell with the given value", function() {
        grid.update({x: 4, y: 4}, 7);
        expect(grid.matrix[4][4]).toBe(7);
      });
    });  

    describe("colToArray ::", function() {
      it("returns the array of values for a given column index", function() {
        expect(grid.colToArray(0)).toEqual([7,9,6,0,4,0,0,0,8]);
        expect(grid.colToArray(1)).toEqual([8,0,0,7,0,0,4,1,0]);
        expect(grid.colToArray(2)).toEqual([0,5,0,0,8,2,9,0,6]);
        expect(grid.colToArray(3)).toEqual([0,0,5,0,0,0,8,0,1]);
        expect(grid.colToArray(4)).toEqual([0,1,0,0,0,0,0,6,0]);
        expect(grid.colToArray(5)).toEqual([3,0,9,0,0,0,5,0,0]);
        expect(grid.colToArray(6)).toEqual([9,0,8,2,7,0,0,5,0]);
        expect(grid.colToArray(7)).toEqual([0,7,1,0,0,4,0,0,2]);
        expect(grid.colToArray(8)).toEqual([2,0,0,0,1,0,7,9,4]);
      });
    });  

    describe("getBox ::", function() {
      it("returns the (x,y) coordinates of the given cell's containing box", function() {
        expect(grid.getBox({x: 6, y: 0})).toEqual({x: 6, y: 0});
        expect(grid.getBox({x: 2, y: 2})).toEqual({x: 0, y: 0});
        expect(grid.getBox({x: 4, y: 4})).toEqual({x: 3, y: 3});
        expect(grid.getBox({x: 5, y: 7})).toEqual({x: 3, y: 6});
        expect(grid.getBox({x: 6, y: 3})).toEqual({x: 6, y: 3});
        expect(grid.getBox({x: 1, y: 8})).toEqual({x: 0, y: 6});
      });
    });

    describe("boxToArray ::", function() {
      it("converts the box of a cell to a flat array", function() {
        expect(grid.boxToArray({x:0, y: 0})).toEqual([7,8,0,9,0,5,6,0,0]);
        expect(grid.boxToArray({x:4, y: 1})).toEqual([0,0,3,0,1,0,5,0,9]);
        expect(grid.boxToArray({x:8, y: 2})).toEqual([9,0,2,0,7,0,8,1,0]);
        expect(grid.boxToArray({x:4, y: 3})).toEqual([0,0,0,0,0,0,0,0,0]);
        expect(grid.boxToArray({x:8, y: 4})).toEqual([2,0,0,7,0,1,0,4,0]);
        expect(grid.boxToArray({x:0, y: 5})).toEqual([0,7,0,4,0,8,0,0,2]);
        expect(grid.boxToArray({x:8, y: 6})).toEqual([0,0,7,5,0,9,0,2,4]);
        expect(grid.boxToArray({x:0, y: 7})).toEqual([0,4,9,0,1,0,8,0,6]);
        expect(grid.boxToArray({x:4, y: 8})).toEqual([8,0,5,0,6,0,1,0,0]);
      });
    });

  });

});

