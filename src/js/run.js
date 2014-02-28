var solver = require('./solver.js');
var R = require('ramda');

var render = function(g) {
  var grid = document.getElementById('grid');
  var htmlStr = R.reduce(function(acc, row) {
    return acc += '<tr>' + 
           R.reduce(function(acc, cell) {
             return acc + '<td>' + (cell || '') + '</td>';
           }, '', row) +
           '</tr>';
  }, '', g.matrix);
 
  grid.innerHTML = htmlStr;
};

solver.setRenderer(render);
solver.load();


// attach to DOM
var opCount = document.getElementById('opCount');
var showOpCount = function() {
  opCount.textContent = solver.getOpCount();
};
var solveBtn = document.getElementById('solveBtn');
solveBtn.addEventListener('click', function() { 
  solver.solve() && showOpCount(); 
});

