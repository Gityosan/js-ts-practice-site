type AnyFn = (...a: unknown[]) => unknown;

export function spy<F extends AnyFn>(impl?: F) {
  const calls: Parameters<F>[] = [];
  const fn = (...args: Parameters<F>) => {
    calls.push(args);
    return impl?.(...args) as ReturnType<F>;
  };
  return Object.assign(fn, { calls });
}
