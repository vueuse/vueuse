import { reactive } from 'vue-demi'

interface recordInfoType {
  TTI: any[]
  LCP?: number | undefined
  FCP?: number | undefined
  CLS?: number
  FP?: number | undefined
  FLP?: number | undefined
  lookup?: number | undefined
  receiving?: number | undefined
  parsing?: number | undefined
  contentLoaded?: number | undefined
  redirect?: number | undefined
  ttfb?: number | undefined
  loadEvent?: number | undefined
  appcache?: number | undefined
  unloadEvent?: number | undefined
  connect?: number | undefined
  clear?: () => void
  [key: string]: any
}

/**
 * Reactive state to show whether mouse leaves the page.
 *
 * @see https://vueuse.org/usePerformanceRecorder
 * @param options
 */
window._vueuse__performance__observer = null

export function usePerformanceRecorder() {
  const detail = reactive<recordInfoType>({
    TTI: [],
    LCP: 0,
    CLS: 0,
  })
  function computPerformanceInfo(entry: PerformanceEntry) {
    const referTiming = performance.timing
    detail.lookup = referTiming.domainLookupEnd - referTiming.domainLookupStart
    detail.receiving = referTiming.responseEnd - referTiming.requestStart
    detail.parsing = referTiming.domComplete - referTiming.domLoading
    detail.contentLoaded = referTiming.loadEventEnd - referTiming.navigationStart
    detail.redirect = referTiming.redirectStart - referTiming.redirectEnd
    detail.ttfb = referTiming.responseStart - referTiming.navigationStart
    detail.loadEvent = referTiming.loadEventEnd - referTiming.loadEventStart
    detail.appcache = referTiming.domainLookupStart - referTiming.fetchStart
    detail.unloadEvent = referTiming.unloadEventEnd - referTiming.unloadEventStart
    detail.connect = referTiming.connectEnd - referTiming.connectStart
    if (entry.name === 'first-paint')
      detail.FP = entry.startTime
    else if (entry.name === 'first-contentful-paint')
      detail.FCP = entry.startTime
    else if (entry.entryType === 'longtask')
      detail.TTI.push(entry)
    else if (entry.entryType === 'layout-shift')
      detail.CLS += entry?.value
    else if (entry.entryType === 'largest-contentful-paint')
      detail.LCP = entry.renderTime || entry.startTime
  }
  window._vueuse__performance__observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries())
      computPerformanceInfo(entry)
  })
  window._vueuse__performance__observer.observe({ entryTypes: ['longtask', 'frame', 'navigation', 'measure', 'paint', 'largest-contentful-paint', 'layout-shift'], buffer: true })
  detail.clear = () => {
    window._vueuse__performance__observer?.disconnect()
    window._vueuse__performance__observer = null
  }
  return detail
}
