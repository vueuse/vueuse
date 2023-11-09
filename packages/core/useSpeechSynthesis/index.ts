import type { MaybeRef, MaybeRefOrGetter } from '@vueuse/shared'
import { toRef, toValue, tryOnScopeDispose } from '@vueuse/shared'
import type { Ref } from 'vue-demi'
import { computed, ref, shallowRef, watch } from 'vue-demi'
import { useSupported } from '../useSupported'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'

export type UseSpeechSynthesisStatus = 'init' | 'play' | 'pause' | 'end'

export interface UseSpeechSynthesisOptions extends ConfigurableWindow {
  /**
   * Language for SpeechSynthesis
   *
   * @default 'en-US'
   */
  lang?: MaybeRefOrGetter<string>
  /**
   * Gets and sets the pitch at which the utterance will be spoken at.
   *
   * @default 1
   */
  pitch?: MaybeRefOrGetter<SpeechSynthesisUtterance['pitch']>
  /**
   * Gets and sets the speed at which the utterance will be spoken at.
   *
   * @default 1
   */
  rate?: MaybeRefOrGetter<SpeechSynthesisUtterance['rate']>
  /**
   * Gets and sets the voice that will be used to speak the utterance.
   */
  voice?: MaybeRef<SpeechSynthesisVoice>
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
 */
export function useSpeechSynthesis(
  text: MaybeRefOrGetter<string>,
  options: UseSpeechSynthesisOptions = {},
) {
  const {
    pitch = 1,
    rate = 1,
    volume = 1,
    window = defaultWindow,
  } = options

  const synth = window && (window as any).speechSynthesis as SpeechSynthesis
  const isSupported = useSupported(() => synth)

  const isPlaying = ref(false)
  const status = ref<UseSpeechSynthesisStatus>('init')

  const spokenText = toRef(text || '')
  const lang = toRef(options.lang || 'en-US')
  const error = shallowRef(undefined) as Ref<SpeechSynthesisErrorEvent | undefined>

  const toggle = (value = !isPlaying.value) => {
    isPlaying.value = value
  }

  const bindEventsForUtterance = (utterance: SpeechSynthesisUtterance) => {
    utterance.lang = toValue(lang)
    utterance.voice = toValue(options.voice) || null
    utterance.pitch = toValue(pitch)
    utterance.rate = toValue(rate)
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

  const stop = () => {
    synth!.cancel()
    isPlaying.value = false
  }

  if (isSupported.value) {
    bindEventsForUtterance(utterance.value)

    watch(lang, (lang) => {
      if (utterance.value && !isPlaying.value)
        utterance.value.lang = lang
    })

    if (options.voice) {
      watch(options.voice, () => {
        synth!.cancel()
      })
    }

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
    utterance,
    error,

    stop,
    toggle,
    speak,
  }
}

export type UseSpeechSynthesisReturn = ReturnType<typeof useSpeechSynthesis>
