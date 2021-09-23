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

  await page.goto(`https://www.instagram.com/${user_instagram}/`);

  const imgList = await page.evaluate(() => {
    // Toda essa função será executada no browser

    // Pegar imagens que estão na parte de posts
    const nodeList = document.querySelectorAll("article img");

    // Transformar NodeList em array
    const imgArray = [...nodeList];

    // Transformar os nodes (elementos html) em objetos javascript
    const imgList = imgArray.map((img) => ({ src: img.src }));

    // Colocar para fora da função
    return imgList;
  });

  await browser.close();
  return imgList;
}
