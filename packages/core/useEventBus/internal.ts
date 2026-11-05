import type { EventBusEvents, EventBusIdentifier } from './index'

export const events = new Map<EventBusIdentifier<any>, EventBusEvents<any>>()
