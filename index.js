import lighthouse from 'lighthouse';
import fs from 'fs';
import puppeteer from 'puppeteer';
let siteUrl = 'https://shop.trimarketplace.com/login';
let siteDomain = 'https://shop.trimarketplace.com'
import config from './config/desktop-config.js';
import buildHtml from './build-html.js';
import buildNewDate from './build-new-date.js';

async function asyncCall() {
    const urlObj = new URL(siteDomain);
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
            console.log(`${dirName}/login-${buildNewDate()}.html written`)
        }
    });
    const selector = '.onpagelogin form .login-btn';
    const btn = await page.$(selector)
    const present = await btn.isVisible()


    //start authenticating to log into the site
    await page.type('.onpagelogin form .username-input', '1_pw_user1@trimarkusa.com')
    await page.type('.onpagelogin form .password-input', 'Welcome1$')
    await Promise.all([
        page.click('.onpagelogin form .login-btn'),
        page.waitForNavigation()
    ]);
    console.log('finished login');

    let urlstoTest = [
        { pageName: 'my-account', url: "https://shop.trimarketplace.com/my-account" },
        { pageName: 'my-catalog', url: "https://shop.trimarketplace.com/mycatalog" },
        { pageName: 'my-order-history', url: "https://shop.trimarketplace.com/my-order-history" },
        { pageName: 'my-approvals', url: "https://shop.trimarketplace.com/myapprovals" },
        { pageName: 'my-wishlist', url: "https://shop.trimarketplace.com/my-wishlists" },
        { pageName: 'my-saved-carts', url: "https://shop.trimarketplace.com/my-saved-carts" },
        { pageName: 'my-invoices', url: "https://shop.trimarketplace.com/invoices" },
        { pageName: 'pdp', url: "https://shop.trimarketplace.com/product-details/-/o/d/Libbey-Classics-Contour-Wine-Glass/ecom-item/10010574" },
        { pageName: 'shopping-cart', url: "https://shop.trimarketplace.com/shopping-cart" },
        { pageName: 'checkout-page', url: "https://shop.trimarketplace.com/checkout" }
    ]



    for (let i = 0; i < urlstoTest.length; i++) {
        console.log(urlstoTest[i])
        await page.goto(urlstoTest[i].url)
        const result = await lighthouse(urlstoTest[i].url, lhOpts, config, page);

        const lhr = result.report;

        fs.writeFile(`${dirName}/${urlstoTest[i].pageName}-${buildNewDate()}.html`, lhr, err => {
            if (err) {
                console.error(err);
            }
            else {
                // file written successfully
                console.log(`${dirName}/${urlstoTest[i].pageName}-${buildNewDate()}.html written`)

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




