var solver = (function(R) {
  
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

  function render(g) {
    console.log("solved");
    g.forEach(function(r) {
      console.log(r);
    });
  }

  function solve(g, x, y) {
    var cell;
    var i = 0;
    g = g || defaultGrid;
    x = x || 0;
    y = y || 0;
    cell = findEmptyCell(g, x, y);
    
    if (!cell) {
      render(g);
      return true;
    }

    var domain = constrain(g, cell);

    while (i < domain.length) {
      g[cell.y][cell.x] = domain[i];

      if (solve(g, cell.x, cell.y)) {               
        return true;
      }
      // mark cell as empty and backtrack    
      g[cell.y][cell.x] = EMPTY;
      i += 1;
    }
    return false;
  }
  
  function findEmptyCell(g, x, y) {
    var cell = {};
    cell.y = R.findIndex(function(r) { return R.contains(EMPTY, r); }, g);
    if (cell.y !== false) {
      cell.x = R.findIndex(function(c) { return c === EMPTY; }, g[cell.y]);
    }
    return (cell.y !== false && cell.x !== false) ? cell : false;
  }

  function colToArray(g, x) {
    return R.pluck(x, g);
  }

  function boxToArray(g, cell) {
    var boxCol = Math.floor(cell.x/3) * 3;
    var boxRow = Math.floor(cell.y/3) * 3;
    
    return R.reduce(function(acc, row) {  
      return acc.concat(R.map(R.I, row.slice(boxCol, 3)));
    }, [], g.slice(boxRow, 3));
  }

  return {
    solve: solve,
    setRenderer: function(fn) { render = fn; }
  };   

}(ramda));

  
