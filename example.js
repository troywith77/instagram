const fs = require('fs');
const fse = require('fs-extra')
const path = require('path');
const puppeteer = require('puppeteer');
const request = require('request');
const getIns = require('./gist');

(async () => {
  const id = 'BgSAmJqAMwQ';
  const browser = await puppeteer.launch({
    args: [
     '--proxy-server=127.0.0.1:1080',
    ]
  });
  const page = await browser.newPage();
  await page.goto(`https://www.instagram.com/p/${id}`);
  const _sharedData = JSON.parse(await page.evaluate(
    () => JSON.stringify(window._sharedData)
  ));
  const { images, videoUrl } = getIns(_sharedData);
  // console.log(images);
  if (videoUrl) {
    fse.ensureDir(id);
    request
    .get(videoUrl)
    .pipe(fs.createWriteStream(path.resolve() + `/${id}/${id}.mp4`))
  } else {
    images.forEach(async (url, index) => {
      fse.ensureDir(id);
      request
      .get(url)
      .pipe(fs.createWriteStream(path.resolve() + `/${id}/${id + '-' + index}.png`))
    })
  }
  await browser.close();
})();