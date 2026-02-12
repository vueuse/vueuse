---
category: '@Integrations'
---

# useFuse

Easily implement fuzzy search using a composable with [Fuse.js](https://github.com/krisk/fuse).

From the Fuse.js website:

> What is fuzzy searching?
>
> Generally speaking, fuzzy searching (more formally known as approximate string matching) is the technique of finding strings that are approximately equal to a given pattern (rather than exactly).

## Install Fuse.js as a peer dependency

### NPM

```bash
npm install fuse.js@^7
```

### Yarn

```bash
yarn add fuse.js
```

## Usage

```ts
import { useFuse } from '@vueuse/integrations/useFuse'
import { shallowRef } from 'vue'

const data = [
  'John Smith',
  'John Doe',
  'Jane Doe',
  'Phillip Green',
  'Peter Brown',
]

const input = shallowRef('Jhon D')

const { results } = useFuse(input, data)

/*
 * Results:
 *
 * { "item": "John Doe", "index": 1 }
 * { "item": "John Smith", "index": 0 }
 * { "item": "Jane Doe", "index": 2 }
 *
 */
```

## Type Declarations

```ts
export type FuseOptions<T> = IFuseOptions<T>
export interface UseFuseOptions<T> {
  fuseOptions?: FuseOptions<T>
  resultLimit?: number
  matchAllWhenSearchEmpty?: boolean
}
export declare function useFuse<DataItem>(
  search: MaybeRefOrGetter<string>,
  data: MaybeRefOrGetter<DataItem[]>,
  options?: MaybeRefOrGetter<UseFuseOptions<DataItem>>,
): {
  fuse: Ref<
    {
      search: <R = DataItem>(
        pattern: string | Expression,
        options?: FuseSearchOptions,
      ) => FuseResult<R>[]
      setCollection: (
        docs: readonly DataItem[],
        index?: FuseIndex<DataItem> | undefined,
      ) => void
      add: (doc: DataItem) => void
      remove: (predicate: (doc: DataItem, idx: number) => boolean) => DataItem[]
      removeAt: (idx: number) => void
      getIndex: () => FuseIndex<DataItem>
    },
    | Fuse<DataItem>
    | {
        search: <R = DataItem>(
          pattern: string | Expression,
          options?: FuseSearchOptions,
        ) => FuseResult<R>[]
        setCollection: (
          docs: readonly DataItem[],
          index?: FuseIndex<DataItem> | undefined,
        ) => void
        add: (doc: DataItem) => void
        remove: (
          predicate: (doc: DataItem, idx: number) => boolean,
        ) => DataItem[]
        removeAt: (idx: number) => void
        getIndex: () => FuseIndex<DataItem>
      }
  >
  results: ComputedRef<FuseResult<DataItem>[]>
}
export type UseFuseReturn = ReturnType<typeof useFuse>
```
