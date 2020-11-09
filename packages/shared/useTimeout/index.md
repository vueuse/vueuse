# useTimeout

> Update value after a given time. Provides handles to cancel and/or reset the timeout.

## Usage

```html
<template>
  <div id="demo">
    <p>Ready: {{ ready }}</p>
    <button @click="start" :disabled="!ready">Start Again</button>
  </div>
</template>

<script>
export default {
  setup() {
    const { ready, start } = useTimeout(1000)

    return {
      ready,
      start,
    }
  }
}
</script>
```
