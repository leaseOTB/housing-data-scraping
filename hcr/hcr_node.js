const puppeteer = require('puppeteer'); 


//open browser and head to the page 
 const datascrape= async () => { 
 const browser = await puppeteer.launch({headless: false, args: [
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
    '--deterministic-fetch'
  ]});
  const page = await browser.newPage();
  await page.goto("https://apps.hcr.ny.gov/BuildingSearch/", page,{waitUntil:'load', timeout:3000});
  await page.setViewport({ width: 1366, height: 663 })
  
  // Navigate on the page to click dropdown options 
  await page.waitForXPath(('//*[@id="ctl00_ContentPlaceHolder1_zipCodeSearchLinkButton"]'));
  await page.click('#ctl00_ContentPlaceHolder1_zipCodeSearchLinkButton');
  await page.waitFor(1000);


 const counties = await page.$$eval('select#ctl00_ContentPlaceHolder1_countyListDropDown > optgroup:nth-child(n+2) > option:nth-child(n+1)', all => all.map(a => a.getAttribute('value')));
//console.log(counties); to view counties
for (let county of counties) {
  //await page.waitForSelector('#ctl00_ContentPlaceHolder1_countyListDropDown option')
 await page.click('select#ctl00_ContentPlaceHolder1_countyListDropDown', page, {waitUntil:'load'});
 await page.waitFor(1000);
 await page.keyboard.press('ArrowDown');

 const zips = await page.$$eval('select#ctl00_ContentPlaceHolder1_zipCodesDropDown > option:nth-child(n+1)', il => il.map(b => b.getAttribute('value')));

 for (let zip of zips) {
  // wait for the zipcode options to load
  while ( await page.waitForSelector('#ctl00_ContentPlaceHolder1_zipCodesDropDown option:nth-child(n+1)', page,{visible: true})) {
          //click on every zipcode 
          await page.click('#ctl00_ContentPlaceHolder1_zipCodesDropDown', page, {waitUntil:'load'});
          await page.waitFor(1000);
          await page.keyboard.press('ArrowDown')
          await page.click('#ctl00_ContentPlaceHolder1_submitZipCodeButton');

          // catch the error
         try {
          
            await page.$$eval('#ctl00_ContentPlaceHolder1_buildingsGridView > tbody');
          
         }catch (error) {
         console.log("Error Caught")
            
         while   (await page.waitForSelector('#ctl00_ContentPlaceHolder1_zipCodesDropDown option:nth-child(n+1)', page,{visible: true})){
             await page.click('#ctl00_ContentPlaceHolder1_zipCodesDropDown', page, {waitUntil:'load'});
             await page.waitFor(1000);
             await page.keyboard.press('ArrowDown')
             await page.click('#ctl00_ContentPlaceHolder1_submitZipCodeButton');
         
    await page.waitForFunction(tableselector => !!document.querySelectorAll(tableselector), {},'#ctl00_ContentPlaceHolder1_buildingsGridView > tbody > tr' ) 
   
   const data = await page.$$eval('#ctl00_ContentPlaceHolder1_buildingsGridView > tbody > tr', il => il.map(b => b.textContent.trim('\n')));
   

console.log(data)
 };
}
}

}

};
 }

datascrape();



