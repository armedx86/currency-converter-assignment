import {
  differenceInMilliseconds,
  milliseconds,
  millisecondsToHours,
  millisecondsToMinutes,
  millisecondsToSeconds,
} from "date-fns";
import { memo, useCallback, useMemo, useState } from "react";
import { useGlobalTick } from "@/hooks/useGlobalTick";

const formatElapsedTime = (ms: number): string => {
  if (ms < 0) return "0s";
  if (ms < milliseconds({ minutes: 1 })) return `${millisecondsToSeconds(ms)}s`;
  if (ms < milliseconds({ hours: 1 })) return `${millisecondsToMinutes(ms)}m`;
  if (ms < milliseconds({ days: 1 })) return `${millisecondsToHours(ms)}h`;
  return `${Math.floor(millisecondsToHours(ms) / 24)}d`;
};

const TradeTime = memo(function TradeTime({ time }: { time: number }) {
  const [elapsedMs, setElapsedMs] = useState(0);

  const updateElapsedTime = useCallback(() => {
    setElapsedMs(differenceInMilliseconds(new Date(), time));
  }, [time]);

  useGlobalTick(updateElapsedTime);

  const formattedTime = useMemo(() => formatElapsedTime(elapsedMs), [elapsedMs]);

  return <>{formattedTime}</>;
});

export default TradeTime;
