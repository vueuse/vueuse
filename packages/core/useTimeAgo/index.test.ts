import { timestamp } from '@vueuse/shared'
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

function getNeededTimeChange(type: TimeUnit, count: number, adjustSecond?: number) {
  const unit = UNITS.find(i => i.name === type)
  return (unit?.value || 0) * count + (adjustSecond || 0) * 1000
}

describe('useTimeAgo', () => {
  let baseTime: number
  const changeValue = ref(0)
  let changeTime: ComputedRef<number>

  beforeEach(() => {
    vi.useFakeTimers()
    baseTime = timestamp()
    vi.setSystemTime(baseTime)
    changeValue.value = 0
    changeTime = computed(() => baseTime + changeValue.value)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('just now', () => {
    test('just now', () => {
      expect(useTimeAgo(baseTime).value).toBe('just now')
    })
  })

  describe('second', () => {
    test('future: less than 1 minute', () => {
      changeValue.value = getNeededTimeChange('minute', 1, -1)
      expect(useTimeAgo(changeTime).value).toBe('just now')
    })

    test('future: less than 1 minute/ with showSecond', () => {
      changeValue.value = getNeededTimeChange('minute', 1, -1)
      expect(useTimeAgo(changeTime, { showSecond: true }).value).toBe('in 59 seconds')
    })

    test('past: less than 1 minute', () => {
      changeValue.value = -getNeededTimeChange('minute', 1, -1)
      expect(useTimeAgo(changeTime).value).toBe('just now')
    })

    test('past: less than 1 minute/ with showSecond', () => {
      changeValue.value = -getNeededTimeChange('minute', 1, -1)
      expect(useTimeAgo(changeTime, { showSecond: true }).value).toBe('59 seconds ago')
    })
  })

  describe('minute', () => {
    test('future: 1 minute', () => {
      changeValue.value = getNeededTimeChange('minute', 1)
      expect(useTimeAgo(changeTime).value).toBe('in 1 minute')
    })

    test('past:  1 minute', () => {
      changeValue.value = -getNeededTimeChange('minute', 1)
      expect(useTimeAgo(changeTime).value).toBe('1 minute ago')
    })

    test('future: 10 minutes', () => {
      changeValue.value = getNeededTimeChange('minute', 10)
      expect(useTimeAgo(changeTime).value).toBe('in 10 minutes')
    })

    test('past:  10 minutes', () => {
      changeValue.value = -getNeededTimeChange('minute', 10)
      expect(useTimeAgo(changeTime).value).toBe('10 minutes ago')
    })
  })

  describe('hour', () => {
    test('future: 1 hour', () => {
      changeValue.value = getNeededTimeChange('hour', 1)
      expect(useTimeAgo(changeTime).value).toBe('in 1 hour')
    })

    test('past:  1 hour', () => {
      changeValue.value = -getNeededTimeChange('hour', 1)
      expect(useTimeAgo(changeTime).value).toBe('1 hour ago')
    })

    test('future: 10 hours', () => {
      changeValue.value = getNeededTimeChange('hour', 10)
      expect(useTimeAgo(changeTime).value).toBe('in 10 hours')
    })

    test('past:  10 hours', () => {
      changeValue.value = -getNeededTimeChange('hour', 10)
      expect(useTimeAgo(changeTime).value).toBe('10 hours ago')
    })
  })

  describe('day', () => {
    test('future: 1 day', () => {
      changeValue.value = getNeededTimeChange('day', 1)
      expect(useTimeAgo(changeTime).value).toBe('tomorrow')
    })

    test('past:  1 day', () => {
      changeValue.value = -getNeededTimeChange('day', 1)
      expect(useTimeAgo(changeTime).value).toBe('yesterday')
    })

    test('future: 3 days', () => {
      changeValue.value = getNeededTimeChange('day', 3)
      expect(useTimeAgo(changeTime).value).toBe('in 3 days')
    })

    test('past:  3 days', () => {
      changeValue.value = -getNeededTimeChange('day', 3)
      expect(useTimeAgo(changeTime).value).toBe('3 days ago')
    })
  })

  describe('week', () => {
    test('future: 1 week', () => {
      changeValue.value = getNeededTimeChange('week', 1)
      expect(useTimeAgo(changeTime).value).toBe('next week')
    })

    test('past:  1 week', () => {
      changeValue.value = -getNeededTimeChange('week', 1)
      expect(useTimeAgo(changeTime).value).toBe('last week')
    })

    test('future: 3 weeks', () => {
      changeValue.value = getNeededTimeChange('week', 3)
      expect(useTimeAgo(changeTime).value).toBe('in 3 weeks')
    })

    test('past:  3 weeks', () => {
      changeValue.value = -getNeededTimeChange('week', 3)
      expect(useTimeAgo(changeTime).value).toBe('3 weeks ago')
    })
  })

  describe('month', () => {
    test('future: 1 month', () => {
      changeValue.value = getNeededTimeChange('month', 1)
      expect(useTimeAgo(changeTime).value).toBe('next month')
    })

    test('past:  1 month', () => {
      changeValue.value = -getNeededTimeChange('month', 1)
      expect(useTimeAgo(changeTime).value).toBe('last month')
    })

    test('future: 3 months', () => {
      changeValue.value = getNeededTimeChange('month', 3)
      expect(useTimeAgo(changeTime).value).toBe('in 3 months')
    })

    test('past:  3 months', () => {
      changeValue.value = -getNeededTimeChange('month', 3)
      expect(useTimeAgo(changeTime).value).toBe('3 months ago')
    })
  })

  describe('year', () => {
    test('future: 1 year', () => {
      changeValue.value = getNeededTimeChange('year', 1)
      expect(useTimeAgo(changeTime).value).toBe('next year')
    })

    test('past:  1 year', () => {
      changeValue.value = -getNeededTimeChange('year', 1)
      expect(useTimeAgo(changeTime).value).toBe('last year')
    })

    test('future: 3 years', () => {
      changeValue.value = getNeededTimeChange('year', 3)
      expect(useTimeAgo(changeTime).value).toBe('in 3 years')
    })

    test('past:  3 years', () => {
      changeValue.value = -getNeededTimeChange('year', 3)
      expect(useTimeAgo(changeTime).value).toBe('3 years ago')
    })
  })
})
