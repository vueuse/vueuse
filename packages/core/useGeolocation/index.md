---
category: Sensors
---

<!--DEMO_STARTS-->
<script setup>
import Demo from './demo.vue'
</script>
<DemoContainer><Demo/></DemoContainer>
<!--DEMO_ENDS-->

<!--HEAD_STARTS--><!--HEAD_ENDS-->


# useGeolocation

> Reactive [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API). It allows the user to provide their location to web applications if they so desire. For privacy reasons, the user is asked for permission to report location information.

## Usage

```js
import { useGeolocation } from '@vueuse/core'

const { coords, locatedAt, error } = useGeolocation()
```

| State     | Type                                                                          | Description                                                              |
| --------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| coords    | [`Coordinates`](https://developer.mozilla.org/en-US/docs/Web/API/Coordinates) | information about the position retrieved like the latitude and longitude |
| locatedAt | `Date`                                                                        | The time of the last geolocation call                                    |
| error     | `string`                                                                      | An error message in case geolocation API fails.                          |

## Config

`useGeolocation` function takes [PositionOptions](https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions) object as an optional parameter.


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export interface GeolocationOptions
  extends Partial<PositionOptions>,
    ConfigurableNavigator {}
/**
 * Reactive Geolocation API.
 *
 * @see   {@link https://vueuse.js.org/useGeolocation}
 * @param options
 */
export declare function useGeolocation(
  options?: GeolocationOptions
): {
  isSupported: boolean | undefined
  coords: Ref<GeolocationCoordinates>
  locatedAt: Ref<number | null>
  error: Ref<{
    readonly code: number
    readonly message: string
    readonly PERMISSION_DENIED: number
    readonly POSITION_UNAVAILABLE: number
    readonly TIMEOUT: number
  } | null>
}
```

## Source

[Source](https://github.com/antfu/vueuse/blob/master/packages/core/useGeolocation/index.ts) • [Demo](https://github.com/antfu/vueuse/blob/master/packages/core/useGeolocation/demo.vue) • [Docs](https://github.com/antfu/vueuse/blob/master/packages/core/useGeolocation/index.md)


<!--FOOTER_ENDS-->