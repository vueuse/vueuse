# Contributing

Thanks for being interested in contributing to this project!

## Development 

### Setup

Clone this repo to your local machine and install the dependencies.

```bash
yarn install
```

We use Vitepress for rapid development and documenting. You can start it locally by

```bash
yarn dev
```

## Contributing

### Existing functions

Feel free to enhance the existing functions. Please try not to introduce breaking changes.

### New functions

There are some notes for adding new functions

- Before you start working, it's better to open an issue to discuss first.
- The implementation should be placed under `packages/core` as a folder and exposing in `index.ts`
- In the `core` package, try not to introduce 3rd-party dependencies as this package is aimed to be as lightweight as possible.
- If you'd like to introduce 3rd-party dependencies, please contribute to @vueuse/integrations or create a new add-on.
- You can find the function template under `packages/core/_template/`, details explained in the [Function Folder](#function-folder) section.
- When writing documentation for your function, the `<!--FOOTER_STARTS-->` and `<!--FOOTER_ENDS-->` will be automatically updated at build time, so don't feel the need to update them.

> Please note you don't need to update the `indexes.json` or packages' `index.ts`. They are auto-generated.

### New add-ons

New add-ons are greatly welcome!

- Create a new folder under `packages/`, name it as your add-on name. 
- Add add-on details in `scripts/packages.ts`
- Create `README.md` under that folder.
- Add functions as you would do to the core package.
- Commit and submit as a PR.

## Project Structure

### Monorepo

We use monorepo for multiple packages

```
packages
  shared/         - shared utils across packages
  core/           - the core package
  firebase/       - the Firebase add-on
  [...addons]/    - add-ons named
```

### Function Folder

A function folder typicality contains these 4 files:

> You can find the template under `packages/core/_template/`

```bash
index.ts            # function source code itself
demo.vue            # documentation demo
index.test.ts       # jest unit testing
index.md            # documentation
```

for `index.ts` you should export the function with names.

```ts
// DO
export { useMyFunction }

// DON'T
export default useMyFunction
```

for `index.md` the first sentence will be displayed as the short intro in the function list, so try to keep it brief and clear.

```md
# useMyFunction

This will be the intro. The detail descriptions...
```

Read more about the [guidelines](https://vueuse.org/guidelines).

## Code Style

Don't worry about the code style as long as you install the dev dependencies. Git hooks will format and fix them for you on committing.

## Thanks

Thank you again for being interested in this project! You are awesome!
