import { computed, reactive } from 'vue-demi'

interface recordInfoType {
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
}
/**
 * Reactive state to show whether mouse leaves the page.
 *
 * @see https://vueuse.org/usePerformanceRecorder
 * @param options
 */

export function usePerformanceRecorder() {
  const referTiming = reactive(performance.timing)
  const recorderInfo = computed(() => {
    const detail: recordInfoType = {}
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
    return detail
  })

  return recorderInfo
}
