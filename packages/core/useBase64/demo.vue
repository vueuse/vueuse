<template>
  <div class="item">
    <div class="title">
      <div>Text Input</div>
      <div>Base64</div>
    </div>
    <div class="input-output">
      <textarea v-model="text" type="text" placeholder="Type something..." />
      <textarea col="50" rows="5" :value="textBase64" readonly />
    </div>
  </div>
  <div class="item">
    <div class="title">
      <div>Buffer Input</div>
      <div>Base64</div>
    </div>
    <div class="input-output">
      <pre>new ArrayBuffer(1024)</pre>
      <textarea col="50" rows="5" :value="bufferBase64" readonly />
    </div>
  </div>
  <div class="item">
    <div class="title">
      <div>File Input</div>
      <div>Base64</div>
    </div>
    <div class="input-output">
      <div class="py-5">
        <input type="file" @input="onFileInput">
      </div>
      <textarea col="50" rows="5" :value="fileBase64" readonly />
    </div>
  </div>
  <div class="item">
    <div class="title">
      <div>Image Input</div>
      <div>Base64</div>
    </div>
    <div class="input-output">
      <img
        ref="image"
        width="200"
        height="125"
        class="rounded mt-2"
        src="https://images.unsplash.com/photo-1494256997604-768d1f608cac?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
      >
      <textarea col="50" rows="5" :value="imageBase64" readonly />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { ref } from 'vue'
import { useBase64 } from '@vueuse/core'

const text = ref('')
const file = ref() as Ref<File>
const image = ref() as Ref<HTMLImageElement>

const { base64: textBase64 } = useBase64(text)
const { base64: fileBase64 } = useBase64(file)
const { base64: imageBase64 } = useBase64(image)
const { base64: bufferBase64 } = useBase64(new ArrayBuffer(8))

function onFileInput(e: Event) {
  file.value = (e.target as HTMLInputElement).files![0]
}
</script>

<style scoped>
.title {
  margin-top: 10px;
  opacity: 0.8;
}

.input-output, .title {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.input-output textarea {
  resize: none;
}
</style>
