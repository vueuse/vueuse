import { makeDialogComposable } from '@vueuse/core'

export interface PrefilledLoginForm {
  email?: string
}

export interface LoginFormResult {
  email: string
  password: string
}

export const useLoginDialog = makeDialogComposable<PrefilledLoginForm, LoginFormResult>()
