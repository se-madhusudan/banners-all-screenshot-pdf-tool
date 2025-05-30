const puppeteer = require("puppeteer");
const ora = require("ora");
const mkdirp = require("mkdirp");
const {  rmDir } = require("./helper");
const spinner = new ora();
const FOLDER_OUTPUT = "./tools/screenshots/output/";
const FOLDER_NAME = "banner";
const SCREEN_PATH = `./tools/screenshots/output/${FOLDER_NAME}/`;
const SERVER_PATH = "http://localhost:3000/";
const INNER_PAGES = ["dist/unbranded/1/300X250", "dist/unbranded/1/300X600","dist/unbranded/1/728X90","dist/unbranded/2/300X250", "dist/unbranded/2/300X600","dist/unbranded/2/728X90"];


const VIEWPORT_WIDTH = 1360;
const VIEWPORT_HEIGHT = 768;
const VIEWPORT_OPTS = {
  width: VIEWPORT_WIDTH,
  height: VIEWPORT_HEIGHT,
  deviceScaleFactor: 2,
  hasTouch: true,
};

let viewportOpts = VIEWPORT_OPTS;
rmDir(FOLDER_OUTPUT + FOLDER_NAME); // clean folder with screens

mkdirp(FOLDER_OUTPUT);
mkdirp(FOLDER_OUTPUT + FOLDER_NAME);
mkdirp(FOLDER_OUTPUT + FOLDER_NAME + "/unbranded-1");
mkdirp(FOLDER_OUTPUT + FOLDER_NAME + "/unbranded-2");

(async () => {
  // const browser = await puppeteer.launch({ devtools: false });
  const browser = await puppeteer.launch({
    devtools: false,
    headless: true,
    args: ["--no-sandbox"],
    ignoreHTPPSErrors: true,
  });
  const page = await browser.newPage();

  /** Run spinner and execute recived Function */
  async function makeScreen(msg, func) {
    spinner.start(`Start - ${msg}`);
    await func();
    spinner.succeed(`Finish - ${msg}`);
  }

  async function screenshot(name, clip) {

    let unbranded1 = name.includes("dist-unbranded-1");
    if(unbranded1){
    var subfolder = "unbranded-1/";
    }
    let unbranded2 = name.includes("dist-unbranded-2");
    if(unbranded2){
    var subfolder = "unbranded-2/";
    }
    let opts = {
      path: SCREEN_PATH + subfolder +  name + ".png"
    };

    if (clip) {
      opts.clip = clip;
    }

    await page.screenshot(opts);
  }

  /**
   * Reset viewport height
   */
  async function resetVH() {
    viewportOpts.height = VIEWPORT_HEIGHT;
    await page.setViewport(viewportOpts);
  }

  /** Set base viewport */
  await page.setViewport(viewportOpts);
  await page.goto(`${SERVER_PATH}?screentest=true`, {
    waitUntil: "networkidle2",
  });
  await page.waitFor(3000 * 4);
  await makeScreen("Banner Screens", bannerScreen);

  /**
   * Screen Home
   */
  async function bannerScreen() {    
    await page.waitFor(2000);
    var k = 0;
    for (let i = 0; i < INNER_PAGES.length; i++) {
      await page.goto(SERVER_PATH+INNER_PAGES[i], {
        waitUntil: 'networkidle2'
      });
      var size = INNER_PAGES[i].split("/"); // ['dist', 'branded', '1', '300X250'] or ['dist', 'unbranded', '1-static', '300X250']
      var bannername = size[2].split("-"); // ['1', 'static']
      var size1 = size[3].split("X");
      var name =  size[0]+"-"+size[1]+"-"+size[2]+"-"+size[3];
          
      await page.evaluate((width ,height) => {           
        document.querySelector(".bannerWrapper").style.width = width+"px";
        document.querySelector(".bannerWrapper").style.height = height+"px";
      },size1[0],size1[1]);     
      viewportOpts.width = parseInt(size1[0]);
      viewportOpts.height = parseInt(size1[1]);
      await page.setViewport(viewportOpts);  
      await page.waitFor(1500);
      if(size[1] == "unbranded"){
        await screenshot(k + "-00-"+name+"-1-Page");
        await page.waitFor(4200);
        await screenshot(k + "-00-"+name+"-2-Page");
        await page.waitFor(4200);
        await screenshot(k + "-00-"+name+"-3-Page");
        await page.waitFor(4200);
        await screenshot(k + "-00-"+name+"-4-Page");
      }
          
      await resetVH();

      if(k == 9){
        k = 89;
      }
      if(k == 97){
        k = 970;
      }
      k++;
    }
    await resetVH();
  }
    /**
   * Screen Home
   */

  await browser.close();
})();