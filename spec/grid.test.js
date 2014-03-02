// test Grid
var R = require('ramda');
var Grid = require('../src/js/Grid.js');
var mx = require('./matrices.js');

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
      grid = new Grid(R.map(R.clone, mx.valid));
    });

    describe("findEmptyCell ::", function() {
      it("returns the first empty cell it finds", function() {
        var cell = grid.findEmptyCell();
        expect(cell).toEqual({x: 2, y: 0});
      });
    });  

    describe("getAllEmptyCells ::", function() {
      it("returns an array of coordinates of all the empty cells in the grid", function() {
        var empties = grid.getAllEmptyCells();
        expect(empties).toEqual([
          {x: 2, y: 0}, {x: 3, y: 0}, {x: 4, y: 0}, {x: 7, y: 0},
          {x: 1, y: 1}, {x: 3, y: 1}, {x: 5, y: 1}, {x: 6, y: 1}, {x: 8, y: 1},
          {x: 1, y: 2}, {x: 2, y: 2}, {x: 4, y: 2}, {x: 8, y: 2},
          {x: 0, y: 3}, {x: 2, y: 3}, {x: 3, y: 3}, {x: 4, y: 3}, {x: 5, y: 3}, {x: 7, y: 3}, {x: 8, y: 3},
          {x: 1, y: 4}, {x: 3, y: 4}, {x: 4, y: 4}, {x: 5, y: 4}, {x: 7, y: 4},
          {x: 0, y: 5}, {x: 1, y: 5}, {x: 3, y: 5}, {x: 4, y: 5}, {x: 5, y: 5}, {x: 6, y: 5}, {x: 8, y: 5},
          {x: 0, y: 6}, {x: 4, y: 6}, {x: 6, y: 6}, {x: 7, y: 6}, 
          {x: 0, y: 7}, {x: 2, y: 7}, {x: 3, y: 7}, {x: 5, y: 7}, {x: 7, y: 7},
          {x: 1, y: 8}, {x: 4, y: 8}, {x: 5, y: 8}, {x: 6, y: 8} 
        ]);
      });
    });  

    describe("getCellsByDomain ::", function() {
      it("returns empty cells indexed by the size of their domains", function() {
        expect(grid.getCellsByDomain()).toEqual({ 
          1 : [ { x : 4, y : 0 }, { x : 8, y : 2 }, { x : 5, y : 8 }, { x : 6, y : 8 } ], 
          2 : [ { x : 2, y : 0 }, { x : 3, y : 0 }, { x : 7, y : 0 }, { x : 1, y : 1 }, 
                { x : 8, y : 1 }, { x : 1, y : 2 }, { x : 2, y : 2 }, { x : 2, y : 3 }, 
                { x : 5, y : 4 }, { x : 6, y : 5 }, { x : 0, y : 6 }, { x : 4, y : 6 }, 
                { x : 7, y : 6 }, { x : 0, y : 7 }, { x : 2, y : 7 }, { x : 7, y : 7 }, 
                { x : 1, y : 8 } ], 
          3 : [ { x : 3, y : 1 }, { x : 6, y : 1 }, { x : 4, y : 2 }, { x : 0, y : 3 }, 
                { x : 0, y : 5 }, { x : 6, y : 6 }, { x : 5, y : 7 }, { x : 4, y : 8 } ], 
          4 : [ { x : 5, y : 1 }, { x : 3, y : 3 }, { x : 5, y : 3 }, { x : 8, y : 3 }, 
                { x : 1, y : 4 }, { x : 3, y : 4 }, { x : 4, y : 4 }, { x : 7, y : 4 }, 
                { x : 1, y : 5 }, { x : 3, y : 5 }, { x : 5, y : 5 }, { x : 8, y : 5 }, 
                { x : 3, y : 7 } ], 
          5 : [ { x : 4, y : 3 }, { x : 7, y : 3 }, { x : 4, y : 5 } ] 
        });

        expect(grid.constrain({x: 6, y: 8}).length).toBe(1);
        expect(grid.constrain({x: 1, y: 2}).length).toBe(2);
        expect(grid.constrain({x: 7, y: 7}).length).toBe(2);
        expect(grid.constrain({x: 5, y: 4}).length).toBe(2);
        expect(grid.constrain({x: 6, y: 6}).length).toBe(3);
        expect(grid.constrain({x: 0, y: 5}).length).toBe(3);
        expect(grid.constrain({x: 3, y: 7}).length).toBe(4);
        expect(grid.constrain({x: 8, y: 5}).length).toBe(4);
        expect(grid.constrain({x: 4, y: 3}).length).toBe(5);
      });
    });

    describe("getMostConstrainedCells ::", function() {
      it("returns a list of the cells with the smallest domain", function() {
        expect(grid.getMostConstrainedCells()).toEqual([
          { x: 4, y: 0 }, { x: 8, y: 2 }, { x: 5, y: 8 }, { x: 6, y: 8 } 
        ]);
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

    describe("isValid ::", function() {
      it("detects if a grid has any duplicate values", function() {
        expect(grid.isValid()).toBe(true);
        expect((new Grid(mx.badRow)).isValid()).toBe(false);
        expect((new Grid(mx.badCol)).isValid()).toBe(false);
        expect((new Grid(mx.badBox)).isValid()).toBe(false);
      });
    });

    describe("clone ::", function() {
      it("returns a new Grid with a deep copy (i.e. not a reference) of this.matrix", function() {
        var clone = grid.clone();
        expect(clone.matrix).toEqual(grid.matrix);
        expect(clone.matrix).not.toBe(grid.matrix);

        grid.update({x: 8, y: 1}, 'G');
        expect(clone.matrix[1][8]).not.toEqual(grid.matrix[1][8]);
        
        clone.update({x: 4, y: 4}, 'C');
        expect(clone.matrix[4][4]).not.toEqual(grid.matrix[4][4]);
      });
    });

  });

});

