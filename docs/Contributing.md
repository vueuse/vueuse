# 🧱 Contribute

Thanks for being interested in contributing to this project!

## Setup

Clone this repo to your local machine and install the dependencies.

```bash
yarn install
```

## Code Style

Don't worry about the code style as long as you install the dev dependencies. Git hooks will format and fix them for you on committing.

## Development 

We use Storybook for rapid development and documenting. You can start it locally by

```bash
yarn dev
```

## Online one-click setup

You can use Gitpod(an online IDE which is free for Open Source) for contributing. With a single click it will launch a workspace and automatically clone the `VueUse` repo, run `yarn install` and `yarn dev`.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/from-referrer/)

## Contributing to existing functions

Feel free to enhance the existing functions. Please try not to introduce breaking changes.


## Contributing to new functions

There are some notes for adding new functions

- Before you start working, it's better to open an issue to discuss first.
- The implementation should be placed under `packages/core` as a folder and exposing in `index.ts`
- In the `core` package, try not to introduce 3-rd party dependencies as this package is aimed to be as lightweight as possible. 
- If you do want to introduce 3-rd party dependencies, please contribute to add-ons.
- You can found the function template under `packages/core/_template/`

## Contributing to new add-ons

New add-ons are greatly welcome!

- Create a new folder under `packages/`, name it as your add-on name. 
- Add add-on details in `scripts/packages.ts`
- Create `README.md` and `readme.stories.tsx` under that folder, `package.json` will be auto-generated.
- Add functions as you would do to the core package.
- Run `npm run update:readme` to update the docs.

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

> You can found the template under `packages/core/_template/`

```bash
index.ts            # function source code itself
index.stories.tsx   # storybook demo
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

> This will be the intro. The detail descriptions...
```

for `index.stories.tsx`, you can duplicate for the other functions and modify it.


## Thanks

Thank you again for being interested in this project! You are awesome!
