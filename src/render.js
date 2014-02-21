(function(R, solver) {

    // stoyan stefanov's `sleep` function      
    function sleep(milliseconds) {
      var start = new Date().getTime();
      for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
          break;
        }
      } 
    }

    var render = function(g) {
      var grid = document.getElementById('grid');
      var htmlStr = R.reduce(function(acc, row) {
        return acc += '<tr>' + 
               R.reduce(function(acc, cell) {
                 return acc + '<td>' + cell + '</td>';
               }, '', row) +
               '</tr>';
      }, '', g);
     
      grid.innerHTML = htmlStr;
      sleep(500);
    };
    
    solver.setRenderer(render);
  }(ramda, solver));