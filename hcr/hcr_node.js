const puppeteer = require('puppeteer'); 
const fs = require('fs');

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
  
  // Navigate on the page to click dropdown options 
  await page.waitForXPath(('//*[@id="ctl00_ContentPlaceHolder1_zipCodeSearchLinkButton"]'),[1]);
  await page.click('#ctl00_ContentPlaceHolder1_zipCodeSearchLinkButton');
  await page.waitFor(1000);
  await page.click('#ctl00_ContentPlaceHolder1_countyListDropDown');
  
  
  //
//const countiesarr = [counties];
//console.log(countiesarr);
const counties = await page.$$eval('select#ctl00_ContentPlaceHolder1_countyListDropDown option', all => all.map(a => a.innerText));
for (let i = 1; i< counties.length; i++) {
  await page.waitForSelector('select#ctl00_ContentPlaceHolder1_countyListDropDown option');
  const cnty = counties[i];
  const eachcounty = await page.$('select#ctl00_ContentPlaceHolder1_countyListDropDown');
  console.log(eachcounty);
  await page.waitFor(1000);  
  eachcounty.select(cnty); 
  //console.log(cnty);

await page.waitForXPath('//*[@id="ctl00_ContentPlaceHolder1_zipCodesDropDown"]');

const zip = await page.$$eval('select#ctl00_ContentPlaceHolder1_zipCodesDropDown option', il => il.map(b => b.innerText));

//console.log(zip); 

for (let j=0; j< zip.length ;j++) {

 const zipcodes = zip[j];
 const eachzip = await page.$('select#ctl00_ContentPlaceHolder1_zipCodesDropDown option');
 console.log(eachzip);
 eachzip.select(zipcodes);
 //const next = await page.evaluate(eachzip => eachzip.textContent,eachzip);
 await page.waitFor(1000);
 await page.waitForSelector('select#ctl00_ContentPlaceHolder1_zipCodesDropDown',{visible:true});

 console.log(zipcodes);

await page.waitFor(1000);
await page.click('select#ctl00_ContentPlaceHolder1_submitZipCodeButton', page, {waitUntil:'load'});


for (let k = 0; k < 70 ;k++){ 
   await page.waitForXPath('//*[@id="ctl00_ContentPlaceHolder1_buildingsGridView"]');
   const table = await page.evaluate(() => {
     const rows = document.querySelectorAll('#ctl00_ContentPlaceHolder1_buildingsGridView tr');
     return Array.from(rows, row => {
       const columns = row.querySelectorAll('td');
       return Array.from(columns, column => column.innerText);
     });
   })
    console.log("test done");
   };

  //const zipcode = await page.click('#ctl00_ContentPlaceHolder1_zipCodesDropDown');
  };
  
//

 //
};
 
};
    



 

datascrape();
      
     
  