---
category: Sensors
---

# useSticky

Make elements remain at the any position you want.

## Usage

```html
<script setup lang="ts">
import { ref } from 'vue-demi'
import { UseSticky as USticky } from './component'
import { useSticky } from '.'

const el = ref<HTMLElement | null>(null)

const { isFixed } = useSticky(el, { offsetTop: 100 })

</script>

<template>
  <div ref="el">
    Sticky State : {{ isFixed }}
  </div>
</template>
```

## Component

```html
<use-sticky
    v-slot="{isFixed}"
    :offset-top="50"
    :z-index="99"
>
  <div>
    Sticky State : {{ isFixed }}
  </div>
</use-sticky>
```

