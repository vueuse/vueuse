/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import Vue from 'vue'

export function createGlobalState<T>(
  factory: () => T,
) {
  let state: T

  const vm = new Vue({
    setup() {
      state = factory()
      return { state }
    },
  })

  return () => state
}
