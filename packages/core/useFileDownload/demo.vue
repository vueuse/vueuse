<script setup lang="ts">
import { useFileDownload } from '@vueuse/core'

const { download: downloadTxt } = useFileDownload({
  fileName: 'hello',
  fileType: 'txt',
  href: 'hello world',
})

const { download: downloadVue } = useFileDownload({
  href: `<template>
     <div class="box">vueuse</div>
   </template>`,
  fileName: 'hello',
  fileType: 'vue',
})
</script>

<template>
  <div>
    <button @click="downloadTxt">download txt file</button>
    <button style="margin-left: 12px" @click="downloadVue">download vue file</button>
  </div>
</template>
