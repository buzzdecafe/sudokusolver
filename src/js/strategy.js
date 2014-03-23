var R = require('ramda');
var Grid = require('./Grid.js');

var selectedKey = 'bruteforce';
var algoMap = {
  bruteforce: function(g) {
    return g.getFirstUnboundCell();
  },
  constrained: function(g) {
    return R.car(g.getMostConstrainedCells());
  }
};


module.exports = {
  get: function() {
    return algoMap[selectedKey];
  },
  set: function(type) {
    selectedKey = type;
  }
};

