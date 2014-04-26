var R = require('ramda');
var g = require('./grid');
var getSolver = require('./solver');
var matrix = require('./data/grids');


var solver = getSolver(g.isFullyBound, g.isSolved, g.isValid, g.makeNextFn);

var print = function(cells) {
  console.log('.-----------+-----------+-----------+'); 
  R.each(function(n) {
    console.log('[ ' + R.map(function(c) { return g.isBound(c) ? c.domain[0] : ' '; }, g.getRow({y: n}, cells)).join(' | ') + ' ]');
    console.log('[-----------+-----------+-----------]');
  }, R.range(0,9));
};

var cells = g.constrainAll(g.matrixToCells(matrix.Easy[0]));
print(cells);
solver(cells, print);


