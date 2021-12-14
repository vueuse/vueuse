---
category: Browser
---

# useTemplateTitle

Reactive document title with template reference.

## Usage

If the template string contains substring '%s', that value will be the target for the replacement:

```js
import { useTemplateTitle } from '@vueuse/core'

const title = useTemplateTitle(null, '%s | My Awesome Website')

title.value = 'Hello, World!' // Change current title

console.log(title.value) // 'Hello, World! | My Awesome Website'

```

Set initial title immediately

```js
const title = useTemplateTitle('New Title', '%s | My Awesome Website')
```

Pass a `ref` and the title will be updated when the source ref changes

```js
import { useTemplateTitle } from '@vueuse/core'

const messages = ref(0)

const title = computed(() => {
  return !messages.value ? 'No message' : `${messages.value} new messages`
})

useTemplateTitle(title, '%s | My Awesome Website') // document title will match with the ref "title"
```