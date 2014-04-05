var R = require('ramda');
var Grid = require('./Grid.js');
var DomainBoard = require('./DomainBoard.js');
var strategy = require('./strategy.js');
var renderers = require('./renderers.js');
var instrument = require('./instrument.js').init();

var grid;
var matrixClone;
var render = renderers.console;
var forwardCheck = false;
var domainBoard;

function reset() {
  instrument.reset();
  load(new Grid(matrixClone));
}

function useForwardChecking(bool) {
  forwardCheck = bool;
}

function load(g) {
  grid = g;
  matrixClone = R.map(R.clone, grid.matrix);
  if (forwardCheck) {
    domainBoard = new DomainBoard(g);
  }
  render(grid);
}

function solve(g) {
  var i, cell, domain;
  g = g || grid;

  instrument.start();
  
  cell = strategy.get()(g);
  if (!cell) {
    render(g);
    instrument.end();
    return true;
  }

  domain = g.constrain(cell);
  i = 0;
  while (i < domain.length) {
    g.update(cell, domain[i]); 
    if (forwardCheck) {

    }
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
  instrument: instrument,
  load: load,
  reset: reset,
  setRenderer: function(fn) { 
    if (typeof fn === 'function') {
      render = fn;
    } else if (typeof fn === 'string') {
      render = renderers[fn]; 
    } else {
      render = renderers.console;
    }
  },
  solve: solve,
  strategy: strategy,
  useForwardChecking: useForwardChecking
};   


 
