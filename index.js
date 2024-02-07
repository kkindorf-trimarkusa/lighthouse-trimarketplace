import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import url from 'url';
import fs from 'fs';
import puppeteer from 'puppeteer';

let siteUrl = 'https://qa.trimarketplace.com';

async function asyncCall() {
    const urlObj = new URL(siteUrl);
    let dirName = urlObj.host;
    if (urlObj.pathname !== "/") {
        dirName = dirName + urlObj.pathname.replace(/\//g, "_");
    }
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName);
    }
    let lhOpts = {
        output: 'html',
        disableStorageReset: true
    }

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(siteUrl, {
        waitUntil: ['load']
    })


    // run an initial lighthouse report for the login page before filling in form for authentication
    let initialPageresult = await lighthouse(siteUrl, lhOpts, undefined, page);
    const lhr = initialPageresult.report;
    fs.writeFile(`login.html`, lhr, err => {
        if (err) throw err;
    });
    const selector = '.onpagelogin form .login-btn';
    const btn = await page.$(selector)
    const present = await btn.isVisible()
    console.log(present)


    //start authenticating to log into the site
    await page.click('.cc-compliance')
    await page.type('.onpagelogin form .username-input', '1_pw_approver1@trimarkusa.com')
    await page.type('.onpagelogin form .password-input', 'Welcome1$')
    await Promise.all([
        page.click('.onpagelogin form .login-btn'),
        page.waitForNavigation()
    ]);
    console.log('finished login');

    let urlstoTest = [
        { pageName: 'my-account', url: "https://qa.trimarketplace.com/my-account" },
        { pageName: 'my-catalog', url: "https://qa.trimarketplace.com/mycatalog" }
    ]



    for (let i = 0; i < urlstoTest.length; i++) {
        console.log(urlstoTest[i])
        await page.goto(urlstoTest[i].url)
        const result = await lighthouse(urlstoTest[i].url, lhOpts, undefined, page);
        const lhr = result.report;
        fs.writeFile(`${urlstoTest[i].pageName}.html`, lhr, err => {
            if (err) throw err;
        });
    }

}


asyncCall();




