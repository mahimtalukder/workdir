const fs = require("fs");
const dirs = require("./Directory");
let url = "https://turkishfoodmart.com";

async function delay(time = 6000) {
  await new Promise((resolve) => setTimeout(resolve, time));
  // console.log("waited " + time / 1000 + " seconds");
}

// create backup dir
const today_date = dirs.today_date;
let dir = "./backup/turkishfoodmart/backUp_of_" + today_date;

/*
    - download a copy of category list page
    @ returns a categories array of following property 
    [{
        name :
        url :
    }]
*/
async function addCategoryList(browser) {
  try {
    const page = await browser.newPage();

    // create category dir and saving home page
    const catagoryPath = dir + "/category.html";
    if (fs.existsSync(catagoryPath)) {
      let contentHtml = await fs.readFileSync(catagoryPath, "utf8");
      await page.setContent(contentHtml);
    } else {
      await page.goto(url, { waitUntil: "load", timeout: 0 });
      page.setDefaultNavigationTimeout(0);
      fs.writeFile(catagoryPath, await page.content(), function (err) {
        if (err) {
          console.log(err);
        }
      });
    }

    categoryList = await page.$$eval(
      "#emthemesModez-verticalCategories-sidebar > ul > li > a",
      (category) => {
        // Extract the links from the data
        let data = {};
        data["url"] = category.map((el) => el.href);
        data["name"] = category.map((el) =>
          el.innerText
            .replace(/(\/\n\t|\n|\t)/gm, " ")
            .replace(/(\/)/gm, " or ")
        );
        return data;
      }
    );

    let categories = [];
    for (let i = 0; i < categoryList["name"].length; i++) {
      let cat = {
        name: categoryList["name"][i],
        url: categoryList["url"][i],
      };
      categories.push(cat);
    }
    page.close();
    return categories;
  } catch (e) {
    console.log("cannot add categoryList : " + e);
  }
}

/*
  - download a copy of Product list page
  @ returns a Products array of following property 
    [{
        name :
        url :
      }]
      */
async function addIndividualCategory(browser, name, url, pageNo) {
  try {
    const page = await browser.newPage();

    let dir = "./backup/turkishfoodmart/backUp_of_" + today_date + "/" + name;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    const catagoryPath = dir + "/page_" + pageNo.toString() + ".html";
    if (fs.existsSync(catagoryPath)) {
      let contentHtml = await fs.readFileSync(catagoryPath, "utf8");
      await page.setContent(contentHtml);
      console.log("cat : " + name + " page : " + pageNo + " already exist");
    } else {
      pageUrl = url + "?page=" + pageNo.toString();
      await page.goto(pageUrl, { waitUntil: "load", timeout: 0 });
      page.setDefaultNavigationTimeout(0);
      fs.writeFile(catagoryPath, await page.content(), function (err) {
        if (err) {
          console.log(err);
        }
      });
      console.log("cat : " + name + " page : " + pageNo);
    }

    let page404NotFound =
      (await page.$(
        "#topOfPage > div.body > div.container > main > section > h1"
      )) || "";

    page404NotFound = page404NotFound ? "found" : "not found";
    if (page404NotFound === "found") {
      await page.close();
      return false;
    }

    productListParsed = await page.$$eval(
      "#product-listing-container > form > ul > li > article > div.card-body > h4 > a",
      (product) => {
        // Extract the links from the data
        let data = {};
        data["url"] = product.map((el) => el.href);
        data["name"] = product.map((el) =>
          el.innerText
            .replace(/(\/\n\t|\n|\t)/gm, " ")
            .replace(/(\/)/gm, " or ")
            .replace("|", " or ")
            .replace("|", " or ")
        );
        return data;
      }
    );
    // console.log(productListParsed);
    let productList = [];
    for (let i = 0; i < productListParsed["name"].length; i++) {
      let product = {
        name: productListParsed["name"][i],
        url: productListParsed["url"][i],
      };
      productList.push(product);
    }
    await page.close();
    return productList;
  } catch (e) {
    console.log("cannot add category ->" + name + " : " + e);
  }
}

/*
    Parse product from web page
    Product_fact,
    product_id:mf1//unique,
    shop_product_id://unique
    product_dim_id:
    product_category_id:,
    availability: //yes or no,
    price: ,
    currency:, //USD, CAD, BDT
    weight: ,
    shop_id:,
    pieces:,
    inventory:,
    scraped_at://datetime()UTC,
*/
async function addProductInfo(page, dir, productName, catName, url) {
  try {
    let product = {
      downloaded_pageLink: dir + "/" + productName + ".html",
      name: productName,
      catagory: [catName],
      actual_pageLink: url,
      shop_product_id: "",
      tag: [],
      currency: "USD",
      availability: "yes",
      comments: "no_comment",
      scraped_at: new Date().toISOString(),
    };

    product["price"] = await page.$eval(
      "#topOfPage > div.body > div.container > div > main > div.productView-scope > div.productView.productView--full > div.productView-detailsWrapper > div.productView-beforeAlsoBought > section:nth-child(3) > div.productView-options.productView-options--1col > div.productView-price > div:nth-child(2) > span.price.price--withoutTax.price--main",
      (el) =>
        el.innerText.replace(/(\/\n\t|\n|\t)/gm, " ").replace(/(\/)/gm, " or ")
    );
    product["desc"] = await page.$eval("#tab-description > div", (el) =>
      el.innerText.replace(/(\/\n\t|\n|\t)/gm, " ").replace(/(\/)/gm, " or ")
    );
    try {
      product["images"] = await page.$eval(
        "section.productView-images a img",
        (el) => el.src
      );
    } catch (e) {
      product["images"] = "";
    }

    fs.writeFile(
      dir + "/" + productName + ".json",
      JSON.stringify(product),
      "utf8",
      function (err) {
        if (err) {
          return console.log(err);
        }
        // console.log(product);
        // console.log("The data has been scraped and saved successfully! View it at './data.json'");
      }
    );
  } catch (e) {
    console.log("cannot add productInfo : " + e);
  }
}

/* 
    download a product webpage
*/
async function addProduct(browser, name, url, cat, pageNo) {
  try {
    const page = await browser.newPage();

    let dir =
      "./backup/turkishfoodmart/backUp_of_" +
      today_date +
      "/" +
      cat +
      "/page_" +
      pageNo.toString();
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    const productPath = dir + "/" + name + ".html";
    if (!fs.existsSync(productPath)) {
      // return;

      await page.goto(url, { waitUntil: "load", timeout: 0 });
      page.setDefaultNavigationTimeout(0);

      await delay();
      // console.log(name);
      await addProductInfo(page, dir, name, cat, url);

      fs.writeFile(productPath, await page.content(), function (err) {
        if (err) {
          console.log(err);
        }
      });
      console.log("product : " + name);
    } else {
      console.log("product : " + name + " already exists");
    }
    await page.close();
  } catch (e) {
    console.log("cannot add product->" + name + " : " + e);
  }
}

module.exports = {
  addCategoryList,
  addIndividualCategory,
  addProduct,
};
