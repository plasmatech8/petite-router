# petite-router

A tiny client-side SPA router.

Zero dependencies. Size < 3kB. High performance and a simple API.

📦 **Zero Dependencies**: Keep your project lean and mean!

🔍 **Simple API**: Define routes, update document titles dynamically, and inject HTML content effortlessly using `r-*` HTML directives.

⚡ **High Performance**: Leveraging efficient DOM operations, petite-router delivers lightning-fast navigation and seamless user experiences.

🪶 **Small Size**: With a size of less than 3kB, petite-router loads fast and keeps your project lightweight.

⚙️ **Configurable**: Easily configure routes and hook into navigation and HTML injection callbacks.

Inspired by [petite-vue](https://github.com/vuejs/petite-vue) and [navaid](https://github.com/lukeed/navaid).

## Features

🚏 **Simple Routing**:

Define routes using `r-path` HTML directives, making it easy to specify routing information directly in your HTML markup.

🪧 **Dynamic Page Titles**:

Update document titles dynamically using the `r-title` directive, allowing for improved SEO and user experience.

💉 **HTML Content Injection**:

Fetch and inject HTML content from URLs using the `r-html` directive, with support for loading indicators and error handling.

🪝 **After Navigation & Injection Hooks**:

Use the methods on the `Router` instance to register callbacks required when your page changes.

## Installation

> TODO:
>
> You can install petite-router via npm:
>
> ```bash
> npm install petite-router
> ```
>
> Or include it directly in your HTML:
>
> ```bash
> <script src="path/to/petite-router.min.js"></script>
> ```

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
  <li><a href="/">Home</a></li>
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

<div r-path="/users/:userId" r-title="Users" hidden>
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

You can see a more complex example under: [/example](example)

### Defining Routes

Use the `r-path` directive to define routes in your HTML elements.

You can additionally add an `r-title` directive to update the document title.

```html
<div r-path="/about" r-title="About Us" hidden>About Us Page</div>
```

> [!TIP]
> Add the `hidden` attribute to your elements with `r-path` to avoid flash of HTML content before
> the JavaScript is loaded.

#### r-path directive

Elements with `r-path` that do not match the current URL path will have the `hidden` attribute added.

Use these special values for `r-path="<value>"` for specific scenarios:
- `404` - for when no route/path matches the current URL
- `none` - will always be hidden (after JavaScript router is mounted)

Supported path strings:
- `*` wildcard  (e.g. `/*` -> `/foo`)
- `**` recursive wildcard (e.g. `/**` -> `/foo/bar/baz`)
- `:param` wildcard attached to parameter (e.g. `/:param` -> `/foo` -> `foo`)
- `:param(*)` recursive wildcard attached to parameter (e.g. `/:param(*)` -> `/foo/bar/baz` -> `foo/bar/baz`)

#### r-title Directive

If navigating to a route, and no `r-title` attribute exists for any matching `r-path` route,
then the document title will revert to the original page title.

### HTML Injection

Fetch and inject HTML content from URLs using the `r-html` directive.

```html
<div r-html="/content.html">Loading...</div>
```

This will replace the inner HTML with the text content of the response.

#### r-html directive

The `r-status="<value>"` attribute will be added to describe the status of the HTML injection:
- `loading` - fetch still pending
- `success` - content successfully fetched and injected
- `error` - failed to fetch

You can place `r-html` inside of the HTML which will be fetched by another `r-html`.
Recursive fetching is possible but not recommended.

The contents of `r-html` will be fetched and injected onto the page when:
- The user navigates to a URL path which matches the `r-path` of the closest parent element
- The user navigates to a URL path which is not contained by a `r-path` element
- The hovers over an anchor tag where the `href` matches the `r-path` of the closest parent element

> [!NOTE]
> If `r-status` exists on the element, content will not be fetched (or re-fetched).

> [!NOTE]
> If HTML content contains a `<html>` tag, the injection will be refused because the content should
> be a snippet of raw HTML.

### Router Hooks and Methods

```js
router.afterNavigation(() => {
    // Do something required after the user navigates!
    // e.g. Update state variables that may contain routing information.
    console.log("Route path:", router.path);
    console.log("Route parameters:", router.params);
    localStorage.s
});

router.afterInjection(() => {
    // Do something required after new HTML content is injected!
    // e.g. Update new HTML with JavaScript enhancements.
    console.log("New content was injected!");
    app.mount()
});
```

## License

petite-router is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
