"use client";

import { useCalculatorStore } from "@/store/store";
import { useMemo } from "react";
import TradeTime from "./trade-time/TradeTime";

const MAX_HISTORY_LENGTH = 5;

export default function ConversionHistory() {
  const conversionHistory = useCalculatorStore((state) => state.conversionHistory);

  const truncatedConversionHistory = useMemo(
    () => conversionHistory.slice(0, MAX_HISTORY_LENGTH),
    [conversionHistory],
  );

  return truncatedConversionHistory.length == 0 ? (
    <p className="text-th-fgd-3">No conversion history available.</p>
  ) : (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Time</th>
            <th>From</th>
            <th>Amount</th>
            <th>To</th>
            <th>Converted Amount</th>
          </tr>
        </thead>
        <tbody>
          {truncatedConversionHistory.map((conversion) => {
            return (
              <tr key={conversion.timestamp}>
                <td>
                  <TradeTime time={conversion.timestamp} />
                </td>
                <td>{conversion.inputSymbol}</td>
                <td>{Number(Number(conversion.inputAmount).toFixed(4))}</td>
                <td>{conversion.outputSymbol}</td>
                <td>{Number(Number(conversion.outputAmount).toFixed(4))}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
