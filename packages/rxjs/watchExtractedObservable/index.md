---
category: '@RxJS'
---

# watchExtractedObservable

Watch the values of an RxJS [`Observable`](https://rxjs.dev/guide/observable) as extracted from one or more composables.

Automatically unsubscribe on observable change, and automatically unsubscribe from it when the component is unmounted.

Supports all overloads of [`watch`](https://vuejs.org/guide/essentials/watchers.html#basic-example).

## Usage

<!-- TODO: import rxjs error if enable twoslash -->

```ts no-twoslash
import { watchExtractedObservable } from '@vueuse/rxjs'
import { computed, reactive, useTemplateRef } from 'vue'
import { AudioPlayer } from '../my/libs/AudioPlayer'

// setup()

const audio = useTemplateRef('audio')
const player = computed(() => (audio.value ? new AudioPlayer(audio.value) : null))
const state = reactive({
  progress: 0,
})

watchExtractedObservable(player, p => p.progress$, (percentage) => {
  state.progress = percentage * 100
})
```

If you want to add custom error handling to an `Observable` that might error, you can supply an optional `onError` configuration. Without this, RxJS will treat any error in the supplied `Observable` as an "unhandled error" and it will be thrown in a new call stack and reported to `window.onerror` (or `process.on('error')` if you happen to be in Node).

You can also supply an optional `onComplete` configuration if you need to attach special behavior when the watched observable completes.

```ts no-twoslash
import { watchExtractedObservable } from '@vueuse/rxjs'
import { computed, reactive, useTemplateRef } from 'vue'
import { AudioPlayer } from '../my/libs/AudioPlayer'

// setup()

const audio = useTemplateRef('audio')
const player = computed(() => (audio.value ? new AudioPlayer(audio.value) : null))
const state = reactive({
  progress: 0,
})

watchExtractedObservable(player, p => p.progress$, (percentage) => {
  state.progress = percentage * 100
}, {
  onError: (err: unknown) => {
    console.error(err)
  },
  onComplete: () => {
    state.progress = 100 // or 0, or whatever
  },
})
```

If you want, you can also pass `watch` options as the last argument:

```ts no-twoslash
import { watchExtractedObservable } from '@vueuse/rxjs'
import { computed, reactive, useTemplateRef } from 'vue'
import { AudioPlayer } from '../my/libs/AudioPlayer'

// setup()

const audio = useTemplateRef('audio')
const player = computed(() => (audio.value ? new AudioPlayer(audio.value) : null))
const state = reactive({
  progress: 0,
})

watchExtractedObservable(player, p => p.progress$, (percentage) => {
  state.progress = percentage * 100
}, {
  onError: (err: unknown) => {
    console.error(err)
  }
}, {
  immediate: true
})
```
