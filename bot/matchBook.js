'use strict'

const P = require('puppeteer');

// module variables
const
    EVENT_URL = 'https://matchbook.com/events/horse-racing/uk/lingfield/757631550280014/13-35-lingfield',
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

    // ensure race container selector available
    const parentContainer = await page.waitForSelector(SELECTIONS_CONTAINER_SELECTOR, {
        timeout: 180000
    });

    if (!!parentContainer) {

        await page.waitForSelector(MATCHED_AMOUNT_SELECTOR, {
            timeout: 180000
        })

        page.on('console', data => console.log(data.text()));
        await page.$eval(SELECTIONS_CONTAINER_SELECTOR,
            (target, MATCHED_AMOUNT_SELECTOR) => {

                target.addEventListener('DOMSubtreeModified', function (e) {
                     console.log(e);

                    let betType,
                        odds,
                        liquidity,
                        SELECTION = e.target.parentElement.parentElement.parentElement.children[0].innerText;

                    if ((e.target.parentElement.className == 'mb-price__odds') && (e.target.parentElement.parentElement.className == 'mb-price mb-price--back mb-price--level0')) {
                        betType = 'b0';
                        odds = e.target.parentElement.textContent;
                        liquidity = e.target.parentElement.parentElement.children[2].innerText;

                    }
                    else if ((e.target.parentElement.className == 'mb-price__odds') && (e.target.parentElement.parentElement.className == 'mb-price mb-price--lay mb-price--level0')) {
                        betType = 'l0';
                        odds = e.target.parentElement.textContent;
                        liquidity = e.target.parentElement.parentElement.children[2].innerText;


                    }
                    else if ((e.target.className == 'mb-price__odds') && (e.target.parentElement.parentElement.className == 'mb-price mb-price--back  mb-price--level1 ')) {
                        betType = 'b1';
                        odds = e.target.parentElement.textContent;
                        liquidity = e.target.parentElement.parentElement.children[1].innerText;

                    }
                    else if ((e.target.parentElement.className == 'mb-price__odds') && (e.target.parentElement.parentElement.className == 'mb-price mb-price--lay mb-price--level1')) {
                        betType = 'l1';
                        odds = e.target.parentElement.textContent;
                        liquidity = e.target.parentElement.parentElement.children[1].innerText;


                    }
                    else if ((e.target.className == 'mb-price__odds') && (e.target.parentElement.className == 'mb-price mb-price--back  mb-price--level2 ')) {
                        betType = 'b2';
                        odds = e.target.parentElement.textContent;
                        liquidity = e.target.parentElement.parentElement.children[1].innerText;

                    }
                    else if ((e.target.parentElement.className == 'mb-price__odds') && (e.target.parentElement.parentElement.className == 'mb-price mb-price--lay mb-price--level2')) {
                        betType = 'l2';
                        odds = e.target.parentElement.textContent;
                        liquidity = e.target.parentElement.parentElement.children[1].innerText;

                    }
                    else if ((e.target.parentElement.className == 'mb-price__amount') && (e.target.parentElement.parentElement.className == 'mb-price mb-price--back  mb-price--level0')) {
                        betType = 'b0';
                        odds = e.target.parentElement.parentElement.children[1].innerText;
                        liquidity = e.target.parentElement.textContent;


                    }
                    else if ((e.target.parentElement.className == 'mb-price__amount') && (e.target.parentElement.parentElement.className == 'mb-price mb-price--lay mb-price--level0')) {
                        betType = 'l0';
                        odds = e.target.parentElement.parentElement.children[1].innerText;
                        liquidity = e.target.parentElement.textContent;


                    }
                    else if ((e.target.className == 'mb-price__amount') && (e.target.parentElement.parentElement.className == 'mb-price mb-price--back  mb-price--level1')) {
                        betType = 'b1';
                        odds = e.target.parentElement.parentElement.children[0].innerText;
                        liquidity = e.target.parentElement.textContent;

                    }
                    else if ((e.target.parentElement.className == 'mb-price__amount') && (e.target.parentElement.parentElement.className == 'mb-price mb-price--lay mb-price--level1')) {
                        betType = 'l1';
                        odds = e.target.parentElement.parentElement.children[0].innerText;
                        liquidity = e.target.parentElement.textContent;


                    }
                    else if ((e.target.parentElement.className == 'mb-price__amount') && (e.target.parentElement.parentElement.className == 'mb-price mb-price--back  mb-price--level2')) {
                        betType = 'b2';
                        odds = e.target.parentElement.parentElement.children[0].innerText;
                        liquidity = e.target.parentElement.textContent;


                    }
                    else if ((e.target.parentElement.className == 'mb-price__amount') && (e.target.parentElement.parentElement.className == 'mb-price mb-price--lay mb-price--level2')) {
                        betType = 'l2';
                        odds = e.target.parentElement.parentElement.children[0].innerText;
                        liquidity = e.target.parentElement.textContent;

                    }

                    if (!!betType && !!odds && !!liquidity && !!SELECTION) {
                        let timestamp = new Date();
                        timestamp = timestamp.toISOString();
                        let matchedAmount = document.querySelector(MATCHED_AMOUNT_SELECTOR).innerText;
                        matchedAmount = Number(matchedAmount.replace(/\D/g, ''));
                        const data = {
                            betType,
                            matchedAmount,
                            timestamp,
                            odds: Number(odds),
                            liquidity: Number(liquidity.slice(1)),
                            selection: SELECTION.replace(/[\d\n$.]/g, ''),
                        };

                        //convert data JSON before outputting it
                        const output = JSON.stringify(data);
                        console.log(output);
                    }
                })

            }, MATCHED_AMOUNT_SELECTOR);

    } else {
        // display message for failed selector
        console.log('Parent Container Not Found!!!')
    }

}

// execute scraper
bot()
    .catch(err => console.error(err));