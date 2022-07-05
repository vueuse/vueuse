---
category: Utilities
---

# useStepper

Provides helpers for building a multi-step wizard interface.

## Usage

```js
import { useStepper } from '@vueuse/core'

const {
  /** List of steps. */
  steps,
  /** List of step names. */
  stepNames,
  /** Index of the current step. */
  index,
  /** Current step. */
  current,
  /** Next step, or undefined if the current step is the last one. */
  next,
  /** Previous step, or undefined if the current step is the first one. */
  previous,
  /** Whether the current step is the first one. */
  isFirst,
  /** Whether the current step is the last one. */
  isLast,
  /** Go to the specified step. */
  goTo,
  /** Go to the next step. Does nothing if the current step is the last one. */
  goNext,
  /** Go to the previous step. Does nothing if the current step is the previous one. */
  goPrevious,
  /** Go back to the given step, only if the current step is after. */
  goBackTo,
  /** Checks whether the given step is the next step. */
  isNext,
  /** Checks whether the given step is the previous step. */
  isPrevious,
  /** Checks whether the given step is the current step. */
  isCurrent,
  /** Checks if the current step is before the given step. */
  isBefore,
  /** Checks if the current step is after the given step. */
  isAfter,
} = useStepper([
  'billing-address',
  'terms',
  'payment',
])
```
