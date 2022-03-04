---
category: '@Integrations'
---

# useTitleCase

wrapper for [`useTitleCase`](github.com/blakeembrey/change-case)

## Install 

```bash
npm i title-case
```

## Usage

```ts
import { useTitleCase } from '@vueuse/integrations/useTitleCase'

// `titleCase` will be a computed
const titleCase = useTitleCase('hello world')
```

or passing a `ref` to it, the returned `computed` will change along with the source ref's changes.


```ts
import { ref } from 'vue-demi'
import { useTitleCase } from '@vueuse/integrations/useTitleCase'

const input = ref('hello world')
const titleCase = useTitleCase(input)
```

```html
<input v-model="input" type="text">
<p>{{ titleCase }}</p>
```
