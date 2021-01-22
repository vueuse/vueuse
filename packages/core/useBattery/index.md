---
category: Sensors
---

# useBattery

Reactive [Battery Status API](https://developer.mozilla.org/en-US/docs/Web/API/Battery_Status_API), more often referred to as the Battery API, provides information about the system's battery charge level and lets you be notified by events that are sent when the battery level or charging status change. This can be used to adjust your app's resource usage to reduce battery drain when the battery is low, or to save changes before the battery runs out in order to prevent data loss.

## Usage

```js
import { useBattery } from '@vueuse/core'

const { isCharging, chargingTime, dischargingTime, level } = useBattery()
```

| State           | Type      | Description                                                       |
| --------------- | --------- | ----------------------------------------------------------------- |
| charging        | `Boolean` | If the device is currently charging.                              |
| chargingTime    | `Number`  | The number of seconds until the device becomes fully charged.     |
| dischargingTime | `Number`  | The number of seconds before the device becomes fully discharged. |
| level           | `Number`  | A number between 0 and 1 representing the current charge level.   |

## Use-cases

Our applications normally are not empathetic to battery level, we can make a few adjustments to our applications that will be more friendly to low battery users.

- Trigger a special "dark-mode" battery saver theme settings.
- Stop auto playing videos in news feeds.
- Disable some background workers that are not critical.
- Limit network calls and reduce CPU/Memory consumption.


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export interface BatteryManager extends EventTarget {
  charging: boolean
  chargingTime: number
  dischargingTime: number
  level: number
}
/**
 * Reactive Battery Status API.
 *
 * @see   {@link https://vueuse.js.org/useBattery}
 * @param options
 */
export declare function useBattery({
  navigator,
}?: ConfigurableNavigator): {
  isSupported: boolean | undefined
  charging: Ref<boolean>
  chargingTime: Ref<number>
  dischargingTime: Ref<number>
  level: Ref<number>
}
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/master/packages/core/useBattery/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/master/packages/core/useBattery/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/master/packages/core/useBattery/index.md)


<!--FOOTER_ENDS-->