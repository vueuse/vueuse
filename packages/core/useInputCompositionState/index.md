---
category: State
---

# useInputCompositionState

The compositionstart event is fired when a text composition system such as an input method editor starts a new composition session.

For example, this state change could be fired after a user starts entering a Chinese character using a Pinyin

## Usage

```js
import { useInputCompositionState } from '@vueuse/core'

const state = useInputCompositionState()
```
