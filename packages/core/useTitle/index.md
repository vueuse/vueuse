---
category: Browser
---

# useTitle

Reactive document title.

## Usage

```js
import { useTitle } from '@vueuse/core'

const title = useTitle()
console.log(title.value) // print current title
title.value = 'Hello' // change current title
```

Set initial title immediately

```js
const title = useTitle('New Title')
```

Pass a `ref` and the title will be updated when the source ref changes

```js
import { useTitle } from '@vueuse/core'

const messages = ref(0)

const title = computed(() => {
  return !messages.value ? 'No message' : `${messages.value} new messages`
})

useTitle(title) // document title will match with the ref "title"
```
