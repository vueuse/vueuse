import { describe, expect } from 'vitest'
import { computed, ref } from 'vue'
import { useFavicon } from '.'

describe('useFavicon', () => {
  it('no param', () => {
    const favicon = useFavicon()
    expect(favicon.value).toEqual(null)
    favicon.value = 'https://www.google.at/favicon.ico'
    expect(favicon.value).toEqual('https://www.google.at/favicon.ico')
  })

  it('const', () => {
    const favicon = useFavicon('v1')
    expect(favicon.value).toEqual('v1')
    favicon.value = 'v2'
    expect(favicon.value).toEqual('v2')
  })

  it('null', () => {
    const favicon = useFavicon(null)
    expect(favicon.value).toEqual(null)
    favicon.value = 'v1'
    expect(favicon.value).toEqual('v1')
  })

  it('undefined', () => {
    const favicon = useFavicon(undefined)
    expect(favicon.value).toEqual(null)
    favicon.value = 'v1'
    expect(favicon.value).toEqual('v1')
  })

  it('ref const', () => {
    const tagetRef = ref('v1')
    const favicon = useFavicon(tagetRef)
    expect(favicon.value).toEqual('v1')
    tagetRef.value = 'v2'
    expect(favicon.value).toEqual('v2')
  })

  it('ref null', () => {
    const tagetRef = ref(null)
    const favicon = useFavicon(tagetRef)
    expect(favicon.value).toEqual(null)
  })

  it('ref undefined', () => {
    const favicon = useFavicon(ref(undefined))
    expect(favicon.value).toEqual(undefined)
  })

  it('computed/readonly', () => {
    const onoff = ref(1)
    const target = computed(() => onoff.value === 1 ? 'a.jpg' : 'b.jpg')
    const favicon = useFavicon(target)
    expect(favicon.value).toEqual('a.jpg')
    onoff.value = 2
    expect(favicon.value).toEqual('b.jpg')
    // favicon.value = '1'
  })

  it('function/readonly', () => {
    const target = () => 'a.jpg'
    const favicon = useFavicon(target)
    expect(favicon.value).toEqual('a.jpg')
    // favicon.value = '1'
  })
})
