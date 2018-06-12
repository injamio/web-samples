# Injam Web Samples

All Injam SDK features for web are covering in this simple web app with most real world examples.

## Installation and Usage

clone this repo:

```bash
git clone git@github.com:injamio/web-samples.git
```

Go to app directory:

```bash
cd web-samples
```

### Quick usage

You just need to set your credentials (physical id and application key) in `dist/js/injam.samples.js`.
Now all samples works fine in browser. Start with opening `dist/index.html` in your browser.

### Build from source

If you want to build project from the source, the only required is node and npm installed on your machine.

Then install all dependencies:

```bash
npm i
```

Now set your credentials (physical id and application key) in `src/js/app.js`.

Build to `dist`:

```bash
gulp
```

Build and watch for changes:

```bash
gulp watch
```