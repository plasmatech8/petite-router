/*
 * TODO:
 * - Wildcard parameters (cannot test nested HTML injections yet)
 * - Route parameters
 */

const afterInjectionFunctions = [];
const afterNavigationFunctions = [];

/**
 * Router object containing callback registration methods.
 * @typedef {object} Router
 * @property {Function} afterInjection Add a function to be called after HTML injections when new HTML content is added to the page.
 * @property {{[key: string]: string}} params URL params for the current route.
 */

/**
 * Initialize a router in the DOM.
 * @returns {Router} The router object.
 */
export function createRouter() {
  convertAllAnchorTagsToRouterLinks();
  handleRouting();
  handleInjections();
  return {
    afterInjection(fn) {
      afterInjectionFunctions.push(fn);
      return this;
    },
    afterNavigation(fn) {
      afterNavigationFunctions.push(fn);
      return this;
    },
    get params() {
      return history.state;
    }
  };
}

/**
 * Hide and show HTML elements with r-path attribute based on the value.
 * @param {string} to Path used for updating the DOM. Defaults to window.location.pathname.
 */
function handleRouting(to = null) {
  if (!to) to = window.location.pathname;

  // Toggle elements based on route path
  const elements = document.querySelectorAll('[r-path]');
  let routeFound = false;
  elements.forEach((el) => {
    const path = el.getAttribute('r-path');
    const title = el.getAttribute('r-title');

    // Update hidden attributes
    // TODO: update URL matching
    if (to === path) {
      if (title) document.title = title;
      el.removeAttribute('hidden');
      routeFound = true;
    } else {
      el.setAttribute('hidden', true);
    }
  });

  // No matching route, 404
  if (!routeFound) {
    document.querySelectorAll('[r-path="404"]').forEach((el) => el.removeAttribute('hidden'));
  }

  // Call navigation callbacks
  afterNavigationFunctions.forEach((f) => f());
}

/**
 * Inject HTML from a URL into elements with the r-html attribute.
 * @param {string} to Path used for updating the DOM. Defaults to window.location.pathname.
 * @param {Document | HTMLElement} root The root element whose children will be updated. Defaults to document.
 */
async function handleInjections(to = null, root = document) {
  if (!to) to = window.location.pathname;
  const elements = Array.from(
    root.querySelectorAll('[r-html]:not([r-html-status="success"],[r-html-status="loading"])')
  );
  let newContent = false;
  for (const el of elements) {
    const source = el.getAttribute('r-html');
    const path = el.closest('[r-path]')?.getAttribute('r-path');
    // TODO: update URL matching
    if ((path && !to.startsWith(path)) || !source) continue;

    // Inject HTML
    try {
      el.setAttribute('r-html-status', 'loading');
      const res = await fetch(source);
      if (!res.ok) throw new Error(`Status: ${res.status} ${res.statusText}`);
      const text = await res.text();
      const html = new DOMParser().parseFromString(text, 'text/html').body;
      await handleInjections(to, html);
      el.replaceChildren(...html.childNodes);
      el.setAttribute('r-html-status', 'success');
      newContent = true;
    } catch (error) {
      console.error(`Failed to fetch resource from ${source}:`, error);
      el.setAttribute('r-html-status', 'failed');
    }

    // Call injection callbacks
    if (newContent) {
      afterInjectionFunctions.forEach((f) => f());
    }
  }
}

/**
 * Converts all anchor tags in the DOM into router links if they navigate to the same host.
 */
function convertAllAnchorTagsToRouterLinks() {
  const click = (e) => {
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
  };
  const hover = (e) => {
    const anchor = e.target.closest('a');
    if (anchor?.pathname) handleInjections(anchor.pathname);
  };
  const navigate = () => {
    handleRouting();
    handleInjections();
  };
  addEventListener('popstate', navigate);
  addEventListener('replacestate', navigate);
  addEventListener('pushstate', navigate);
  addEventListener('click', click);
  addEventListener('mouseover', hover);
}
