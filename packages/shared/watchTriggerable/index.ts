import { ref } from 'vue-demi'
import type { WatchIgnorableReturn } from '../watchIgnorable'
import { watchIgnorable } from '../watchIgnorable'
import type { WatchWithFilterOptions } from '../watchWithFilter'

export interface WatchTriggerableReturn extends WatchIgnorableReturn {
  trigger: () => void
}

export function watchTriggerable<Immediate extends Readonly<boolean> = false>(
  source: any,
  cb: any,
  options: WatchWithFilterOptions<Immediate> = {},
): WatchTriggerableReturn {
  const triggerCounter = ref(0)

  const trigger = () => triggerCounter.value += 1

  const _source = Array.isArray(source)
    ? [triggerCounter, ...source]
    : [triggerCounter, source]

  const _cb = (
    [, ...value]: any[],
    [, ...oldValue]: any[],
    onCleanup: any,
  ) => cb(value, oldValue, onCleanup)

  return {
    ...watchIgnorable(_source, _cb, options),
    trigger,
  }
}
