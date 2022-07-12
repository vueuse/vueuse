category: Browser
---

# useFileDownload

download file with ease.

## Usage

``` ts
import { useFileDownload } from '@vueuse/core'

const { download } = useFileDialog({
  herf: 'hello world',
  fileName: 'hello',
  fileType: 'txt',
  onSuccess() {
    console.log('success')
  }
})
```


``` html
<template>
  <button @click="download">download file</button>
</template>
```