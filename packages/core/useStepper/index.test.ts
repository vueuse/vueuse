import { reactive, ref } from 'vue-demi'
import { useStepper } from '.'

describe('useStepper', () => {
  it('should be defined', () => {
    expect(useStepper).toBeDefined()
  })

  describe('common', () => {
    test('steps are reactive', () => {
      const flag = ref(true)
      const steps = reactive({
        first: {
          title: 'First',
          enabled: flag,
        },
        second: {
          title: 'Second',
          enabled: flag,
        },
      })

      const stepper = useStepper(steps)

      expect(stepper.current.value.enabled).toBe(true)
      flag.value = false
      expect(stepper.current.value.enabled).toBe(false)
    })

    it('does not navigate to steps that do not exist', () => {
      const stepper = useStepper({
        first: 'First',
        second: 'Second',
        last: 'Last',
      })

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      stepper.goTo('unexisting step')
      expect(stepper.current.value).toBe('First')
    })

    it('supports navigating through steps', () => {
      const stepper = useStepper({
        first: 'First',
        second: 'Second',
        last: 'Last',
      })

      expect(stepper.current.value).toBe('First')

      // Checks that when this is the first step, we can't go back
      stepper.goToPrevious()
      expect(stepper.current.value).toBe('First')

      // Checks that we can simply go next
      stepper.goToNext()
      expect(stepper.current.value).toBe('Second')
      stepper.goToNext()
      expect(stepper.current.value).toBe('Last')

      // Checks that when this is the last step, we can't go next
      stepper.goToNext()
      expect(stepper.current.value).toBe('Last')

      // Checks that when this is not the first step, we can go back
      stepper.goToPrevious()
      expect(stepper.current.value).toBe('Second')

      // Checks that we can go back to a previous step
      stepper.goBackTo('first')
      expect(stepper.current.value).toBe('First')

      // Checks that we CANNOT go back to a future step
      stepper.goBackTo('last')
      expect(stepper.current.value).toBe('First')

      // Checks that we can go to a any step
      stepper.goTo('last')
      expect(stepper.current.value).toBe('Last')
    })

    it('can tell the step position', () => {
      const stepper = useStepper({
        first: 'First',
        second: 'Second',
        last: 'Last',
      })

      // First step
      expect(stepper.isFirst.value).toBe(true)
      expect(stepper.isLast.value).toBe(false)

      expect(stepper.isAfter('first')).toBe(false)
      expect(stepper.isAfter('second')).toBe(false)
      expect(stepper.isAfter('last')).toBe(false)

      expect(stepper.isBefore('first')).toBe(false)
      expect(stepper.isBefore('second')).toBe(true)
      expect(stepper.isBefore('last')).toBe(true)

      expect(stepper.isCurrent('first')).toBe(true)
      expect(stepper.isCurrent('second')).toBe(false)
      expect(stepper.isCurrent('last')).toBe(false)

      expect(stepper.isPrevious('first')).toBe(false)
      expect(stepper.isPrevious('second')).toBe(false)
      expect(stepper.isPrevious('last')).toBe(false)

      expect(stepper.isNext('first')).toBe(false)
      expect(stepper.isNext('second')).toBe(true)
      expect(stepper.isNext('last')).toBe(false)

      // Second step
      stepper.goToNext()

      expect(stepper.isFirst.value).toBe(false)
      expect(stepper.isLast.value).toBe(false)

      expect(stepper.isAfter('first')).toBe(true)
      expect(stepper.isAfter('second')).toBe(false)
      expect(stepper.isAfter('last')).toBe(false)

      expect(stepper.isBefore('first')).toBe(false)
      expect(stepper.isBefore('second')).toBe(false)
      expect(stepper.isBefore('last')).toBe(true)

      expect(stepper.isCurrent('first')).toBe(false)
      expect(stepper.isCurrent('second')).toBe(true)
      expect(stepper.isCurrent('last')).toBe(false)

      expect(stepper.isPrevious('first')).toBe(true)
      expect(stepper.isPrevious('second')).toBe(false)
      expect(stepper.isPrevious('last')).toBe(false)

      expect(stepper.isNext('first')).toBe(false)
      expect(stepper.isNext('second')).toBe(false)
      expect(stepper.isNext('last')).toBe(true)

      // Last step
      stepper.goToNext()

      expect(stepper.isFirst.value).toBe(false)
      expect(stepper.isLast.value).toBe(true)

      expect(stepper.isAfter('first')).toBe(true)
      expect(stepper.isAfter('second')).toBe(true)
      expect(stepper.isAfter('last')).toBe(false)

      expect(stepper.isBefore('first')).toBe(false)
      expect(stepper.isBefore('second')).toBe(false)
      expect(stepper.isBefore('last')).toBe(false)

      expect(stepper.isCurrent('first')).toBe(false)
      expect(stepper.isCurrent('second')).toBe(false)
      expect(stepper.isCurrent('last')).toBe(true)

      expect(stepper.isPrevious('first')).toBe(false)
      expect(stepper.isPrevious('second')).toBe(true)
      expect(stepper.isPrevious('last')).toBe(false)

      expect(stepper.isNext('first')).toBe(false)
      expect(stepper.isNext('second')).toBe(false)
      expect(stepper.isNext('last')).toBe(false)
    })
  })

  describe('as array', () => {
    it('supports being initialized with a specific step', () => {
      const stepper = useStepper([
        'First step',
        'Second step',
        'Last step',
      ], 'Last step')

      expect(stepper.current.value).toBe('Last step')
      expect(stepper.isCurrent('Last step')).toBeTruthy()
    })

    it('support type-specific features', () => {
      const stepper = useStepper([
        'First step',
        'Second step',
        'Last step',
      ])

      expect(stepper.stepNames.value).toEqual(['First step', 'Second step', 'Last step'])
      expect(stepper.steps.value).toEqual(['First step', 'Second step', 'Last step'])
    })

    it('can get a step at a specific index', () => {
      const stepper = useStepper([
        'First step',
        'Second step',
        'Last step',
      ])

      expect(stepper.at(0)).toBe('First step')
      expect(stepper.at(1)).toBe('Second step')
      expect(stepper.at(2)).toBe('Last step')
    })

    it('can get a step by its name', () => {
      const stepper = useStepper([
        'First step',
        'Second step',
        'Last step',
      ])

      expect(stepper.get('First step')).toBe('First step')
      expect(stepper.get('Second step')).toBe('Second step')
      expect(stepper.get('Last step')).toBe('Last step')
      expect(stepper.get('unknown' as any)).toBeUndefined()
    })
  })

  describe('as object', () => {
    it('supports being initialized with a specific step', () => {
      const stepper = useStepper({
        first: 'First',
        second: 'Second',
        last: 'Last',
      }, 'second')

      expect(stepper.current.value).toBe('Second')
      expect(stepper.isCurrent('second')).toBeTruthy()
    })

    it('support type-specific features', () => {
      const stepper = useStepper({
        first: 'First',
        second: 'Second',
        last: 'Last',
      })

      expect(stepper.stepNames.value).toEqual(['first', 'second', 'last'])
      expect(stepper.steps.value).toEqual({
        first: 'First',
        second: 'Second',
        last: 'Last',
      })
    })

    it('can get a step at a specific index', () => {
      const stepper = useStepper({
        first: 'First',
        second: 'Second',
        last: 'Last',
      })

      expect(stepper.at(0)).toBe('First')
      expect(stepper.at(1)).toBe('Second')
      expect(stepper.at(2)).toBe('Last')
    })

    it('can get a step by its name', () => {
      const stepper = useStepper({
        first: 'First',
        second: 'Second',
        last: 'Last',
      })

      expect(stepper.get('first')).toBe('First')
      expect(stepper.get('second')).toBe('Second')
      expect(stepper.get('last')).toBe('Last')
    })
  })
})
