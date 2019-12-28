# useNetwork

> The [Network Information API](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API) provides information about the system's connection in terms of general connection type (e.g., 'wifi', 'cellular', etc.). This can be used to select high definition content or low definition content based on the user's connection. The entire API consists of the addition of the NetworkInformation interface and a single property to the Navigator interface: Navigator.connection.

## Usage

```js
import { useNetwork } from 'vue-use-web'

const { isOnline, offlineAt, downlink, downlinkMax, effectiveType, saveData, type } = useNetwork()
```

| State         | Type                 | Description                                 |
| ------------- | -------------------- | ------------------------------------------- |
| isOnline      | `boolean`            | If the user is currently connected.         |
| offlineAt     | `Date | undefined`   | The time since the user was last connected. |
| downlink      | `Number | undefined` | The download speed in Mbps.                 |
| downlinkMax   | `Number | undefined` | The max reachable download speed in Mbps.   |
| effectiveType | `string | undefined` | The detected effective speed type.          |
| saveData      | `boolean| undefined` | If the user activated data saver mode.      |
| type          | `string | undefined` | The detected connection/network type.       |
