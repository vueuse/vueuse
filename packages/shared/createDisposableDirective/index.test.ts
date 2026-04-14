import { describe, expect, it } from 'vitest'
import { createDisposableDirective } from './index'

describe('createDisposableDirective', () => {
  it('should return disposable directive', () => {
    const directive = {
      mounted() {

      },
    }
    const VDirective = createDisposableDirective(directive)
    expect(VDirective).haveOwnProperty('mounted')
    expect(VDirective).haveOwnProperty('unmounted')
  })

  it('should return normal directive', () => {
    const directive = {
      mounted() {

      },
    }
    const VDirective = createDisposableDirective(directive)
    expect(VDirective).haveOwnProperty('mounted')
  })

  it('simple directive', () => {
    const directive = () => {
    }
    const VDirective = createDisposableDirective(directive)
    expect(VDirective).haveOwnProperty('mounted')
    expect(VDirective).haveOwnProperty('updated')
  })
})
