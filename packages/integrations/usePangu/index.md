---
category: '@Integrations'
---

# usePangu

wrapper for [`pangu`](https://github.com/vinta/pangu.js)

## Install 

```bash
npm i pangu
```

## Usage

```ts
import { usePangu } from '@vueuse/integrations/usePangu'

// `pangu` will be a computed
const pangu = usePangu('当你凝视bug时，bug也在凝视你') // pangu.value = '当你凝视 bug 时，bug 也在凝视你'
```

or passing a `ref` to it, the returned `computed` will change along with the source ref's changes.

```ts
import { ref } from 'vue'
import { usePangu } from '@vueuse/integrations/usePangu'

const text = ref('当你凝视bug时，bug也在凝视你')
const pangu = usePangu(text) // pangu.value = '当你凝视 bug 时，bug 也在凝视你'
```
