---
category: Browser
---

# usePermission

> Reactive [Permissions API](https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API). The Permissions API provides the tools to allow developers to implement a better user experience as far as permissions are concerned.

## Usage

```js
import { usePermission } from '@vueuse/core'

const microphoneAccess = usePermission('microphone')
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
declare type DescriptorNamePolyfill = "clipboard-read" | "clipboard-write"
export declare type GeneralPermissionDescriptor =
  | PermissionDescriptor
  | DevicePermissionDescriptor
  | MidiPermissionDescriptor
  | PushPermissionDescriptor
  | {
      name: DescriptorNamePolyfill
    }
/**
 * Reactive Permissions API.
 *
 * @see   {@link https://vueuse.js.org/usePermission}
 * @param permissionDesc
 * @param options
 */
export declare function usePermission(
  permissionDesc:
    | GeneralPermissionDescriptor
    | GeneralPermissionDescriptor["name"],
  options?: ConfigurableNavigator
): Ref<"" | "denied" | "granted" | "prompt">
export {}
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/master/packages/core/usePermission/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/master/packages/core/usePermission/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/master/packages/core/usePermission/index.md)


<!--FOOTER_ENDS-->