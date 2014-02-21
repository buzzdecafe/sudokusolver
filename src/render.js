(function(R, solver) {

    var render = function(g) {
      var grid = document.getElementById('grid');
      var htmlStr = R.reduce(function(acc, row) {
        return acc += '<tr>' + 
               R.reduce(function(acc, cell) {
                 return acc + '<td>' + (cell || '') + '</td>';
               }, '', row) +
               '</tr>';
      }, '', g);
     
      grid.innerHTML = htmlStr;
    };
    
    solver.setRenderer(render);
    solver.load();
  }(ramda, solver));
