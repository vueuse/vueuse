# useTimeout

> Update value after a given time. Provides handles to cancel and/or reset the timeout.

## Usage

```jsx {3}
const Demo = defineComponent({
  setup() {
    const { ready, start } = useTimeout(1000)

    return {
      ready,
      start,
    }
  },

  render(this) {
    const { ready, start } = this

    return (
      <div id="demo">
        <p>Ready: {ready.toString()}</p>
        <button onClick={() => start()} disabled={!ready}>Start Again</button>
      </div>
    )
  },
})
```
