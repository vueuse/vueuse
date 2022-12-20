---
category: Utilities
---

# useExpiringRef

Create a ref that timeout itself, with the ability to reset it at need

## Usage

```ts
import { useExpiringRef } from '@vueuse/core'

const [expiringRef, setRefTimeout] = useExpiringRef<string>(3_000)

expiringRef.value = 'foo'
setTimeout(() => {
  console.log(expiringRef.value === undefined) // True
}, 4_000)

expiringRef.value = 'bar'
setRefTimeout(10_000)
```

## useAsyncExpiringRef

Create an expiring ref, that auto generates itself on access. The async-expiring-ref is based on a function that provides a value and its timeout. If the value expired, the function will retrigger on the next access

### Usage

```ts
import { useAsyncExpiringRef } from '@vueuse/core'

const expiringAsyncRef = useAsyncExpiringRef(async () => {
  const asyncOperation = await doStuff()
  return [asyncOperation.result, asyncOperation.expiryMs]
})(async () => {
  const firstValue = await expiringAsyncRef.value

  await waitSomeTime()
  const currentValue = await expiringAsyncRef.value
  console.log(currentValue === firstValue) // True

  await waitEnoughTime()
  const secondValue = await expiringAsyncRef.value
  console.log(secondValue !== firstValue) // True
})()
```

### Usecase

```ts
import { useAsyncExpiringRef } from '@vueuse/core'

async function createJWT(): Promise<[string, int]> {
  const tokenResult = await fetch('/generate-jwt').then(res => res.text())
  return [tokenResult.token, tokenResult.expiry]
}

async function doStuffWithTheToken() {
  const token = await tokenAsyncRef.value
  doStuffWithToken(token)
}
```
