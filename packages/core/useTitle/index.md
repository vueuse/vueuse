---
category: Browser
---

# useTitle

Reactive document title.

::: tip
When using with Nuxt 3, this functions will **NOT** be auto imported in favor of Nuxt's built-in `useTitle()`.
Use explicit import if you want to use the function from VueUse.
:::

## Usage

```js
import { useTitle } from '@vueuse/core'

const title = useTitle()
console.log(title.value) // print current title
title.value = 'Hello' // change current title
```

Set initial title immediately:

```js
const title = useTitle('New Title')
```

Pass a `ref` and the title will be updated when the source ref changes:

```js
import { useTitle } from '@vueuse/core'

const messages = ref(0)

const title = computed(() => {
  return !messages.value ? 'No message' : `${messages.value} new messages`
})

useTitle(title) // document title will match with the ref "title"
```

Pass an optional template tag [Vue Meta Title Template](https://vue-meta.nuxtjs.org/guide/metainfo.html) to update the title to be injected into this template:

```js
const title = useTitle('New Title', { titleTemplate: '%s | My Awesome Website' })
```

::: warning
When setting `observe` to `true`, the `titleTemplate` must return the exact same value as the input title.
Otherwise, the document title will not be updated.
:::

```js
// this will work
const title = useTitle('New Title', { observe: true, titleTemplate: '%s' }) // default value
// this will work
const title = useTitle('New Title', { observe: true, titleTemplate: title => title })

// this won't work
const title = useTitle('New Title', { observe: true, titleTemplate: '%s - %s' })
// this won't work
const title = useTitle('New Title', { observe: true, titleTemplate: title => `${title} - modified` })
```
