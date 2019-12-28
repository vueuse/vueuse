# usePrefersDark

> Querying user's prefer color scheme, by using [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) media query.

## State

```js
import { usePrefersDark } from '@vueuse/core'

const isDark = usePrefersDark()
```

| State   | Type           | Description                  |
| ------- | -------------- | ---------------------------- |
| matches | `Ref<boolean>` | If user prefers dark theme or not |
