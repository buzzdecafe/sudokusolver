var R = require('./ramda.js');
var Grid = require('./Grid.js');

var grid = [
  [5, 0, 0,   1, 0, 0,   9, 3, 0],
  [6, 4, 0,   0, 7, 3,   0, 8, 0],
  [0, 0, 1,   8, 0, 5,   0, 0, 0],

  [8, 0, 0,   3, 4, 0,   0, 1, 0],
  [0, 0, 0,   5, 2, 1,   0, 0, 0],
  [0, 2, 0,   0, 8, 9,   0, 0, 6],

  [0, 0, 0,   6, 0, 7,   8, 0, 0],
  [0, 8, 0,   9, 3, 0,   0, 7, 1],
  [0, 1, 3,   0, 0, 8,   0, 0, 9]
];


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
  if (!g) {
    g = new Grid(grid);
    load(g);
  }

  var cell = g.findEmptyCell();
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
    g.update(cell, EMPTY);
    i += 1;
  }
  return false;
}

module.exports = {
  load: load,
  setRenderer: function(fn) { 
    render = fn; 
  },
  solve: solve
};   


 
