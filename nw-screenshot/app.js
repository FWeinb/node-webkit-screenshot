'use strict';
/* globals nwrequire */

var gui = nwrequire('nw.gui');
var options = JSON.parse(gui.App.argv.toString());


var win = gui.Window.open(options.url, {
  width: options.width,
  height: options.height,
  show: false
});

win.on('document-end', function(){
	setTimeout(function(){
		win.capturePage(function(buffer) {
			process.stdout.write(buffer);
			win.close(true);
			gui.Window.get().close(true);
		 }, { format : options.format, datatype : 'buffer'});
	}, options.delay * 1000);
});
