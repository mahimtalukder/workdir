var fs = require('fs');
const pageScraper = require('./pageScraper');
const puppeteer = require('puppeteer');
async function scrapeAll(browserInstance) {
    let browser;
    try {
        browser = await browserInstance

        let category = (link) => new Promise(async (resolve, reject) => {
            const page = await browser.newPage();
            await page.goto(link, { timeout: 0 });
            page.setDefaultNavigationTimeout(0);

            const today_date = new Date().toISOString().split('T')[0];
            let dir = './backup/mffoodmart/backUp_of_' + today_date;
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }

            const catagoryPath = dir + "/category.html";
            fs.writeFile(catagoryPath, await page.content(), function (err) {
                if (err) {
                    console.log(err)
                }
            });
            // Get the link to all the required books
            let urls = await page.$$eval('#woocommerce_product_categories-4 > ul > li > a', links => {
                // Extract the links from the data
                let data = {};
                data["url"] = links.map(el => el.href)
                data["name"] = links.map(el => el.innerText.replace(/(\/\n\t|\n|\t)/gm, " ").replace(/(\/)/gm, " or "))
                return data;
            });
            await page.close();
            resolve(urls);
        })

        let allScrapingInfo = await category("https://www.mffoodmart.com/shop/");
        let scrapedData = {};

        for (let i = 0; i < allScrapingInfo["name"].length; i++) {
            scrapedData[allScrapingInfo["name"][i]] = await pageScraper.scraper(browser, allScrapingInfo["url"][i], allScrapingInfo["name"][i], 1);
        }
        await browser.close();

        const today_date = new Date().toISOString().split('T')[0];

        fs.writeFile("./data_of_mffoodmart_" + today_date + ".json", JSON.stringify(scrapedData), 'utf8', function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The data has been scraped and saved successfully!");
        });


    }
    catch (err) {
        console.log("Could not resolve the browser instance => ", err);
    }
}

module.exports = (browserInstance) => scrapeAll(browserInstance)