// ported from https://www.reddit.com/r/vuejs/comments/jksizl/speech_recognition_as_a_vue_3_hook
// by https://github.com/wobsoriano

import { tryOnUnmounted } from '@vueuse/shared'
import { ref, watch } from 'vue-demi'

export interface SpeechRecognitionOptions {
  continuous?: boolean
  interimResults?: boolean
  lang?: string
}

export function useSpeechRecognition({
  lang = 'en-US',
  interimResults = true,
  continuous = true,
}: SpeechRecognitionOptions = {}) {
  const isListening = ref(false)
  const result = ref('')
  const error = ref(null)

  const toggle = (value = !isListening.value) => {
    isListening.value = value
  }

  const start = () => {
    isListening.value = true
  }

  const stop = () => {
    isListening.value = false
  }

  const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
  const isSupported = Boolean(SpeechRecognition)

  let recognition: SpeechRecognition | undefined

  if (isSupported) {
    const recognition = new SpeechRecognition()

    recognition.continuous = continuous
    recognition.interimResults = interimResults
    recognition.lang = lang

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')

      result.value = transcript
      error.value = null
    }

    recognition.onerror = (event) => {
      error.value = event.error
    }

    recognition.onend = () => {
      isListening.value = false
    }

    watch(isListening, () => {
      if (isListening.value)
        recognition.start()
      else
        recognition.stop()
    })
  }

  tryOnUnmounted(() => {
    isListening.value = false
  })

  return {
    isSupported,
    isListening,
    recognition,
    result,
    error,
    toggle,
    start,
    stop,
  }
}
