---
category: '@Integrations'
---

# useKatex

Reactive wrapper for [`katex`](https://github.com/KaTeX/KaTeX)

> To properly render katex equations, the katex stylesheet must be included in the page.

## Install 

```bash
npm i katex
```

## Usage

```html
<script setup>
import { katex } from '@vueuse/integrations/useKatex'
import 'katex/dist/katex.min.css'

const formula = ref('a^2 + b^2 = c^2')
const rendered = useKatex(formula)
</script>

<template>
  <div v-html="rendered"></div>
</template>
```
