var solver = require('./solver.js');

// attach to DOM
var radios = document.getElementsByName('strategy');
var i = 0;
while (i < radios.length) {
  radios[i].addEventListener('change', function(e) {
    if (this.checked) {
      solver.strategy.set(this.value);
    }
  });
  i++;
}

var solveBtn = document.getElementById('solveBtn');
solveBtn.addEventListener('click', function() { 
  resetBtn.setAttribute('disabled', true);
  if (solver.solve()) {
    showOpCount() && showDuration(); 
  } else {
    alert('crap, failed to solve it! This should never happen');
  }
  resetBtn.removeAttribute('disabled');
  this.setAttribute('disabled', true);
});

var resetBtn = document.getElementById('resetBtn');
resetBtn.addEventListener('click', function() {
  solver.reset();
  showOpCount(' ');
  showDuration(' ');
  solveBtn.removeAttribute('disabled');
});

var opCount = document.getElementById('opCount');
var showOpCount = function(s) {
  opCount.textContent = s || solver.instrument.getOps();
  return true;
};

var duration = document.getElementById('duration');
var showDuration = function(s) {
  duration.textContent = s || solver.instrument.getDuration();
  return true;
};

document.getElementById('anotherBtn').addEventListener('click', function() {
  var evt = new document.defaultView.CustomEvent('loadAnother');
  document.dispatchEvent(evt);
});


module.exports = document.getElementById('solve');



