---
category: Sensors
---

# useSpeechRecognition

Reactive [SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition).

> [Can I use?](https://caniuse.com/mdn-api_speechrecognitionevent)

## Usage

```ts
import { useSpeechRecognition } from '@vueuse/core'

const {
  isSupported,
  isListening,
  isFinal,
  result,
  start,
  stop,
} = useSpeechRecognition()
```

### Options

The following shows the default values of the options, they will be directly passed to [SpeechRecognition API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition).

```ts
import { useSpeechRecognition } from '@vueuse/core'
// ---cut---
useSpeechRecognition({
  lang: 'en-US',
  interimResults: true,
  continuous: true,
})
```

## Type Declarations

```ts
export interface UseSpeechRecognitionOptions extends ConfigurableWindow {
  /**
   * Controls whether continuous results are returned for each recognition, or only a single result.
   *
   * @default true
   */
  continuous?: boolean
  /**
   * Controls whether interim results should be returned (true) or not (false.) Interim results are results that are not yet final
   *
   * @default true
   */
  interimResults?: boolean
  /**
   * Language for SpeechRecognition
   *
   * @default 'en-US'
   */
  lang?: MaybeRefOrGetter<string>
  /**
   * A number representing the maximum returned alternatives for each result.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition/maxAlternatives
   * @default 1
   */
  maxAlternatives?: number
}
/**
 * Reactive SpeechRecognition.
 *
 * @see https://vueuse.org/useSpeechRecognition
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition SpeechRecognition
 * @param options
 */
export declare function useSpeechRecognition(
  options?: UseSpeechRecognitionOptions,
): {
  isSupported: ComputedRef<boolean>
  isListening: ShallowRef<boolean, boolean>
  isFinal: ShallowRef<boolean, boolean>
  recognition: SpeechRecognition | undefined
  result: ShallowRef<string, string>
  error: ShallowRef<
    Error | SpeechRecognitionErrorEvent | undefined,
    Error | SpeechRecognitionErrorEvent | undefined
  >
  toggle: (value?: boolean) => void
  start: () => void
  stop: () => void
}
export type UseSpeechRecognitionReturn = ReturnType<typeof useSpeechRecognition>
```
