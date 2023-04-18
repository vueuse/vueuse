---
category: Utilities
---

# useStepper

Provides helpers for building a multi-step wizard interface.

## Usage

### Steps as array

```js
import { useStepper } from '@vueuse/core'

const {
  steps,
  stepNames,
  index,
  current,
  next,
  previous,
  isFirst,
  isLast,
  goTo,
  goToNext,
  goToPrevious,
  goBackTo,
  isNext,
  isPrevious,
  isCurrent,
  isBefore,
  isAfter,
} = useStepper([
  'billing-address',
  'terms',
  'payment',
])

// Access the step through `current`
console.log(current.value) // 'billing-address'
```

### Steps as object

```js
import { useStepper } from '@vueuse/core'

const {
  steps,
  stepNames,
  index,
  current,
  next,
  previous,
  isFirst,
  isLast,
  goTo,
  goToNext,
  goToPrevious,
  goBackTo,
  isNext,
  isPrevious,
  isCurrent,
  isBefore,
  isAfter,
} = useStepper({
  'user-information': {
    title: 'User information',
  },
  'billing-address': {
    title: 'Billing address',
  },
  'terms': {
    title: 'Terms',
  },
  'payment': {
    title: 'Payment',
  },
})

// Access the step object through `current`
console.log(current.value.title) // 'User information'
```
