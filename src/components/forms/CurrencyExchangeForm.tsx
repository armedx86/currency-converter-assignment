"use client";

import { useCalculatorStore } from "@/store";
import { useMemo, useState } from "react";
import CurrencyInput from "@/components/currency-input/CurrencyInput";
import { CURRENCIES } from "@/constants";

// TODO: this must be calculated dynamically when a real API is used
const CURRENCIES_AS_OPTIONS = Object.values(CURRENCIES).map(({ mint, symbol }) => ({
  value: mint,
  label: symbol,
}));

export default function Home() {
  const selectedInputMint = useCalculatorStore((s) => s.selectedInputMint);
  const selectedOutputMint = useCalculatorStore((s) => s.selectedOutputMint);
  const selectInputMint = useCalculatorStore((s) => s.selectInputMint);
  const selectOutputMint = useCalculatorStore((s) => s.selectOutputMint);

  const [inputAmount, setInputAmount] = useState<string | null>(null);
  const [outputAmount, setOutputAmount] = useState<string | null>(null);

  const inputOptions = useMemo(() => {
    return CURRENCIES_AS_OPTIONS.filter(({ value }) => {
      return value !== selectedOutputMint;
    });
  }, [selectedOutputMint]);
  const outputOptions = useMemo(() => {
    return CURRENCIES_AS_OPTIONS.filter(({ value }) => {
      return value !== selectedInputMint;
    });
  }, [selectedInputMint]);

  return (
    <>
      <CurrencyInput
        label="Sell"
        currencyOptions={inputOptions}
        selectedCurrency={selectedInputMint}
        enteredAmount={inputAmount ?? ""}
        onAmountChange={(value) => setInputAmount(value ? value : null)}
        onCurrencySelect={selectInputMint}
      />
      <CurrencyInput
        label="Buy"
        currencyOptions={outputOptions}
        selectedCurrency={selectedOutputMint}
        enteredAmount={outputAmount ?? ""}
        onAmountChange={(value) => setOutputAmount(value ? value : null)}
        onCurrencySelect={selectOutputMint}
      />
    </>
  );
}
