const puppeteer = require("puppeteer");

/**
 * @returns  a browser instance
 */
async function startBrowser() {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,

      args: ["--disable-setuid-sandbox"],
      ignoreHTTPSErrors: true,
    });
  } catch (err) {
    console.log("Could not create a browser instance => : ", err);
  }
  return browser;
}

module.exports = {
  startBrowser,
};