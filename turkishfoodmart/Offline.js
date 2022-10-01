const fs = require("fs");
const dirs = require("./Directory");

const today_date = dirs.today_date;

async function parseProduct(dir) {
  dir = "../" + dir;
  text = require(dir);
  let product = JSON.parse(JSON.stringify(text));
  return product;
}
async function createJsonData(browser) {
  let dir = "./backup/turkishfoodmart/backUp_of_" + today_date;

  const getDirectories = (source) =>
    fs
      .readdirSync(source, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

  res = {};
  let catNameList = getDirectories(dir);

  for (cat of catNameList) {
    let dirPage = dir + "/" + cat;
    let pageList = getDirectories(dirPage);

    res[cat] = [];

    for (page of pageList) {
      let dirProductList = dirPage + "/" + page;
      let productList = fs
        .readdirSync(dirProductList)
        .filter((el) => el.match(".json"));

      //   console.log(productList);
      for (product of productList) {
        let dirProduct = dirProductList + "/" + product;
        // console.log(dirProduct);
        res[cat].push(await parseProduct(dirProduct));
      }
    }
  }
  if (fs.existsSync(dir + "data" + ".json")) {
    console.log("exist");
    // fs.unlinkSync(dir + "/data" + ".json");
  }
  fs.writeFile(
    "data_of_turkishfoodmart_" + today_date + ".json",
    JSON.stringify(res),
    "utf8",
    function (err) {
      if (err) {
        return console.log(err);
      }
    }
  );
}

async function addCategorys(categories) {
  // console.log(categories);
  for (cat of categories) {
    let fileName = dirs.dirTodoCat + "/" + cat.name + ".json";
    if (fs.existsSync(fileName)) continue;
    fs.writeFile(fileName, JSON.stringify(cat), "utf8", function (err) {
      if (err) {
        return console.log(err);
      }
    });
  }
}

module.exports = {
  createJsonData,
  addCategorys,
};
