import { computed, ref } from 'vue-demi'

export function useStepper<T extends string>(steps: readonly T[], initial?: T) {
  const index = ref(steps.indexOf(initial ?? steps[0]))
  const current = computed(() => steps[index.value])
  const isFirst = computed(() => index.value === 0)
  const isLast = computed(() => index.value === steps.length - 1)

  function backTo(step: T) {
    if (currentStepIsAfter(step))
      goTo(step)
  }

  function goTo(step: T) {
    index.value = steps.indexOf(step)
  }

  function next() {
    if (isLast.value)
      return

    index.value++
  }

  function previous() {
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

  function completed(step: T) {
    return currentStepIsAfter(step)
  }

  function active(step: T) {
    return currentStepIs(step)
  }

  function todo(step: T) {
    return currentStepIsBefore(step)
  }

  return {
    backTo,
    goTo,
    current,
    index,
    next,
    previous,
    steps,
    currentStepIs,
    currentStepIsAfter,
    currentStepIsBefore,
    completed,
    active,
    todo,
    isFirst,
    isLast,
    isNext,
    isPrevious,
  }
}
