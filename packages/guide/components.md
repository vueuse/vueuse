# Components

In v5.0, we introduced a new package, `@vueuse/components` providing renderless component versions of composable functions.

## Install

```bash
npm i @vueuse/core @vueuse/components
```

## Usage

For example of `onClickOutside`, instead of binding the component ref for functions to consume:

```vue
<script setup>
import { onClickOutside } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const el = useTemplateRef('el')

function close() {
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

```vue
<script setup>
import { OnClickOutside } from '@vueuse/components'

function close() {
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

```vue
<template>
  <UseMouse v-slot="{ x, y }">
    x: {{ x }}
    y: {{ y }}
  </UseMouse>
</template>
```

```vue
<template>
  <UseDark v-slot="{ isDark, toggleDark }">
    <button @click="toggleDark()">
      Is Dark: {{ isDark }}
    </button>
  </UseDark>
</template>
```

Refer to each function's documentation for the detailed usage of component style.
