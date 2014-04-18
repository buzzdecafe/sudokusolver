var clone = require('ramda').clone;

function Cell(x, y, domain) {
  this.x = x;
  this.y = y;
  this.domain = domain;
}

Cell.clone = function(cell) {
  return new Cell(cell.x, cell.y, clone(cell.domain));
};

module.exports = Cell;
