var solve = (function(R) {
  
  var EMPTY = 0;
  var defaultGrid = [
  
    [5, 0, 0,   1, 0, 0,   9, 3, 0],
    [6, 4, 0,   0, 7, 3,   0, 8, 0],
    [0, 0, 1,   8, 0, 5,   0, 0, 0],
  
    [8, 0, 0,   3, 4, 0,   0, 1, 0],
    [0, 0, 0,   5, 2, 1,   0, 0, 0],
    [0, 2, 0,   0, 8, 9,   0, 0, 6],

    [0, 0, 0,   6, 0, 7,   8, 0, 0],
    [0, 8, 0,   9, 3, 0,   0, 7, 1],
    [0, 1, 3,   0, 0, 8,   0, 0, 9]

  ];

  function constrain(g, cell) {
    var rowWise = R.difference(R.range(1,10), g[cell.y]);
    var colWise = R.difference(rowWise, colToArray(g, cell.x));
    var boxWise = R.difference(colWise, boxToArray(g, cell));
    return boxWise;
  }

  function solve(g, x, y) {
    var cell;
    var i = 0;
    g = g || defaultGrid;
    x = x || 0;
    y = y || 0;
    cell = findEmptyCell(g, x, y);
    
    if (!cell) {
        console.log("solved");
        g.forEach(function(r) {
          console.log(r);
        });
        return true;
    }

    var domain = constrain(g, cell);

    while (i < domain.length) {
      if (ok(g, cell, domain[i])) {   
        g[cell.y][cell.x] = domain[i];

        if (solve(g, cell.x, cell.y)) {                
          return true;
        }

        // mark cell as empty and backtrack    
        g[cell.y][cell.x] = EMPTY;
      }
      i += 1;
    }
    return false;
  }
  
  function findEmptyCell(g, x, y) {
    var coords = {};
    coords.y = R.findIndex(function(r) { return R.contains(EMPTY, r); }, g);
    if (coords.y !== false) {
      coords.x = R.findIndex(function(c) { return c === EMPTY; }, g[coords.y]);
    }
    return (coords.y !== false && coords.x !== false) ? coords : false;
  }

  function colToArray(g, x) {
    return R.pluck(x, g);
  }

  function boxToArray(g, cell) {
    var boxCol = Math.floor(cell.x/3) * 3;
    var boxRow = Math.floor(cell.y/3) * 3;
    
    return R.flatten(
      R.map(function(row) {
        return R.map(function(col) {
          return col;
        }, row.slice(boxCol, 3));
      }, g.slice(boxRow, 3))
    );
  }

  function valid(value, list) {
    return !R.contains(function(v) { v === value; }, list);
  }
 

  function ok(g, cell, value) {
    return valid(value, g[cell.y]) &&
           valid(value, colToArray(g, cell.x)) &&
           valid(value, boxToArray(g, cell));
  }

  return solve;   

}(ramda));

  
