import type { EventBusEvents, EventBusIdentifier, EventBusSpecialEvents } from '.'

/* #__PURE__ */
export const events = new Map<EventBusIdentifier<any>, EventBusEvents<any>>()
export const specialEvents: EventBusSpecialEvents = new Map()
