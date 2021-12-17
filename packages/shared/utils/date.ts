export type UDate = Date | number | string | undefined

export interface ParsedMs {
  days: number
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
}

export const REGEX_PARSE = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/
export const REGEX_FORMAT = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g

export const padStart = (string: number, length: number, pad: string) => {
  const s = String(string)
  if (!s || s.length >= length) return string
  return `${Array((length + 1) - s.length).join(pad)}${string}`
}

export const parseDate = (date: UDate) => {
  if (date === undefined) return new Date()
  if (date instanceof Date) return new Date(date)
  if (typeof date === 'string' && !/Z$/i.test(date)) {
    const d = date.match(REGEX_PARSE) as any
    if (d) {
      const m = d[2] - 1 || 0
      const ms = (d[7] || '0').substring(0, 3)
      return new Date(d[1], m, d[3]
          || 1, d[4] || 0, d[5] || 0, d[6] || 0, ms)
    }
  }

  return new Date(date!)
}

export const parseMs = (milliseconds: number): ParsedMs => {
  return {
    days: Math.floor(milliseconds / 86400000),
    hours: Math.floor(milliseconds / 3600000) % 24,
    minutes: Math.floor(milliseconds / 60000) % 60,
    seconds: Math.floor(milliseconds / 1000) % 60,
    milliseconds: Math.floor(milliseconds) % 1000,
  }
}

export const formatDate = (parsedMs: ParsedMs, formatStr: string) => {
  const { days, hours, minutes, seconds, milliseconds } = parsedMs
  const matches: Record<string, string|number> = {
    D: String(days),
    DD: padStart(days, 2, '0'),
    H: String(hours),
    HH: padStart(hours, 2, '0'),
    h: padStart(hours % 12 || 12, 1, '0'),
    hh: padStart(hours % 12 || 12, 2, '0'),
    m: String(minutes),
    mm: padStart(minutes, 2, '0'),
    s: String(seconds),
    ss: padStart(seconds, 2, '0'),
    SSS: padStart(milliseconds, 3, '0'),
  }
  return formatStr.replace(REGEX_FORMAT, (match, $1) => $1 || matches[match])
}
