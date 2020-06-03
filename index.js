
const puppeteer = require('puppeteer');
const { Storage } = require('@google-cloud/storage');

const puppeteer = require('puppeteer');

const PUPPETEER_OPTIONS = {
  headless: true,
  args: [
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--disable-setuid-sandbox',
    '--timeout=30000',
    '--no-first-run',
    '--no-sandbox',
    '--no-zygote',
    '--single-process',
    "--proxy-server='direct://'",
    '--proxy-bypass-list=*',
    '--deterministic-fetch',
  ],
};

const openConnection = async () => {
  const browser = await puppeteer.launch(PUPPETEER_OPTIONS);
  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36'
  );
  await page.setViewport({ width: 1680, height: 1050 });
  return { browser, page };
};

const closeConnection = async (page, browser) => {
  page && (await page.close());
  browser && (await browser.close());
};

exports.scrapingExample = async (req, res) => {
  let { browser, page } = await openConnection();
  try {
    await page.goto('https://medium.com/', { waitUntil: 'load' });
    const firstArticleTitle = await page.evaluate(() =>
      document.querySelector('.extremeHero-titleClamp').innerText
    );
    res.status(200).send(firstArticleTitle);
  } catch (err) {
    res.status(500).send(err.message);
  } finally {
    await closeConnection(page, browser);
  }
}


const storage = new Storage({
  projectId: 'your-gcp-project-id',
  keyFilename: 'keyfile.json',
});
const BUCKET_NAME = 'your-gcp-bucket-name';
const BucketInstance = storage.bucket(BUCKET_NAME);

const browser = await puppeteer.launch(PUPPETEER_OPTIONS);
const page = await browser.newPage();

await page._client.send('Page.setDownloadBehavior', {
  behavior: 'allow',
  downloadPath: '/tmp/',
});

await page.goto('https://example.com/', { waitUntil: 'load' });

await page.click('.downloadButton');
await BucketInstance.upload('/tmp/downloadedFile.pdf');
