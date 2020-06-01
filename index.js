
const puppeteer = require('puppeteer');
const { Storage } = require('@google-cloud/storage');

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