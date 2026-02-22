import { describe, expect, it } from 'vitest'
import { createDisposableDirective } from './index'

describe('createDisposableDirective', () => {
  it('should return disposable direactive', () => {
    const direactive = {
      mounted() {

      },
    }
    const VDirective = createDisposableDirective(direactive)
    expect(VDirective).haveOwnProperty('mounted')
    expect(VDirective).haveOwnProperty('unmounted')
  })

  it('should return normal direactive', () => {
    const direactive = {
      mounted() {

      },
    }
    const VDirective = createDisposableDirective(direactive)
    expect(VDirective).haveOwnProperty('mounted')
  })

  it('simple directive', () => {
    const direactive = () => {
    }
    const VDirective = createDisposableDirective(direactive)
    expect(VDirective).haveOwnProperty('mounted')
    expect(VDirective).haveOwnProperty('updated')
  })
})
