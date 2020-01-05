# usePreferredColorScheme

> Querying user's prefer color scheme, by using [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) media query.

## Usage

```js
import { usePreferredColorScheme } from '@vueuse/core'

const preferredColor = usePreferredColorScheme()
```

| State   | Type           | Description                  |
| ------- | -------------- | ---------------------------- |
| matches | `Ref<string>` | `dark`, `light` or `no-preference` |
