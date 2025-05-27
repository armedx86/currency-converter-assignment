"use client";

import { useCalculatorStore } from "@/store/store";
import { ArrowsUpDownIcon } from "@heroicons/react/20/solid";
import Decimal from "decimal.js";
import { useCallback, useMemo } from "react";
import CurrencyInput from "@/components/currency-input/CurrencyInput";
import { MINTS_WITH_PRICES, MintDataWithPrice } from "@/constants";

// TODO: this must be calculated dynamically when a real API is used
const CURRENCIES_AS_OPTIONS = Object.values(MINTS_WITH_PRICES).map(({ mint, symbol }) => ({
  value: mint,
  label: symbol,
}));

export default function CurrencyExchangeForm() {
  const selectedInputMint = useCalculatorStore((s) => s.currencyExchangeForm.inputMint);
  const inputAmount = useCalculatorStore((s) => s.currencyExchangeForm.inputAmount);
  const selectedOutputMint = useCalculatorStore((s) => s.currencyExchangeForm.outputMint);
  const outputAmount = useCalculatorStore((s) => s.currencyExchangeForm.outputAmount);
  const selectInputMint = useCalculatorStore((s) => s.selectInputMint);
  const setInputAmount = useCalculatorStore((s) => s.setInputAmount);
  const selectOutputMint = useCalculatorStore((s) => s.selectOutputMint);
  const setOutputAmount = useCalculatorStore((s) => s.setOutputAmount);
  const setInputOutputPair = useCalculatorStore((s) => s.setInputOutputPair);

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
      if (value) {
        const outputValue = calculateExchangeOutput(selectedInputMint, selectedOutputMint, value);
        setInputOutputPair(value, outputValue);
      } else {
        setInputAmount(null);
      }
    },
    [selectedInputMint, selectedOutputMint, setInputAmount, setInputOutputPair],
  );
  const onBuyAmountChange = useCallback(
    (value: string) => {
      if (value) {
        const inputValue = calculateExchangeOutput(selectedOutputMint, selectedInputMint, value);
        setInputOutputPair(inputValue, value);
      } else {
        setOutputAmount(null);
      }
    },
    [selectedInputMint, selectedOutputMint, setInputOutputPair, setOutputAmount],
  );

  const handleSwitchTokens = useCallback(() => {
    const inputMint = selectedInputMint;
    selectInputMint(selectedOutputMint);
    selectOutputMint(inputMint);
  }, [selectInputMint, selectOutputMint, selectedInputMint, selectedOutputMint]);

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
        }}
      />
      <div className="flex items-center">
        <div className="h-px w-full bg-th-bkg-4" />
        <button
          className="flex size-9 shrink-0 items-center justify-center rounded-full border"
          onClick={handleSwitchTokens}
        >
          <ArrowsUpDownIcon className="size-5" />
        </button>
        <div className="h-px w-full" />
      </div>
      <CurrencyInput
        label="Buy"
        currencyOptions={outputOptions}
        selectedCurrency={selectedOutputMint}
        enteredAmount={outputAmount ?? ""}
        onAmountChange={onBuyAmountChange}
        onCurrencySelect={(mint) => {
          selectOutputMint(mint);
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
  const inputCurrency = Object.values(MINTS_WITH_PRICES).find(({ mint }) => mint === inputMint);
  const outputCurrency = Object.values(MINTS_WITH_PRICES).find(({ mint }) => mint === outputMint);

  if (!inputCurrency || !outputCurrency) {
    return null;
  }

  return calculateExchangeOutputForCurrency(inputCurrency, outputCurrency, inputAmount);
}

export function calculateExchangeOutputForCurrency(
  inputCurrency: MintDataWithPrice,
  outputCurrency: MintDataWithPrice,
  inputAmount: string,
): string {
  const inputAmountAsUSDC = new Decimal(inputAmount)
    .mul(inputCurrency.priceInUSDC)
    .div(10 ** MINTS_WITH_PRICES.USDC.decimals);
  const outputAsUSDC = new Decimal(outputCurrency.priceInUSDC).div(
    10 ** MINTS_WITH_PRICES.USDC.decimals,
  );
  const outputAmount = inputAmountAsUSDC.div(outputAsUSDC);
  const outputAmountAtoms = outputAmount.mul(10 ** outputCurrency.decimals);

  return outputAmountAtoms
    .round()
    .div(10 ** outputCurrency.decimals)
    .toString();
}
