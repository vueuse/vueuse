---
category: Browser
---

# useBreakpoints

Reactive viewport breakpoints

## Usage

### Basic API 

```js
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints(breakpointsTailwind)

const smAndLarger = breakpoints.greaterOrEqual('sm') // sm and larger
const largerThanSm = breakpoints.greater('sm') // only larger than sm
const lgAndSmaller = breakpoints.smallerOrEqual('lg') // lg and smaller
const smallerThanLg = breakpoints.smaller('lg') // only smaller than lg
```

```js
import { useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints({
  tablet: 640,
  laptop: 1024,
  desktop: 1280,
})

const laptop = breakpoints.between('laptop', 'desktop')
```

### Usage Restrictions

The functions that are returned on the breakpoints object are also composables and are required to be called in a component setup context.

#### Correct Usage

```html
<script setup>
import { useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints(breakpointsTailwind)
const smallerThanLarge = breakpoints.smaller('lg')
const greaterThanSmall = breakpoints.greater('sm')

const location = computed(() => greaterThanSmall.value ? 'top' : 'bottom')
</script>

<template>
  <example-component v-if="smallerThanLarge" />
  <another-component :location="location" />
</template>
```

#### Incorrect Usage

```html

<script setup>
import {useBreakpoints} from '@vueuse/core'

const breakpoints = useBreakpoints(breakpointsTailwind);
const location = computed(() => breakpoints.greater('sm').value ? 'top' : 'bottom');
</script>

<template>
  <example-component v-if="breakpoints.smaller('lg')" />
  <another-component :location="location" />
</template>

```


