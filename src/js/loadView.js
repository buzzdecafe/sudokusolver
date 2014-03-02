var R = require('ramda');
var Grid = require('./Grid.js');
var solver = require('./solver.js');

// convert table values to js 2d-matrix
function htmlToMatrix(tbl) {
  var trs = tbl.getElementsByTagName('tr');
  return R.map(function(tr) {
    var inputs = tr.getElementsByTagName('input');
    return R.map(function(input) {
      return +input.value;
    }, inputs);
  }, trs);
}

var message = document.getElementById('message');

// maybe delegate these. for now, this is good enough:
var loadCells = document.getElementsByClassName('loadCell');
var j = 0;
while (j < loadCells.length) {
  loadCells[j].addEventListener('keydown', function(e) {
    if (this.value.length && !this.value.match(/^\d$/)) {
      this.value = '';
      e.stopPropagation();
    } else {
      message.style.display = 'none';
      message.textContent = ''
    }
  });
  j++;
}

function broadcast() {
  document.dispatchEvent(new document.defaultView.CustomEvent('gridLoaded', 
        { detail: {
            callback: function() {
              var i = 0;
              while (i < loadCells.length) {
                loadCells[i].value = '';
                i += 1;
              }
            }
          }
        })
  );
}

var loadBtn = document.getElementById('loadBtn');
loadBtn.addEventListener('click', function() {
  // convert html to matrix
  var matrix = htmlToMatrix(document.getElementById('loadTbl'));
  var testGrid = new Grid(matrix);
  if (testGrid.isValid(matrix)) {
    // if grid is valid, load the grid, hide load view and show solve view
    solver.load(testGrid);
    broadcast();
  } else {
    // else warn and stay here
    message.style.display = 'block';
    message.textContent = 'The grid is not valid';
  }
});

module.exports = document.getElementById('load');


