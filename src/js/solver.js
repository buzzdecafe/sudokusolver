var R = require('ramda');
var Grid = require('./Grid.js');
var strategy = require('./strategy.js');


function getMatrix() {
  return [
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
}

var grid = new Grid(getMatrix());
var ops = 0;
var start;
var end;

function render(g) {
  console.log("solved");
  g.matrix.forEach(function(r) {
    console.log(r);
  });
}

function reset() {
  ops = 0;
  start = void 0;
  load(new Grid(getMatrix()));
}

function load(g) {
  grid = g || grid;
  render(grid);
}

function solve(g) {
  start = start || new Date();
  ops += 1;
  if (!g) {
    g = grid;
    load(g);
  }

  var cell = strategy.get()(g);
  var i = 0;
  
  if (!cell) {
    render(g);
    end = new Date();
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
  getDuration: function() {
    return end.getTime() - start.getTime() 
  },
  getOpCount: function() { return ops; },
  load: load,
  reset: reset,
  setStrategy: strategy.set,
  setRenderer: function(fn) { 
    render = fn; 
  },
  solve: solve
};   


 
