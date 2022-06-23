---
category: Utilities
related:
  - useDialog
---

# makeDialogComposable

Creates a composable for a specific dialog interface. Useful for defining multiple, different dialogs with their own typings.

## Usage

```ts
// dialogs.ts
import { makeDialogComposable } from '@vueuse/core'

// This is the arguments you can give to `reveal`.
// They will be available in the `properties`
// ref and in the `on.reveal` hook.
interface PrefilledLoginForm {
  email?: string
}

// This is the arguments you can give to `close`.
// They will be available as the return value
// of `reveal` or in the `on.close` hook.
interface LoginFormResult {
  email: string
  password: string
}

export const useLoginDialog = makeDialogComposable<PrefilledLoginForm, LoginFormResult>()
```
