import { promiseTimeout, timestamp } from '@vueuse/shared'
import type { ComputedRef } from 'vue-demi'
import { computed, ref } from 'vue-demi'
import { useTimeAgo } from '.'

type TimeUnit = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'

const UNITS = [
  { max: 60000, value: 1000, name: 'second' },
  { max: 2760000, value: 60000, name: 'minute' },
  { max: 72000000, value: 3600000, name: 'hour' },
  { max: 518400000, value: 86400000, name: 'day' },
  { max: 2419200000, value: 604800000, name: 'week' },
  { max: 28512000000, value: 2592000000, name: 'month' },
  { max: Infinity, value: 31536000000, name: 'year' },
]

const fullDateFormatter = (value: any) => new Date(value).toISOString().slice(0, 10)

function getNeededTimeChange(type: TimeUnit, count: number, adjustSecond?: number) {
  const unit = UNITS.find(i => i.name === type)
  return (unit?.value || 0) * count + (adjustSecond || 0) * 1000
}

describe('useTimeAgo', () => {
  let baseTime: number
  const changeValue = ref(0)
  let changeTime: ComputedRef<number>

  function reset() {
    vi.useFakeTimers()
    baseTime = timestamp()
    vi.setSystemTime(baseTime)
    changeValue.value = 0
    changeTime = computed(() => baseTime + changeValue.value)
  }

  beforeEach(() => {
    reset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('control now', async () => {
    vi.useRealTimers()
    const { resume, pause, timeAgo } = useTimeAgo(baseTime, { controls: true, showSecond: true, updateInterval: 500 })
    await promiseTimeout(100)
    expect(timeAgo.value).toBe('0 second ago')

    pause()
    await promiseTimeout(1000)
    expect(timeAgo.value).toBe('0 second ago')

    resume()
    await promiseTimeout(1000)
    expect(timeAgo.value).toBe('2 seconds ago')
  })

  test('get undefined when time is invalid', () => {
    expect(useTimeAgo('invalid date').value).toBe('')
  })

  describe('just now', () => {
    test('just now', () => {
      expect(useTimeAgo(baseTime).value).toBe('just now')
    })

    test('just now using custom formatter', () => {
      // @ts-expect-error mock messages
      expect(useTimeAgo(baseTime, { messages: { second: '{0}', future: '{0}' }, showSecond: true }).value).toBe('0')
    })
  })

  describe('second', () => {
    function testSecond(isFuture: boolean) {
      const text = isFuture ? 'future' : 'past'
      const nextTime = getNeededTimeChange('minute', 1, -1) * (isFuture ? 1 : -1)
      test(`${text}: less than 1 minute`, () => {
        changeValue.value = nextTime
        expect(useTimeAgo(changeTime).value).toBe('just now')
      })

      test(`${text}: less than 1 second`, () => {
        changeValue.value = getNeededTimeChange('minute', 1, -59.6) * (isFuture ? 1 : -1)
        expect(useTimeAgo(changeTime, { showSecond: true }).value).toBe(
          isFuture ? 'in 0 second' : '0 second ago')
      })

      test(`${text}: less than 1 minute/ with showSecond`, () => {
        changeValue.value = nextTime
        expect(useTimeAgo(changeTime, { showSecond: true }).value).toBe(
          isFuture ? 'in 59 seconds' : '59 seconds ago')
      })

      test(`${text}: less than 1 minute but more than 10 seconds with showSecond`, () => {
        changeValue.value = nextTime
        expect(useTimeAgo(changeTime, { showSecond: true, max: 10000 }).value).toBe(fullDateFormatter(changeTime.value))
      })

      test(`${text}: more than 1 minute`, () => {
        changeValue.value = getNeededTimeChange('minute', 1, 1) * (isFuture ? 1 : -1)
        expect(useTimeAgo(changeTime, { showSecond: true, max: 'second' }).value).toBe(fullDateFormatter(changeTime.value))
      })
    }

    testSecond(true)
    testSecond(false)
  })

  describe('minute', () => {
    test('future: 1 minute', () => {
      changeValue.value = getNeededTimeChange('minute', 1)
      expect(useTimeAgo(changeTime).value).toBe('in 1 minute')
    })

    test('past: 1 minute', () => {
      changeValue.value = -getNeededTimeChange('minute', 1)
      expect(useTimeAgo(changeTime).value).toBe('1 minute ago')
    })

    test('future: 10 minutes', () => {
      changeValue.value = getNeededTimeChange('minute', 10)
      expect(useTimeAgo(changeTime).value).toBe('in 10 minutes')
    })

    test('past: 10 minutes', () => {
      changeValue.value = -getNeededTimeChange('minute', 10)
      expect(useTimeAgo(changeTime).value).toBe('10 minutes ago')
    })
  })

  describe('hour', () => {
    test('future: 1 hour', () => {
      changeValue.value = getNeededTimeChange('hour', 1)
      expect(useTimeAgo(changeTime).value).toBe('in 1 hour')
    })

    test('past: 1 hour', () => {
      changeValue.value = -getNeededTimeChange('hour', 1)
      expect(useTimeAgo(changeTime).value).toBe('1 hour ago')
    })

    test('future: 10 hours', () => {
      changeValue.value = getNeededTimeChange('hour', 10)
      expect(useTimeAgo(changeTime).value).toBe('in 10 hours')
    })

    test('past: 10 hours', () => {
      changeValue.value = -getNeededTimeChange('hour', 10)
      expect(useTimeAgo(changeTime).value).toBe('10 hours ago')
    })
  })

  describe('day', () => {
    test('future: 1 day', () => {
      changeValue.value = getNeededTimeChange('day', 1)
      expect(useTimeAgo(changeTime).value).toBe('tomorrow')
    })

    test('past: 1 day', () => {
      changeValue.value = -getNeededTimeChange('day', 1)
      expect(useTimeAgo(changeTime).value).toBe('yesterday')
    })

    test('future: 3 days', () => {
      changeValue.value = getNeededTimeChange('day', 3)
      expect(useTimeAgo(changeTime).value).toBe('in 3 days')
    })

    test('past: 3 days', () => {
      changeValue.value = -getNeededTimeChange('day', 3)
      expect(useTimeAgo(changeTime).value).toBe('3 days ago')
    })
  })

  describe('week', () => {
    test('future: 1 week', () => {
      changeValue.value = getNeededTimeChange('week', 1)
      expect(useTimeAgo(changeTime).value).toBe('next week')
    })

    test('past: 1 week', () => {
      changeValue.value = -getNeededTimeChange('week', 1)
      expect(useTimeAgo(changeTime).value).toBe('last week')
    })

    test('future: 3 weeks', () => {
      changeValue.value = getNeededTimeChange('week', 3)
      expect(useTimeAgo(changeTime).value).toBe('in 3 weeks')
    })

    test('past: 3 weeks', () => {
      changeValue.value = -getNeededTimeChange('week', 3)
      expect(useTimeAgo(changeTime).value).toBe('3 weeks ago')
    })
  })

  describe('month', () => {
    test('future: 1 month', () => {
      changeValue.value = getNeededTimeChange('month', 1)
      expect(useTimeAgo(changeTime).value).toBe('next month')
    })

    test('past: 1 month', () => {
      changeValue.value = -getNeededTimeChange('month', 1)
      expect(useTimeAgo(changeTime).value).toBe('last month')
    })

    test('future: 3 months', () => {
      changeValue.value = getNeededTimeChange('month', 3)
      expect(useTimeAgo(changeTime).value).toBe('in 3 months')
    })

    test('past: 3 months', () => {
      changeValue.value = -getNeededTimeChange('month', 3)
      expect(useTimeAgo(changeTime).value).toBe('3 months ago')
    })
  })

  describe('year', () => {
    test('future: 1 year', () => {
      changeValue.value = getNeededTimeChange('year', 1)
      expect(useTimeAgo(changeTime).value).toBe('next year')
    })

    test('past: 1 year', () => {
      changeValue.value = -getNeededTimeChange('year', 1)
      expect(useTimeAgo(changeTime).value).toBe('last year')
    })

    test('future: 3 years', () => {
      changeValue.value = getNeededTimeChange('year', 3)
      expect(useTimeAgo(changeTime).value).toBe('in 3 years')
    })

    test('past: 3 years', () => {
      changeValue.value = -getNeededTimeChange('year', 3)
      expect(useTimeAgo(changeTime).value).toBe('3 years ago')
    })
  })

  test('rounding', () => {
    changeValue.value = getNeededTimeChange('day', 5.49)
    expect(useTimeAgo(changeTime).value).toBe('in 5 days')
    expect(useTimeAgo(changeTime, { rounding: 'ceil' }).value).toBe('in 6 days')
    expect(useTimeAgo(changeTime, { rounding: 'floor' }).value).toBe('in 5 days')
    expect(useTimeAgo(changeTime, { rounding: 1 }).value).toBe('in 5.5 days')
    expect(useTimeAgo(changeTime, { rounding: 3 }).value).toBe('in 5.49 days')
  })

  test('rounding unit fallback', () => {
    changeValue.value = getNeededTimeChange('month', 11.5)
    expect(useTimeAgo(changeTime).value).toBe('next year')
    expect(useTimeAgo(changeTime, { rounding: 'ceil' }).value).toBe('next year')
    expect(useTimeAgo(changeTime, { rounding: 'floor' }).value).toBe('in 11 months')
    expect(useTimeAgo(changeTime, { rounding: 1 }).value).toBe('in 0.9 year')
    expect(useTimeAgo(changeTime, { rounding: 3 }).value).toBe('in 0.945 year')
  })

  test('custom units', () => {
    changeValue.value = getNeededTimeChange('day', 14)
    expect(useTimeAgo(changeTime).value).toBe('in 2 weeks')
    expect(useTimeAgo(changeTime, {
      units: [
        { max: 60000, value: 1000, name: 'second' },
        { max: 2760000, value: 60000, name: 'minute' },
        { max: 72000000, value: 3600000, name: 'hour' },
        { max: 518400000 * 30, value: 86400000, name: 'day' },
        { max: 28512000000, value: 2592000000, name: 'month' },
        { max: Infinity, value: 31536000000, name: 'year' },
      ],
    }).value).toBe('in 14 days')
  })
})
