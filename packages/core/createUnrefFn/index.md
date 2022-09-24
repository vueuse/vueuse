---
category: Utilities
related: reactify
---

# createUnrefFn

Make a plain function accepting ref and raw values as arguments.
Returns the same value the unconverted function returns, with proper typing.

::: tip
Make sure you're using the right tool for the job. Using `reactify`
might be more pertinent in some cases where you want to evaluate the function on each changes of it's arguments.
:::

## Usage

```ts
import { ref } from 'vue'
import { createUnrefFn } from '@vueuse/core'

const url = ref('https://httpbin.org/post')
const data = ref({ foo: 'bar' })

const post = (url, data) => fetch(url, { data })
const unrefPost = createUnrefFn(post)

post(url, data) /* ❌ Will throw an error because the arguments are refs */
unrefPost(url, data) /* ✔️ Will Work because the arguments will be auto unref */
```
