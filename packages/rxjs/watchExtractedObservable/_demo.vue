<script setup lang="ts">
import type { Observable } from 'rxjs'
import { fromEvent } from 'rxjs'
import { map, skip, tap } from 'rxjs/operators'
import { computed, reactive, ref } from 'vue-demi'
import { watchExtractedObservable } from './index'

class AudioPlayer {
  public readonly reachEnd$: Observable<unknown>

  /**
   * Player progress as a number within [0;1]
   */
  public readonly progress$: Observable<number>

  constructor(
    public readonly audio: HTMLAudioElement,
  ) {
    let _magic = false
    this.reachEnd$ = fromEvent(this.audio, 'ended')
      .pipe(
        tap(() => {
          _magic = !_magic
        }),
        map(() => _magic),
      )

    this.progress$ = fromEvent(this.audio, 'timeupdate')
      .pipe(
        skip(1),
        map(() => this.audio.currentTime / this.audio.duration),
      )
  }

  async togglePlay() {
    if (this.audio.paused)
      return this.play()
    else
      return this.pause()
  }

  async play(): Promise<void> {
    if (!this.audio.paused)
      return

    return this.audio.play()
  }

  async pause(): Promise<void> {
    if (this.audio.paused)
      return

    return this.audio.pause()
  }

  /**
   * @param percentage - A number in the range [0;1]
   */
  seek(percentage: number) {
    this.audio.currentTime = percentage * this.audio.duration
  }
}

const audio = ref<HTMLAudioElement>()
const player = computed(() => audio.value ? new AudioPlayer(audio.value) : null)

const state = reactive({
  progress: 0,
})

watchExtractedObservable(player, p => p.progress$, (percentage: number) => {
  state.progress = 100 * percentage
})
</script>

<template>
  <p>
    Progress: {{ state.progress }}%
  </p>
  <audio ref="audio" src="https://upload.wikimedia.org/wikipedia/commons/f/f1/Sintel_movie_4K.webm" controls />
</template>
