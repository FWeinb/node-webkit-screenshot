'use strict';
/* globals nwrequire */

var gui = nwrequire('nw.gui');
var socket = require('socket.io-client')('http://localhost:3000');

var show = process.env.NODESCREENSHOT_SHOW === '1' ? true : false;

if (show){
  gui.Window.get().show();
}

socket.on('connect', function(){

  var emitSuccess = function( id, data ){
    socket.emit('screenshot', {
      id : id,
      data : data
    });
  };

  var emitError = function( id, error ){
    socket.emit('screenshot-error', {
      id : id,
      error : error
    });
  };

  socket.on('take-screenshot', function(options){
    takeScreenshot(options, emitSuccess.bind(null, options.id), emitError.bind(null, options.id));
  });

  socket.on('close', function(){
    gui.Window.get().close(true);
  });

});


function takeScreenshot(options, success /* error */){

  if ( (options.format !== 'png' && options.format !== 'jpeg') || !options.format) {
    options.format = 'png';
  }

  // It looks like the browser UI is taken into account on linux.
  // TODO(FWeinb): confirm this
  if ( process.platform === 'linux') {
    options.height += 38;
  } else if ( process.platform === 'win32' ) {
    options.height += 60;
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
        success(buffer);
        win.close(true);
       }, { format : options.format, datatype : 'buffer'});
    }, options.delay * 1000);
  });

}