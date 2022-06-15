import { computed, ref } from 'vue-demi'

export function useStepper<T extends string>(steps: readonly T[], initial?: T) {
  const index = ref(steps.indexOf(initial ?? steps[0]))
  const current = computed(() => steps[index.value])
  const isFirst = computed(() => index.value === 0)
  const isLast = computed(() => index.value === steps.length - 1)
  const nextStep = computed(() => isLast.value ? undefined : steps[index.value + 1])
  const previousStep = computed(() => isFirst.value ? undefined : steps[index.value - 1])

  function backTo(step: T) {
    if (currentStepIsAfter(step))
      goTo(step)
  }

  function goTo(step: T) {
    index.value = steps.indexOf(step)
  }

  function goToNext() {
    if (isLast.value)
      return

    index.value++
  }

  function goToPrevious() {
    if (isFirst.value)
      return

    index.value--
  }

  function isNext(step: T) {
    return steps.indexOf(step) === index.value + 1
  }

  function isPrevious(step: T) {
    return steps.indexOf(step) === index.value - 1
  }

  function currentStepIs(step: T) {
    return steps.indexOf(step) === index.value
  }

  function currentStepIsAfter(step: T) {
    return index.value > steps.indexOf(step)
  }

  function currentStepIsBefore(step: T) {
    return index.value < steps.indexOf(step)
  }

  return {
    backTo,
    goTo,
    current,
    index,
    goToNext,
    goToPrevious,
    steps,
    currentStepIs,
    currentStepIsAfter,
    currentStepIsBefore,
    isFirst,
    isLast,
    isNext,
    isPrevious,
    nextStep,
    previousStep,
  }
}
