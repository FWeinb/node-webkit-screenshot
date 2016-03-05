node-webkit-screenshot [![NPM version](https://badge.fury.io/js/node-webkit-screenshot.svg)](http://badge.fury.io/js/node-webkit-screenshot) [![Build Status](https://travis-ci.org/FWeinb/node-webkit-screenshot.svg?branch=master)](https://travis-ci.org/FWeinb/node-webkit-screenshot)
---
> Create screenshots using [node-webkit](https://github.com/rogerwang/node-webkit)

## Install

```shell
npm install node-webkit-screenshot
```


## Usage

```js
var fs = require('fs');
var screenshot = require('node-webkit-screenshot');

screenshot({
  url : 'http://google.de',
  width : 1024,
  height : 768
})
.then(function(buffer){
  fs.writeFile('./out.png', buffer, function(){
    // This will close the screenshot service
    screenshot.close();
  });
});

```

#### screenshot(options)

##### port

Type: `number`
Default: `3000`

Specify custom port number for the webkit browser

##### delay

Type: `number` *(seconds)*
Default: `0`

Delay capturing the screenshot.

Useful when the site does things after load that you want to capture.

##### format

Type: `string` png|jpeg
Default: `png`

Specify the image type fot he screenshot

##### width

Type: `int`
Default: `0`

Specify the with of the browser window

##### height

Type: `int`
Default: `0`

Specify the height of the browser window

##### crop (since `0.2.1`)
Type: `Object`
Default: `undefined`

This will only work if generating png's.
A crop object may look like this:
```js
{
  top : 10,
  left : 10,
  width : 100,
  height : 100
}
```


#### close()

This will close the `node-webkit` process. You have to call this function before node is able to exit.



## Troubleshooting

If you would like to use this on travis or with a framebuffer like xvfb than you need to set the environment variable
`NODESCREENSHOT_SHOW` to `1`. (`export NODESCREENSHOT_SHOW`).
See this [`.travis.yml`](https://github.com/FWeinb/node-webkit-screenshot/blob/master/.travis.yml) for more information


# Changelog

##### `0.3.2`
  * Fix installation of sub modules for nw-screenshot
  * Upgrade various modules

##### `0.3.1`
  * Fix black backgrounds in screenshots.

##### `0.3.0`
  * Add `close()` method.

##### `0.2.1`
  * remove `toolbar` for node-webkit
  * Add `crop` option.

##### `0.2.0`

  * Rewrite using socket.io to communicate between a single nw-snapshot instance.
  * Promise based API

##### `0.1.0`

  * 0.1.0 Inital release
