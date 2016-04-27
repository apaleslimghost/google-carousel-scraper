import Browser from 'zombie';
import fuzzyDateParse from '@quarterto/fuzzy-date-parse-naive';

const IPHONE_AGENT = 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1';

function getSearchUrl(searchTerm) {
	return `https://www.google.co.uk/search?q=${encodeURIComponent(searchTerm)}`;
}

export default async function(searchTerm) {
	const url = getSearchUrl(searchTerm);
	const browser = new Browser({userAgent: IPHONE_AGENT});

	try {
		await browser.visit(url);
	} catch(e) {
		console.error(e.stack);
	}

	return browser.queryAll('[data-ampgroup=true] a[data-amp]').map(link => ({
		link: link.getAttribute('data-amp'),
		title: link.lastElementChild.textContent,
		date: fuzzyDateParse(link.nextSibling.textContent),
		publisher: link.getAttribute('data-amp-title'),
	}));
}
