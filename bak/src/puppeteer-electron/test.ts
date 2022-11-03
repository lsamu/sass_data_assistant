import { BrowserContext } from "puppeteer";

const puppeteer = require('.')

;(async () => {
	const browser:BrowserContext = await puppeteer.launch({headless:false, args: ['--autoplay-policy=no-user-gesture-required'] })
    const pages = await browser.pages();
    let page = pages[0];
    let response = await page.goto("http://www.so.com");
    if(response.ok()){
       let input = await page.$$("#input");
       input[0].type("奶粉");

       let btn = await page.$$("#search-button");
       btn[0].click();
    }
    // let page = await browser.newPage();
    // await page.goto("http://www.so.com");

})();