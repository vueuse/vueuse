import {
  WatchOptions,
  watch,
  WatchSource,
  isRef,
  ref,
  reactive,
} from "vue-demi";
import { promiseTimeout } from "../utils";

export interface WhenToMatchOptions {
  flush?: WatchOptions["flush"];
  timeout?: number;
  throwOnTimeout?: boolean;
}

export interface BaseWhenInstance<T> {
  toMatch(
    condition: (v: T) => boolean,
    options?: WhenToMatchOptions
  ): Promise<void>;
}

export interface RefWhenInstance<T> extends BaseWhenInstance<T> {
  readonly not: RefWhenInstance<T>;

  toBe<P>(value: P | T, options?: WhenToMatchOptions): Promise<void>;
  toBeTruthy(options?: WhenToMatchOptions): Promise<void>;
  toBeNull(options?: WhenToMatchOptions): Promise<void>;
  toBeUndefined(options?: WhenToMatchOptions): Promise<void>;
  toBeNaN(options?: WhenToMatchOptions): Promise<void>;
  changed(options?: WhenToMatchOptions): Promise<void>;
  changedTimes(n?: number, options?: WhenToMatchOptions): Promise<void>;
}
export interface RecordWhenInstance<T> extends BaseWhenInstance<T> {
  readonly not: RecordWhenInstance<T>;
}
export interface ArrayWhenInstance<T> extends BaseWhenInstance<T> {
  readonly not: ArrayWhenInstance<T>;

  toContain<P>(value: P, options?: WhenToMatchOptions): Promise<void>;
}

export function when<T>(r: WatchSource<T>): RefWhenInstance<T>;
export function when<T extends { [key: string]: unknown }>(
  r: T
): RecordWhenInstance<T>;
export function when<T extends unknown[]>(r: T): ArrayWhenInstance<T>;
export function when<T>(r: any): any {
  let isNot = false;

  function toMatch(
    condition: (v: T | object) => boolean,
    { flush = "sync", timeout, throwOnTimeout }: WhenToMatchOptions = {}
  ): Promise<void> {
    let stop: Function | null = null;
    const watcher = new Promise<void>((resolve) => {
      stop = watch(
        r,
        (v) => {
          if (condition(v) === !isNot) {
            stop?.();
            resolve();
          }
        },
        {
          flush,
          immediate: true,
        }
      );
    });

    const promises = [watcher];
    if (timeout) {
      promises.push(
        promiseTimeout(timeout, throwOnTimeout).finally(() => {
          stop?.();
        })
      );
    }

    return Promise.race(promises);
  }

  if (isRef(r)) {
    function toBe<P>(value: P | T, options?: WhenToMatchOptions) {
      return toMatch((v) => v === value, options);
    }

    function toBeTruthy(options?: WhenToMatchOptions) {
      return toMatch((v) => Boolean(v), options);
    }

    function toBeNull(options?: WhenToMatchOptions) {
      return toBe<null>(null, options);
    }

    function toBeUndefined(options?: WhenToMatchOptions) {
      return toBe<undefined>(undefined, options);
    }

    function toBeNaN(options?: WhenToMatchOptions) {
      return toMatch(Number.isNaN, options);
    }

    function changed(options?: WhenToMatchOptions) {
      return changedTimes(1, options);
    }

    function changedTimes(n = 1, options?: WhenToMatchOptions) {
      let count = -1; // skip the immediate check
      return toMatch(() => {
        count += 1;
        return count >= n;
      }, options);
    }

    return {
      toMatch,
      toBe,
      toBeTruthy,
      toBeNull,
      toBeNaN,
      toBeUndefined,
      changed,
      changedTimes,
      get not() {
        isNot = !isNot;
        return this;
      },
    };
  }

  if (Array.isArray(r)) {
    function toContain<P>(value: P, options?: WhenToMatchOptions) {
      return toMatch((v) => {
        const array = Array.from(v as any);
        return array.includes(value);
      }, options);
    }

    return {
      toMatch,
      toContain,
      get not() {
        isNot = !isNot;
        return this;
      },
    };
  }

  return {
    toMatch,
    get not() {
      isNot = !isNot;
      return this;
    },
  };
}
