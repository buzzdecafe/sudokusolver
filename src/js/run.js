var solver = require('./solver.js');

solver.setRenderer('html');

// DOM crap
var loadView = require('./loadView.js');
var solveView = require('./solveView.js');

document.addEventListener('gridLoaded', function(e) {
  loadView.style.display = 'none';
  solveView.style.display = 'block';
  e.callback && e.callback();
});

document.addEventListener('loadAnother', function(e) {
  loadView.style.display = 'block';
  solveView.style.display = 'none';
  e.callback && e.callback();
});

