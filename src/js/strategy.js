var R = require('ramda');
var Grid = require('./Grid.js');

var selectedAlgo;
var algoMap = {
  bruteforce: function(g) {
    return g.findEmptyCell();
  },
  constrained: function(g) {
    return R.car(g.getMostConstrainedCells());
  }
};


module.exports = {
  get: function() {
    return selectedAlgo || algoMap.bruteforce;
  },
  set: function(type) {
    selectedAlgo = algoMap[type];
  }
};

