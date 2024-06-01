# petite-router

A tiny client-side SPA router.

Zero dependencies.

Size < 2.8kB.

Uses `r-*` HTML directives to define your routing information.

Features:
- Routes defined by `r-path="/foo/bar"` directive
- Page titles defined by `r-title="My Homepage"` directive
- Inject HTML fetched from a URL using `r-html="/html/my-content.html"` directive (fetch state reflected in `r-status=(loading|success|error)`)

## HTML Directives

### r-path

All elements with `r-path` that match the URL path will be set to `hidden=false` and elements that do match are set to `hidden`.

Add `hidden` the attribute to your `r-path` elements to avoid flash of HTML content before the JavaScript is loaded

Use `r-path="404"` for when no path is matched

Use `r-path="none"` if you want a loading icon that will only appear

Supported path strings:
- `*` wildcard  (e.g. `/*` -> `/foo`)
- `**` recursive wildcard (e.g. `/**` -> `/foo/bar/baz`)
- `:param` wildcard attached to parameter (e.g. `/:param` -> `/foo` -> `foo`)
- `:param(*)` recursive wildcard attached to parameter (e.g. `/:param(*)` -> `/foo/bar/baz` -> `foo/bar/baz`)

### r-title

Updates the document title with the value.

e.g. `r-title="Home Page"` -> "Home Page"

If navigating to a route, and no matched `r-path` element exists which contain a `r-title` attribute,
then the title will revert to the default page title. (`<title>` tag)

### r-html

Will send a fetch request to the value and replace the inner HTML with the text content of the response. e.g. `r-html="/content.html"`

While loading the element will have attribute: `r-status="loading"`

Once succeeded the element will have `r-status="success"` or `r-status="error"` if failed.

You can place `r-html` anywhere. You can even place `r-html` inside of the content being requested
by another `r-html`.

The contents of `r-html` will be fetched and injected onto the page when:
- The user navigates to a URL path which matches the `r-path` of the closest parent element
- The user navigates to a URL path which is not contained by a `r-path` element
- The hovers over an anchor tag where the `href` matches the `r-path` of the closest parent element

Note: if `r-status` exists on the element, content will not be fetched (or re-fetched).