---
category: '@Integrations'
---

# useFuse

Easily implement fuzzy search using a composable with [Fuse.js](https://github.com/krisk/fuse).

From the Fuse.js website:

> What is fuzzy searching?
>
> Generally speaking, fuzzy searching (more formally known as approximate string matching) is the technique of finding strings that are approximately equal to a given pattern (rather than exactly).

## Install Fuse.js as a peer dependency

### NPM

```bash
npm install fuse.js@^7
```

### Yarn

```bash
yarn add fuse.js
```

## Usage

```ts
import { useFuse } from '@vueuse/integrations/useFuse'
import { shallowRef } from 'vue'

const data = [
  'John Smith',
  'John Doe',
  'Jane Doe',
  'Phillip Green',
  'Peter Brown',
]

const input = shallowRef('Jhon D')

const { results } = useFuse(input, data)

/*
 * Results:
 *
 * { "item": "John Doe", "index": 1 }
 * { "item": "John Smith", "index": 0 }
 * { "item": "Jane Doe", "index": 2 }
 *
 */
```

## Logical queries

The search argument also accepts Fuse.js [logical query operators](https://www.fusejs.io/logical-search.html), either directly, as a ref, or through a getter. For example, combine conditions across fields with `$and` and `$or`:

```ts
import { useFuse } from '@vueuse/integrations/useFuse'

const books = [
  { title: 'Old War', author: 'Alice' },
  { title: 'Old War', author: 'Bob' },
  { title: 'New World', author: 'Alice' },
]

const { results } = useFuse({
  $and: [
    { author: '=Alice' },
    { $or: [{ title: '="Old War"' }, { title: '="New World"' }] },
  ],
}, books, {
  fuseOptions: {
    keys: ['title', 'author'],
    useExtendedSearch: true,
  },
})

// Results contain Alice's "Old War" and "New World".
```

Here, `useExtendedSearch` enables the `=` exact-match operator inside each condition.
