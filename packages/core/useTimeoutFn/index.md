# useTimeoutFn

> Call function after a given time. 

```jsx {6-9}
const Demo = defineComponent({
  setup() {
    const defaultText = 'Please wait 3 seconds'
    const text = ref(defaultText)

    const { ready, start } = useTimeoutFn(() => {
      text.value = 'Fired!'
    }, 3000)

    const restart = () => {
      text.value = defaultText
      start()
    }

    return {
      ready,
      restart,
      text,
    }
  },

  render(this: Vue & Inject) {
    const { ready, restart, text } = this

    return (
      <div id="demo">
        <p>{text}</p>
        <br></br>
        <button onClick={() => restart()} disabled={!ready}>Start Again</button>
      </div>
    )
  },
})
```
