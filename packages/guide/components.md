# Components

In v5.0, we introduced a new package `@vueuse/components` providing renderless component style usage of composable functions.

For example of `onClickOutside`, instead of

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

You can now use it in the component way:

```html
<script setup>
import { OnClickOutside } from '@vueuse/components'
</script>

<template>
  <OnClickOutside @trigger="close">
    <div>
      Click Outside of Me
    </div>
  </OnClickOutside>
</template>
```

Similarly, you can also access return values with `v-slot`:

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

## Install

```bash
$ npm i @vueuse/core @vueuse/components
```

Refer to each function's documentation for the detailed usage of component style.
