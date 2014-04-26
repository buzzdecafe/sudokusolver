var R = require('ramda');
var g = require('./grid');
var Cell = require('./Cell');
var getSolver = require('./solver');
var matrix = require('./data/grids');


var solver = getSolver(g.isFullyBound, g.isSolved, g.isValid, g.makeNextFn);

var print = function(cells) {
  console.log('.-----------+-----------+-----------+'); 
  R.each(function(n) {
    console.log('[ ' + R.map(function(c) { return Cell.isBound(c) ? c.domain[0] : ' '; }, g.getRow({y: n}, cells)).join(' | ') + ' ]');
    console.log('[-----------+-----------+-----------]');
  }, R.range(0,9));
};

var cells = g.constrainAll(g.matrixToCells(matrix.Easy[0]));
print(cells);
var start = new Date();
var result = solver(cells, print);
var duration = (new Date()) - start;
if (result) {
  console.log("solution found in", duration, "milliseconds");
} else {
  console.log("no solution found");
}

