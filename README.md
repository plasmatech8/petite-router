# petite-router · <a href="https://www.npmjs.com/package/petite-router"><img src="https://img.shields.io/npm/v/petite-router.svg" alt="Version">
  </a>

A simple and tiny client-side SPA router.

Zero dependencies. Size < 3kB. High performance with a simple API.

📖 [**API Documentation**](https://plasmatech8.github.io/petite-router/modules.html)

💻 [**Example Site**](https://petite-router.pages.dev/)

Inspired by [petite-vue](https://github.com/vuejs/petite-vue) and [navaid](https://github.com/lukeed/navaid).

## Features

🚏 **Configurable Routing** <br />
Define routes using `r-path` HTML directives, making it straightforward to specify routing
information directly in your HTML markup. Supports wildcards and named parameters.

🪧 **Dynamic Page Titles** <br />
Improve SEO and user experience by dynamically updating document titles using the `r-title`
directive.

💉 **HTML Content Injection** <br />
Fetch and inject HTML content from a URL using the `r-html` directive, with support for
loading indicators and error handling.

🚥 **Route Parameters** <br />
Access route parameters and perform programmatic navigation with ease using the `Router` instance,
which is attached to the `window` object.

🪝 **Navigation & Injection Hooks** <br />
Register callbacks to execute custom logic after navigation or HTML content injection using the
methods available on the `Router` instance.

## Installation

### Using CDN

Add script tag to header:
```html
<script type="module" defer>
    import { createRouter } from 'https://unpkg.com/petite-router/dist/petite-router.es.js';
    const router = createRouter().mount();
</script>
```

Alternatively, you can load the IIFE script:
```html
<script src="https://unpkg.com/petite-router/dist/petite-router.iife.js" defer></script>
```

### Using NPM

Install package:
```bash
npm install petite-router
```

Create and mount router:
```ts
import { createRouter } from 'petite-router';
const router = createRouter().mount();
```

Alternatively, you can import the IIFE script:
```ts
import 'petite-router/dist/petite-router.iife.js';
```

### Installation with Petite-Vue

Petite-router and [petite-vue] can be used together.

However, some complications may arise when using HTML injection
on elements subject to conditional directives.

It is recommended to setup in the same way as described in [example/index.html](example/index.html).

### Files

Download the files directly and use them in your project.

| File                                                                                | Description                              |
| ----------------------------------------------------------------------------------- | ---------------------------------------- |
| [petite-router.es.js](https://unpkg.com/petite-router/dist/petite-router.es.js)     | ECMAScript Module (ESM) bundle           |
| [petite-router.umd.js](https://unpkg.com/petite-router/dist/petite-router.umd.js)   | Universal Module Definition (UMD) bundle |
| [petite-router.iife.js](https://unpkg.com/petite-router/dist/petite-router.iife.js) | Immediately Invoked Function Expression  |

## Usage

### Basic Example

This is an example of routing and content injection when using plain HTML/JS:
```html
<script>
  router.afterNavigation(() => {
    // Print the route parameters from the current route and path
    console.log(router.params)

    // Update state variables
    document.getElementById('userId').innerText = router.params.userId
  });
</script>

<ul>
  <li><a href="/">Home</a></li>
  <li><a href="/about">About</a></li>
  <li><a href="/users">Users</a></li>
  <li><a href="/users/42">User #42</a></li>
</ul>

<div r-path="none">
  Website Loading... This message will disappear when the JavaScript is loaded.
</div>

<div r-path="/" r-title="Home" hidden>
  This is the homepage!
</div>

<div r-inject="/html/banner.html" hidden>
  This will be replaced by HTML content fetched from /html/banner.html
</div>

<div r-path="/about" r-title="About Us" hidden>
  About Us Page.
</div>

<div r-path="/users" r-title="Users" r-html="/html/users.html" hidden>
  This will be replaced by HTML content fetched from /html/users.html after an anchor tag is hovered which matches <code>/users</code>.
</div>

<div r-path="/users/:userId" r-title="User Profile" hidden>
   This is the page for user #<span id="userId"></span>.
</div>

<div r-path="/users/*" hidden>
   This content will also appear for <code>/user/:userId</code>.
</div>

<div r-path="/users/**" hidden>
   This content will also appear for both <code>/users</code> and <code>/user/:userId</code>.
</div>

<div r-path="404" r-title="Not Found" hidden>
  Page Not Found: Sorry! This page does not exist.
</div>
```

For a more complex example, see the [example site](example).

### Defining Routes

Use the `r-path` directive to define routes in your HTML elements.

Add an `r-title` directive to update the document title.

```html
<div r-path="/about" r-title="About Us" hidden>About Us Page</div>
```

> [!TIP]
> Add the `hidden` attribute to your elements with `r-path` to avoid flash of HTML content before
> the JavaScript is loaded.

> [!NOTE]
> If no `r-title` attribute exists for any matching `r-path` route,
> the document title will revert to the original page title from when the router was mounted.

#### `r-path` directive

Elements with `r-path` that do not match the current URL path will have the `hidden` attribute added.

Use these special values for `r-path="<value>"` for specific scenarios:
- `404` - for when no route/path matches the current URL
- `none` - will always be hidden (after JavaScript router is mounted)

Supported path strings:
- `*` wildcard  (e.g. `/*` -> `/foo`)
- `**` recursive wildcard (e.g. `/**` -> `/foo/bar/baz`)
- `:param` wildcard attached to parameter (e.g. `/:param` -> `/foo` -> `foo`)
- `:param(*)` recursive wildcard attached to parameter (e.g. `/:param(*)` -> `/foo/bar/baz` -> `foo/bar/baz`)

#### `r-title` Directive

Sets the document title dynamically based on the route.

If titles for multiple routes are active, it will use the last title of the last
active route in document order.

### HTML Injection

Fetch and inject HTML content from URLs using the `r-html` directive.

The `r-status` attribute will be added to describe the status of the fetch & injection.

```html
<div r-html="/content.html">Loading...</div>
```

This will replace the inner HTML with the text content of the response.

> [!CAUTION]
> Ensure content sources are trusted when injecting HTML content fetched from external
> URLs to prevent XSS attacks.

> [!NOTE]
> If `r-status` already exists on the element, content will not be fetched/re-fetched.

> [!WARNING]
> If HTML content contains a `<html>` tag, the injection will be refused because the content should
> be a snippet of raw HTML. If you are using an SPA server and mispell the path to a HTML resource,
> it may return a 404 page instead of your intended HTML snippet.

#### `r-html` directive

The contents of `r-html` will be fetched and injected onto the page when:
- The user navigates to a URL path which matches the `r-path` of the closest parent element
- The user navigates to a URL path which is not contained by a `r-path` element
- The hovers over an anchor tag where the `href` matches the `r-path` of the closest parent element

You can place `r-html` inside of a HTML snippet which is fetched by another `r-html` request.
Recursive fetching is possible but not recommended.

#### `r-status` directive

The `r-status="<value>"` attribute will be added to describe the status of the HTML injection:
- `loading` - fetch still pending
- `success` - content successfully fetched and added to DOM
- `error` - failed to fetch

### Router Hooks and Methods

The `Router` instance is attached to the `window` object on mount, so you can use it anywhere.

#### `afterNavigation` method

Register a callback called after the user navigates to a new URL path.

```js
router.afterNavigation(() => {
    // Do something required after the user navigates!
    console.log("New route path:", router.path);
    console.log("New route parameters:", router.params);
    // e.g. Update state variables that may contain routing information.
    localStorage.setItem('lastPageSeen', router.path);
});
```

#### `afterInjection` method

Register a callback called after new HTML content is injected onto the page.

```js
router.afterInjection(() => {
    // Do something required after new HTML content is injected!
    console.log("New content was injected!");
    // e.g. Re-apply JavaScript enhancements.
    document.querySelectorAll('button').forEach((el) => applyEnhancement(el));
});
```

#### `match` function

Check whether the current URL path matches the specified path.

```js
const isAboutSubpage = router.match('/about/**'); // true/false
const isUsersSubpage = router.match('/users/**', '/users/0/profile'); // true
const isUsersSubpage = router.match('/storage/:bucket/:key(*)/*.txt', '/storage/mybucket/path/to/my/file/file.txt'); // true
```

#### `params` property

Get an object containing route parameter values for the current route.

```js
// Route: /storage/:bucket/:key(*)/*.txt
// Path:  /storage/mybucket/path/to/my/file/file.txt
const params = router.params // { bucket: 'mybucket', key: 'path/to/my/file' }
```

---

For additional methods, see the [Router API Documentation](https://plasmatech8.github.io/petite-router/classes/Router.html) .

---

## Run the Example Site + Development Server

The [example site](example) demonstrates usage of petite-vue and petite-router with a number of
routing, navigation and HTML injection demonstrations.

Clone the repository, install the dev dependencies:
```bash
git clone git@github.com:plasmatech8/petite-router.git
cd petite-router
npm install
```

Run the dev server:
```bash
npm run dev
```

## Known Issues

- `r-html` does not work when inside `v-if` or `v-for` or any JavaScript DOM operation that mounts the tag after router is mounted.
  - There may be a way to re-mount the router, or re-run injections after JavaScript DOM operation is applied.
  - Elements with `r-html` may get stuck with `r-status="loading"`

## License

petite-router is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
