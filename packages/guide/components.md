# Components

In v5.0, we introduced a new package, `@vueuse/components` providing renderless component versions of composable functions.

## Install

```bash
$ npm i @vueuse/core @vueuse/components
```

## Usage

For example of `onClickOutside`, instead of binding the component ref for functions to consume:

```html
<script setup>
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

const el = ref()

function close () {
  /* ... */
}

onClickOutside(el, close)
</script>

<template>
  <div ref="el">
    Click Outside of Me
  </div>
</template>
```

We can now use the renderless component which the binding is done automatically:

```html
<script setup>
import { OnClickOutside } from '@vueuse/components'

function close () {
  /* ... */
}
</script>

<template>
  <OnClickOutside @trigger="close">
    <div>
      Click Outside of Me
    </div>
  </OnClickOutside>
</template>
```

## Return Value

You can access return values with `v-slot`:

```html
<UseMouse v-slot="{ x, y }">
  x: {{ x }}
  y: {{ y }}
</UseMouse>
```

```html
<UseDark v-slot="{ isDark, toggleDark }">
  <button @click="toggleDark()">
    Is Dark: {{ isDark }}
  </button>
</UseDark>
```

Refer to each function's documentation for the detailed usage of component style.
