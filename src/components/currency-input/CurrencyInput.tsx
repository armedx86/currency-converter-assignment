import { useEffect, useRef, useState } from "react";
import {
  DefaultNumeralDelimiter,
  formatNumeral,
  FormatNumeralOptions,
  NumeralThousandGroupStyles,
  registerCursorTracker,
  unformatNumeral,
} from "cleave-zen";

const numeralOptions: FormatNumeralOptions = {
  delimiter: DefaultNumeralDelimiter,
  numeralDecimalMark: ".",
  numeralThousandsGroupStyle: NumeralThousandGroupStyles.THOUSAND,
  stripLeadingZeroes: true,
  numeralPositiveOnly: true,
  // TODO: this must be adjusted based on the count of leading and token decimals
  numeralDecimalScale: 6,
};

export default function CurrencyInput<TCurrencyVal extends string>({
  label,
  currencyOptions,
  selectedCurrency,
  enteredAmount,
  onCurrencySelect,
  onAmountChange,
}: Readonly<{
  label: string;
  selectedCurrency: TCurrencyVal;
  currencyOptions: { value: TCurrencyVal; label: string }[];
  enteredAmount: string;
  onCurrencySelect: (value: TCurrencyVal) => void;
  onAmountChange: (value: string) => void;
}>) {
  const amountInputRef = useRef<HTMLInputElement | null>(null);
  const [formattedAmount, setFormattedAmount] = useState(() =>
    formatNumeral(enteredAmount, numeralOptions),
  );

  // needed to stop the cursor from jumping to the end of the input when the value changes due to formatting
  useEffect(() => {
    if (!amountInputRef.current) return;

    return registerCursorTracker({
      input: amountInputRef.current,
      delimiter: DefaultNumeralDelimiter,
    });
  }, []);

  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">{label}</legend>
      <div className="join">
        <select
          className="select select-lg join-item flex-1/3"
          value={selectedCurrency}
          onChange={(e) => onCurrencySelect(e.target.value as TCurrencyVal)}
        >
          {currencyOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <input
          ref={amountInputRef}
          type="text"
          placeholder="0.00"
          className="input input-lg join-item flex-2/3"
          value={formattedAmount}
          onChange={(e) => {
            setFormattedAmount(formatNumeral(e.target.value, numeralOptions));
            onAmountChange(unformatNumeral(e.target.value, numeralOptions));
          }}
        />
      </div>
    </fieldset>
  );
}
