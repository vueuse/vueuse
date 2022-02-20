---
category: Browser
---

# useContainerQuery

A composable implementation of CSS container queries. CSS container queries are tantalisingly powerful in what they will achieve.
However, the specification is at an early stage specification and has not yet been adopted or implemented in any mainstream browser,
although they can be experimented with by utilising experiment flags in Chrome Canary.

This composable implements them in JS.

## Usage

```ts
import { defineComponent, ref } from 'vue'
import { useContainerQuery } from '@vueuse/core'

// setup a ref to an element on your template:
const someTemplateRef = ref(null)

const {
  activeBreakpoint,
  width,
} = useContainerQuery({ el: someTemplateRef })
```

As well as the default sm-xl standard breakpoints, you can specify your own custom breakpoints by passing them via options:

```ts
import { defineComponent, ref } from 'vue'
import { useContainerQuery } from '@vueuse/core'

// setup a ref to an element on your template:
const someTemplateRef = ref(null)

const breakpoints = {
  sm: {
    min: 320,
    max: 480,
  },
  md: {
    min: 481,
    max: 768,
  },
  lg: {
    min: 769,
    max: 1024,
  },
  xl: {
    min: 1025,
    max: 1200,
  },
  xxl: {
    min: 1201,
    max: 1440
  },
  xxxl: {
    min: 1440
  }
}

const {
  activeBreakpoint,
  width
} = useContainerQuery({ el: someTemplateRef })
```
