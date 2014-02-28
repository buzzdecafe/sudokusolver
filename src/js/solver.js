var R = require('ramda');
var Grid = require('./Grid.js');

var grid = new Grid([
  [5, 0, 0,   1, 0, 0,   9, 3, 0],
  [6, 4, 0,   0, 7, 3,   0, 8, 0],
  [0, 0, 1,   8, 0, 5,   0, 0, 0],

  [8, 0, 0,   3, 4, 0,   0, 1, 0],
  [0, 0, 0,   5, 2, 1,   0, 0, 0],
  [0, 2, 0,   0, 8, 9,   0, 0, 6],

  [0, 0, 0,   6, 0, 7,   8, 0, 0],
  [0, 8, 0,   9, 3, 0,   0, 7, 1],
  [0, 1, 3,   0, 0, 8,   0, 0, 9]
]);

var ops = 0;

function render(g) {
  console.log("solved");
  g.matrix.forEach(function(r) {
    console.log(r);
  });
}

function load(g) {
  grid = g || grid;
  render(grid);
}

function solve(g) {
  ops += 1;
  if (!g) {
    g = grid;
    load(g);
  }

  var cell = R.car(g.getMostConstrainedCells());
  var i = 0;
  
  if (!cell) {
    render(g);
    return true;
  }

  var domain = g.constrain(cell);

  while (i < domain.length) {
    g.update(cell, domain[i]); 

    if (solve(g)) {               
      return true;
    }

    // mark cell as empty and backtrack    
    g.update(cell, 0);
    i += 1;
  }
  return false;
}

module.exports = {
  getOpCount: function() { return ops; },
  load: load,
  setRenderer: function(fn) { 
    render = fn; 
  },
  solve: solve
};   


 
