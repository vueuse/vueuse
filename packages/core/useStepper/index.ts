import type { MaybeRef } from '@vueuse/shared'
import type { ComputedRef, Ref } from 'vue-demi'
import { computed, ref } from 'vue-demi'

export interface UseStepperReturn<StepName, Steps, Step> {
  /** List of steps. */
  steps: Readonly<Ref<Steps>>
  /** List of step names. */
  stepNames: Readonly<Ref<StepName[]>>
  /** Index of the current step. */
  index: Ref<number>
  /** Current step. */
  current: ComputedRef<Step>
  /** Next step, or undefined if the current step is the last one. */
  next: ComputedRef<StepName | undefined>
  /** Previous step, or undefined if the current step is the first one. */
  previous: ComputedRef<StepName | undefined>
  /** Whether the current step is the first one. */
  isFirst: ComputedRef<boolean>
  /** Whether the current step is the last one. */
  isLast: ComputedRef<boolean>
  /** Get the step at the specified index. */
  at: (index: number) => Step | undefined
  /** Get a step by the specified name. */
  get: (step: StepName) => Step | undefined
  /** Go to the specified step. */
  goTo: (step: StepName) => void
  /** Go to the next step. Does nothing if the current step is the last one. */
  goToNext: () => void
  /** Go to the previous step. Does nothing if the current step is the previous one. */
  goToPrevious: () => void
  /** Go back to the given step, only if the current step is after. */
  goBackTo: (step: StepName) => void
  /** Checks whether the given step is the next step. */
  isNext: (step: StepName) => boolean
  /** Checks whether the given step is the previous step. */
  isPrevious: (step: StepName) => boolean
  /** Checks whether the given step is the current step. */
  isCurrent: (step: StepName) => boolean
  /** Checks if the current step is before the given step. */
  isBefore: (step: StepName) => boolean
  /** Checks if the current step is after the given step. */
  isAfter: (step: StepName) => boolean
}

export function useStepper<T extends string | number>(steps: MaybeRef<T[]>, initialStep?: T): UseStepperReturn<T, T[], T>
export function useStepper<T extends Record<string, any>>(steps: MaybeRef<T>, initialStep?: keyof T): UseStepperReturn<Exclude<keyof T, symbol>, T, T[keyof T]>
export function useStepper(steps: any, initialStep?: any): UseStepperReturn<any, any, any> {
  const stepsRef = ref<any[]>(steps)
  const stepNames = computed<any[]>(() => Array.isArray(stepsRef.value) ? stepsRef.value : Object.keys(stepsRef.value))
  const index = ref(stepNames.value.indexOf(initialStep ?? stepNames.value[0]))
  const current = computed(() => at(index.value))
  const isFirst = computed(() => index.value === 0)
  const isLast = computed(() => index.value === stepNames.value.length - 1)
  const next = computed(() => stepNames.value[index.value + 1])
  const previous = computed(() => stepNames.value[index.value - 1])

  function at(index: number) {
    if (Array.isArray(stepsRef.value))
      return stepsRef.value[index]

    return stepsRef.value[stepNames.value[index]]
  }

  function get(step: any) {
    if (!stepNames.value.includes(step))
      return

    return at(stepNames.value.indexOf(step))
  }

  function goTo(step: any) {
    if (stepNames.value.includes(step))
      index.value = stepNames.value.indexOf(step)
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

  function goBackTo(step: any) {
    if (isAfter(step))
      goTo(step)
  }

  function isNext(step: any) {
    return stepNames.value.indexOf(step) === index.value + 1
  }

  function isPrevious(step: any) {
    return stepNames.value.indexOf(step) === index.value - 1
  }

  function isCurrent(step: any) {
    return stepNames.value.indexOf(step) === index.value
  }

  function isBefore(step: any) {
    return index.value < stepNames.value.indexOf(step)
  }

  function isAfter(step: any) {
    return index.value > stepNames.value.indexOf(step)
  }

  return {
    steps: stepsRef,
    stepNames,
    index,
    current,
    next,
    previous,
    isFirst,
    isLast,
    at,
    get,
    goTo,
    goToNext,
    goToPrevious,
    goBackTo,
    isNext,
    isPrevious,
    isCurrent,
    isBefore,
    isAfter,
  }
}
