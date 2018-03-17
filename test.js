const fs = require('fs');
const path = require('path');
const r = require('request');

r
.get('https://scontent-nrt1-1.cdninstagram.com/vp/1b5d8227a3cd50fd4a4bbba957a17fec/5B44D35B/t51.2885-15/e35/28766417_166569440577533_2391752332342722560_n.jpg')
.pipe(fs.createWriteStream(path.resolve() + `/123.png`))