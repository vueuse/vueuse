import { computed, ComputedRef, Ref, unref, warn } from "vue-demi"

type DurationUnits = 'Y' | 'M' | 'w' | 'd' | 'h' | 'm' | 's' | '甲子'

enum EUnits {
  SECOND = 1000,
  MINUTE = EUnits.SECOND * 60,
  HOUR = EUnits.MINUTE * 60,
  DAY = EUnits.HOUR * 24,
  WEEK = EUnits.DAY * 7,
  MONTH = EUnits.DAY * 30,
  YEAR = EUnits.DAY * 365
}

const Units: {
  [K in DurationUnits]: number
} = {
  'Y': EUnits.YEAR,
  'M': EUnits.MONTH,
  'w': EUnits.WEEK,
  'd': EUnits.DAY,
  'h': EUnits.HOUR,
  'm': EUnits.MINUTE,
  's': EUnits.SECOND,
  '甲子': EUnits.YEAR * 60
}
export function useDuration(duration: string, date: number): ComputedRef<Date>;
export function useDuration(duration: string, date: Date): ComputedRef<Date>
export function useDuration(duration: Ref<string>, date: Date): ComputedRef<Date>
export function useDuration(duration: Ref<string>, date: number): ComputedRef<Date>

export function useDuration(duration: string | Ref<string>, date: number | Date = Date.now()) {
  let durationTime = 0
  let units = Object.keys(Units)
  for (let dur of unref(duration).split(" ")) {
    let number = /[+-]?\d+/
    let numstr = number.test(dur) ? dur.match(number)![0] : ""
    if (numstr != "") {
      let timeValue = parseInt(numstr)
      let unit = dur.slice(numstr.length) as DurationUnits
      if (units.includes(unit)) {
        durationTime += timeValue * Units[unit]
      } else {
        warn(`unknow unit ${unit}`)
      }
    } else {
      warn(`can't process this time format: ${dur}`)
    }
  }
  let durDate = new Date()
  if (Number.isInteger(date)) {
    durDate.setTime((date as number) + durationTime)
  } else {
    let nowTime = (date as unknown as Date).getTime()
    durDate.setTime(nowTime + durationTime)
  }
  return computed(() => durDate)
}
