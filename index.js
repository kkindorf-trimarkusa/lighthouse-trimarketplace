import lighthouse from 'lighthouse';
import fs from 'fs';
import puppeteer from 'puppeteer';
let siteUrl = 'https://prod.trimarketplace.com';
import config from './config/desktop-config.js';
import buildHtml from './build-html.js';

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
    let initialPageresult = await lighthouse(siteUrl, lhOpts, config, page);
    const lhr = initialPageresult.report;
    fs.writeFile(`${dirName}/login.html`, lhr, err => {
        if (err) {
            console.error(err);
        }
        else {
            console.log(`${dirName}/login.html written`)
        }
    });
    const selector = '.onpagelogin form .login-btn';
    const btn = await page.$(selector)
    const present = await btn.isVisible()


    //start authenticating to log into the site
    await page.type('.onpagelogin form .username-input', '1_pw_approver1@trimarkusa.com')
    await page.type('.onpagelogin form .password-input', 'Welcome1$')
    await Promise.all([
        page.click('.onpagelogin form .login-btn'),
        page.waitForNavigation()
    ]);
    console.log('finished login');

    let urlstoTest = [
        { pageName: 'my-account', url: "https://prod.trimarketplace.com/my-account" },
        { pageName: 'my-catalog', url: "https://prod.trimarketplace.com/mycatalog" },
        { pageName: 'my-order-history', url: "https://prod.trimarketplace.com/my-order-history" },
        { pageName: 'my-approvals', url: "https://prod.trimarketplace.com/myapprovals" },
        { pageName: 'my-wishlist', url: "https://prod.trimarketplace.com/my-wishlists" },
        { pageName: 'my-saved-carts', url: "https://prod.trimarketplace.com/my-saved-carts" },
        { pageName: 'my-invoices', url: "https://prod.trimarketplace.com/invoices" },
        { pageName: 'pdp', url: "https://prod.trimarketplace.com/product-details/-/o/d/9-X1075-12-ALUMINUM-SHEET/ecom-item/10016095" },
        { pageName: 'shopping-cart', url: "https://prod.trimarketplace.com/shopping-cart" },
        { pageName: 'checkout-page', url: "https://prod.trimarketplace.com/checkout" }
    ]



    for (let i = 0; i < urlstoTest.length; i++) {
        console.log(urlstoTest[i])
        await page.goto(urlstoTest[i].url)
        const result = await lighthouse(urlstoTest[i].url, lhOpts, config, page);

        const lhr = result.report;

        fs.writeFile(`${dirName}/${urlstoTest[i].pageName}.html`, lhr, err => {
            if (err) {
                console.error(err);
            }
            else {
                // file written successfully
                console.log(`${dirName}/${urlstoTest[i].pageName}.html written`)

                if (urlstoTest.length - 1 === i) {
                    console.log('all lighthouse reports written')
                    let reportFiles = fs.readdirSync(dirName)
                    var html = buildHtml(reportFiles);
                    console.log('writing index.html')
                    fs.writeFile('index.html', html, err => {
                        if (err) {
                            console.error(err);
                        } else {

                            console.log(html)
                            console.log('index.html written')
                            process.exit();
                        }
                    });

                }

            }
        });

    }

}


asyncCall();




