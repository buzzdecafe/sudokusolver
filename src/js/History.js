var Grid = require('./Grid');

function History() {
  this.stack = [];
}

History.prototype = {
  constructor: History,

  push: function(g) {
    this.stack.push(JSON.stringify(g));
  },

  pop: function() {
    return Grid.rehydrate(this.stack.pop());
  },

  size: function() {
    return this.stack.length;
  }
};



module.exports = History;