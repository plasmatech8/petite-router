const afterInjectionFunctions = [];
const afterNavigationFunctions = [];
let params = {};

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
      return params;
    },
    mount() {
      convertAllAnchorTagsToRouterLinks();
      handleRouting();
      handleInjections();
    },
    back() {
      history.back();
    },
    forward() {
      history.forward();
    },
    push(path) {
      history.pushState({}, '', path);
      handleRouting();
    },
    replace(path) {
      history.replaceState({}, '', path);
      handleRouting();
    }
  };
}

/**
 * Hide and show HTML elements with r-path attribute based on the value.
 * @param {string} to Path used for updating the DOM. Defaults to window.location.pathname.
 */
function handleRouting(to = null) {
  params = {};
  if (!to) to = window.location.pathname;

  // Update elements based on route path
  const elements = document.querySelectorAll('[r-path]');
  let routeFound = false;
  elements.forEach((el) => {
    const path = el.getAttribute('r-path');
    const title = el.getAttribute('r-title');
    // If r-path matches, update hidden attribute and add route parameters to history state
    const match = matchRoute(path, to);
    if (match) {
      if (title) document.title = title;
      el.removeAttribute('hidden');
      routeFound = true;
      params = { ...params, ...match };
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
    if (!path || !source || !matchRoute(path, to)) continue;

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

/**
 * Check if a route string matches a path string.
 * @param {string} route Route path string
 * @param {string} path Destination path string
 * @returns {{ params: {[key: string]: string }} | null} Returns an object of route information if matched, otherwise null.
 */
function matchRoute(route, path) {
  // Convert route string to regex pattern
  const patternString = route
    // Escape any regex
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    // Convert :param(*) to (/(?<param>.+))?
    .replace(/\/:([^\s/]+)\\\(\\\*\\\)/g, (_, paramName) => `(/(?<${paramName}>.+))?`)
    // Convert :param to (?<param>[^/]+)
    .replace(/:([^\s/]+)/g, (_, paramName) => `(?<${paramName}>[^/]+)`)
    // Convert /** to (/.+)?
    .replace(/\/\\\*\\\*/g, '(/.+)?')
    // Convert * to [^/]+
    .replace(/\\\*/g, '[^/]+');
  const pattern = new RegExp(`^${patternString}/?$`);
  const match = path.match(pattern);
  return match ? { ...match.groups } : null;
}
