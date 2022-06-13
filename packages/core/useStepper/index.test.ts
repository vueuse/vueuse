import { useStepper } from '.'

describe('useStepper', () => {
  it('should be defined', () => {
    expect(useStepper).toBeDefined()
  })

  it('can navigate through steps', () => {
    const { isFirst, isLast, next, previous, current, index, goTo, backTo, isPrevious, isNext, currentStepIs, currentStepIsAfter, currentStepIsBefore } = useStepper([
      'First step',
      'Second step',
      'Last step',
    ] as const)

    expect(index.value).toBe(0)
    expect(current.value).toBe('First step')
    expect(isFirst.value).toBe(true)
    expect(currentStepIs('First step')).toBe(true)
    expect(currentStepIs('Second step')).toBe(false)
    expect(currentStepIsAfter('Second step')).toBe(false)

    next()
    expect(index.value).toBe(1)
    expect(current.value).toBe('Second step')
    expect(isPrevious('First step')).toBe(true)
    expect(isNext('Last step')).toBe(true)
    expect(currentStepIsAfter('First step')).toBe(true)
    expect(currentStepIsBefore('First step')).toBe(false)
    expect(currentStepIsBefore('Last step')).toBe(true)

    previous()
    expect(index.value).toBe(0)
    expect(current.value).toBe('First step')

    backTo('Last step') // we can't go back to a future step
    expect(index.value).toBe(0)
    expect(current.value).toBe('First step')

    goTo('Last step') // we can force a step
    expect(index.value).toBe(2)
    expect(current.value).toBe('Last step')
    expect(isLast.value).toBe(true)
  })
})
