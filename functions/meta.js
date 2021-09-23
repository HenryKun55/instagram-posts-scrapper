let chrome = {};
let puppeteer;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  chrome = require("chrome-aws-lambda");
} else {
  puppeteer = require("puppeteer");
}

exports.handler = async function (event, context) {
  const user_instagram = "codigotecnologia";

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

  await page.goto(`https://www.instagram.com/${user_instagram}/`);

  const imgList = await page.evaluate(() => {
    const nodeList = document.querySelectorAll("article img");

    //@ts-ignore
    const imgArray = [...nodeList];

    const imgList = imgArray.map((img) => ({ src: img.src }));

    return imgList;
  });

  await browser.close();
  return {
    statusCode: 200,
    body: JSON.stringify({
      status: "ok",
      posts: imgList,
    }),
  };
};
