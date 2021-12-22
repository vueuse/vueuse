import { setSSRHandler } from '@vueuse/core'
import { useMeta } from '#meta'
import { useCookie } from '#app'

setSSRHandler('getDefaultStorage', () => {
  const cookieMap = new Map()
  return {
    getItem: (key) => {
      if (!cookieMap.get(key))
        cookieMap.set(key, useCookie(key))
      return cookieMap.get(key).value
    },
    setItem: (key, value) => {
      if (!cookieMap.get(key))
        cookieMap.set(key, useCookie(key))
      cookieMap.get(key).value = value
    },
    removeItem: (key) => {
      if (!cookieMap.get(key))
        cookieMap.set(key, useCookie(key))
      cookieMap.get(key).value = undefined
    },
  }
})

if (process.server) {
  setSSRHandler('updateHTMLAttrs', (selector, attr, value) => {
    if (selector === 'html') {
      useMeta({
        htmlAttrs: {
          [attr]: value,
        },
      })
    }
    else if (selector === 'body') {
      useMeta({
        bodyAttrs: {
          [attr]: value,
        },
      })
    }
    else {
      throw new Error(`Unsupported meta selector "${selector}" in SSR`)
    }
  })
}

export default () => {}
