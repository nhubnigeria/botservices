/**
 * created by Ernest on 16 - 03 - 2018
*/
//=============================================================================
'use strict';

if (process.env.NODE_ENV != 'production') {
  require('dotenv').config();
}
//=============================================================================
// dependencies
const P = require('puppeteer'),
  sendMail = require('../utils/sendMail.js');

// module variables
const
  EVENT_URL= process.env.EVENT_URL,
  SELECTIONS_CONTAINER_SELECTOR = 'table.dataTable.marketViewSelections',
  MATCHED_AMOUNT_SELECTOR = 'span.gep-matchedamount';

  


async function bot() {
  // instantiate browser
  const browser = await P.launch({
    headless: false,
    timeout: 180000
  });
  // create blank page
  const page = await browser.newPage();
  // set viewport to 1366*768
  await page.setViewport({ width: 1366, height: 768 });
  // set the user agent
  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko)');
  // navigate to EVENT_URL
  await page.goto('https://www.betdaq.com', {
    waitUntil: 'networkidle2'
  });
  console.log('started');
  await page.goto(EVENT_URL, {
    waitUntil: 'networkidle2',
    timeout: 180000
  });
  await page.waitFor(30 * 1000);
  // ensure race container selector available
  const frame = await page.frames().find(f => f.name() === 'mainFrame');
  await frame.waitForSelector(SELECTIONS_CONTAINER_SELECTOR, {
    timeout: 180000
  });
  page.on('console', data => console.log(data.text()))
  // bind to races container and lsiten for updates to , bets etc
  await frame.$eval(SELECTIONS_CONTAINER_SELECTOR,
    (target, MATCHED_AMOUNT_SELECTOR) => {
      // listen for raceStart
      const observer = new MutationObserver( (mutations) => {
        mutations.forEach(function (ed) {
          const e = {
            mutation: ed,
            el: ed.target,
            value: ed.target.textContent,
            oldValue: ed.oldValue
          };
          if (e.el.parentElement.parentElement.parentElement.parentElement.className == ('marketViewSelectionRow gep-altrow' || 'marketViewSelectionRow gep-row')) {
          // define variables
          let
            betType,
            odds,
            liquidity,
            SELECTION;
          SELECTION = e.el.parentElement.parentElement.parentElement.parentElement.children[0].children[2].children[0].children[0].children[2].children[0].innerText
          // check 12 conditions

          if ((e.el.className == 'price') && (e.el.parentElement.parentElement.parentElement.className == 'priceBox backCell_0')) {
            betType = 'b0';
            odds = e.el.innerText;
            liquidity = e.el.parentElement.children[1].innerText;
          }
          else if ((e.el.className == 'price') && (e.el.parentElement.parentElement.parentElement.className == 'priceBox layCell_0')) {
            betType = 'l0';
            odds = e.el.innerText;
            liquidity = e.el.parentElement.children[1].innerText;
          }
          else if ((e.el.className == 'price') && (e.el.parentElement.parentElement.parentElement.className == 'priceBox backCell_1')) {
            betType = 'b1';
            odds = e.el.innerText;
            liquidity = e.el.parentElement.children[1].innerText;
          }
          else if ((e.el.className == 'price') && (e.el.parentElement.parentElement.parentElement.className == 'priceBox layCell_1')) {
            betType = 'l1';
            odds = e.el.innerText;
            liquidity = e.el.parentElement.children[1].innerText;
          }
          else if ((e.el.className == 'price') && (e.el.parentElement.parentElement.parentElement.className == 'priceBox backCell_2')) {
            betType = 'b2';
            odds = e.el.innerText;
            liquidity = e.el.parentElement.children[1].innerText;
          }
          else if ((e.el.className == 'price') && (e.el.parentElement.parentElement.parentElement.className == 'priceBox layCell_2')) {
            betType = 'l2';
            odds = e.el.innerText;
            liquidity = e.el.parentElement.children[1].innerText;
          }
          else if ((e.el.className == 'stake') && (e.el.parentElement.parentElement.parentElement.className == 'priceBox backCell_0')) {
            betType = 'b0';
            odds = e.el.parentElement.children[0].innerText;
            liquidity = e.el.innerText;
          }
          else if ((e.el.className == 'stake') && (e.el.parentElement.parentElement.parentElement.className == 'priceBox layCell_0')) {
            betType = 'l0';
            odds = e.el.parentElement.children[0].innerText;
            liquidity = e.el.innerText;
          }
          else if ((e.el.className == 'stake') && (e.el.parentElement.parentElement.parentElement.className == 'priceBox backCell_1')) {
            betType = 'b1';
            odds = e.el.parentElement.children[0].innerText;
            liquidity = e.el.innerText;
          }
          else if ((e.el.className == 'stake') && (e.el.parentElement.parentElement.parentElement.className == 'priceBox layCell_1')) {
            betType = 'l1';
            odds = e.el.parentElement.children[0].innerText;
            liquidity = e.el.innerText;
          }
          else if ((e.el.className == 'stake') && (e.el.parentElement.parentElement.parentElement.className == 'priceBox backCell_2')) {
            betType = 'b2';
            odds = e.el.parentElement.children[0].innerText;
            liquidity = e.el.innerText;
          }
          else if ((e.el.className == 'stake') && (e.el.parentElement.parentElement.parentElement.className == 'priceBox layCell_2')) {
            betType = 'l2';
            odds = e.el.parentElement.children[0].innerText;
            liquidity = e.el.innerText;
          }
          if (!!betType && !!odds && !!liquidity && !!SELECTION) {
            let timestamp = new Date();
            timestamp = timestamp.toISOString();
            let matchedAmount = document.querySelector(MATCHED_AMOUNT_SELECTOR).innerText;
            // matchedAmount = Number(matchedAmount.replace(/\D/g, ''));
            const data = {
              betType,
              matchedAmount,
              timestamp,
              odds: Number(odds),
              liquidity: Number(liquidity.slice(1)),
              selection: SELECTION

            };
            const output = JSON.stringify(data);
            const msg = `All data checked out correctly`
            // console.log(output);
            sendMail(output, msg)
          }else {
            //how do i get a falsy
            // create an object for them
            let allContent = [
              {name: 'matchedAmount', val: matchedAmount},
              { name: 'odds', val: Number(odds) }, 
              { name: 'selection', val: SELECTION },
              { name: 'liquidity', val: Number(liquidity.slice(1)) }
            ];
            // filter out false content in val
            let falseData = allContent.filter(word => !!(word.val) == false);
            // create a new arr.. when filled it carries the name of properties that returned the false data
            let data = [];
            // push only name to the array
            falseData.forEach(w => data.push(w.name));
            // create an object to send
            const output = {...data}
            // create msg
            const msg = `Some Elements returned with False data`
            // call mail service
            sendMail(output, msg)
          }
      }
        });
      });
      observer.observe(target, {
        attributes: true,
        childList: false,
        characterData: false,
        characterDataOldValue: false,
        subtree: true
      });

    }, MATCHED_AMOUNT_SELECTOR);
}

// execute scraper
bot()
  .catch(err => console.error(err));
//=============================================================================
