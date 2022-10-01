var fs = require('fs');
const scraperObject = {
    url: 'https://www.mffoodmart.com/shop/',
    async scraper(browser, catagoryUrl, directoryName, page_num) {
        this.url = catagoryUrl;
        page_num = 1;
        let page = await browser.newPage();
        // Navigate to the selected page
        await page.goto(this.url, { timeout: 0 });
        page.setDefaultNavigationTimeout(0);
        const today_date = new Date().toISOString().split('T')[0];

        let dir = './backup/mffoodmart/backUp_of_' + today_date + '/' + directoryName;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        const catagoryPath = dir + "/page_" + page_num + ".html";
        fs.writeFile(catagoryPath, await page.content(), function (err) {
            if (err) {
                console.log(err)
            }
        });
        let scrapedData = [];
        async function scrapeCurrentPage() {
            //save file in a specific folder
            try {
                await page.waitForSelector('div.products.elements-grid.wd-products-holder.wd-spacing-20.grid-columns-3.wd-quantity-enabled.pagination-pagination.align-items-start.row');

                // Get the link to all the required catagories
                //Downloaded page
                let urls = await page.$$eval('div.product-element-top.wd-quick-shop', links => {
                    links = links.map(el => el.querySelector('a').href)//el.querySelector('a').href)
                    return links;
                });



                let productInfo = (link) => new Promise(async (resolve, reject) => {
                    let dataObj = {};
                    let newPage = await browser.newPage();
                    await newPage.goto(link, { timeout: 0 });
                    newPage.setDefaultNavigationTimeout(0);
                    let name = "undefined";
                    try {
                        name = await newPage.$eval('div.col-lg-6.col-12.col-md-6.text-left.summary.entry-summary > div > h1', text => text.textContent.replace(/(\r\n\t|\n|\r|\t)/gm, "").replace(/(\/)/gm, " or "));
                        dataObj['name'] = name;
                    } catch (err) {
                        dataObj['name'] = "";
                    }
                    const today_date = new Date().toISOString().split('T')[0];
                    let dir = './backup/mffoodmart/backUp_of_' + today_date + '/' + directoryName + '/page_' + page_num;
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }
                    const catagoryPath = dir + "/" + name + ".html";
                    fs.writeFile(catagoryPath, await newPage.content(), function (err) {
                        if (err) {
                            console.log(err)
                        }
                    });

                    dataObj['downloaded_pageLink'] = catagoryPath;
                    dataObj['actual_pageLink'] = link;


                    //id
                    try {
                        dataObj['shop_product_id'] = await newPage.$eval('div.main-page-wrapper > div > div > div > div[id^=product-] ', text => text.id);

                    } catch (err) {
                        dataObj['shop_product_id'] = ""
                    }

                    //category
                    try {
                        let productCategory = await newPage.$$eval('div.product_meta > span.posted_in > a', text => {
                            text = text.map(el => el.innerText.replace(/(\/\n\t|\n|\t)/gm, " ").replace(/(\/)/gm, " or "))
                            return text;
                        });
                        dataObj['catagory'] = productCategory;
                    } catch (err) {
                        dataObj['catagory'] = "";
                    }

                    //tags
                    try {

                        let productTag = await newPage.$$eval('span.tagged_as > a', text => {
                            let data = [];
                            data = text.map(el => {
                                let val = {};
                                val["name"] = el.innerText;
                                val["url"] = el.href;
                                return val;
                            })
                            return data;
                        });
                        dataObj['tag'] = productTag;
                    } catch (err) {
                        dataObj['tag'] = [];
                    }

                    //price
                    try {
                        dataObj['price'] = await newPage.$eval('div.col-lg-6.col-12.col-md-6.text-left.summary.entry-summary > div > p > span', text => text.innerText);
                        dataObj['currency'] = await newPage.$eval('div.col-lg-6.col-12.col-md-6.text-left.summary.entry-summary > div > p > span > bdi > span', text => text.textContent.replace(/(\r\n\t|\n|\r|\t)/gm, ""));
                    } catch (err) {
                        dataObj['price'] = ""
                        dataObj['currency'] = "";
                    }
                    try {
                        let is_stock_Out = await newPage.$eval('div.col-lg-6.col-12.col-md-6.text-left.summary.entry-summary > div > p.stock.out-of-stock.wd-style-default', text => text.textContent);
                        dataObj['availability'] = 'no';
                    } catch (err) {
                        dataObj['availability'] = 'yes';
                    }


                    //image
                    const images = await newPage.evaluate(() => {
                        return document.querySelector('.wp-post-image').src;
                    });
                    dataObj['images'] = images;

                    //comments
                    try {
                        let no_commant = await newPage.$eval('#comments > p', text => text.textContent);
                        dataObj['comments'] = "no_comment";
                    } catch (err) {
                        dataObj['comments'] = "comment have";
                    }

                    //comments
                    try {
                        dataObj['discription'] = await newPage.$eval('.woocommerce-product-details__short-description', text => text.innerText)
                    } catch (err) {
                        dataObj['discription'] = ""
                    }

                    //scraped_at
                    const date = new Date();
                    const utcStr = date.toUTCString();
                    const scrapt = new Date(utcStr);
                    dataObj['scraped_at'] = scrapt;



                    resolve(dataObj);
                    await newPage.close();
                });

                for (link in urls) {
                    let currentPageData = await productInfo(urls[link]);
                    scrapedData.push(currentPageData);
                    let data = fs.readFileSync('./mffoodmart/config.json');
                    let delay = JSON.parse(data);
                    await new Promise(function (resolve) {
                        console.log("delay")
                        setTimeout(resolve, delay["delay"])
                    });
                }
                let nextButtonExist = false;
                try {
                    const nextButton = await page.$eval('a.next.page-numbers', a => a.textContent);
                    nextButtonExist = true;
                }
                catch (err) {
                    nextButtonExist = false;
                }

                if (nextButtonExist) {
                    await page.click('a.next.page-numbers');
                    this.url = await page.$eval('a.next.page-numbers', text => text.href);
                    await page.close();
                    page_num = page_num + 1;
                    page = await browser.newPage();
                    await page.goto(this.url, { timeout: 0 });

                    const today_date = new Date().toISOString().split('T')[0];
                    let dir = './backup/mffoodmart/backUp_of_' + today_date + '/' + directoryName;
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }
                    const catagoryPath = dir + "/page_" + page_num + ".html";
                    fs.writeFile(catagoryPath, await page.content(), function (err) {
                        if (err) {
                            console.log(err)
                        }
                    });

                    return scrapeCurrentPage();
                }
                await page.close();
                return scrapedData;
            } catch (err) {
                console.log("NO Data available");
                return scrapedData;
            }
        }
        let data = await scrapeCurrentPage();
        return data;

    }
}

module.exports = scraperObject;
