// test Grid
var R = require('ramda');
var Grid = require('../src/js/Grid');
var mx = require('./matrices');

describe("Grid ::", function() {
  it("is a function", function() {
    expect(typeof Grid).toBe('function');
  });
  
  it("constructs a Grid object with a `cells` property", function() {
    var g = new Grid(mx.valid);
    expect(g instanceof Grid).toBe(true);
    expect(g.cells instanceof Array).toBe(true);
    expect(g.cells.length).toBe(81);
  });

  describe("Grid methods ::", function() {

    var grid;

    var validZeros = R.foldl(function(acc, r) { 
        return acc + R.foldl(function(innerAcc, v) { 
            return v === 0 ? innerAcc + 1 : innerAcc; 
        }, 0, r);         
    }, 0, mx.valid);
    
    beforeEach(function() {
      grid = new Grid(R.map(R.clone, mx.valid));
    });
    
    describe('test input ::', function() {
        expect(validZeros).toBe(45);
    });

    describe('getRow :: ', function() {
      it('returns all cells with y coordinate that match the argument', function() {
        function toNums(c) { return c.domain.length === 1 ? c.domain[0] : 0; }
        expect(R.map(toNums, grid.getRow(0))).toEqual([7, 8, 0, 0, 4, 3, 9, 0, 2]);
        expect(R.map(toNums, grid.getRow(1))).toEqual([9, 0, 5, 0, 1, 0, 0, 7, 0]);
        expect(R.map(toNums, grid.getRow(2))).toEqual([6, 0, 0, 5, 0, 9, 8, 1, 3]);
        expect(R.map(toNums, grid.getRow(3))).toEqual([0, 7, 0, 0, 0, 0, 2, 0, 0]);
        expect(R.map(toNums, grid.getRow(4))).toEqual([4, 0, 8, 0, 0, 0, 7, 0, 1]);
        expect(R.map(toNums, grid.getRow(5))).toEqual([0, 0, 2, 0, 0, 0, 0, 4, 0]);
        expect(R.map(toNums, grid.getRow(6))).toEqual([0, 4, 9, 8, 0, 5, 0, 0, 7]);
        expect(R.map(toNums, grid.getRow(7))).toEqual([0, 1, 0, 0, 6, 0, 5, 0, 9]);
        expect(R.map(toNums, grid.getRow(8))).toEqual([8, 0, 6, 1, 0, 7, 3, 2, 4]);
      });
    });

    describe("getAllUnboundCells ::", function() {
      it("returns an array of coordinates of all the empty cells in the grid", function() {
        var empties = grid.getAllUnboundCells();
        expect(empties.length).toBe(41);
        
        expect(R.map(R.pick(['x', 'y']), empties)).toEqual([
          {x: 2, y: 0}, {x: 3, y: 0}, {x: 7, y: 0},
          {x: 1, y: 1}, {x: 3, y: 1}, {x: 5, y: 1}, {x: 6, y: 1}, {x: 8, y: 1},
          {x: 1, y: 2}, {x: 2, y: 2}, {x: 4, y: 2}, 
          {x: 0, y: 3}, {x: 2, y: 3}, {x: 3, y: 3}, {x: 4, y: 3}, {x: 5, y: 3}, {x: 7, y: 3}, {x: 8, y: 3},
          {x: 1, y: 4}, {x: 3, y: 4}, {x: 4, y: 4}, {x: 5, y: 4}, {x: 7, y: 4},
          {x: 0, y: 5}, {x: 1, y: 5}, {x: 3, y: 5}, {x: 4, y: 5}, {x: 5, y: 5}, {x: 6, y: 5}, {x: 8, y: 5},
          {x: 0, y: 6}, {x: 4, y: 6}, {x: 6, y: 6}, {x: 7, y: 6}, 
          {x: 0, y: 7}, {x: 2, y: 7}, {x: 3, y: 7}, {x: 5, y: 7}, {x: 7, y: 7},
          {x: 1, y: 8}, {x: 4, y: 8} 
        ]);

      });
    });  

    describe("getFirstUnboundCell ::", function() {
      it("returns the first empty cell it finds", function() {
        var cell = grid.getFirstUnboundCell();
        expect(cell.x).toEqual(2);
        expect(cell.y).toEqual(0);
        expect(cell.domain.length > 1).toBe(true);
      });
    });  
  
    describe("getMostConstrainedCells ::", function() {
      it("returns a list of the cells with the smallest domain of length > 1", function() {
        var constrained = grid.getMostConstrainedCells();
        expect(R.all(function(c) { return c.domain.length == 2; }, constrained)).toBe(true);
        expect(constrained.length).toBe(19);
        expect(JSON.stringify(constrained)).toEqual(JSON.stringify([
          {"x":2,"y":0,"domain":[1,4]},{"x":3,"y":0,"domain":[4,6]},{"x":7,"y":0,"domain":[5,6]},
          {"x":1,"y":1,"domain":[2,3]},{"x":3,"y":1,"domain":[2,6]},{"x":8,"y":1,"domain":[3,6]},
          {"x":1,"y":2,"domain":[2,3]},{"x":2,"y":2,"domain":[3,4]},{"x":4,"y":2,"domain":[2,7]},
          {"x":2,"y":3,"domain":[1,3]},
          {"x":5,"y":4,"domain":[2,6]},
          {"x":6,"y":5,"domain":[3,6]},
          {"x":0,"y":6,"domain":[2,3]},{"x":4,"y":6,"domain":[2,3]},{"x":7,"y":6,"domain":[3,6]},
          {"x":0,"y":7,"domain":[2,3]},{"x":2,"y":7,"domain":[3,7]},{"x":7,"y":7,"domain":[3,8]},
          {"x":1,"y":8,"domain":[3,5]}
        ]));
      });
    });

    describe("getColumn ::", function() {
      it("returns the array of values for a given column index", function() {
        expect(JSON.stringify(grid.getColumn(0))).toEqual(JSON.stringify([{"x":0,"y":0,"domain":[7]},{"x":0,"y":1,"domain":[9]},
          {"x":0,"y":2,"domain":[6]},{"x":0,"y":3,"domain":[1,3,5]},{"x":0,"y":4,"domain":[4]},{"x":0,"y":5,"domain":[1,3,5]},
          {"x":0,"y":6,"domain":[2,3]},{"x":0,"y":7,"domain":[2,3]},{"x":0,"y":8,"domain":[8]}]));

        expect(JSON.stringify(grid.getColumn(1))).toEqual(JSON.stringify([{"x":1,"y":0,"domain":[8]},{"x":1,"y":1,"domain":[2,3]},
          {"x":1,"y":2,"domain":[2,3]},{"x":1,"y":3,"domain":[7]},{"x":1,"y":4,"domain":[3,5,6,9]},{"x":1,"y":5,"domain":[3,5,6,9]},
          {"x":1,"y":6,"domain":[4]},{"x":1,"y":7,"domain":[1]},{"x":1,"y":8,"domain":[3,5]}]));
        
        expect(JSON.stringify(grid.getColumn(2))).toEqual(JSON.stringify([{"x":2,"y":0,"domain":[1,4]},{"x":2,"y":1,"domain":[5]},
          {"x":2,"y":2,"domain":[3,4]},{"x":2,"y":3,"domain":[1,3]},{"x":2,"y":4,"domain":[8]},{"x":2,"y":5,"domain":[2]},
          {"x":2,"y":6,"domain":[9]},{"x":2,"y":7,"domain":[3,7]},{"x":2,"y":8,"domain":[6]}]));
        
        expect(JSON.stringify(grid.getColumn(3))).toEqual(JSON.stringify([{"x":3,"y":0,"domain":[4,6]},{"x":3,"y":1,"domain":[2,6]},
          {"x":3,"y":2,"domain":[5]},{"x":3,"y":3,"domain":[3,4,6,9]},{"x":3,"y":4,"domain":[2,3,6,9]},{"x":3,"y":5,"domain":[3,6,7,9]},
          {"x":3,"y":6,"domain":[8]},{"x":3,"y":7,"domain":[2,3,4,7]},{"x":3,"y":8,"domain":[1]}]));
        
        expect(JSON.stringify(grid.getColumn(4))).toEqual(JSON.stringify([{"x":4,"y":0,"domain":[4]},{"x":4,"y":1,"domain":[1]},
          {"x":4,"y":2,"domain":[2,7]},{"x":4,"y":3,"domain":[3,5,8,9]},{"x":4,"y":4,"domain":[2,3,5,9]},{"x":4,"y":5,"domain":[3,5,7,8,9]},{"x":4,"y":6,"domain":[2,3]},{"x":4,"y":7,"domain":[6]},{"x":4,"y":8,"domain":[3,7,9]}]));
        
        expect(JSON.stringify(grid.getColumn(5))).toEqual(JSON.stringify([{"x":5,"y":0,"domain":[3]},{"x":5,"y":1,"domain":[2,6,8]},
          {"x":5,"y":2,"domain":[9]},{"x":5,"y":3,"domain":[1,4,6,8]},{"x":5,"y":4,"domain":[2,6]},{"x":5,"y":5,"domain":[1,6,7,8]},
          {"x":5,"y":6,"domain":[5]},{"x":5,"y":7,"domain":[2,4,7]},{"x":5,"y":8,"domain":[7]}]));
        
        expect(JSON.stringify(grid.getColumn(6))).toEqual(JSON.stringify([{"x":6,"y":0,"domain":[9]},{"x":6,"y":1,"domain":[3,4,6]},
          {"x":6,"y":2,"domain":[8]},{"x":6,"y":3,"domain":[2]},{"x":6,"y":4,"domain":[7]},{"x":6,"y":5,"domain":[3,6]},
          {"x":6,"y":6,"domain":[1,3,6]},{"x":6,"y":7,"domain":[5]},{"x":6,"y":8,"domain":[3]}]));
        
        expect(JSON.stringify(grid.getColumn(7))).toEqual(JSON.stringify([{"x":7,"y":0,"domain":[5,6]},{"x":7,"y":1,"domain":[7]},
          {"x":7,"y":2,"domain":[1]},{"x":7,"y":3,"domain":[3,5,6,8,9]},{"x":7,"y":4,"domain":[3,5,6,9]},{"x":7,"y":5,"domain":[4]},
          {"x":7,"y":6,"domain":[3,6]},{"x":7,"y":7,"domain":[3,8]},{"x":7,"y":8,"domain":[2]}]));
        
        expect(JSON.stringify(grid.getColumn(8))).toEqual(JSON.stringify([{"x":8,"y":0,"domain":[2]},{"x":8,"y":1,"domain":[3,6]},
          {"x":8,"y":2,"domain":[3]},{"x":8,"y":3,"domain":[5,6,8]},{"x":8,"y":4,"domain":[1]},{"x":8,"y":5,"domain":[5,6,8]},
          {"x":8,"y":6,"domain":[7]},{"x":8,"y":7,"domain":[9]},{"x":8,"y":8,"domain":[4]}]));
      });
    });  

    describe("getBox ::", function() {
      it("returns an array of cells comprising a given cell's containing box", function() {
        expect(JSON.stringify(grid.getBox({x: 6, y: 0}))).toEqual(JSON.stringify([{"x":6,"y":0,"domain":[9]},{"x":7,"y":0,"domain":
          [5,6]},{"x":8,"y":0,"domain":[2]},{"x":6,"y":1,"domain":[3,4,6]},{"x":7,"y":1,"domain":[7]},{"x":8,"y":1,"domain":[3,6]},
          {"x":6,"y":2,"domain":[8]},{"x":7,"y":2,"domain":[1]},{"x":8,"y":2,"domain":[3]}]));
        
        expect(JSON.stringify(grid.getBox({x: 2, y: 2}))).toEqual(JSON.stringify([{"x":0,"y":0,"domain":[7]},{"x":1,"y":0,"domain":[8]},
          {"x":2,"y":0,"domain":[1,4]},{"x":0,"y":1,"domain":[9]},{"x":1,"y":1,"domain":[2,3]},{"x":2,"y":1,"domain":[5]},
          {"x":0,"y":2,"domain":[6]},{"x":1,"y":2,"domain":[2,3]},{"x":2,"y":2,"domain":[3,4]}]));
        
        expect(JSON.stringify(grid.getBox({x: 4, y: 4}))).toEqual(JSON.stringify([{"x":3,"y":3,"domain":[3,4,6,9]},{"x":4,"y":3,"domain":
          [3,5,8,9]},{"x":5,"y":3,"domain":[1,4,6,8]},{"x":3,"y":4,"domain":[2,3,6,9]},{"x":4,"y":4,"domain":[2,3,5,9]},
          {"x":5,"y":4,"domain":[2,6]},{"x":3,"y":5,"domain":[3,6,7,9]},{"x":4,"y":5,"domain":[3,5,7,8,9]},{"x":5,"y":5,"domain":
          [1,6,7,8]}]));
        
        expect(JSON.stringify(grid.getBox({x: 5, y: 7}))).toEqual(JSON.stringify([{"x":3,"y":6,"domain":[8]},{"x":4,"y":6,"domain":
          [2,3]},{"x":5,"y":6,"domain":[5]},{"x":3,"y":7,"domain":[2,3,4,7]},{"x":4,"y":7,"domain":[6]},{"x":5,"y":7,"domain":[2,4,7]},
          {"x":3,"y":8,"domain":[1]},{"x":4,"y":8,"domain":[3,7,9]},{"x":5,"y":8,"domain":[7]}]));
        
        expect(JSON.stringify(grid.getBox({x: 6, y: 3}))).toEqual(JSON.stringify([{"x":6,"y":3,"domain":[2]},{"x":7,"y":3,"domain":
          [3,5,6,8,9]},{"x":8,"y":3,"domain":[5,6,8]},{"x":6,"y":4,"domain":[7]},{"x":7,"y":4,"domain":[3,5,6,9]},{"x":8,"y":4,"domain":
          [1]},{"x":6,"y":5,"domain":[3,6]},{"x":7,"y":5,"domain":[4]},{"x":8,"y":5,"domain":[5,6,8]}]));
        
        expect(JSON.stringify(grid.getBox({x: 1, y: 8}))).toEqual(JSON.stringify([{"x":0,"y":6,"domain":[2,3]},{"x":1,"y":6,"domain":
          [4]},{"x":2,"y":6,"domain":[9]},{"x":0,"y":7,"domain":[2,3]},{"x":1,"y":7,"domain":[1]},{"x":2,"y":7,"domain":[3,7]},
          {"x":0,"y":8,"domain":[8]},{"x":1,"y":8,"domain":[3,5]},{"x":2,"y":8,"domain":[6]}]));
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
      xit("returns a new Grid with a deep copy (i.e. not a reference) of this.matrix", function() {
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

