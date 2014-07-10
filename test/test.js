/* globals  assert, describe, it */
'use strict';

var assert = require('assert');
var imageSize = require('image-size');
var concat = require('concat-stream');
var once = require('lodash.once');
var isPng = require('is-png');
var isJpg = require('is-jpg');

var screenshot = require('./../index.js');

describe('screenshot', function(){

  it('should produce pngs', function(done){
    this.timeout(0);
    var stream = screenshot({url : 'about:config', width : 500, height : 500});

    stream.pipe(concat(function (data) {
      assert.ok(isPng(data));
      done();
    }));

  });

  it('should have a `delay` option', function(done){
    this.timeout(0);
    var stream = screenshot({url : 'about:config', delay : 2, width : 500, height : 500});

    var now = new Date();
    stream.on('data', once(function () {
      assert((new Date()) - now > 2000);
      done();
    }));
  });

  it('should have a `format` option', function(done){
    this.timeout(0);
    var stream = screenshot({url : 'about:config', width : 500, height : 500, format : 'jpeg'});

    stream.pipe(concat(function (data) {
      assert.ok(isJpg(data));
      done();
    }));

  });


  it('should create a screenshot with 500x500 pixels', function(done){
    var stream = screenshot({url : 'about:config', width : 500, height : 500});

    stream.pipe(concat(function (data) {
      var size = imageSize(data);
      assert.equal(size.width, 500);
      assert.equal(size.height, 500);
      done();
    }));

  });

});
