const fs = require("fs");
const dirs = require("./Directory");
const browserObject = require("./browser");
const scrapper = require("./Scrapper");
const offline = require("./Offline");

//Start the browser and create a browser instance
let browserInstance = browserObject.startBrowser();

async function scrapeAll(browserInstance) {
  let browser;
  try {
    browser = await browserInstance;

    // create backup dir if not exist

    // get category list
    categories = await scrapper.addCategoryList(browser);

    /*
        - iterate every category
        - for each category got through every page(p)
        - for each page parse all the product page
     */
    for (cat of categories) {
      //   console.log(cat.name);

      for (let p = 1; ; p++) {
        let catagoryPath =
          dirs.dirToday +
          "/" +
          cat.name +
          "/page_" +
          (p + 1).toString() +
          ".html";
        if (fs.existsSync(catagoryPath)) {
          console.log(cat.name + "page : " + p + " already exists");
          continue;
        }

        let productList = await scrapper.addIndividualCategory(
          browser,
          cat.name,
          cat.url,
          p
        );
        if (productList === false) break;

        for (product of productList) {
          await scrapper.addProduct(
            browser,
            product.name,
            product.url,
            cat.name,
            p
          );
        }
      }
    }

    await offline.createJsonData(browser);

    console.log("Successfully Executed");

    await browser.close();
  } catch (err) {
    console.log("Could not resolve the browser instance => ", err);
  }
}

scrapeAll(browserInstance);
