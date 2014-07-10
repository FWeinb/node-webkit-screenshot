'use strict';
/* globals nwrequire */

var gui = nwrequire('nw.gui');
var options = JSON.parse(gui.App.argv.toString());

// Needed if the procces is running in a framebuffer (like on travis)
var show = process.env.NODESCREENSHOT_SHOW === '1' ? true : false;

if (show){
  gui.Window.get().show();
}

// It looks like the browser UI is taken into account on linux.
// TODO(FWeinb): confirm this
if ( process.platform === 'linux') {
  options.height += 38;
}

var win = gui.Window.open(options.url, {
  width: options.width,
  height: options.height,
  show: show,
  frame: false
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
