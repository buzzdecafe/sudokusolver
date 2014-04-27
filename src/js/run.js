var R = require('ramda');
var g = require('./grid');
var Cell = require('./Cell');
var getSolver = require('./solver');
var matrix = require('./data/grids');


var solver = getSolver(g.isFullyBound, g.isSolved, g.isValid, g.makeNextFn);

var display = function(cells) {
  setTimeout(function() {
    console.log('.-----------+-----------+-----------+'); 
    R.each(function(n) {
      console.log('[ ' + R.map(function(c) { return Cell.isBound(c) ? c.domain[0] : ' '; }, g.getRow({y: n}, cells)).join(' | ') + ' ]');
      console.log('[-----------+-----------+-----------]');
    }, R.range(0,9));
  }, 100);
}

var cells = g.constrainAll(g.matrixToCells(matrix.Easy[0]));
var start = new Date();
display(cells);
var result = solver(cells, display);
console.log("solution found in " + ((new Date()) - start) + " milliseconds");

