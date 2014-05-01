var R = require('ramda');
var g = require('./grid');
var Cell = require('./Cell');
var getSolver = require('./solver');
var matrix = require('./data/grids');
var display = require('dom/render');

var solver = getSolver(g.isFullyBound, g.isSolved, g.isValid, g.makeNextFn);


var cells = g.constrainAll(g.matrixToCells(matrix.Easy[0]));
var start = new Date();
display.setDelay(500);
display.setContainer(document.getElementById('grid'));
display.toHtml(cells);
var result = solver(cells, display.toHtml);
console.log("solution found in " + ((new Date()) - start) + " milliseconds");

