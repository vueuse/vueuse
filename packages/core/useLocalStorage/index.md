---
category: State
---

# useLocalStorage

> Reactive [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage). 

## Usage

Please refer to `useStorage`


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export declare function useLocalStorage(
  key: string,
  defaultValue: string,
  options?: StorageOptions
): Ref<string>
export declare function useLocalStorage(
  key: string,
  defaultValue: boolean,
  options?: StorageOptions
): Ref<boolean>
export declare function useLocalStorage(
  key: string,
  defaultValue: number,
  options?: StorageOptions
): Ref<number>
export declare function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  options?: StorageOptions
): Ref<T>
export declare function useLocalStorage<T = unknown>(
  key: string,
  defaultValue: null,
  options?: StorageOptions
): Ref<T>
```

## Source

[Source](https://github.com/antfu/vueuse/blob/master/packages/core/useLocalStorage/index.ts) • [Docs](https://github.com/antfu/vueuse/blob/master/packages/core/useLocalStorage/index.md)


<!--FOOTER_ENDS-->