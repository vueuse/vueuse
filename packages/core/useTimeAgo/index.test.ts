import { promiseTimeout, timestamp } from '@vueuse/shared'
import type { ComputedRef } from 'vue-demi'
import { computed, ref } from 'vue-demi'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useTimeAgo } from '.'

type TimeUnit = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'

const UNITS = [
  { max: 60000, value: 1000, name: 'second' },
  { max: 2760000, value: 60000, name: 'minute' },
  { max: 72000000, value: 3600000, name: 'hour' },
  { max: 518400000, value: 86400000, name: 'day' },
  { max: 2419200000, value: 604800000, name: 'week' },
  { max: 28512000000, value: 2592000000, name: 'month' },
  { max: Number.POSITIVE_INFINITY, value: 31536000000, name: 'year' },
]

function fullDateFormatter(value: any) {
  return new Date(value).toISOString().slice(0, 10)
}

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

  it('control now', async () => {
    vi.useRealTimers()
    const { resume, pause, timeAgo } = useTimeAgo(baseTime, { controls: true, showSecond: true, updateInterval: 500 })
    await promiseTimeout(400)
    expect(timeAgo.value).toBe('0 second ago')

    pause()
    await promiseTimeout(700)
    expect(timeAgo.value).toBe('0 second ago')

    resume()
    await promiseTimeout(1000)
    expect(timeAgo.value).toBe('2 seconds ago')
  })

  it('get undefined when time is invalid', () => {
    expect(useTimeAgo('invalid date').value).toBe('')
  })

  describe('just now', () => {
    it('just now', () => {
      expect(useTimeAgo(baseTime).value).toBe('just now')
    })

    it('just now using custom formatter', () => {
      // @ts-expect-error mock messages
      expect(useTimeAgo(baseTime, { messages: { second: '{0}', future: '{0}' }, showSecond: true }).value).toBe('0')
    })
  })

  describe('second', () => {
    function testSecond(isFuture: boolean) {
      const text = isFuture ? 'future' : 'past'
      const nextTime = getNeededTimeChange('minute', 1, -1) * (isFuture ? 1 : -1)
      it(`${text}: less than 1 minute`, () => {
        changeValue.value = nextTime
        expect(useTimeAgo(changeTime).value).toBe('just now')
      })

      it(`${text}: less than 1 second`, () => {
        changeValue.value = getNeededTimeChange('minute', 1, -59.6) * (isFuture ? 1 : -1)
        expect(useTimeAgo(changeTime, { showSecond: true }).value).toBe(
          isFuture ? 'in 0 second' : '0 second ago',
        )
      })

      it(`${text}: less than 1 minute/ with showSecond`, () => {
        changeValue.value = nextTime
        expect(useTimeAgo(changeTime, { showSecond: true }).value).toBe(
          isFuture ? 'in 59 seconds' : '59 seconds ago',
        )
      })

      it(`${text}: less than 1 minute but more than 10 seconds with showSecond`, () => {
        changeValue.value = nextTime
        expect(useTimeAgo(changeTime, { showSecond: true, max: 10000 }).value).toBe(fullDateFormatter(changeTime.value))
      })

      it(`${text}: more than 1 minute`, () => {
        changeValue.value = getNeededTimeChange('minute', 1, 1) * (isFuture ? 1 : -1)
        expect(useTimeAgo(changeTime, { showSecond: true, max: 'second' }).value).toBe(fullDateFormatter(changeTime.value))
      })
    }

    testSecond(true)
    testSecond(false)
  })

  describe('minute', () => {
    it('future: 1 minute', () => {
      changeValue.value = getNeededTimeChange('minute', 1)
      expect(useTimeAgo(changeTime).value).toBe('in 1 minute')
    })

    it('past: 1 minute', () => {
      changeValue.value = -getNeededTimeChange('minute', 1)
      expect(useTimeAgo(changeTime).value).toBe('1 minute ago')
    })

    it('future: 10 minutes', () => {
      changeValue.value = getNeededTimeChange('minute', 10)
      expect(useTimeAgo(changeTime).value).toBe('in 10 minutes')
    })

    it('past: 10 minutes', () => {
      changeValue.value = -getNeededTimeChange('minute', 10)
      expect(useTimeAgo(changeTime).value).toBe('10 minutes ago')
    })
  })

  describe('hour', () => {
    it('future: 1 hour', () => {
      changeValue.value = getNeededTimeChange('hour', 1)
      expect(useTimeAgo(changeTime).value).toBe('in 1 hour')
    })

    it('past: 1 hour', () => {
      changeValue.value = -getNeededTimeChange('hour', 1)
      expect(useTimeAgo(changeTime).value).toBe('1 hour ago')
    })

    it('future: 10 hours', () => {
      changeValue.value = getNeededTimeChange('hour', 10)
      expect(useTimeAgo(changeTime).value).toBe('in 10 hours')
    })

    it('past: 10 hours', () => {
      changeValue.value = -getNeededTimeChange('hour', 10)
      expect(useTimeAgo(changeTime).value).toBe('10 hours ago')
    })
  })

  describe('day', () => {
    it('future: 1 day', () => {
      changeValue.value = getNeededTimeChange('day', 1)
      expect(useTimeAgo(changeTime).value).toBe('tomorrow')
    })

    it('past: 1 day', () => {
      changeValue.value = -getNeededTimeChange('day', 1)
      expect(useTimeAgo(changeTime).value).toBe('yesterday')
    })

    it('future: 3 days', () => {
      changeValue.value = getNeededTimeChange('day', 3)
      expect(useTimeAgo(changeTime).value).toBe('in 3 days')
    })

    it('past: 3 days', () => {
      changeValue.value = -getNeededTimeChange('day', 3)
      expect(useTimeAgo(changeTime).value).toBe('3 days ago')
    })
  })

  describe('week', () => {
    it('future: 1 week', () => {
      changeValue.value = getNeededTimeChange('week', 1)
      expect(useTimeAgo(changeTime).value).toBe('next week')
    })

    it('past: 1 week', () => {
      changeValue.value = -getNeededTimeChange('week', 1)
      expect(useTimeAgo(changeTime).value).toBe('last week')
    })

    it('future: 3 weeks', () => {
      changeValue.value = getNeededTimeChange('week', 3)
      expect(useTimeAgo(changeTime).value).toBe('in 3 weeks')
    })

    it('past: 3 weeks', () => {
      changeValue.value = -getNeededTimeChange('week', 3)
      expect(useTimeAgo(changeTime).value).toBe('3 weeks ago')
    })
  })

  describe('month', () => {
    it('future: 1 month', () => {
      changeValue.value = getNeededTimeChange('month', 1)
      expect(useTimeAgo(changeTime).value).toBe('next month')
    })

    it('past: 1 month', () => {
      changeValue.value = -getNeededTimeChange('month', 1)
      expect(useTimeAgo(changeTime).value).toBe('last month')
    })

    it('future: 3 months', () => {
      changeValue.value = getNeededTimeChange('month', 3)
      expect(useTimeAgo(changeTime).value).toBe('in 3 months')
    })

    it('past: 3 months', () => {
      changeValue.value = -getNeededTimeChange('month', 3)
      expect(useTimeAgo(changeTime).value).toBe('3 months ago')
    })
  })

  describe('year', () => {
    it('future: 1 year', () => {
      changeValue.value = getNeededTimeChange('year', 1)
      expect(useTimeAgo(changeTime).value).toBe('next year')
    })

    it('past: 1 year', () => {
      changeValue.value = -getNeededTimeChange('year', 1)
      expect(useTimeAgo(changeTime).value).toBe('last year')
    })

    it('future: 3 years', () => {
      changeValue.value = getNeededTimeChange('year', 3)
      expect(useTimeAgo(changeTime).value).toBe('in 3 years')
    })

    it('past: 3 years', () => {
      changeValue.value = -getNeededTimeChange('year', 3)
      expect(useTimeAgo(changeTime).value).toBe('3 years ago')
    })
  })

  it('rounding', () => {
    changeValue.value = getNeededTimeChange('day', 5.49)
    expect(useTimeAgo(changeTime).value).toBe('in 5 days')
    expect(useTimeAgo(changeTime, { rounding: 'ceil' }).value).toBe('in 6 days')
    expect(useTimeAgo(changeTime, { rounding: 'floor' }).value).toBe('in 5 days')
    expect(useTimeAgo(changeTime, { rounding: 1 }).value).toBe('in 5.5 days')
    expect(useTimeAgo(changeTime, { rounding: 3 }).value).toBe('in 5.49 days')
  })

  it('rounding unit fallback', () => {
    changeValue.value = getNeededTimeChange('month', 11.5)
    expect(useTimeAgo(changeTime).value).toBe('next year')
    expect(useTimeAgo(changeTime, { rounding: 'ceil' }).value).toBe('next year')
    expect(useTimeAgo(changeTime, { rounding: 'floor' }).value).toBe('in 11 months')
    expect(useTimeAgo(changeTime, { rounding: 1 }).value).toBe('in 0.9 year')
    expect(useTimeAgo(changeTime, { rounding: 3 }).value).toBe('in 0.945 year')
  })

  it('custom units', () => {
    changeValue.value = getNeededTimeChange('day', 14)
    expect(useTimeAgo(changeTime).value).toBe('in 2 weeks')
    expect(useTimeAgo(changeTime, {
      units: [
        { max: 60000, value: 1000, name: 'second' },
        { max: 2760000, value: 60000, name: 'minute' },
        { max: 72000000, value: 3600000, name: 'hour' },
        { max: 518400000 * 30, value: 86400000, name: 'day' },
        { max: 28512000000, value: 2592000000, name: 'month' },
        { max: Number.POSITIVE_INFINITY, value: 31536000000, name: 'year' },
      ],
    }).value).toBe('in 14 days')
  })
})
