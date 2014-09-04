'use strict';

var path = require('path');

var spawn = require('win-spawn');
var Promise = require('bluebird');
var server = require('http').createServer();
var io = require('socket.io').listen(server);

var app =  path.join(__dirname, 'nw-screenshot');
var nodewebkit = require('nodewebkit').findpath();

var requestId = 0;

var Browser = function(socket){
  this.promises = {};
  this.socket = socket;

  this.socket.on('screenshot', function(data){
    var screenshotId = data.id;
    this.promises[''+screenshotId].resolve(data.data);
  }.bind(this));

  this.socket.on('screenshot-error', function(data){
    var screenshotId = data.id;
    this.promises[''+screenshotId].reject(data.error);
  }.bind(this));

};


Browser.prototype.screenshot = function(options){
  var deferred = Promise.pending();
  options.id = requestId++;
  this.socket.emit('take-screenshot', options);
  this.promises[''+options.id] = deferred;
  return deferred.promise;
};


var _isStarted;
var connection;
var createBrowser = function(options){
  _isStarted = new Promise(function(resolve, reject){

    io.on('connection', function(socket){
      if (!connection) {
        resolve( new Browser(socket) );
        connection = socket;
      }
    });

    io.on('error', function(error){
      reject(error);
    });

  });

  process.env.NWS_PORT = options.port;
  server.listen(process.env.NWS_PORT || 3000);

  spawn(nodewebkit, [
    '.'
  ],{
    cwd: app,
    env: process.env
  });

  return _isStarted;
};

module.exports = {

  getBrowser : function(options){
    return _isStarted || createBrowser(options);
  },

  close : function(){
    _isStarted = undefined;
    if ( connection ){
      connection.emit('close');
    }
    server.close();
  }
};
