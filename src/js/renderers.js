var R = require('ramda');


module.exports = {

  console: function(g) { console.log(g); },
  
  html: function(g) {
    var grid = document.getElementById('grid');
    var htmlStr = R.reduce(function(acc, row) {
      return acc += '<tr>' + 
             R.foldl(function(acc, cell) {
               return acc + '<td>' + (cell || '') + '</td>';
             }, '', row) +
             '</tr>';
    }, '', g.matrix);
     grid.innerHTML = htmlStr;
  }
 
};


