const fs = require('fs');
const fse = require('fs-extra')
const path = require('path');
const puppeteer = require('puppeteer');
const request = require('request');
const getIns = require('./gist');

process.env.http_proxy = 'http://127.0.0.1:1080';
process.env.https_proxy = 'http://127.0.0.1:1080';

const main = async (id) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.146 Safari/537.36'
  });
  await page.goto(`https://www.instagram.com/p/${id}`);
  const _sharedData = JSON.parse(await page.evaluate(
    () => JSON.stringify(window._sharedData)
  ));
  const data = getIns(_sharedData);
  const { images, videoUrl } = data;
  if (!images && !videoUrl) return;
  const resourcesPath = path.resolve(__dirname, 'resources', id);
  fse.ensureDir(resourcesPath);
  if (videoUrl) {
    request
    .get(videoUrl)
    .pipe(fs.createWriteStream(path.resolve(resourcesPath, `${id}.mp4`)))
  } else {
    images.forEach(async (url, index) => {
      request
      .get(url)
      .pipe(fs.createWriteStream(path.resolve(resourcesPath, `${id + '-' + index}.png`)))
    })
  }
  await browser.close();
};

main('BffIsztnS82');