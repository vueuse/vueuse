export * from "./is";
export * from "./filters";
export * from "./types";

export function promiseTimeout(
  ms: number,
  throwOnTimeout = false,
  reason = "Timeout"
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (throwOnTimeout) setTimeout(() => reject(reason), ms);
    else setTimeout(resolve, ms);
  });
}

export function invoke<T>(fn: () => T): T {
  return fn();
}

interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

const todo: Todo = {
  title: "string",
  description: "string",
  completed: true,
};

interface A {
  [key: string]: unknown;
}

function a(arg: { [key: string]: unknown }) {
  return undefined;
}

a(todo);
