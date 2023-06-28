// polyfill for jsdom (https://github.com/jsdom/jsdom/pull/2666)
if (!globalThis.PointerEvent) {
  class PointerEvent extends MouseEvent {
    public pointerId?: number

    constructor(type: string, params: PointerEventInit = {}) {
      super(type, params)
      this.pointerId = params.pointerId
    }
  }
  globalThis.PointerEvent = PointerEvent as any
}

export {}
