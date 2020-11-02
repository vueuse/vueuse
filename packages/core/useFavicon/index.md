# useFavicon

> Reactive favicon

## Usage

```jsx
import { useFavicon } from '@vueuse/core'

const icon = useFavicon()

icon.value = 'dark.ico' // change current icon
```

or passing a `ref` to it

```jsx
import { computed } from 'vue'
import { useFavicon, usePreferredDark } from '@vueuse/core'

const isDark = usePreferredDark()
const favicon = computed(() => isDark.value ? 'dark.ico' : 'light.ico')

useFavicon(favicon)

// const icon = useFavicon(favicon)
// `icon` will be same as `favicon`
```
