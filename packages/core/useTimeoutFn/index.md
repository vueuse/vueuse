# useTimeoutFn

> Call function after a given time. 

```html
<template>
  <div>
    <p>{{text}}</p>
    <br></br>
    <button @click="restart" :disabled="!ready">Start Again</button>
  </div>
</template>

<script>
export default {
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
  }
}
</script>
```
