'use strict';

const puppeteer = require('puppeteer');

// module variables
const
	EVENT_URL = 'https://matchbook.com/events/horse-racing/uk/sedgefield/757632370220013/live-betting/14-50-sedgefield',
	SELECTIONS_CONTAINER_SELECTOR = '#app-next > div > div.mb-app__containerChildren > div > div > div.mb-event__markets.mb-event__markets--standalone > div:nth-child(1) > div.mb-market__runners',
	MATCHED_AMOUNT_SELECTOR = '#app-next > div > div.mb-app__containerChildren > div > div > div:nth-child(1) > div > div > span:nth-child(2)';

async function bot() {
	// instantiate browser
	const browser = await puppeteer.launch({
		headless: true
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
		timeout: 180000
	});


	// ensure race container selector available
	const parentContainer = await page.waitForSelector(SELECTIONS_CONTAINER_SELECTOR, {
		timeout: 180000
	});

	if (!!parentContainer) {

		await page.waitForSelector(MATCHED_AMOUNT_SELECTOR, {
			timeout: 180000
		})

		// allow 'page' instance to output any calls to browser log to process obj
		page.on('console', data => console.log(data.text()));
		// bind to races container and listen for updates to , bets etc
		await page.$eval(SELECTIONS_CONTAINER_SELECTOR,
			(target, MATCHED_AMOUNT_SELECTOR) => {

				const observer = new MutationObserver((mutations) => {
					mutations.forEach(function (ed) {
						const e = {
							mutation: ed,
							el: ed.target,
							value: ed.target.textContent,
							oldValue: ed.oldValue
						};

						let
							betType,
							odds,
							liquidity,
							SELECTION;
						SELECTION = e.el.parentElement.children[0].innerText;

						if ((e.el.children[1].className == 'mb-price__odds') && (e.el.className == 'mb-price mb-price--back  mb-price--level0 ')) {
							betType = 'b0';
							odds = e.el.children[1].textContent;
							liquidity = e.el.children[2].textContent;

						}
						else if ((e.el.children[1].className == 'mb-price__odds') && (e.el.className == 'mb-price mb-price--lay  mb-price--level0 ')) {

							betType = 'l0';
							odds = e.el.children[1].textContent;
							liquidity = e.el.children[2].textContent;
						}
						else if ((e.el.children[0].className == 'mb-price__odds') && (e.el.className == 'mb-price mb-price--back  mb-price--level1 ')) {
							betType = 'b1';
							odds = e.el.children[0].textContent;
							liquidity = e.el.children[1].textContent;

						}
						else if ((e.el.children[0].className == 'mb-price__odds') && (e.el.className == 'mb-price mb-price--lay  mb-price--level1 ')) {
							betType = 'l1';
							odds = e.el.children[0].textContent;
							liquidity = e.el.children[1].textContent;


						}
						else if ((e.el.children[0].className == 'mb-price__odds') && (e.el.className == 'mb-price mb-price--back  mb-price--level2 ')) {
							betType = 'b2';
							odds = e.el.children[0].textContent;
							liquidity = e.el.children[1].textContent;

						}
						else if ((e.el.children[0].className == 'mb-price__odds') && (e.el.className == 'mb-price mb-price--lay  mb-price--level2 ')) {
							betType = 'l2';
							odds = e.el.children[0].textContent;
							liquidity = e.el.children[1].textContent;

						}
						else if ((e.el.children[2].className == 'mb-price__amount') && (e.el.className == 'mb-price mb-price--back  mb-price--level0 ')) {
							betType = 'b0';
							odds = e.el.children[1].textContent;
							liquidity = e.el.children[2].textContent;

						}
						else if ((e.el.children[2].className == 'mb-price__amount') && (e.el.className == 'mb-price mb-price--lay  mb-price--level0 ')) {
							betType = 'l0';
							odds = e.el.children[1].textContent;
							liquidity = e.el.children[2].textContent;

						}
						else if ((e.el.children[2].className == 'mb-price__amount') && (e.el.className == 'mb-price mb-price--back  mb-price--level1 ')) {
							betType = 'b1';
							odds = e.el.children[1].textContent;
							liquidity = e.el.children[2].textContent;


						}
						else if ((e.el.children[2].className == 'mb-price__amount') && (e.el.className == 'mb-price mb-price--lay  mb-price--level1 ')) {
							betType = 'l1';
							odds = e.el.children[1].textContent;
							liquidity = e.el.children[2].textContent;

						}
						else if ((e.el.children[2].className == 'mb-price__amount') && (e.el.className == 'mb-price mb-price--back  mb-price--level2 ')) {
							betType = 'b2';
							odds = e.el.children[1].textContent;
							liquidity = e.el.children[2].textContent;

						}
						else if ((e.el.children[2].className == 'mb-price__amount') && (e.el.className == 'mb-price mb-price--lay  mb-price--level2 ')) {
							betType = 'l2';
							odds = e.el.children[1].textContent;
							liquidity = e.el.children[2].textContent;

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
								selection: SELECTION.replace(/\d|\n/g, '').trim()

							};
							//convert data JSON before outputting it
							const output = JSON.stringify(data);
							console.log(output);
						} else {
							console.log('something went wrong')
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

	} else {
		//output message in the terminal that the parent container is not found
		console.log('Parent Container Not Found!!!')
	}

}

// execute scraper
bot()
	.catch(err => console.error(err));
