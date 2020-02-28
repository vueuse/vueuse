# usePreferredDark

> Reactive dark theme preference.

## Usage

```js
import { usePreferredDark } from '@vueuse/core'

const isDark = usePreferredDark()
```

| State   | Type           | Description                  |
| ------- | -------------- | ---------------------------- |
| return | `Ref<boolean>` | If user prefers dark theme or not |
