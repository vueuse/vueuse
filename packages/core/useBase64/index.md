---
category: Utilities
---

# useBase64

Reactive base64 transforming. Supports plain text, buffer, files, canvas, objects, maps, sets and images.

## Usage

```ts
import { useBase64 } from '@vueuse/core'
import { shallowRef } from 'vue'

const text = shallowRef('')

const { base64, promise, execute } = useBase64(text)
```

### Supported Input Types

- `string` - Plain text
- `Blob` - File or blob data
- `ArrayBuffer` - Binary data
- `HTMLCanvasElement` - Canvas element
- `HTMLImageElement` - Image element
- `Object` / `Array` / `Map` / `Set` - Serialized to JSON

### Return Values

| Property  | Description                               |
| --------- | ----------------------------------------- |
| `base64`  | The resulting base64 string               |
| `promise` | The promise of the current transformation |
| `execute` | Manually trigger the transformation       |

### Data URL Format

By default, the output is in Data URL format (e.g., `data:text/plain;base64,...`). Set `dataUrl: false` to get raw base64.

```ts
const { base64 } = useBase64(text, { dataUrl: false })
// Returns raw base64 without the data URL prefix
```

### Canvas and Image Options

When transforming canvas or image elements, you can specify the MIME type and quality.

```ts
const canvas = document.querySelector('canvas')

const { base64 } = useBase64(canvas, {
  type: 'image/jpeg', // MIME type
  quality: 0.8, // Image quality (0-1, for jpeg/webp)
})
```

### Custom Serializer

For objects, arrays, maps and sets, you can provide a custom serializer. Otherwise, the data will be serialized using `JSON.stringify` (maps are converted to objects, sets to arrays).

```ts
const data = shallowRef({ foo: 'bar' })

const { base64 } = useBase64(data, {
  serializer: v => JSON.stringify(v, null, 2),
})
```
