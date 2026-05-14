import type { EventBusEvents, EventBusIdentifier } from './index'

export const events = /* @__PURE__ */ new Map<EventBusIdentifier<any>, EventBusEvents<any>>()
