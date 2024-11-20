import { beforeEach } from 'vitest'
import './polyfillFetch'
import './polyfillPointerEvents'
import './polyfillIndexedDb'
import './polyfillMatchMedia'

beforeEach(() => {
  document.body.innerHTML = ''
  document.head.innerHTML = ''
})
