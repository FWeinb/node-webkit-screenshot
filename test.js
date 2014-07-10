var fs = require('fs');
var screenshot = require('./index.js');

screenshot({
  url : 'http://google.de',
  width : 1024,
  height : 768
}).pipe(fs.createWriteStream('./out.png'));