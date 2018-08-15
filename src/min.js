const puppeteer = require('puppeteer');
const { mn } = require('./config/default');
const srcToImg = require('./helper/srcToimg');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://image.baidu.com/');
  console.log('go to https://image.baidu.com/');

  // 让浏览器显示变大
  await page.setViewport({
    width: 1920,
    height: 2080
  });
  console.log('reset viewport');

  // 获得焦点,输入的文字,点击
  await page.focus('#kw');
  await page.keyboard.sendCharacter('狗');
  await page.click('.s_search');
  console.log('go to search list');

  page.on('load', async () => {
    console.log('page loading done');

    const srcs = await page.evaluate(() => {
      const imgs = document.querySelectorAll('img.main_img');
      return Array.prototype.map.call(imgs, img => img.src)
    });
    console.log(`get ${srcs.length}`);

    srcs.forEach(async (src) => {
    // sleep
      await page.waitFor(200);
      await srcToImg(src, mn);
    });

    await browser.close();
  });

})();