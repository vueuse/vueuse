---
category: Sensors
---

# useSpeechRecognition

Reactive [SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition).

> [Can I use?](https://caniuse.com/mdn-api_speechrecognition)

## Usage

```ts
import { useSpeechRecognition } from '@vueuse/core'

const {
  isSupported,
  isListening,
  isFinal,
  result,
  start,
  stop
} = useSpeechRecognition()
```

### Options

The following shows the default values of the options, they will be directly passed to [SpeechRecognition API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition).

```ts
{
  lang: 'en-US',
  interimResults: true,
  continuous: true,
}
```

You can also bind the lang property to a ref object. Note that updating this ref value cannot take effect until the next time the recognition is stopped.

```ts
const lang = ref('en-US') // start language as English

const {
  isSupported,
  isListening,
  isFinal,
  result,
  start,
  stop
} = useSpeechRecognition({
  lang
})

start() // start listening in English

lang.value = 'es' // change language to Spanish

stop()
start() // start listening in Spanish
```
