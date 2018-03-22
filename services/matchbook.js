/**
 * created by Ajor on 21 - 03 - 2018
*/
//=============================================================================

// dependencies
const P = require('puppeteer');
const _ = require('lodash');

// module variables
const
  EVENT_URL = 'https://matchbook.com/events/horse-racing/uk/chelmsford/755887749110013/17-45-chelmsford-city',
  SELECTIONS_CONTAINER_SELECTOR = '#app-next > div > div.mb-app__containerChildren > div > div > div.mb-event__markets.mb-event__markets--standalone > div:nth-child(1) > div.mb-market__runners',
  MATCHED_AMOUNT_SELECTOR = '#app-next > div > div.mb-app__containerChildren > div > div > div:nth-child(1) > div > div > span:nth-child(2)';

async function bot() {
  // instantiate browser
  const browser = await P.launch({
    headless: false
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
  // console.log(`${SELECTIONS_CONTAINER_SELECTOR}`);
  const parentContainer = await page.waitForSelector(SELECTIONS_CONTAINER_SELECTOR, {
  timeout: 180000
  });

  // Message passing back to Parent Process
  // page.on('console', data => {
  //   if (data.type == 'error') {
  //     // passing failure messages
  //     console.error(data.text())
  //   }
  //   else {
  //     // passing success message
  //     console.log(data.text())
  //   }
  // })

  page.on('console', data => console.log(data.text()));
  
  //console.log('SELECTIONS_CONTAINER_SELECTOR found, continuing...');

  await page.$eval(SELECTIONS_CONTAINER_SELECTOR,
     (target, MATCHED_AMOUNT_SELECTOR) => {

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

           let failure = [];

          // add a click listener to the table
          target.addEventListener("click", async function (e) {

   

               let betType,
                  amount,
                  odd,
                  SELECTION;

                  SELECTION = e.target.parentElement.parentElement.parentElement.children[0].innerText;
                 

            // console.log(e)
             if((e.target.className == 'mb-price__odds') && (e.target.parentElement.className == 'mb-price mb-price--back  mb-price--level0 ')) {
              betType = 'b0';
                  // back
               if (e.target.innerText) { amount = e.target.innerText; } else {
                failure.push({
                  betType: 'b0',
                  identifier: "DOM nav for (e.target.className == 'mb-price__odds') && (e.target.parentElement.className == 'mb-price mb-price--back  mb-price--level0 ')",
                  amount: "e.target.innerText"
                })
              };

              if (e.target.parentElement.children[0].innerText) {odd = e.target.parentElement.children[0].innerText; } else {
                failure.push({
                  betType: 'b0',
                  identifier: "DOM nav for (e.target.className == 'mb-price__odds') && (e.target.parentElement.className == 'mb-price mb-price--back  mb-price--level0 ')",
                  odd: "e.target.parentElement.children[0].innerText"
                })
              }
            }
            else if((e.target.className == 'mb-price__odds') && (e.target.parentElement.className == 'mb-price mb-price--lay  mb-price--level0 ')) {
              betType = 'l0';
                 // lay
               if (e.target.innerText) { amount = e.target.innerText; } else {
                failure.push({
                  betType: 'l0',
                  identifier: "DOM nav for (e.target.className == 'mb-price__odds') && (e.target.parentElement.className == 'mb-price mb-price--back  mb-price--level0 ')",
                  amount: "e.target.innerText"
                })
              };

              if (e.target.parentElement.children[0].innerText) {odd = e.target.parentElement.children[0].innerText; } else {
                failure.push({
                  betType: 'l0',
                  identifier: "DOM nav for (e.target.className == 'mb-price__odds') && (e.target.parentElement.className == 'mb-price mb-price--back  mb-price--level0 ')",
                  odd: "e.target.parentElement.children[0].innerText"
                })
              }
            }
            else if((e.target.className == 'mb-price__odds') && (e.target.parentElement.className == 'mb-price mb-price--back  mb-price--level1 ')) {
              betType = 'b1';
                  // back
               if (e.target.innerText) { amount = e.target.innerText; } else {
                failure.push({
                  betType: 'b1',
                  identifier: "DOM nav for (e.target.className == 'mb-price__odds') && (e.target.parentElement.className == 'mb-price mb-price--back  mb-price--level1 ')",
                  amount: "e.target.innerText"
                })
              };

              if (e.target.parentElement.children[0].innerText) {odd = e.target.parentElement.children[0].innerText; } else {
                failure.push({
                  betType: 'b1',
                  identifier: "DOM nav for (e.target.className == 'mb-price__odds') && (e.target.parentElement.className == 'mb-price mb-price--back  mb-price--level1 ')",
                  odd: "e.target.parentElement.children[0].innerText"
                })
              }
            }
            else if((e.target.className == 'mb-price__odds') && (e.target.parentElement.className == 'mb-price mb-price--lay  mb-price--level1 ')) {
              betType = 'l1';
                  // lay
               if (e.target.innerText) { amount = e.target.innerText; } else {
                failure.push({
                  betType: 'l1',
                  identifier: "DOM nav for (e.target.className == 'mb-price__odds') && (e.target.parentElement.className == 'mb-price mb-price--back  mb-price--level1 ')",
                  amount: "e.target.innerText"
                })
              };

              if (e.target.parentElement.children[0].innerText) {odd = e.target.parentElement.children[0].innerText; } else {
                failure.push({
                  betType: 'l1',
                  identifier: "DOM nav for (e.target.className == 'mb-price__odds') && (e.target.parentElement.className == 'mb-price mb-price--back  mb-price--level1 ')",
                  odd: "e.target.parentElement.children[0].innerText"
                })
              }
            }
            else if((e.target.className == 'mb-price__odds') && (e.target.parentElement.className == 'mb-price mb-price--back  mb-price--level2 ')) {
              betType = 'b2';
                  // back
               if (e.target.innerText) { amount = e.target.innerText; } else {
                failure.push({
                  betType: 'b2',
                  identifier: "DOM nav for (e.target.className == 'mb-price__odds') && (e.target.parentElement.className == 'mb-price mb-price--back  mb-price--level2 ')",
                  amount: "e.target.innerText"
                })
              };

              if (e.target.parentElement.children[0].innerText) {odd = e.target.parentElement.children[0].innerText; } else {
                failure.push({
                  betType: 'b2',
                  identifier: "DOM nav for (e.target.className == 'mb-price__odds') && (e.target.parentElement.className == 'mb-price mb-price--back  mb-price--level2 ')",
                  odd: "e.target.parentElement.children[0].innerText"
                })
              }
            }
            else if((e.target.className == 'mb-price__odds') && (e.target.parentElement.className == 'mb-price mb-price--lay  mb-price--level2 ')) {
              betType = 'l2';
                // lay
               if (e.target.innerText) { amount = e.target.innerText; } else {
                failure.push({
                  betType: 'l2',
                  identifier: "DOM nav for (e.target.className == 'mb-price__odds') && (e.target.parentElement.className == 'mb-price mb-price--back  mb-price--level2 ')",
                  amount: "e.target.innerText"
                })
              };

              if (e.target.parentElement.children[0].innerText) {odd = e.target.parentElement.children[0].innerText; } else {
                failure.push({
                  betType: 'l2',
                  identifier: "DOM nav for (e.target.className == 'mb-price__odds') && (e.target.parentElement.className == 'mb-price mb-price--back  mb-price--level2 ')",
                  odd: "e.target.parentElement.children[0].innerText"
                })
              }
            }
            else if((e.target.className == 'mb-price__amount') && (e.target.parentElement.className == 'mb-price mb-price--back  mb-price--level0 ')) {
              betType = 'b0';
                  // back
               if (e.target.innerText) { amount = e.target.innerText; } else {
                failure.push({
                  betType: 'b0',
                  identifier: "DOM nav for (e.target.className == 'mb-price__amount') && (e.target.parentElement.className == 'mb-price mb-price--back  mb-price--level0 ')",
                  amount: "e.target.innerText"
                })
              };

              if (e.target.parentElement.children[0].innerText) {odd = e.target.parentElement.children[0].innerText; } else {
                failure.push({
                  betType: 'b0',
                  identifier: "DOM nav for (e.target.className == 'mb-price__amount') && (e.target.parentElement.className == 'mb-price mb-price--back  mb-price--level0 ')",
                  odd: "e.target.parentElement.children[0].innerText"
                })
              }
            }
            else if((e.target.className == 'mb-price__amount') && (e.target.parentElement.className == 'mb-price mb-price--lay  mb-price--level0 ')) {
              betType = 'l0';
                   // lay
               if (e.target.innerText) { amount = e.target.innerText; } else {
                failure.push({
                  betType: 'l0',
                  identifier: "DOM nav for (e.target.className == 'mb-price__amount') && (e.target.parentElement.className == 'mb-price mb-price--lay  mb-price--level0 ')",
                  amount: "e.target.innerText"
                })
              };

              if (e.target.parentElement.children[0].innerText) {odd = e.target.parentElement.children[0].innerText; } else {
                failure.push({
                  betType: 'l0',
                  identifier: "DOM nav for (e.target.className == 'mb-price__amount') && (e.target.parentElement.className == 'mb-price mb-price--lay  mb-price--level0 ')",
                  odd: "e.target.parentElement.children[0].innerText"
                })
              }
            }
            else if((e.target.className == 'mb-price__amount') && (e.target.parentElement.className == 'mb-price mb-price--back  mb-price--level1 ')) {
              betType = 'b1';
                  // back
                 if (e.target.innerText) { amount = e.target.innerText; } else {
                  failure.push({
                    betType: 'b1',
                    identifier: "DOM nav for (e.target.className == 'mb-price__amount') && (e.target.parentElement.className == 'mb-price mb-price--back  mb-price--level1 ')",
                    amount: "e.target.innerText"
                  })
                };

                if (e.target.parentElement.children[0].innerText) {odd = e.target.parentElement.children[0].innerText; } else {
                  failure.push({
                    betType: 'b1',
                    identifier: "DOM nav for (e.target.className == 'mb-price__amount') && (e.target.parentElement.className == 'mb-price mb-price--back  mb-price--level1 ')",
                    odd: "e.target.parentElement.children[0].innerText"
                  })
                }
            }
            else if((e.target.className == 'mb-price__amount') && (e.target.parentElement.className == 'mb-price mb-price--lay  mb-price--level1 ')) {
              betType = 'l1';
                  // lay
               if (e.target.innerText) { amount = e.target.innerText; } else {
                failure.push({
                  betType: 'l1',
                  identifier: "DOM nav for (e.target.className == 'mb-price__amount') && (e.target.parentElement.className == 'mb-price mb-price--lay  mb-price--level1 ')",
                  amount: "e.target.innerText"
                })
              };

              if (e.target.parentElement.children[0].innerText) {odd = e.target.parentElement.children[0].innerText; } else {
                failure.push({
                  betType: 'l1',
                  identifier: "DOM nav for (e.target.className == 'mb-price__amount') && (e.target.parentElement.className == 'mb-price mb-price--lay  mb-price--level1 ')",
                  odd: "e.target.parentElement.children[0].innerText"
                })
              }
            }
            else if((e.target.className == 'mb-price__amount') && (e.target.parentElement.className == 'mb-price mb-price--back  mb-price--level2 ')) {
              betType = 'b2';
                // back
                 if (e.target.innerText) { amount = e.target.innerText; } else {
                  failure.push({
                    betType: 'b2',
                    identifier: "DOM nav for (e.target.className == 'mb-price__amount') && (e.target.parentElement.className == 'mb-price mb-price--back  mb-price--level2 ')",
                    amount: "e.target.innerText"
                  })
                };

                if (e.target.parentElement.children[0].innerText) {odd = e.target.parentElement.children[0].innerText; } else {
                  failure.push({
                    betType: 'b2',
                    identifier: "DOM nav for (e.target.className == 'mb-price__amount') && (e.target.parentElement.className == 'mb-price mb-price--back  mb-price--level2 ')",
                    odd: "e.target.parentElement.children[0].innerText"
                  })
                }
            }
            else if((e.target.className == 'mb-price__amount') && (e.target.parentElement.className == 'mb-price mb-price--lay  mb-price--level2 ')) {
              betType = 'l2';
                          // lay
               if (e.target.innerText) { amount = e.target.innerText; } else {
                failure.push({
                  betType: 'l2',
                  identifier: "DOM nav for (e.target.className == 'mb-price__amount') && (e.target.parentElement.className == 'mb-price mb-price--lay  mb-price--level2 ')",
                  amount: "e.target.innerText"
                })
              };

              if (e.target.parentElement.children[0].innerText) {odd = e.target.parentElement.children[0].innerText; } else {
                failure.push({
                  betType: 'l2',
                  identifier: "DOM nav for (e.target.className == 'mb-price__amount') && (e.target.parentElement.className == 'mb-price mb-price--lay  mb-price--level2 ')",
                  odd: "e.target.parentElement.children[0].innerText"
                })
              }
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

          // If failure array length is empty fire success
          if(failure.length < 1){
            console.log('Success: All Selectors and Relationships are verified')
          }else{
            console.error(failure)
          }
        
          //end of else for target
      }
      // end process

     }, MATCHED_AMOUNT_SELECTOR);

// process.exit(0)
  // end of bot() 
}

// execute scraper
bot()
  .catch(err => console.error(err));
//=============================================================================