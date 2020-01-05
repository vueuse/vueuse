# usePreferredDark

> Querying user's prefer color scheme, by using [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) media query.

## Usage

```js
import { usePreferredDark } from '@vueuse/core'

const isDark = usePreferredDark()
```

| State   | Type           | Description                  |
| ------- | -------------- | ---------------------------- |
| return | `Ref<boolean>` | If user prefers dark theme or not |
