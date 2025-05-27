"use client";

import { useCalculatorStore } from "@/store/store";
import Decimal from "decimal.js";
import { useCallback, useMemo, useState } from "react";
import CurrencyInput from "@/components/currency-input/CurrencyInput";
import { CURRENCIES, Currency } from "@/constants";

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

  const onSellAmountChange = useCallback(
    (value: string) => {
      setInputAmount(value ? value : null);
      if (value) {
        const outputValue = calculateExchangeOutput(selectedInputMint, selectedOutputMint, value);
        setOutputAmount(outputValue);
      }
    },
    [selectedInputMint, selectedOutputMint],
  );
  const onBuyAmountChange = useCallback(
    (value: string) => {
      setOutputAmount(value ? value : null);
      if (value) {
        const outputValue = calculateExchangeOutput(selectedOutputMint, selectedInputMint, value);
        setInputAmount(outputValue);
      }
    },
    [selectedInputMint, selectedOutputMint],
  );

  return (
    <>
      <CurrencyInput
        label="Sell"
        currencyOptions={inputOptions}
        selectedCurrency={selectedInputMint}
        enteredAmount={inputAmount ?? ""}
        onAmountChange={onSellAmountChange}
        onCurrencySelect={(mint) => {
          selectInputMint(mint);
          setInputAmount(null);
          setOutputAmount(null);
        }}
      />
      <CurrencyInput
        label="Buy"
        currencyOptions={outputOptions}
        selectedCurrency={selectedOutputMint}
        enteredAmount={outputAmount ?? ""}
        onAmountChange={onBuyAmountChange}
        onCurrencySelect={(mint) => {
          selectOutputMint(mint);
          setInputAmount(null);
          setOutputAmount(null);
        }}
      />
    </>
  );
}

export function calculateExchangeOutput(
  inputMint: string,
  outputMint: string,
  inputAmount: string,
): string | null {
  const inputCurrency = Object.values(CURRENCIES).find(({ mint }) => mint === inputMint);
  const outputCurrency = Object.values(CURRENCIES).find(({ mint }) => mint === outputMint);

  if (!inputCurrency || !outputCurrency) {
    return null;
  }

  return calculateExchangeOutputForCurrency(inputCurrency, outputCurrency, inputAmount);
}

export function calculateExchangeOutputForCurrency(
  inputCurrency: Currency,
  outputCurrency: Currency,
  inputAmount: string,
): string {
  const inputAmountAsUSDC = new Decimal(inputAmount)
    .mul(inputCurrency.priceInUSDC)
    .div(10 ** CURRENCIES.USDC.decimals);
  const outputAsUSDC = new Decimal(outputCurrency.priceInUSDC).div(10 ** CURRENCIES.USDC.decimals);
  const outputAmount = inputAmountAsUSDC.div(outputAsUSDC);
  const outputAmountAtoms = outputAmount.mul(10 ** outputCurrency.decimals);

  return outputAmountAtoms
    .round()
    .div(10 ** outputCurrency.decimals)
    .toString();
}
