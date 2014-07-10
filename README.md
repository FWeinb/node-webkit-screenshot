node-webkit-screenshot
---
> Create screenshots using [node-webkit](https://github.com/rogerwang/node-webkit)

### Install

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
}).pipe(fs.createWriteStream('./out.png'));
```

#### screenshot(options)

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



