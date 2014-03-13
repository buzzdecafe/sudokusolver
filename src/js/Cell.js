var R = require('ramda');

function Cell(x, y, domain) {
  this.x = x;
  this.y = y;
  this.domain = domain;
}

Cell.prototype.constrain = function(arr) {
  this.domain = R.difference(this.domain, arr);
  return this;
};

Cell.prototype.isBound = function() {
  return this.domain.length === 1;
};

Cell.prototype.isUnbound = function() {
  return this.domain.length > 1;
};

Cell.prototype.isValid = function() {
  return this.domain.length >= 1;
};

Cell.prototype.isInvalid = function() {
  return this.domain.length < 1;
};

module.exports = Cell;


