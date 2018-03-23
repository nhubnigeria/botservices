// dependencies
const P = require('puppeteer');

// module variables
const
    EVENT_URL = 'https://www.matchbook.com/events/horse-racing/uk/chelmsford/755887762450013/live-betting/19-45-chelmsford-city',
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
        waitUntil: 'networkidle2',
        timeout: 100000
    });
    // await page.waitFor(30000)

    // ensure race container selector available
    // console.log(`${SELECTIONS_CONTAINER_SELECTOR}`);
    const parentContainer = await page.waitForSelector(SELECTIONS_CONTAINER_SELECTOR, {
        timeout: 180000
    });

     page.on('console', data => console.log(data.text()));


    await page.$eval(SELECTIONS_CONTAINER_SELECTOR,
        (target, MATCHED_AMOUNT_SELECTOR) => {

                let matched_amount = document.querySelector(MATCHED_AMOUNT_SELECTOR)
                //     //Matched amount check
                if (!matched_amount) console.error(`Failure: The Selector '${MATCHED_AMOUNT_SELECTOR}' could not be verifed`);
                // Grabbing first row
                let firstRow = target.children[0].children[0];
                if (!firstRow) console.error(`Failure: The Selector '${firstRow}' could not be verifed`);
                // get all array of odds
                let oddsCount = Array.from(document.querySelectorAll('.mb-price__odds')).slice(0, 6);
                // get all array of amounts
                let amountCount = Array.from(document.querySelectorAll('.mb-price__amount')).slice(0, 6);

                // add a click listener to the table
                target.addEventListener("click", async function (e) {

                    let betType,
                        odd,
                        liquidity,
                        SELECTION;
                    SELECTION = e.target.parentElement. parentElement.children[0].innerText;
                     // console.log(e.target.innerText)
                   
                    if((e.target.className == 'mb-price__odds') && (e.target.parentElement.className == 'mb-price mb-price--back  mb-price--level0')) {
                        betType = 'b0';
                            // back
                         if (!!e.target.innerText) { odd = e.target.innerText; console.log('io', odd)} 
                        if (!!e.target.parentElement.children[1].innerText) {liquidity = e.target.parentElement.children[2].innerText; } 
                      }
                      else if((e.target.className == 'mb-price__odds') && (e.target.parentElement.className == 'mb-price mb-price--lay  mb-price--level0 ')) {
                        betType = 'l0';
                           // lay
                         if (!!e.target.innerText) { odd = e.target.innerText; console.log('fire',odd) } 
          
                        if (!!e.target.parentElement.children[2].innerText) {liquidity = e.target.parentElement.children[2].innerText;  console.log('fired', liquidity)  } 
                      }
                      else if((e.target.className == 'mb-price__odds') && (e.target.parentElement.className == 'mb-price mb-price--back  mb-price--level1 ')) {
                        betType = 'b1';
                            // back
                         if (!!e.target.innerText) { odd = e.target.innerText;  console.log('fireddd',odd) } 
                      
                        if (!!e.target.parentElement.children[1].innerText) {liquidity = e.target.parentElement.children[1].innerText; console.log('fired',liquidity)  } 
                      }
                      else if((e.target.className == 'mb-price__odds') && (e.target.parentElement.className == 'mb-price mb-price--lay  mb-price--level1 ')) {
                        betType = 'l1';
                            // lay
                         if (!!e.target.innerText) { odd = e.target.innerText; console.log('fired',odd)  } 
          
                        if (!!e.target.parentElement.children[1].innerText) {liquidity = e.target.parentElement.children[1].innerText; console.log('fired', liquidity)  } 
                        
                      }
                      else if((e.target.className == 'mb-price__odds') && (e.target.parentElement.className == 'mb-price mb-price--back  mb-price--level2 ')) {
                        betType = 'b2';
                            // back
                         if (!!e.target.innerText) { odd = e.target.innerText;  console.log('fireqqqq',odd)  } 
                        if (!!e.target.parentElement.children[2].innerText) {liquidity = e.target.parentElement.children[1].innerText; console.log('ttttt', liquidity)  }
                      }
                      else if((e.target.className == 'mb-price__odds') && (e.target.parentElement.className == 'mb-price mb-price--lay  mb-price--level2 ')) {
                        betType = 'l2';
                          // lay
                         if (!!e.target.innerText) { odd = e.target.innerText;  console.log('fired', odd) } 
          
                        if (!!e.target.parentElement.children[1].innerText) {liquidity = e.target.parentElement.children[1].innerText; console.log('fire00', liquidity)  } 
                      }
                      else if((e.target.className == 'mb-price__amount') && (e.target.parentElement.className == 'mb-price mb-price--back  mb-price--level0 ')) {
                        betType = 'b0';
                            // back
                         if (!!e.target.innerText) { odd = e.target.innerText; console.log('fired', odd) } 
                        if (!!e.target.parentElement.children[1].innerText) {liquidity = e.target.parentElement.children[1].innerText; console.log('fired--', liquidity)  }
                      }
                      else if((e.target.className == 'mb-price__amount') && (e.target.parentElement.className == 'mb-price mb-price--lay  mb-price--level0 ')) {
                        betType = 'l0';
                             // lay
                         if (!!e.target.innerText) { odd = e.target.innerText; console.log('fired000',odd)  } 
                        if (!!e.target.parentElement.children[2].innerText) {liquidity = e.target.parentElement.children[1].innerText; console.log('fired', liquidity)  } 
                      }
                      else if((e.target.className == 'mb-price__amount') && (e.target.parentElement.className == 'mb-price mb-price--back  mb-price--level1 ')) {
                        betType = 'b1';
                            // back
                           if (!!e.target.innerText) { odd = e.target.innerText; console.log('fired11',odd)  } 
                          if (!!e.target.parentElement.children[1].innerText) {liquidity = e.target.parentElement.children[1].innerText; console.log('fired ', liquidity)  } 
                      }
                      else if((e.target.className == 'mb-price__amount') && (e.target.parentElement.className == 'mb-price mb-price--lay  mb-price--level1 ')) {
                        betType = 'l1';
                            // lay
                         if (!!e.target.innerText) { odd = e.target.innerText; console.log('fired77', odd)  } 
                        if (!!e.target.parentElement.children[1].innerText) {liquidity = e.target.parentElement.children[1].innerText; console.log('fired33', liquidity)  } 
                      }
                      else if((e.target.className == 'mb-price__amount') && (e.target.parentElement.className == 'mb-price mb-price--back  mb-price--level2 ')) {
                        betType = 'b2';
                          // back
                           if (!!e.target.innerText) { odd = e.target.innerText; console.log('fireds',odd)  } 
                          if (!!e.target.parentElement.children[2].innerText) {liquidity = e.target.parentElement.children[1].innerText; console.log('bbbb', liquidity)  }
                 
                      }
                      else if((e.target.className == 'mb-price__amount') && (e.target.parentElement.className == 'mb-price mb-price--lay  mb-price--level2 ')) {
                        betType = 'l2';
                                    // lay
                         if (!!e.target.innerText) { odd = e.target.innerText; console.log('firedd', odd)  } 
                        if (!!e.target.parentElement.children[1].innerText) {liquidity = e.target.parentElement.children[1].innerText; console.log('fired', liquidity)  } 
                      }
          

                    if (!!betType && !!odd && !!liquidity && !!SELECTION) {
                        let timestamp = new Date();
                        timestamp = timestamp.toISOString();
                        let matchedAmount = document.querySelector(MATCHED_AMOUNT_SELECTOR).innerText;
                        matchedAmount = Number(matchedAmount.replace(/\D/g, ''));
                        const data = {
                            betType,
                            matchedAmount,
                            timestamp,
                            odds: Number(odd),
                            liquidity: Number(liquidity.slice(1)),
                            selection: SELECTION.replace(/[\d\n$.]/g, ''),
                        };
                       
                        //convert data JSON before outputting it
                        const output = JSON.stringify(data);
                        console.log(output);
                    }

                }, true);

                // clicking Synchronously for odds
                oddsCount.forEach((a) => {
                    a.click()
                });
                // clicking Synchronously for amount 
                amountCount.forEach((b) => {
                    b.click()
                });
            

        }, MATCHED_AMOUNT_SELECTOR);



}

// execute scraper
bot()
    .catch(err => console.error(err));
//=============================================================================