# petite-router

Petite Router is a lightweight client-side SPA (Single Page Application) router designed to keep
your web applications lean and efficient. With zero dependencies and a small size of less than 3kB,
petite-router provides essential routing functionality for your JavaScript applications.


📦 **Zero Dependencies**: Keep your project lean and mean!

🔍 **Simple API**: Define routes, update document titles dynamically, and inject HTML content effortlessly using `r-*` HTML directives.

⚡ **High Performance**: Leveraging efficient DOM operations, petite-router delivers lightning-fast navigation and seamless user experiences.

🪶 **Small Size**: With a size of less than 3kB, petite-router loads fast and keeps your project lightweight.

⚙️ **Configurable**: Easily configure routes and hook into navigation and HTML injection callbacks.

🛠️ **Developer-Friendly**: Easy to set up and integrate into any project.


## Features

* **Simple Routing**: Define routes using `r-path` HTML directives, making it easy to specify routing information directly in your HTML markup.
* **Dynamic Page Titles**: Update document titles dynamically using the `r-title` directive, allowing for improved SEO and user experience.
* **HTML Content Injection**: Fetch and inject HTML content from URLs using the `r-html` directive, with support for loading indicators and error handling.

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

### r-path Directive

Use the `r-path` directive to define routes in your HTML elements:

```html
<div r-path="/about" hidden>About Us</div>
```

All elements with `r-path` that match the current URL path will be set to `hidden=false`

All elements with `r-path` that do not match the current URL path are set to `hidden`.

> [!TIP]
> Add the `hidden` attribute to your elements with `r-path` to avoid flash of HTML content before
> the JavaScript is loaded

Use `r-path="404"` for when no path is matched

Use `r-path="none"` if you want a loading icon that will only appear

Supported path strings:
- `*` wildcard  (e.g. `/*` -> `/foo`)
- `**` recursive wildcard (e.g. `/**` -> `/foo/bar/baz`)
- `:param` wildcard attached to parameter (e.g. `/:param` -> `/foo` -> `foo`)
- `:param(*)` recursive wildcard attached to parameter (e.g. `/:param(*)` -> `/foo/bar/baz` -> `foo/bar/baz`)

### r-title Directive

Update document titles dynamically with the `r-title` directive:

```html
<div r-path="/about" r-title="About Us" hidden>About Us Page</div>
```

If navigating to a route, and no matched `r-path` element exists which contain a `r-title` attribute,
then the title will revert to the default page title. (`<title>` tag)

### r-html Directive

Fetch and inject HTML content from URLs using the `r-html` directive:

```html
<div r-html="/content.html">Loading...</div>
```

Will replace the inner HTML with the text content of the response. e.g. `r-html="/content.html"`

While loading the element will have attribute: `r-status="loading"`

Once succeeded the element will have `r-status="success"` or `r-status="error"` if failed.

You can place `r-html` anywhere. You can even place `r-html` inside of the content being requested
by another `r-html`.

The contents of `r-html` will be fetched and injected onto the page when:
- The user navigates to a URL path which matches the `r-path` of the closest parent element
- The user navigates to a URL path which is not contained by a `r-path` element
- The hovers over an anchor tag where the `href` matches the `r-path` of the closest parent element

> [!NOTE]
> If `r-status` exists on the element, content will not be fetched (or re-fetched).

> [!NOTE]
> If HTML content contains a `<html>` tag, the injection will be refused because the content should
> be a snippet of raw HTML.

## License

petite-router is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
