var R = require('ramda');
var Grid = require('./Grid.js');

var selectedKey = 'bruteforce';
var algoMap = {
  bruteforce: function(g) {
    return g.findEmptyCell();
  },
  constrained: function(g) {
    return R.car(g.getMostConstrainedCells());
  }
};


module.exports = {
  selected: algoMap[selectedKey],
  set: function(type) {
    selectedKey = type;
  }
};

