# Geolocation

> The [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) allows the user to provide their location to web applications if they so desire. For privacy reasons, the user is asked for permission to report location information.

## State

The `useGeolocation` function exposes the following reactive state:

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
