---
category: Time
---

# useTimeAgoIntl

Reactive time ago with i18n supported. Automatically update the time ago string when the time changes. Powered by `Intl.RelativeTimeFormat`.

## Usage

```js
import { useTimeAgoIntl } from '@vueuse/core'

const timeAgoIntl = useTimeAgoIntl(new Date(2021, 0, 1))
```

## Non-Reactivity Usage

In case you don't need the reactivity, you can use the `formatTimeAgo` function to get the formatted string instead of a Ref.

```js
import { formatTimeAgoIntl } from '@vueuse/core'

const timeAgoIntl = formatTimeAgoIntl(new Date(2021, 0, 1)) // string
```
