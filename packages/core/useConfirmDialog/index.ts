/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Ref,
} from 'vue-demi'
import { createEventHook } from '@vueuse/core'

export function useConfirmDialog(show: Ref<boolean>, fn: Function) {
  const confirmHook = createEventHook<any>()
  const cancelHook = createEventHook<any>()

  let onResolve: Function
  let onReject: Function
  let promise: Promise<any>

  const showDialog = () => {
    promise = new Promise((resolve, reject) => {
      onResolve = resolve
      onReject = reject
    })
    show.value = true
    fn()
    return promise
  }
  const confirm = (data = {}) => {
    show.value = false
    onResolve(true)
    confirmHook.trigger(data)
  }
  const cancel = (error = {}) => {
    show.value = false
    onReject(error)
    cancelHook.trigger(error)
  }
  // const onConfirm = (callback: Function) => {
  //   return confirmHook.on(callback)
  // }
  // const onReject = (callback: Function) => {
  //   callback()
  // }
  return { showDialog, confirm, cancel, onConfirm: confirmHook.on, onCancel: cancelHook.on }
}
