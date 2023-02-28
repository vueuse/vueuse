---
category: Browser
---

# useObjectUrl

Reactive URL representing an object.

Creates an URL for the provided `File`, `Blob`, or `MediaSource` via [URL.createObjectURL()](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL) and automatically releases the URL via [URL.revokeObjectURL()](https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL) when the source changes or the component is unmounted.

## Usage

```html
<script setup>
import { useObjectUrl } from '@vueuse/core'
import { shallowRef } from 'vue'

const file = shallowRef()
const url = useObjectUrl(file)

const onFileChange = (event) => {
  file.value = event.target.files[0]
}
</script>

<template>
  <input type="file" @change="onFileChange" />

  <a :href="url">Open file</a>
</template>
```

## Component Usage

```html
<template>
  <UseObjectUrl v-slot="url" :object="file">
    <a :href="url">Open file</a>
  </UseObjectUrl>
</template>
```
