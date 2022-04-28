<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue-demi'
import { useSliceUpload } from '@vueuse/core'

const file: Ref = ref<HTMLElement | null>()

const HOST = 'http://127.0.0.1:3001'

const uploadId = ref('')
const uploadFileFn = ref()

const onChangeFile = async() => {
  const filePart = file.value.files[0]

  const { uploadFile } = useSliceUpload(filePart, {
    chunkSize: 2 * 1024 * 1024,
    retryTimes: 2,
    initFileUpload: async() => {
      const filename = filePart.name
      const res = await fetch(`${HOST}/api/initUpload`, {
        method: 'POST',
        body: JSON.stringify({ name: filename }),
      })
      const data = await res.json()
      uploadId.value = data.uploadId
    },
    uploadPartFile: async(chunk: Blob, index: number) => {
      const formData = new FormData()
      formData.append('uploadId', uploadId.value)
      formData.append('partIndex', index.toString())
      formData.append('partFile', chunk)

      const res = await fetch(`${HOST}/api/uploadPart`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      console.log(`上传分片 ${index}完成:  ${JSON.stringify(data)}`)
    },
    finishFileUpload: async(md5: string) => {
      const fileName = filePart.name
      const res = await fetch(`${HOST}/api/finishUpload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fileName,
          uploadId: uploadId.value,
          md5,
        }),
      })
      const data = await res.json()
      console.log(`upload done, url is: ${HOST}${data.path}`)
    },
  })
  uploadFileFn.value = uploadFile
}

const onClick = () => {
  uploadFileFn.value()
}
</script>

<template>
  <input ref="file" type="file" @change="onChangeFile">
  <button @click="onClick">
    click to upload
  </button>
</template>
