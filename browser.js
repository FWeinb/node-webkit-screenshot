'use strict';

var path = require('path');

var spawn = require('win-spawn');
var Promise = require('bluebird');
var http = require('http');
var socketio = require('socket.io');


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

var server;
var io;
var connection;
var _isStarted;

var createBrowser = function(options){
  server = http.createServer();
  io = socketio.listen(server);

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

  process.env.NWS_PORT = options.port || 3000;
  server.listen(process.env.NWS_PORT);

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
      connection = undefined;
    }

    try{
      server.close();
    } catch(e){ }
  }
};
