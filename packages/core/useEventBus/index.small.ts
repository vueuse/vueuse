import { tryOnUnmounted } from '@vueuse/shared'

/*
 * @Author: Mr.Mao
 * @Date: 2021-08-01 09:22:24
 * @LastEditTime: 2021-08-01 09:51:48
 * @Description:
 * @LastEditors: Mr.Mao
 * @autograph: 任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
 */
export type OffCallBack = () => void
export type EventBusListener<T = any> = (event: T) => void
export type EventBusEvents = { busKey: symbol; listener: EventBusListener }[]
export interface EventBusKey<T> extends Symbol { }
export type EventBusType<T = any> = EventBusKey<T> | string | number

const all = new Map<EventBusType, EventBusEvents>()

export function useEventBus<T>(eventKey: EventBusType<T>) {
  const busKey = Symbol('ww')

  function on(listener: EventBusListener<T>) {
    const listeners = all.get(eventKey) || []
    listeners.push({ busKey, listener })
    all.set(eventKey, listeners)
    return () => off(listener)
  }

  function off(listener?: EventBusListener<T>) {
    if (typeof listener === 'undefined') {
      const listeners = all.get(eventKey) || []
      ;[...listeners].forEach(v => (v.busKey === busKey && off(v.listener)))
    }
    else {
      const listeners = all.get(eventKey)
      if (!listeners) return
      listeners.splice(listeners.findIndex(v => v.listener === listener), 1)
    }
  }

  function emit(event: T) {
    all.get(eventKey)?.forEach(v => v.listener(event))
  }

  tryOnUnmounted(off)

  return { on, off, emit }
}
