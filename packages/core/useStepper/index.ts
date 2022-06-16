import { computed, ref } from 'vue-demi'

export function useStepper<T>(steps: readonly T[], initial?: T) {
  const index = ref(steps.indexOf(initial ?? steps[0]))
  const current = computed(() => steps[index.value])
  const isFirst = computed(() => index.value === 0)
  const isLast = computed(() => index.value === steps.length - 1)
  const nextStep = computed<T | undefined>(() => steps[index.value + 1])
  const previousStep = computed<T | undefined>(() => steps[index.value - 1])

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

  /**
   * Checks if the given step is the step just after the current step.
   */
  function isNext(step: T) {
    return steps.indexOf(step) === index.value + 1
  }

  /**
   * Checks if the given step is the step just before the current step.
   */
  function isPrevious(step: T) {
    return steps.indexOf(step) === index.value - 1
  }

  /**
   * Checks if the current step is the same as the given step.
   */
  function currentStepIs(step: T) {
    return steps.indexOf(step) === index.value
  }

  /**
   * Checks if the current step is after given step.
   */
  function isStepAfter(step: T) {
    return index.value > steps.indexOf(step)
  }

  /**
   * Checks if the current step is before given step.
   */
  function isStepBefore(step: T) {
    return index.value < steps.indexOf(step)
  }

  return {
    goTo,
    current,
    index,
    goToNext,
    goToPrevious,
    steps,
    currentStepIs,
    isStepAfter,
    isStepBefore,
    isFirst,
    isLast,
    isNext,
    isPrevious,
    nextStep,
    previousStep,
  }
}
