// ported from https://www.reddit.com/r/vuejs/comments/jksizl/speech_recognition_as_a_vue_3_hook
// by https://github.com/wobsoriano

import type { MaybeRefOrGetter } from 'vue'
import type { ConfigurableWindow } from '../_configurable'
import type { SpeechRecognition, SpeechRecognitionErrorEvent } from './types'
import { toRef, tryOnScopeDispose } from '@vueuse/shared'
import { shallowRef, toValue, watch } from 'vue'
import { defaultWindow } from '../_configurable'
import { useSupported } from '../useSupported'

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
export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}) {
  const {
    interimResults = true,
    continuous = true,
    maxAlternatives = 1,
    window = defaultWindow,
  } = options

  const lang = toRef(options.lang || 'en-US')
  const isListening = shallowRef(false)
  const isFinal = shallowRef(false)
  const result = shallowRef('')
  const error = shallowRef<SpeechRecognitionErrorEvent | undefined>(undefined)

  let recognition: SpeechRecognition | undefined

  const start = () => {
    isListening.value = true
  }

  const stop = () => {
    isListening.value = false
  }

  const toggle = (value = !isListening.value) => {
    if (value) {
      start()
    }
    else {
      stop()
    }
  }

  const SpeechRecognition = window && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
  const isSupported = useSupported(() => SpeechRecognition)

  if (isSupported.value) {
    recognition = new SpeechRecognition() as SpeechRecognition

    recognition.continuous = continuous
    recognition.interimResults = interimResults
    recognition.lang = toValue(lang)
    recognition.maxAlternatives = maxAlternatives

    recognition.onstart = () => {
      isListening.value = true
      isFinal.value = false
    }

    watch(lang, (lang) => {
      if (recognition && !isListening.value)
        recognition.lang = lang
    })

    recognition.onresult = (event) => {
      const currentResult = event.results[event.resultIndex]
      const { transcript } = currentResult[0]

      isFinal.value = currentResult.isFinal
      result.value = transcript
      error.value = undefined
    }

    recognition.onerror = (event) => {
      error.value = event
    }

    recognition.onend = () => {
      isListening.value = false
      recognition!.lang = toValue(lang)
    }

    watch(isListening, (newValue, oldValue) => {
      if (newValue === oldValue)
        return

      if (newValue)
        recognition!.start()
      else
        recognition!.stop()
    })
  }

  tryOnScopeDispose(() => {
    stop()
  })

  return {
    isSupported,
    isListening,
    isFinal,
    recognition,
    result,
    error,

    toggle,
    start,
    stop,
  }
}

export type UseSpeechRecognitionReturn = ReturnType<typeof useSpeechRecognition>
