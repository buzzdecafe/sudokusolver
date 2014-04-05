var Grid = require('./Grid.js');
var R = require('ramda');

function DomainBoard(grid) {
  this.matrix = R.map.idx(function(row, yIndex) {
    return R.map.idx(function(cell, xindex) {
      return cell ? [cell] : grid.constrain({x: xIndex, y: yIndex});
    }, row);
  }, grid.matrix);
  this.history = [this.store()];
};

DomainBoard.prototype = Grid.prototype;

DomainBoard.prototype.constructor = DomainBoard;

DomainBoard.prototype.updateDomain = function(value, arr) {
  return R.map(function(dom) {
    var i = dom.indexOf(value);
    return (i > -1) ? dom.splice(i, 1) : dom;
  }, arr);
};

DomainBoard.prototype.propagate = function(cell, value) {
  var row = this.matrix[cell.y];
  var col = this.colToArray(cell.x);
  var box = this.boxToArray(cell);
  var ok = false;
  var hasDomain = function(a) { return a.length > 0; }; 
  // push onto the stack
  this.store();
  
  ok = all(hasDomain, this.updateDomain(value, row)) &&
       all(hasDomain, this.updateDomain(value, col)) &&
       all(hasDomain, this.updateDomain(value, box));

  // if any empty domains, revert and return false;
  if (ok) {
    return true;
  } else {
    this.revert();
    return false;
  }
};

DomainBoard.prototype.store = function() {
  return JSON.stringify(this.matrix);
};

DomainBoard.prototype.revert = function() {
  this.matrix = JSON.parse(this.history.pop()); 
};

module.exports = DomainBoard;

