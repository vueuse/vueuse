# useFavicon

> Changes the current favicon

## Basic Usage

```jsx
import { watch } from 'vue'
import { useFavicon, usePreferredDark } from '@vueuse/core'

const isDark = usePreferredDark()
const { setIcon, resetIcon } = useFavicon()

watch(isDark, (darkMode) => {
  darkMode ? setIcon('/favicon-dark.ico') : resetIcon()
})
```
