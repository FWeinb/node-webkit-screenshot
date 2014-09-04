'use strict';
/* globals nwrequire */

var gui = nwrequire('nw.gui');
var PNGCrop = require('png-crop');
var toArray = require('stream-to-array');
var socket = require('socket.io-client')('http://localhost:' + process.env.NWS_PORT);

var show = process.env.NODESCREENSHOT_SHOW === '1' ? true : false;

if (show){
  gui.Window.get().show();
}

socket.on('connect', function(){

  var emitError = function( options, error ){
    socket.emit('screenshot-error', {
      id : options.id,
      error : error
    });
  };

  var emitSuccess = function( options, data ){
    if ( options.crop && options.crop.width && options.crop.height ){
      PNGCrop.cropToStream(data, options.crop, function(err, stream) {
        if (err) {
          emitError(options, 'Can\'t crop image');
          return;
        }
        toArray(stream, function (err, arr) {
          if (err) {
            emitError(options, err);
            return;
          }
          socket.emit('screenshot', {
            id : options.id,
            data : Buffer.concat(arr)
          });
        });
      });
    } else {
      socket.emit('screenshot', {
        id : options.id,
        data : data
      });
    }
  };


  socket.on('take-screenshot', function(options){
    takeScreenshot(options, emitSuccess.bind(null, options), emitError.bind(null, options));
  });

  socket.on('close', function(){
    gui.Window.get().close(true);
  });

});


function takeScreenshot(options, success, error){

  if ( (options.format !== 'png' && options.format !== 'jpeg') || !options.format) {
    options.format = 'png';
  }

  if ( !options.width || !options.height){
    error('At least `height` and `width` must be set');
    return;
  }


  var win = gui.Window.open(options.url, {
    width: options.width,
    height: options.height,
    show: show,
    frame: false,
    toolbar: false
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