import { setSSRHandler } from '@vueuse/core'
import { defineNuxtPlugin, useCookie, useHead } from '#imports'

setSSRHandler('getDefaultStorage', () => {
  const cookieMap = new Map()
  const get = (key) => {
    if (!cookieMap.get(key))
      cookieMap.set(key, useCookie(key, { maxAge: 2147483646 }))
    return cookieMap.get(key)
  }
  return {
    getItem: key => get(key).value,
    setItem: (key, value) => get(key).value = value,
    removeItem: key => get(key).value = undefined,
  }
})

if (process.server) {
  setSSRHandler('updateHTMLAttrs', (selector, attr, value) => {
    if (selector === 'html') {
      useHead({
        htmlAttrs: {
          [attr]: value,
        },
      })
    }
    else if (selector === 'body') {
      useHead({
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

export default defineNuxtPlugin(() => { })
