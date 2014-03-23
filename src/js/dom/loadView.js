var R = require('ramda');
var Grid = require('../Grid.js');
var solver = require('../solver.js');
var gridData = require('../grids.js');

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

var gridList = document.getElementById('gridList');
var frag = document.createDocumentFragment();
R.each(function(key) {
  var li = document.createElement('li');
  var subtitle = document.createElement('span');
  var puzzleList = document.createElement('ul');
  
  subtitle.textContent = key;
  li.appendChild(subtitle);
  li.appendChild(puzzleList);

  // 'cuz i need the index and haven't impl'd each.idx yet
  for (var i = 0; i < gridData[key].length; i++) {
    var puzzLi = document.createElement('li');
    var wrap = document.createElement('span');
    wrap.className = 'puzzle';
    wrap.textContent = key + ' puzzle ' + i;
    wrap.setAttribute('data-puzzle', key + '_' + i);
    wrap.addEventListener('click', function(e) {
      var puzz = this.getAttribute('data-puzzle').split('_');
      solver.load(new Grid(gridData[puzz[0]][puzz[1]]));
      broadcast();
    });
    puzzLi.appendChild(wrap);
    puzzleList.appendChild(puzzLi);
  }
  
  frag.appendChild(li);
}, R.keys(gridData));
gridList.appendChild(frag);

module.exports = document.getElementById('load');


