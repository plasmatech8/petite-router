/**
 * @type {Function[]}
 */
const afterInjectionCallbacks = [];

/**
 * @type {Function[]}
 */
const afterNavigationCallbacks = [];

/**
 * @type {{[key: string]: string}}
 */
let params = {};

/**
 * @type {string}
 */
let originalTitle = document.title;

/**
 * Router object containing callback registration methods and utilities for navigating and
 * managing routes.
 */
export class Router {
  /**
   * Initialize and mount the router to the DOM.
   * @returns {Router} Returns the router.
   */
  mount() {
    convertAllAnchorTagsToRouterLinks();
    handleRouting();
    handleInjections();
    // @ts-ignore
    window.router = this;
    return this;
  }
  /**
   * Add a callback that will be called after new HTML content is injected onto the page.
   * @param {Function} fn Function that will be called after injection.
   * @returns {Router} Returns the router.
   */
  afterInjection(fn) {
    afterInjectionCallbacks.push(fn);
    return this;
  }
  /**
   * Add a callback that will be called after navigating to new URL path.
   * @param {Function} fn Function that will be called after navigation.
   * @returns {Router} Returns the router.
   */
  afterNavigation(fn) {
    afterNavigationCallbacks.push(fn);
    return this;
  }
  /**
   * Get the URL parameters extracted from the current route and path.
   * @returns {{[key: string]: string}} URL parameters for the current route.
   */
  get params() {
    return params;
  }
  /**
   * Get the current URL path.
   * @returns {string} The current path from location.pathname
   */
  get path() {
    return location.pathname;
  }
  /**
   * Navigate to the previous history entry.
   */
  back() {
    history.back();
  }
  /**
   * forward Navigate to the next history entry.
   */
  forward() {
    history.forward();
  }
  /**
   * Navigate to a new URL path on the site and push the state to the history stack.
   * @param {string} path URL path to navigate to.
   */
  push(path) {
    history.pushState({}, '', path);
    handleRouting();
  }
  /**
   * Navigate to a new URL path on the site and replace the state to the history stack.
   * @param {string} path URL path to navigate to.
   */
  replace(path) {
    history.replaceState({}, '', path);
    handleRouting();
  }
  /**
   * Check if the route matches the current URL path, or specified URL path.
   * @param {string} route Route string.
   * @param {string} to Path string to check if matches the route. Defaults to the current URL path.
   * @returns {boolean} Whether the path matches the route string.
   */
  match(route, to = location.pathname) {
    if (route === '404') {
      const elements = document.querySelectorAll('[r-path]');
      const noMatches = Array.from(elements).every((el) => {
        const path = el.getAttribute('r-path');
        return !(path && matchRoute(path, to));
      });
      return noMatches;
    }
    return !!matchRoute(route, to);
  }
}

/**
 * Return a Router instance.
 * @returns {Router} The router.
 */
export function createRouter() {
  return new Router();
}

/**
 * Hide and show HTML elements with r-path attribute based on the value.
 * @param {string} to Path used for updating the DOM. Defaults to location.pathname.
 */
function handleRouting(to = location.pathname) {
  /** @type {{[key: string]: string}} */
  params = {};
  document.title = originalTitle;

  // Update elements based on route path
  const elements = document.querySelectorAll('[r-path]');
  let routeFound = false;
  elements.forEach((el) => {
    const path = el.getAttribute('r-path');
    const title = el.getAttribute('r-title');
    // If r-path matches, update hidden attribute and add route parameters to history state
    const match = path && matchRoute(path, to);
    if (match) {
      if (title) document.title = title;
      el.removeAttribute('hidden');
      routeFound = true;
      params = { ...params, ...match };
    } else {
      el.setAttribute('hidden', '');
    }
  });

  // No matching route, 404
  if (!routeFound) {
    document.querySelectorAll('[r-path="404"]').forEach((el) => {
      const title = el.getAttribute('r-title');
      if (title) document.title = title;
      el.removeAttribute('hidden');
    });
  }

  // Call navigation callbacks
  afterNavigationCallbacks.forEach((f) => f());
}

/**
 * Inject HTML from a URL into elements with the r-html attribute.
 * @param {string} to Path used for updating the DOM. Defaults to window.location.pathname.
 * @param {Document | HTMLElement} root The root element whose children will be updated. Defaults to document.
 */
async function handleInjections(to = window.location.pathname, root = document) {
  const elements = Array.from(root.querySelectorAll('[r-html]:not([r-status])'));
  let newContent = false;
  for (const el of elements) {
    const source = el.getAttribute('r-html');
    const path = el.closest('[r-path]')?.getAttribute('r-path');
    if (!source || (path && !matchRoute(path, to))) continue;
    // Inject HTML
    try {
      el.setAttribute('r-status', 'loading');
      const res = await fetch(source);
      if (!res.ok) {
        throw new Error(`Status: ${res.status} ${res.statusText}`);
      }
      const text = await res.text();
      if (text.match(/<html\s*[^>]*>/)) {
        throw new Error(
          'File contains <html> tag indicating that it is a page and not a snippet of HTML.'
        );
      }
      const html = new DOMParser().parseFromString(text, 'text/html').body;
      handleInjections(to, html);
      el.replaceChildren(...html.childNodes);
      el.setAttribute('r-status', 'success');
      newContent = true;
    } catch (error) {
      console.error(`Failed to fetch resource from ${source}:`, error);
      el.setAttribute('r-status', 'error');
    }

    // Call injection callbacks
    if (newContent) {
      handleRouting();
      afterInjectionCallbacks.forEach((f) => f());
    }
  }
}

/**
 * Converts all anchor tags in the DOM into router links if they navigate to the same host.
 */
function convertAllAnchorTagsToRouterLinks() {
  /**
   * @param {MouseEvent} e Click event on child of anchor link.
   */
  const click = (e) => {
    // @ts-ignore
    const anchor = e.target?.closest('a');
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
  /**
   * @param {MouseEvent} e Hover event in child of anchor link.
   */
  const hover = (e) => {
    // @ts-ignore
    const anchor = e.target?.closest('a');
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
 * @returns {{[key: string]: string } | null} Returns an object of route information if matched, otherwise null.
 */
function matchRoute(route, path) {
  if (!route.startsWith('/')) return null;
  // Convert route string to regex pattern
  const segments = route
    .replace(/^\/|\/$/g, '')
    .split('/')
    .map((segment) => {
      // Wildcard
      if (segment === '*') return '/[^/]+';
      // Recursive wildcard
      if (segment === '**') return '(/.+)?';
      // Named parameter
      const match = segment.match(/^:([a-zA-Z][a-zA-Z\d_]*)(\(\*\))?$/);
      if (match) {
        const name = match[1];
        const recursive = match[2];
        return recursive ? `(/(?<${name}>.+))?` : `/(?<${name}>[^/]+)`;
      }
      // Hard-coded path value. Escape any regex characters.
      return '/' + segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    });
  const pattern = new RegExp(`^${segments.join('')}/?$`);
  const match = path.match(pattern);
  return match ? { ...match.groups } : null;
}
