import Browser from 'zombie';
import fuzzyDateParse from '@quarterto/fuzzy-date-parse-naive';

const IPHONE_AGENT = 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_3_2 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13F69 Safari/601.1';

function getSearchUrl(searchTerm) {
	return `https://www.google.co.uk/search?q=${encodeURIComponent(searchTerm)}`;
}

export default async function(searchTerm, options = {timeout: 15000}) {
	const url = getSearchUrl(searchTerm);
	Browser.waitDuration = 999999;
	const browser = new Browser({userAgent: IPHONE_AGENT});
	let timeout;
	const timeoutPromise = new Promise((resolve, reject) => {
		const err = new Error(`Search '${searchTerm}' timed out`);
		err.timeout = true;
		timeout = setTimeout(reject, options.timeout, err);
	});

	try {
		try {
			await Promise.race([
				browser.visit(url),
				timeoutPromise,
			]);
		} catch(e) {
			if(e.timeout) {
				throw e;
			}
		} // 🙈

		const links = browser.queryAll('[data-ampgroup=true] a[data-amp]').map(link => ({
			link: link.getAttribute('data-amp'),
			title: link.lastElementChild.textContent,
			date: fuzzyDateParse(link.nextSibling.textContent),
			publisher: link.getAttribute('data-amp-title'),
		}));

		return links;
	} finally {
		clearTimeout(timeout);
		browser.destroy();
	}
}
