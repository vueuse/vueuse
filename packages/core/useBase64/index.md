---
category: Utilities
---

# useBase64

transform to base64 string

## Usage

```ts
import { ref, Ref } from 'vue'
import { useBase64, imgLoaded } from '.'

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
```
template:

```html
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
    <canvas ref="canvas" width="100" height="100"></canvas>
    <img
      v-show="false"
      ref="canvasImg"
      crossorigin="anonymous"
      src="https://dogefs.s3.ladydaily.com/~/source/unsplash/photo-1630905894205-9af77a5eaa16?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=774&q=80"
    />
    <button @click="draw">draw</button>
  </div>
  <div class="output">
    <div>output:</div>
    <textarea col="40" rows="10" :value="canvasBase64" readonly></textarea>
  </div>
</div>
<div class="list">
  <div class="input">
    <div>img element input:</div>
    <img
      ref="image"
      width="100"
      height="100"
      src="https://dogefs.s3.ladydaily.com/~/source/unsplash/photo-1634883796923-8d21ba6d4228?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=776&q=80"
    />
  </div>
  <div class="output">
    <div>output:</div>
    <textarea col="40" rows="10" :value="imageBase64" readonly></textarea>
  </div>
</div>
```