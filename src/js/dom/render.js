var R = require('ramda');
var g = require('./grid');
var Cell = require('./Cell');

var timeout = 200;
var container;

function toConsole(cells) {
  setTimeout(function() {
    console.log('.-----------+-----------+-----------+'); 
    R.each(function(n) {
      console.log('[ ' + R.map(function(c) { return Cell.isBound(c) ? c.domain[0] : ' '; }, g.getRow({y: n}, cells)).join(' | ') + ' ]');
      console.log('[-----------+-----------+-----------]');
    }, R.range(0,9));
  }, timeout);
}

function toHtml(cells) {
  container = container || document.body;
  setTimeout(function() {
    var frag = document.createFragment();
    var rows = R.getRows(cells);
    R.each(function(r) {
      var tr = document.createElement('tr');
      var tds = R.each(function(c) {
        var td = document.createElement('td');
        td.textContent = (Cell.isBound(c) ? R.car(c.domain) : ' ');
        tr.appendChild(td);
      });
      frag.appendChild(tr);
    }, rows);
    while(container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(frag);

  }, timeout);
}



module.exports = {
  setDelay: function(n) { timeout = n; },
  setContainer: function(c) { container = c; },
  toConsole: toConsole,
  toHtml: toHtml
};


