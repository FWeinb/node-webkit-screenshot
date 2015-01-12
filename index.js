'use strict';

var Promise = require('bluebird');

var browserManager = require('./browser.js');

/**
 * Takes an options object liek
 * { url : '', delay : [seconds], width : [size], height :  [size], format : 'png|jpeg' default png };
 * returns a stream
 */
module.exports = function(options){
  return new Promise(function(resolve, reject) {
    browserManager
    .getBrowser(options)
    .then(function(browser){
      browser
      .screenshot(options)
      .then(resolve)
      .catch(reject);
    });
  });
};

module.exports.close = function(){
  browserManager.close();
};

process.on('exit', module.exports.close);