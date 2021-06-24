# Get Started

VueUse is a collection of utility functions based on [Composition API](https://v3.vuejs.org/guide/composition-api-introduction.html). We assume you are already familiar with the basic ideas of [Composition API](https://v3.vuejs.org/guide/composition-api-introduction.html) before you continue.

## Installation

> 🎩 From v4.0, it works for Vue 2 & 3 **within a single package** by the power of [Vue Demi](https://github.com/antfu/vue-demi)!

### NPM

```bash
npm i @vueuse/core # yarn add @vueuse/core
```

Vue 3 Demo: [Vite](https://github.com/antfu/vite-vueuse-starter), [Webpack](https://github.com/vueuse/vueuse-next-example) / Vue 2 Demo: [Vue CLI](https://github.com/vueuse/vueuse-vue2-example)

### CDN

```html
<script src="https://unpkg.com/@vueuse/shared"></script>
<script src="https://unpkg.com/@vueuse/core"></script>
```

It will be exposed to global as `window.VueUse`


## Usage Example

Simply importing the functions you need from `@vueuse/core`

```ts
import { useMouse, usePreferredDark, useLocalStorage } from '@vueuse/core'

export default {
  setup() {
    // tracks mouse position
    const { x, y } = useMouse()

    // is user prefers dark theme
    const isDark = usePreferredDark()

    // persist state in localStorage
    const store = useLocalStorage(
      'my-storage', 
      {
        name: 'Apple',
        color: 'red',
      },
    )

    return { x, y, isDark, store }
  }
}
```

Refer to [functions list](/functions) for more details.
