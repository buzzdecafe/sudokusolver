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
var radios = document.getElementsByName('algo');
var i = 0;
while (i < radios.length) {
  radios[i].addEventListener('change', function(e) {
    if (this.checked) {
      solver.setAlgorithm(this.value);
    }
  });
  i++;
}

var solveBtn = document.getElementById('solveBtn');
solveBtn.addEventListener('click', function() { 
  solver.solve() && showOpCount() && showDuration(); 
});

var resetBtn = document.getElementById('resetBtn');
resetBtn.addEventListener('click', function() {
  solver.reset();
  showOpCount(' ');
  showDuration(' ');
});

var opCount = document.getElementById('opCount');
var showOpCount = function(s) {
  opCount.textContent = s || solver.getOpCount();
  return true;
};

var duration = document.getElementById('duration');
var showDuration = function(s) {
  duration.textContent = s || solver.getDuration();
  return true;
};

