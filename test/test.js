/* globals  assert, describe, it */
'use strict';

var assert = require('assert');
var imageSize = require('image-size');
var isPng = require('is-png');
var isJpg = require('is-jpg');

var screenshot = require('./../index.js');

var timeout = 60000;

describe('screenshot', function(){

  it('should produce pngs', function(done){
    this.timeout(timeout);

    screenshot({url : 'about:config', width : 500, height : 500}).then(function(data){
      assert.ok(isPng(data));
      done();
    });

  });

  it('should have a `delay` option', function(done){
    this.timeout(timeout);
    var now = new Date();
    screenshot({url : 'about:config', delay : 2, width : 500, height : 500})
    .then(function(){
      assert((new Date()) - now > 2000);
      done();
    });
  });

  it('should have a `format` option', function(done){
    this.timeout(timeout);
    screenshot({url : 'about:config', width : 500, height : 500, format : 'jpeg'}).then(function(data){
      assert.ok(isJpg(data));
      done();
    });
  });

  it('should create a screenshot with 500x500 pixels', function(done){
    this.timeout(timeout);
    screenshot({url : 'about:config', width : 500, height : 500}).then(function(data){
      var size = imageSize(data);
      assert.equal(size.width, 500);
      assert.equal(size.height, 500);
      done();
    });
  });

  it('should create a screenshot with 300x300 pixels', function(done){
    this.timeout(timeout);

    screenshot({url : 'about:config', width : 300, height : 300}).then(function(data){
      var size = imageSize(data);
      assert.equal(size.width, 300);
      assert.equal(size.height, 300);
      done();
    });

  });

});
