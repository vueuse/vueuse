import { computed, ref } from 'vue-demi'
import { useSlidingWindow } from '.'

describe('useSlidingWindow', () => {
  it('should be defined', () => {
    expect(useSlidingWindow).toBeDefined()
  })

  it('should work with sliding window', () => {
    const cases: [
      [min: number, max: number, start: number, end: number],
      [actualStart: number, actualEnd: number],
    ][] = [
      [
        [0, 100, 10, 20],
        [10, 20],
      ],
      [
        [0, 100, 0, 10],
        [0, 10],
      ],
      [
        [0, 100, 90, 100],
        [90, 100],
      ],
      [
        [0, 100, -1, 9],
        [0, 10],
      ],
      [
        [0, 100, 91, 101],
        [90, 100],
      ],
    ]

    cases.forEach(([args, expected]) => {
      const result = useSlidingWindow(...args)
      expect(result.value).toEqual(expected)
    })
  })

  it('should work with reactive sliding window', () => {
    const cases: [
      [min: number, max: number, start: number, end: number],
      [actualStart: number, actualEnd: number],
    ][] = [
      [
        [0, 100, 10, 20],
        [10, 20],
      ],
      [
        [0, 100, 0, 10],
        [0, 10],
      ],
      [
        [0, 100, 90, 100],
        [90, 100],
      ],
      [
        [0, 100, -1, 9],
        [0, 10],
      ],
      [
        [0, 100, 91, 101],
        [90, 100],
      ],
      [
        [0, 100, 81, 101],
        [80, 100],
      ],
    ]

    const min = ref(0)
    const max = ref(100)
    const start = ref(0)
    const end = ref(10)

    const range = useSlidingWindow(min, max, start, end)

    cases.forEach(([args, expected]) => {
      const [minValue, maxValue, startValue, endValue] = args
      min.value = minValue
      max.value = maxValue
      start.value = startValue
      end.value = endValue

      expect(range.value).toEqual(expected)
    })
  })

  it('should more reactive', () => {
    const min = ref(0)
    const max = ref(100)
    const start = ref(0)
    const size = ref(10)
    const end = computed(() => start.value + size.value)
    const range = useSlidingWindow(min, max, start, end)

    expect(range.value).toEqual([0, 10])

    size.value = 20
    expect(range.value).toEqual([0, 20])

    min.value = 1
    expect(range.value).toEqual([1, 21])

    size.value = 10
    expect(range.value).toEqual([1, 11])

    start.value = -2
    expect(range.value).toEqual([1, 11])

    min.value = 0
    expect(range.value).toEqual([0, 10])

    min.value = -2
    expect(range.value).toEqual([-2, 8])

    min.value = 0
    start.value = 90
    expect(range.value).toEqual([90, 100])

    max.value = 99
    expect(range.value).toEqual([89, 99])

    max.value = 100
    start.value = 99
    expect(range.value).toEqual([90, 100])

    max.value = 200
    expect(range.value).toEqual([99, 109])
  })
})
