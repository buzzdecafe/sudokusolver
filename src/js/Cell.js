var clone = require('ramda').clone;

function Cell(x, y, domain) {
  this.x = x;
  this.y = y;
  this.domain = domain;
}

Cell.clone = function(cell) {
  return new Cell(cell.x, cell.y, clone(cell.domain));
};

Cell.isBound = function(cell) {
  return cell.domain.length === 1;
}

Cell.isUnbound = function(cell) {
  return cell.domain.length > 1;
}

Cell.isNotEmpty = { domain: function(d) { return d && d.length > 0; } };

module.exports = Cell;

