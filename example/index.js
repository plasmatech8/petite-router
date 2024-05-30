/*
 * TODO:
 * - Wildcard parameters (cannot test nested HTML injections yet)
 * - Route parameters
 * - After navigate hook (need this for the vue reactive state)
 * - After inject hook
 */

export function createRouter() {
	convertAllAnchorTagsToRouterLinks();
	handleRouting();
	handleInjections();
}

function handleRouting(to = null) {
	if (!to) to = window.location.pathname;
	const elements = document.querySelectorAll('[r-path]');
	elements.forEach((el) => {
		const path = el.getAttribute('r-path');
		const title = el.getAttribute('r-title');

		// Update hidden attributes
		// TODO: update URL matching
		if (to === path) {
			if (title) document.title = title;
			el.removeAttribute('hidden');
		} else {
			el.setAttribute('hidden', true);
		}
	});
}

async function handleInjections(to = null, root = document) {
	if (!to) to = window.location.pathname;
	const elements = Array.from(
		root.querySelectorAll('[r-html]:not([r-html-status="success"],[r-html-status="loading"])')
	);
	for (const el of elements) {
		const source = el.getAttribute('r-html');
		const path = el.closest('[r-path]')?.getAttribute('r-path');
		// TODO: update URL matching
		if ((path && !to.startsWith(path)) || !source) continue;

		// Inject HTML
		console.log(`Injecting HTML from source ${source} for ${to}`);
		try {
			el.setAttribute('r-html-status', 'loading');
			const res = await fetch(source);
			const text = await res.text();
			const html = new DOMParser().parseFromString(text, 'text/html').body;
			handleInjections(to, html);
			el.replaceChildren(...html.childNodes);
			el.setAttribute('r-html-status', 'success');
		} catch (error) {
			console.error(`Unable to fetch ${source}:`, error);
			el.setAttribute('r-html-status', 'failed');
		}
	}
}

function convertAllAnchorTagsToRouterLinks() {
	function click(e) {
		const anchor = e.target.closest('a');
		const href = anchor && anchor.getAttribute('href');
		if (
			e.ctrlKey ||
			e.metaKey ||
			e.altKey ||
			e.shiftKey ||
			e.button ||
			e.defaultPrevented ||
			!href ||
			anchor.target ||
			anchor.host !== location.host
		)
			return;
		e.preventDefault();
		history.pushState({}, '', href);
		handleRouting();
	}
	function hover(e) {
		const anchor = e.target.closest('a');
		if (anchor?.pathname) handleInjections(anchor.pathname);
	}
	function navigate() {
		handleRouting();
		handleInjections();
	}
	addEventListener('popstate', navigate);
	addEventListener('replacestate', navigate);
	addEventListener('pushstate', navigate);
	addEventListener('click', click);
	addEventListener('mouseover', hover);
}
