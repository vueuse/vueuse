import { tryOnScopeDispose, MaybeRef } from '@vueuse/shared'
import { Ref, ref, watch, shallowRef, unref, computed } from 'vue-demi'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

export type Status = 'init' | 'play' | 'pause' | 'end'

export type VoiceInfo = Pick<SpeechSynthesisVoice, 'lang' | 'name'>

export interface SpeechSynthesisOptions extends ConfigurableWindow {
  /**
   * Language for SpeechSynthesis
   *
   * @default 'en-US'
   */
  lang?: MaybeRef<string>
  /**
   * Gets and sets the pitch at which the utterance will be spoken at.
   *
   * @default 1
   */
  pitch?: SpeechSynthesisUtterance['pitch']
  /**
   * Gets and sets the speed at which the utterance will be spoken at.
   *
   * @default 1
   */
  rate?: SpeechSynthesisUtterance['rate']
  /**
   * Gets and sets the voice that will be used to speak the utterance.
   */
  voice?: SpeechSynthesisVoice
  /**
   * Gets and sets the volume that the utterance will be spoken at.
   *
   * @default 1
   */
  volume?: SpeechSynthesisUtterance['volume']
}

/**
 * Reactive SpeechSynthesis.
 *
 * @see https://vueuse.org/useSpeechSynthesis
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis SpeechSynthesis
 * @param options
 */
export function useSpeechSynthesis(text: MaybeRef<string>, options: SpeechSynthesisOptions = {}) {
  const {
    pitch = 1,
    rate = 1,
    volume = 1,
    window = defaultWindow,
  } = options

  const synth = window && (window as any).speechSynthesis as SpeechSynthesis
  const isSupported = Boolean(synth)

  const isPlaying = ref(false)
  const status = ref<Status>('init')

  const voiceInfo = {
    lang: options.voice?.lang || 'default',
    name: options.voice?.name || '',
  }

  const spokenText = ref(text || '')
  const lang = ref(options.lang || 'en-US')
  const error = shallowRef(undefined) as Ref<SpeechSynthesisErrorEvent | undefined>

  const toggle = (value = !isPlaying.value) => {
    isPlaying.value = value
  }

  const bindEventsForUtterance = (utterance: SpeechSynthesisUtterance) => {
    utterance.lang = unref(lang)

    options.voice && (utterance.voice = options.voice)
    utterance.pitch = pitch
    utterance.rate = rate
    utterance.volume = volume

    utterance.onstart = () => {
      isPlaying.value = true
      status.value = 'play'
    }

    utterance.onpause = () => {
      isPlaying.value = false
      status.value = 'pause'
    }

    utterance.onresume = () => {
      isPlaying.value = true
      status.value = 'play'
    }

    utterance.onend = () => {
      isPlaying.value = false
      status.value = 'end'
    }

    utterance.onerror = (event) => {
      error.value = event
    }

    utterance.onend = () => {
      isPlaying.value = false
      utterance.lang = unref(lang)
    }
  }

  const utterance = computed(() => {
    isPlaying.value = false
    status.value = 'init'
    const newUtterance = new SpeechSynthesisUtterance(spokenText.value)
    bindEventsForUtterance(newUtterance)
    return newUtterance
  })

  const speak = () => {
    synth!.cancel()
    utterance && synth!.speak(utterance.value)
  }

  if (isSupported) {
    bindEventsForUtterance(utterance.value)

    watch(lang, (lang) => {
      if (utterance.value && !isPlaying.value)
        utterance.value.lang = lang
    })

    watch(isPlaying, () => {
      if (isPlaying.value)
        synth!.resume()
      else
        synth!.pause()
    })
  }

  tryOnScopeDispose(() => {
    isPlaying.value = false
  })

  return {
    isSupported,
    isPlaying,
    status,
    voiceInfo,
    utterance,
    error,

    toggle,
    speak,
  }
}

export type UseSpeechSynthesisReturn = ReturnType<typeof useSpeechSynthesis>
