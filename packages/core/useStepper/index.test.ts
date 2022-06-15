import { useStepper } from '.'

describe('useStepper', () => {
  it('should be defined', () => {
    expect(useStepper).toBeDefined()
  })

  it('can navigate through steps', () => {
    const { isFirst, isLast, goToNext, goToPrevious, nextStep, previousStep, current, index, goTo, backTo, isPrevious, isNext, currentStepIs, currentStepIsAfter, currentStepIsBefore } = useStepper([
      'First step',
      'Second step',
      'Last step',
    ] as const)

    expect(index.value).toBe(0)
    expect(current.value).toBe('First step')
    expect(isFirst.value).toBe(true)
    expect(nextStep.value).toBe('Second step')
    expect(previousStep.value).toBeUndefined()
    expect(currentStepIs('First step')).toBe(true)
    expect(currentStepIs('Second step')).toBe(false)
    expect(currentStepIsAfter('Second step')).toBe(false)

    goToNext()
    expect(index.value).toBe(1)
    expect(current.value).toBe('Second step')
    expect(nextStep.value).toBe('Last step')
    expect(previousStep.value).toBe('First step')
    expect(isPrevious('First step')).toBe(true)
    expect(isNext('Last step')).toBe(true)
    expect(currentStepIsAfter('First step')).toBe(true)
    expect(currentStepIsBefore('First step')).toBe(false)
    expect(currentStepIsBefore('Last step')).toBe(true)

    goToPrevious()
    expect(index.value).toBe(0)
    expect(current.value).toBe('First step')

    backTo('Last step') // we can't go back to a future step
    expect(index.value).toBe(0)
    expect(current.value).toBe('First step')

    goTo('Last step') // we can force a step
    expect(nextStep.value).toBeUndefined()
    expect(previousStep.value).toBe('Second step')
    expect(index.value).toBe(2)
    expect(current.value).toBe('Last step')
    expect(isLast.value).toBe(true)
  })
})
