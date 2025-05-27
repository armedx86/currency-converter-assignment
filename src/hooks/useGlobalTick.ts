import { useEffect, useRef } from "react";

let interval: ReturnType<typeof setInterval> | undefined;
const componentCallbacks = new Map<symbol, () => void>();

function intervalRunner() {
  for (const callback of componentCallbacks.values()) {
    callback();
  }
}

const GLOBAL_TICK_DELAY = 1000;

export function useGlobalTick(stateSetter: () => void) {
  const componentIdentityRef = useRef<symbol>(Symbol("useGlobalTick"));

  useEffect(() => {
    const componentIdentity = componentIdentityRef.current;

    stateSetter();
    componentCallbacks.set(componentIdentity, stateSetter);

    if (!interval) {
      interval = setInterval(intervalRunner, GLOBAL_TICK_DELAY);
    }

    return () => {
      if (componentCallbacks.has(componentIdentity)) {
        componentCallbacks.delete(componentIdentity);
      }
      if (componentCallbacks.size === 0) {
        clearInterval(interval);
        interval = undefined;
      }
    };
  }, [stateSetter]);
}
