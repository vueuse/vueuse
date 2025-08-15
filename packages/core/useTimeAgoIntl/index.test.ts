import { describe, expect, it } from 'vitest'
import { shallowRef } from 'vue'
import { formatTimeAgoIntl, formatTimeAgoIntlParts, useTimeAgoIntl } from './index'

describe('formatTimeAgoIntlParts', () => {
  it('should format without spaces by default', () => {
    const parts1: Intl.RelativeTimeFormatPart[] = [
      { type: 'integer', value: '5', unit: 'day' },
      { type: 'literal', value: ' days' },
    ]

    expect(formatTimeAgoIntlParts(parts1)).toEqual('5 days')

    const parts2: Intl.RelativeTimeFormatPart[] = [
      { type: 'integer', value: '5', unit: 'day' },
      { type: 'literal', value: '天后' },
    ]
    expect(formatTimeAgoIntlParts(parts2)).toEqual('5天后')
  })

  it('should format with spaces if insertSpace is true', () => {
    const parts1: Intl.RelativeTimeFormatPart[] = [
      { type: 'integer', value: '5', unit: 'day' },
      { type: 'literal', value: ' days' },
    ]

    expect(formatTimeAgoIntlParts(parts1, true)).toEqual('5 days')

    const parts2: Intl.RelativeTimeFormatPart[] = [
      { type: 'integer', value: '5', unit: 'day' },
      { type: 'literal', value: '天后' },
    ]

    expect(formatTimeAgoIntlParts(parts2, true)).toEqual('5 天后')
  })
})

describe('formatTimeAgoIntl', () => {
  it('should format a past timestamp', () => {
    const now = Date.now()
    const past = new Date(now - 1000 * 60 * 5)

    expect(formatTimeAgoIntl(past, {}, now)).toMatch('5')
    expect(formatTimeAgoIntl(past, { locale: 'en' }, now)).toEqual('5 minutes ago')
    expect(formatTimeAgoIntl(past, { locale: 'zh' }, now)).toEqual('5 分钟前')
  })

  it('should format a future timestamp', () => {
    const now = Date.now()
    const future = new Date(now + 1000 * 60 * 5)

    expect(formatTimeAgoIntl(future, { locale: 'en' }, now)).toEqual('in 5 minutes')
  })
})

describe('useTimeAgoIntl', () => {
  it('should compute a reactive timeAgo string', () => {
    const now = Date.now()
    const past = shallowRef(now - 1000 * 60 * 5)

    const timeAgo = useTimeAgoIntl(past)

    expect(timeAgo.value).toMatch('5')
  })
})
