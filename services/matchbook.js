/**
 * created by Ajor on 21 - 03 - 2018
*/
//=============================================================================

// dependencies
const P = require('puppeteer');

// module variables
const
  EVENT_URL = 'https://matchbook.com/events/horse-racing/uk/chepstow/755878648680013/live-betting/17-05-chepstow',
  SELECTIONS_CONTAINER_SELECTOR = '#app-next > div > div.mb-app__containerChildren > div > div > div.mb-event__markets.mb-event__markets--standalone > div:nth-child(1) > div.mb-market__runners',
  MATCHED_AMOUNT_SELECTOR = '#app-next > div > div.mb-app__containerChildren > div > div > div:nth-child(1) > div > div > span:nth-child(2)';

async function bot() {
  // instantiate browser
  const browser = await P.launch({
    headless: false
  });
  // create blank page
  const page = await browser.newPage();
  // set viewport to 1366*768#app-next > div > div.mb-app__containerChildren > div > div > div:nth-child(1) > div > div > span:nth-child(2)
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

      console.log(target)

      if(!target){
        console.error(`Failure: The value after evaluating '${SELECTIONS_CONTAINER_SELECTOR}' could not be verified`);
      }else{
          let matched_amount = document.querySelector(MATCHED_AMOUNT_SELECTOR)
          //     //Matched amount check
          if (!matched_amount) console.error(`Failure: The Selector '${MATCHED_AMOUNT_SELECTOR}' could not be verifed`);
          // Grabbing first row
          let firstRow = target.children[0].children[0];
          if (!firstRow) console.error(`Failure: The Selector '${firstRow}' could not be verifed`);
          // get all array of odds
          let oddsCount = Array.from(document.querySelectorAll('.mb-price__odds')).slice(0,6);
          // get all array of amounts
          let amountCount = Array.from(document.querySelectorAll('.mb-price__amount')).slice(0,6);


          let liquidity = [];
          let odds = [];

          console.log('made it');

          // add a click listener to the table
          target.addEventListener("click", async function (e) {
            console.log(e)
             if((e.target.className == 'mb-price__odds') && (e.target.parentElement.className == 'mb-price mb-price--back  mb-price--level0 ')) {
              betType = 'b0';
              liquidity.push('b0')
            }
            else if((e.target.className == 'mb-price__odds') && (e.target.parentElement.className == 'mb-price mb-price--lay  mb-price--level0 ')) {
              betType = 'l0';
             liquidity.push('l0')
            }
            else if((e.target.className == 'mb-price__odds') && (e.target.parentElement.className == 'mb-price mb-price--back  mb-price--level1 ')) {
              betType = 'b1';
              liquidity.push('b1')
            }
            else if((e.target.className == 'mb-price__odds') && (e.target.parentElement.className == 'mb-price mb-price--lay  mb-price--level1 ')) {
              betType = 'l1';
              liquidity.push('l1')
            }
            else if((e.target.className == 'mb-price__odds') && (e.target.parentElement.className == 'mb-price mb-price--back  mb-price--level2 ')) {
              betType = 'b2';
              liquidity.push('b2')
            }
            else if((e.target.className == 'mb-price__odds') && (e.target.parentElement.className == 'mb-price mb-price--lay  mb-price--level2 ')) {
              betType = 'l2';
             liquidity.push('l2')
            }
            else if((e.target.className == 'mb-price__amount') && (e.target.parentElement.className == 'mb-price mb-price--back  mb-price--level0 ')) {
              betType = 'b0';
              odds.push('b0')
            }
            else if((e.target.className == 'mb-price__amount') && (e.target.parentElement.className == 'mb-price mb-price--lay  mb-price--level0 ')) {
              betType = 'l0';
              odds.push('l0')
            }
            else if((e.target.className == 'mb-price__amount') && (e.target.parentElement.className == 'mb-price mb-price--back  mb-price--level1 ')) {
              betType = 'b1';
              odds.push('b1')
            }
            else if((e.target.className == 'mb-price__amount') && (e.target.parentElement.className == 'mb-price mb-price--lay  mb-price--level1 ')) {
              betType = 'l1';
              odds.push('l1')
            }
            else if((e.target.className == 'mb-price__amount') && (e.target.parentElement.className == 'mb-price mb-price--back  mb-price--level2 ')) {
              betType = 'b2';
              odds.push('b2')
            }
            else if((e.target.className == 'mb-price__amount') && (e.target.parentElement.className == 'mb-price mb-price--lay  mb-price--level2 ')) {
              betType = 'l2';
              odds.push('l2')
            }

          }, true);

          // clicking Synchronously for odds
          oddsCount.map((a) => {
            a.click()
          });
          // clicking Synchronously for amount 
          amountCount.map((b) => {
            b.click()
          });

            // If array length is complete fire success
          if (liquidity.length == 6 && odds.length == 6) {
            console.log('Success: All Selectors and Relationships are verified')
          } else {
              // Compare a sample complete array with what was gotten after clicks. determine which betType is not there
            Array.prototype.diff = function (a) {
              return this.filter(function (i) { return a.indexOf(i) < 0 })
            };
            const price = ['b0', 'b1', 'b2', 'l0', 'l1', 'l2'].diff(liquidity);
            const stake = ['b0', 'b1', 'b2', 'l0', 'l1', 'l2'].diff(odds);
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
          // end of else target
      }
      // end process

     }, MATCHED_AMOUNT_SELECTOR);

process.exit(0)
  // end of bot() 
}

// execute scraper
bot()
  .catch(err => console.error(err));
//=============================================================================