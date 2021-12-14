---
category: Utilities
---

# useCountDown

CountDown controller

## Usage

```ts
const { formatted, start, pause, reset } = useCountDown(24 * 60 * 60 * 1000, {
  millisecond: true,
  format: 'HH:mm:ss:SSS',
  onFinish: () => {
    console.log('finish')
  },
  onChange: (time) => {
    console.log(time)
  },
})
```
