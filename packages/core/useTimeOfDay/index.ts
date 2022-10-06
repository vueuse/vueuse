import type { MaybeRef } from '@vueuse/core'
import { useNow, useRafFn } from '@vueuse/core'
import { computed, isRef, ref } from 'vue-demi'

/**
 * Determine the time of day in reactively
 * @param datetime optionally pass a custom date, could be a date ref or a plain date object
 */
export function useTimeOfDay(datetime?: MaybeRef<Date>) {
  const hrs = computed(() => {
    const now = datetime
      ? isRef(datetime)
        ? datetime
        : ref(datetime)
      : useNow()
    return now.value.getHours()
  })

  const timeOfDay = ref('')

  const isMorning = computed(() => hrs.value >= 0 && hrs.value < 12)

  const isNoon = computed(() => hrs.value === 12)

  const isAfternoon = computed(() => hrs.value > 12 && hrs.value <= 17)

  const isEvening = computed(() => hrs.value > 17 && hrs.value <= 20)

  const isNight = computed(() => hrs.value > 20 && hrs.value <= 24)

  const _setTimeOfDay = () => {
    if (isMorning.value)
      timeOfDay.value = 'Morning'
    else if (isNoon.value)
      timeOfDay.value = 'Noon'
    else if (isAfternoon.value)
      timeOfDay.value = 'Afternoon'
    else if (isEvening.value)
      timeOfDay.value = 'Evening'
    else if (isNight.value)
      timeOfDay.value = 'Night'
  }

  useRafFn(_setTimeOfDay, { immediate: true })

  return { timeOfDay, isAfternoon, isEvening, isMorning, isNight, isNoon }
}

export type UseTimeOfDayReturn = ReturnType<typeof useTimeOfDay>
