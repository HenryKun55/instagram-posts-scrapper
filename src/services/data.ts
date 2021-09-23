let chrome = {};
let puppeteer;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  chrome = require("chrome-aws-lambda");
  puppeteer = require("puppeteer-core");
} else {
  puppeteer = require("puppeteer");
}

const user_instagram = "codigotecnologia";

export async function getPosts() {
  const browser = await puppeteer.launch({
    args: [
      //@ts-ignore
      ...(chrome.args || ""),
      "--hide-scrollbars",
      "--disable-web-security",
    ],
    //@ts-ignore
    executablePath: await chrome.executablePath,
    headless: false,
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();

  const imgList = await page.evaluate(() => {
    const nodeList = document.querySelectorAll("article img");

    //@ts-ignore
    const imgArray = [...nodeList];

    const imgList = imgArray.map((img) => ({ src: img.src }));

    return imgList;
  });

  await browser.close();
  return imgList;
}
