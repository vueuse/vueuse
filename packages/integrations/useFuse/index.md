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
npm install fuse.js
```

### Yarn

```bash
yarn add fuse.js
```

## Usage

```ts
import { ref } from 'vue'
import { useFuse } from '@vueuse/integrations/useFuse'

const data = [
  'John Smith',
  'John Doe',
  'Jane Doe',
  'Phillip Green',
  'Peter Brown',
]

const input = ref('Jhon D')

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
