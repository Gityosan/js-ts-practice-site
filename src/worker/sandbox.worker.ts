import { deepEqual } from "../core/deepEqual";
import { spy } from "../core/spy";

type IoMessage = {
  type: "io";
  code: string;
  entry: string;
  cases: Array<{
    input: unknown[];
    expected: unknown;
    epsilon?: number;
    unordered?: boolean;
  }>;
};

type StateMessage = {
  type: "state";
  code: string;
  setupCode: string;
  assertsCode: Array<{ label: string; checkCode: string }>;
};

type WorkerMessage = IoMessage | StateMessage;

const sandboxEnv = { spy, deepEqual };
const sandboxKeys = Object.keys(sandboxEnv);
const sandboxVals = Object.values(sandboxEnv);

function evalInSandbox<T>(fnBody: string): T {
  return new Function(...sandboxKeys, `"use strict"; return (${fnBody})`)(...sandboxVals) as T;
}

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const msg = e.data;

  const timeoutId = setTimeout(() => {
    self.postMessage({ type: "timeout" });
    self.close();
  }, 5000);

  try {
    if (msg.type === "io") {
      const fn = evalInSandbox<(...args: unknown[]) => unknown>(
        `(function(){ ${msg.code}\n return ${msg.entry}; })()`,
      );

      const results = msg.cases.map((c, index) => {
        try {
          const output = fn(...c.input);
          const passed = deepEqual(output, c.expected, {
            epsilon: c.epsilon ?? 1e-9,
            unordered: c.unordered,
          });
          return { index, passed, output };
        } catch (err: unknown) {
          return { index, passed: false, error: (err as Error).message };
        }
      });

      clearTimeout(timeoutId);
      self.postMessage({ type: "io-result", results });
    } else if (msg.type === "state") {
      const setupFn = evalInSandbox<() => Record<string, unknown>>(msg.setupCode);
      const scope = setupFn();

      const scopeKeys = Object.keys(scope);
      const scopeVals = Object.values(scope);
      new Function(...scopeKeys, `"use strict";\n${msg.code}`)(...scopeVals);

      const results = msg.assertsCode.map(({ label, checkCode }, index) => {
        try {
          const checkFn = evalInSandbox<(scope: Record<string, unknown>) => boolean>(checkCode);
          const passed = checkFn(scope);
          return { index, label, passed };
        } catch (err: unknown) {
          return { index, label, passed: false, error: (err as Error).message };
        }
      });

      clearTimeout(timeoutId);
      self.postMessage({ type: "state-result", results });
    }
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    self.postMessage({ type: "error", error: (err as Error).message });
  }
};
