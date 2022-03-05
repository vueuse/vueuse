---
category: Browser
---

# usePreferredLanguages

Reactive [Navigator Languages](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/languages). It provides web developers with information about the user's preferred languages. For example, this may be useful to adjust the language of the user interface based on the user's preferred languages in order to provide better experience.

## Usage

```js
import { usePreferredLanguages } from '@vueuse/core'

const languages = usePreferredLanguages()
```

## Component Usage

```html
<UsePreferredLanguages v-slot="{ languages }">
  Preferred Languages: {{ languages }}
</UsePreferredLanguages>
```
