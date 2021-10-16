---
category: '@Integrations'
---

# useFuse

Reactive wrapper for [Fuse.js](https://github.com/krisk/fuse).

## Install

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
