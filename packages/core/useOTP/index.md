---
category: Browser
---

# useOTPAutoFill

Composable for automatically fetching and managing OTP (One-Time Password) using the OTPCredentials API.

## Usage

```js
import { useOTP } from '@vueuse/core'

const { otp, fetchOTP } = useOTPAutoFill()
```

## Component Usage

```vue
<template>
  <p class="mb-2">
    Autofill OTP will trigger if supported by your browser.
  </p>
  <div>OTP: <span>{{ otp ? `OTP: ${otp}` : 'Waiting for OTP...' }}</span></div>
  <button @click="fetchOTP">
    Fetch OTP
  </button>
</template>
```
