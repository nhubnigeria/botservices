/**
 * created by Ajor && Ernest on 16-03-2018
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
  SELECTIONS_CONTAINER_SELECTOR = 'div.main-mv-runners-list-wrapper',
  MATCHED_AMOUNT_SELECTOR = '#main-wrapper > div > div.scrollable-panes-height-taker > div > div.page-content.nested-scrollable-pane-parent > div > div.bf-col-xxl-17-24.bf-col-xl-16-24.bf-col-lg-16-24.bf-col-md-15-24.bf-col-sm-14-24.bf-col-14-24.center-column.bfMarketSettingsSpace.bf-module-loading.nested-scrollable-pane-parent > div.scrollable-panes-height-taker.height-taker-helper > div > div.bf-row.main-mv-container > div > bf-main-market > bf-main-marketview > div > div.mv-sticky-header > bf-marketview-header-wrapper > div > div > mv-header > div > div > div.mv-secondary-section > div > div > span.total-matched',
  RACE_START_SELECTOR = '#main-wrapper > div > div.scrollable-panes-height-taker > div > div.page-content.nested-scrollable-pane-parent > div > div.bf-col-xxl-17-24.bf-col-xl-16-24.bf-col-lg-16-24.bf-col-md-15-24.bf-col-sm-14-24.bf-col-14-24.center-column.bfMarketSettingsSpace.bf-module-loading.nested-scrollable-pane-parent > div:nth-child(1) > div > div > div > div > div.event-header > div > span.race-status.default';

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
  // navigate to EVENT_URL
  await page.goto(EVENT_URL, {
    waitUntil: 'networkidle2',
    timeout: 50000
  });
  await page.waitFor(30000)
  page.on('console', data => console.log(data.text));
  // bind to races container and lsiten for updates to , bets etc
  await page.$eval(SELECTIONS_CONTAINER_SELECTOR,
    (target, MATCHED_AMOUNT_SELECTOR) => {
        // check for most common element of back and lay as source of event
        const observer = new MutationObserver((mutations) => {
          mutations.forEach(function (ed) {
            const e = {
              mutation: ed,
              el: ed.target,
              value: ed.target.textContent,
              oldValue: ed.oldValue
            };
        if (e.el.parentElement.parentElement.parentElement.parentElement.className == 'runner-line') {
          // define variables
          let
            betType,
            odds,
            liquidity,
            SELECTION;
          SELECTION = e.el.parentElement.parentElement.parentElement.parentElement.children[0].children[1].children[1].children[0].children[0].children[0].children[2].children[0].innerText.split('\n')[0];
          // check 12 conditions
          if ((e.el.className == ('bet-button-price' || 'mv-bet-button-info')) && (e.el.offsetParent.className == 'bet-buttons back-cell last-back-cell')) {
            betType = 'b0';
            odds = e.el.innerText;
            liquidity = e.el.parentElement.parentElement.children[0].children[1].innerText;
          }
          else if ((e.el.className == ('bet-button-price' || 'mv-bet-button-info')) && (e.el.offsetParent.className == 'bet-buttons lay-cell first-lay-cell')) {
            betType = 'l0';
            odds = e.el.innerText;
            liquidity = e.el.parentElement.parentElement.children[0].children[1].innerText;
          }
          else if ((e.el.className == ('bet-button-price' || 'mv-bet-button-info')) && (e.el.offsetParent.className == 'bet-buttons back-cell')) {
            betType = 'b1';
            odds = e.el.innerText;
            liquidity = e.el.parentElement.parentElement.children[0].children[1].innerText;
          }
          else if ((e.el.className == ('bet-button-price' || 'mv-bet-button-info')) && (e.el.offsetParent.className == 'bet-buttons lay-cell')) {
            betType = 'l1';
            odds = e.el.innerText;
            liquidity = e.el.parentElement.parentElement.children[0].children[1].innerText;
          }
          else if ((e.el.className == ('bet-button-price' || 'mv-bet-button-info')) && (e.el.offsetParent.className == 'bet-buttons back-cell first-back-cell')) {
            betType = 'b2';
            odds = e.el.innerText;
            liquidity = e.el.parentElement.parentElement.children[0].children[1].innerText;
          }
          else if ((e.el.className == ('bet-button-price' || 'mv-bet-button-info')) && (e.el.offsetParent.className == 'bet-buttons lay-cell last-lay-cell')) {
            betType = 'l2';
            odds = e.el.innerText;
            liquidity = e.el.parentElement.parentElement.children[0].children[1].innerText;
          }
          else if ((e.el.className == ('bet-button-size' || 'mv-bet-button-info')) && (e.el.offsetParent.className == 'bet-buttons back-cell last-back-cell')) {
            betType = 'b0';
            odds = e.el.parentElement.children[0].innerText;
            liquidity = e.el.innerText;
          }
          else if ((e.el.className == ('bet-button-size' || 'mv-bet-button-info')) && (e.el.offsetParent.className == 'bet-buttons lay-cell first-lay-cell')) {
            betType = 'l0';
            odds = e.el.parentElement.children[0].innerText;
            liquidity = e.el.innerText;
          }
          else if ((e.el.className == ('bet-button-size' || 'mv-bet-button-info')) && (e.el.offsetParent.className == 'bet-buttons back-cell')) {
            betType = 'b1';
            odds = e.el.parentElement.children[0].innerText;
            liquidity = e.el.innerText;
          }
          else if ((e.el.className == ('bet-button-size' || 'mv-bet-button-info')) && (e.el.offsetParent.className == 'bet-buttons lay-cell')) {
            betType = 'l1';
            odds = e.el.parentElement.children[0].innerText;
            liquidity = e.el.innerText;
          }
          else if ((e.el.className == ('bet-button-size' || 'mv-bet-button-info')) && (e.el.offsetParent.className == 'bet-buttons back-cell first-back-cell')) {
            betType = 'b2';
            odds = e.el.parentElement.children[0].innerText;
            liquidity = e.el.innerText;
          }
          else if ((e.el.className == ('bet-button-size' || 'mv-bet-button-info')) && (e.el.offsetParent.className == 'bet-buttons lay-cell last-lay-cell')) {
            betType = 'l2';
            odds = e.el.parentElement.children[0].innerText;
            liquidity = e.el.innerText;
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
              selection: SELECTION

            };
            const output = JSON.stringify(data);
            sendMail(output, msg)
          } else {
            // create an object for them
            let allContent = [
              { name: 'matchedAmount', val: matchedAmount },
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
            const output = { ...data };
            // console.log(output);
            // create msg
            const msg = `Some Elements returned with False data`;
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