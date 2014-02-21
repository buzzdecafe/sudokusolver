#!/usr/local/bin/node


var fs = require('fs');
var src = fs.createReadStream('node_modules/ramda/ramda.js');
var dest = fs.createWriteStream('src/ramda.js');

src.pipe(dest);

