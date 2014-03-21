var R = require('ramda');
var Grid = require('./Grid.js');
var History = require('./History');
var strategy = require('./strategy.js');
var renderers = require('./renderers.js');
var instrument = require('./instrument.js').init();

var grid;
var matrixClone;
var render = renderers.console;
var forwardCheck = false;
var history;

function reset() {
  instrument.reset();
  load(new Grid(matrixClone));
}

function useForwardChecking(bool) {
  forwardCheck = bool;
}

function load(g) {
  history = new History();
  grid = g;
  matrixClone = R.map(R.clone, grid.matrix);
  history.push(g);
  render(grid);
}

function forwardCheck(grid, cell) {
  var value = R.car(cell.domain);
  // get row, col, box
  var related = grid.getUnboundRelatives(cell);
  var fwdCheckGrid = R.curry(forwardCheck)(grid);

  // iterate over cells and remove cell value from domains
  var updated = R.each(function(c) { c.remove(value); }, related);

  // if any domain.length becomes one, forwardCheck that cell
  // if any domain.length becomes zero, backtrack--that means restoring prior state
  return R.all(fwdCheckGrid, R.filter(R.where({domain: isBound}), updated)) &&
         R.all(R.where({domain: isValid}), updated);
};
  
function boundValue(acc, cell) {
  return acc.concat(cell.domain); 
}

function constrain(grid, cell) {
  var rowBound = R.foldl(boundValue, [], grid.getBoundByRow(cell.y));
  var colBound = R.foldl(boundValue, [], grid.getBoundByColumn(cell.x));
  var boxBound = R.foldl(boundValue, [], grid.getBoundByBox(cell));
  
  cell.constrain(rowBound).constrain(colBound).constrain(boxBound);
  return cell.domain;
};

var history = [];

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

  domain = constrain(g, cell);
  i = 0;
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


/*
 *
  // should be called with a cell that is bound
  forwardCheck: function(cell) {
    var value = R.car(cell.domain);
    // get row, col, box
    var related = this.getUnboundRelatives(cell);

    // iterate over cells and remove cell value from domains
    var updated = R.each(function(c) { c.remove(value); }, related);

    // if any domain.length becomes one, forwardCheck that cell
    // if any domain.length becomes zero, backtrack--that means restoring prior state
    return R.all(this.forwardCheck, R.filter(R.where({domain: isBound}), updated)) &&
           R.all(R.where({domain: isValid}), updated);
  },
  
  constrain: function(cell, grid) {
    function boundValue(acc, cell) {
      return acc.concat(cell.domain); 
    }
    var rowBound = R.foldl(boundValue, [], grid.getBoundByRow(cell.y));
    var colBound = R.foldl(boundValue, [], grid.getBoundByColumn(cell.x));
    var boxBound = R.foldl(boundValue, [], grid.getBoundByBox(cell));
    
    cell.constrain(rowBound).constrain(colBound).constrain(boxBound);
    
    return cell.domain;
  },



 */
