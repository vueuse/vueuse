---
category: Utilities
---

# useBase64

Reactive async state. Will not block your setup function and will trigger changes once the promise is ready.

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
const { base64: canvasBase64, execute: executeCanvasBase64 } = useBase64(canvas)
const { base64: imageBase64 } = useBase64(image)

async function draw() {
  const $canvas = canvas.value
  const ctx = $canvas.getContext('2d')!
  await imgLoaded(canvasImg.value)
  ctx.drawImage(canvasImg.value, 0, 0, canvas.value.width, canvas.value.height)
  executeCanvasBase64()
}

function onFileInput(e: Event) {
  file.value = (e.target as HTMLInputElement).files![0]
}
```
