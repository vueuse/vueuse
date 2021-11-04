<template>
  <div class="list">
    <div class="input">
      <div>text input:</div>
      <input v-model="text" type="text" />
    </div>
    <div class="output">
      <div>output:</div>
      <textarea col="40" rows="10" :value="textBase64" readonly></textarea>
    </div>
  </div>
  <div class="list">
    <div class="input">
      <div>buffer input:</div>new ArrayBuffer(1024)
    </div>
    <div class="output">
      <div>output:</div>
      <textarea col="40" rows="10" :value="bufferBase64" readonly></textarea>
    </div>
  </div>
  <div class="list">
    <div class="input">
      <div>file input:</div>
      <input type="file" @input="onFileInput" />
    </div>
    <div class="output">
      <div>output:</div>
      <textarea col="40" rows="10" :value="fileBase64" readonly></textarea>
    </div>
  </div>
  <div class="list">
    <div class="input">
      <div>canvas input:</div>
      <canvas ref="canvas" width="200" height="300"></canvas>
      <img
        v-show="false"
        ref="canvasImg"
        crossorigin="anonymous"
        src="https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
      />
      <button @click="draw">
        draw
      </button>
    </div>
    <div class="output">
      <div>output:</div>
      <textarea col="40" rows="25" :value="canvasBase64" readonly></textarea>
    </div>
  </div>
  <div class="list">
    <div class="input">
      <div>img element input:</div>
      <img
        ref="image"
        width="200"
        height="125"
        src="https://images.unsplash.com/photo-1494256997604-768d1f608cac?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
      />
    </div>
    <div class="output">
      <div>output:</div>
      <textarea col="40" rows="10" :value="imageBase64" readonly></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import { useBase64 } from '@vueuse/core'

const text = ref('')
const file = ref() as Ref<File>
const canvas = ref() as Ref<HTMLCanvasElement>
const canvasImg = ref() as Ref<HTMLImageElement>
const image = ref() as Ref<HTMLImageElement>

const { base64: textBase64 } = useBase64(text)
const { base64: fileBase64 } = useBase64(file)
const { base64: canvasBase64, execute, promise: canvasPromise } = useBase64(canvas)
const { base64: imageBase64 } = useBase64(image)
const { base64: bufferBase64 } = useBase64(new ArrayBuffer(8))

async function draw() {
  const $canvas = canvas.value
  const ctx = $canvas.getContext('2d')!
  await imgLoaded(canvasImg.value)
  ctx.drawImage(canvasImg.value, 0, 0, canvas.value.width, canvas.value.height)
  execute()
  try {
    await canvasPromise.value
    console.log(canvasBase64.value)
  }
  catch (err) { console.error(err) }
}

function onFileInput(e: Event) {
  file.value = (e.target as HTMLInputElement).files![0]
}

function imgLoaded(img: HTMLImageElement) {
  return new Promise<void>((resolve, reject) => {
    if (!img.complete) {
      img.onload = () => {
        resolve()
      }
      img.onerror = reject
    }
    else {
      resolve()
    }
  })
}
</script>

<style scoped>
.list {
  display: flex;
}

.input {
  width: 400px;
  padding: 20px;
}

textarea {
  width: 300px;
}
</style>
