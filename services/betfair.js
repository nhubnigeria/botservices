/**
 * created by Ajor on 21 - 03 - 2018
*/
//=============================================================================

// dependencies
const P = require('puppeteer');

// module variables
const
  EVENT_URL = process.env.EVENT_URL,
  SELECTIONS_CONTAINER_SELECTOR = 'div.main-mv-runners-list-wrapper',
  MATCHED_AMOUNT_SELECTOR = '#main-wrapper > div > div.scrollable-panes-height-taker > div > div.page-content.nested-scrollable-pane-parent > div > div.bf-col-xxl-17-24.bf-col-xl-16-24.bf-col-lg-16-24.bf-col-md-15-24.bf-col-sm-14-24.bf-col-14-24.center-column.bfMarketSettingsSpace.bf-module-loading.nested-scrollable-pane-parent > div.scrollable-panes-height-taker.height-taker-helper > div > div.bf-row.main-mv-container > div > bf-main-market > bf-main-marketview > div > div.mv-sticky-header > bf-marketview-header-wrapper > div > div > mv-header > div > div > div.mv-secondary-section > div > div > span.total-matched';

async function bot() {
  // instantiate browser
  const browser = await P.launch({
    headless: true
  });
  // create blank page
  const page = await browser.newPage();
  // set viewport to 1366*768
  await page.setViewport({ width: 1366, height: 768 });
  // set the user agent
  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko)');
  // navigate to matchbook homepage
  await page.goto(EVENT_URL, {
  waitUntil: 'networkidle0',
  timeout: 100000
  });
  // await page.waitFor(30000)

   // ensure race container selector available
  console.log(`${SELECTIONS_CONTAINER_SELECTOR}`);
  const parentContainer = await page.waitForSelector(SELECTIONS_CONTAINER_SELECTOR, {
  timeout: 180000
  });

    // Message passing back to Parent Process
  page.on('console', data => {
    if (data.type == 'error') {
      // passing failure messages
      process.stderr.write(data.text)
    }
    else {
      // passing success message
      process.stdout.write(data.text)
    }
  })

  // page.on('console', data => console.log(data.text()));
  
  console.log('SELECTIONS_CONTAINER_SELECTOR found, continuing...');

  await page.$eval(SELECTIONS_CONTAINER_SELECTOR,
     (target, MATCHED_AMOUNT_SELECTOR) => {

      if(!target){
      console.error(`Failure: The value after evaluating '${SELECTIONS_CONTAINER_SELECTOR}' could not be verified`);
      }else{
      let matched_amount = document.querySelector(MATCHED_AMOUNT_SELECTOR)
          //Matched amount check
          if (!matched_amount) console.error(`Failure: The Selector '${MATCHED_AMOUNT_SELECTOR}' could not be verifed`);
          // Grabbing first row
          let firstRow = target.children[1].children[0].children[0].children[0].children[1].children[0].children[0].className;
          // console.log(firstRow)
          let sizeCount =  Array.from(document.querySelectorAll('.bet-button-size'));
          // console.log(sizeCount)
          let priceCount = Array.from(document.querySelectorAll('.bet-button-price'));
      // console.log(priceCount)
          let liquidity = [];
          let odd = [];

       // Adding a click listener on table
          target.addEventListener("click", async function (e) {
            if((e.target.className == 'bet-button-price') && (e.target.parentElement.parentElement.parentElement.className == 'bet-buttons back-cell last-back-cell')) {
              betType = 'b0';
              liquidity.push('b0')
            }
            else if((e.target.className == 'bet-button-price') && (e.target.parentElement.parentElement.parentElement.className == 'bet-buttons lay-cell first-lay-cell')) {
              betType = 'l0';
             liquidity.push('l0')
            }
            else if((e.target.className == 'bet-button-price') && (e.target.parentElement.parentElement.parentElement.nextElementSibling.className == 'bet-buttons back-cell last-back-cell')) {
              betType = 'b1';
              liquidity.push('b1')
            }
            else if((e.target.className == 'bet-button-price') && (e.target.parentElement.parentElement.parentElement.nextElementSibling.className == 'bet-buttons lay-cell first-lay-cell')) {
              betType = 'l1';
              liquidity.push('l1')
            }
            else if((e.target.className == 'bet-button-price') && (e.target.parentElement.parentElement.parentElement.nextElementSibling.nextElementSibling.className == 'bet-buttons back-cell last-back-cell')) {
              betType = 'b2';
              liquidity.push('b2')
            }
            else if((e.target.className == 'bet-button-price') && (e.target.parentElement.parentElement.parentElement.nextElementSibling.nextElementSibling.className == 'bet-buttons lay-cell first-lay-cell')) {
              betType = 'l2';
             liquidity.push('l2')
            }
            else if((e.target.className == 'bet-button-size') && (e.target.parentElement.parentElement.parentElement.className == 'bet-buttons back-cell last-back-cell')) {
              betType = 'b0';
              odd.push('b0')
            }
            else if((e.target.className == 'bet-button-size') && (e.target.parentElement.parentElement.parentElement.className == 'bet-buttons lay-cell first-lay-cell')) {
              betType = 'l0';
              odd.push('l0')
            }
            else if((e.target.className == 'bet-button-size') && (e.target.parentElement.parentElement.parentElement.nextElementSibling.className == 'bet-buttons back-cell last-back-cell')) {
              betType = 'b1';
              odd.push('b1')
            }
            else if((e.target.className == 'bet-button-size') && (e.target.parentElement.parentElement.parentElement.nextElementSibling.className == 'bet-buttons lay-cell first-lay-cell')) {
              betType = 'l1';
              odd.push('l1')
            }
            else if((e.target.className == 'bet-button-size') && (e.target.parentElement.parentElement.parentElement.nextElementSibling.nextElementSibling.className == 'bet-buttons back-cell last-back-cell')) {
              betType = 'b2';
              odd.push('b2')
            }
            else if((e.target.className == 'bet-button-size') && (e.target.parentElement.parentElement.parentElement.nextElementSibling.nextElementSibling.className == 'bet-buttons lay-cell first-lay-cell')) {
              betType = 'l2';
              odd.push('l2')
            }
          }, true);
           // Synchronous click of all Odds  
          sizeCount.map((a) => {
            a.click()
          });
          // Synchronous click of all Liquidity  
          priceCount.map((b) => {
            b.click()
          });

            // If array length is complete fire success
          if (liquidity.length == 6 && odd.length == 6) {
            console.log('Success: All Selectors and Relationships are verified')
          } else {
            // Compare a sample complete array with what was gotten after clicks. determine which betType is not there
            Array.prototype.diff = function (a) {
              return this.filter(function (i) { return a.indexOf(i) < 0 })
            };
            const price = ['b0', 'b1', 'b2', 'l0', 'l1', 'l2'].diff(liquidity);
            const stake = ['b0', 'b1', 'b2', 'l0', 'l1', 'l2'].diff(odd);
            // If odds and liquidity both contain filtered value, please fire
           if (price.length > 0 && stake.length > 0) {
             console.error(`Failure: The relationship for Odds at '${stake.toString()}' and liquidity at '${price.toString()}' could not be verified`)
              //If only liquidity contain filtered value, please fire
           } else if (price.length < 1 && stake.length > 0) {
             console.error(`Failure: The relationship For Liquidity at '${price.toString()}' could not be verified`)
              //If only odds contain filtered values, please fire 
           } else if (price.length > 0 && stake.length < 1) {
              console.error(`Failure: The relationship for Odd at '${stake.toString()}' could not be verified`)
            }
          }
          //end of else for target
      }

     }, MATCHED_AMOUNT_SELECTOR);

}

// execute scraper
bot()
  .catch(err => console.error(err));
//=============================================================================