# 🧱 Contribute

Thanks for being instrested contributing this project!

## Setup

Clone this repo to your local machine and install the dependencies.

```bash
npm i
```

Before you start, you need to init the target Vue API you gonna work with. Normally you would like to starts with Vue 2.x

```bash
npm run switch 2
```

## Code Style

Don't worry about the code style as long as you install the dev dependencies. Git hooks will format and fix them for you on commiting.

## Development 

We use Storybook for rapid developmenting and documenting. You can start it locally by

```bash
npm run storybook
```

## Contributing to existing functions

Feel free to enhance the existing functions. Please try not to introduce breaking changes.


## Contributing to new functions

There are some notes for add new functions

- Before you starts working, it's better to open an issue to discuss first.
- Function name should starts with `use` or `create` in lowercases.
- The implementation should be placed under `packages/core` as a folder and exposing in `index.ts`
- In the `core` package, try not to introduce 3-rd party dependencies as this package is aim to be as lightweight as possible. 
- If you do want to introduce 3-rd party dependencies, please contribute to non-`core` package or create a new package for that.

## Thanks

You you again for being instrested in this project! You are awesome!
