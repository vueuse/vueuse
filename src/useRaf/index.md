# useRaf

Reactive time elapsed on each `requestAnimationFrame`.

## Usage

```jsx
const Demo = createComponent({
  setup () {
    const elapsed = useRaf()

    return {
      elapsed,
    }
  },

  render (this) {
    const { elapsed } = this

    return (
      <div id='demo'>
        <p>Elapsed: {elapsed}</p>
      </div>
    )
  },
})
```


## Reference

```ts
useRaf(ms?: number, delay?: number): Ref<number>;
```

- `ms` &mdash; milliseconds for how long to keep re-rendering component, defaults to `1e12`.
- `delay` &mdash; delay in milliseconds after which to start re-rendering component, defaults to `0`.
