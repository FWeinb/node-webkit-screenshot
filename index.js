'use strict';

var path = require('path');
var spawn = require('win-spawn');
var nodewebkit = require('nodewebkit').findpath();
var app =  path.join(__dirname, 'nw-screenshot');

/**
 * Takes an options object liek
 * { url : '', delay : [seconds], width : [size], heihgt :  [size], format : 'png|jpeg' default png };
 * returns a stream
 */
module.exports = function (options) {

  if ( (options.format !== 'png' && options.format !== 'jpeg') || !options.format) {
    options.format = 'png';
  }

  return spawn(nodewebkit, [
    '.',
    JSON.stringify(options)
  ],{
    cwd: app,
    env: process.env
  }).stdout;
};