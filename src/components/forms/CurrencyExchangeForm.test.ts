import { calculateExchangeOutputForCurrency } from "./CurrencyExchangeForm";

const MOCK_CURRENCIES = {
  USDC: {
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    symbol: "USDC",
    priceInUSDC: "1000000",
    decimals: 6,
  },
  SOL: {
    mint: "So11111111111111111111111111111111111111112",
    symbol: "SOL",
    priceInUSDC: "176000000",
    decimals: 6,
  },
  JUP: {
    mint: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
    symbol: "JUP",
    priceInUSDC: "655841",
    decimals: 6,
  },
} as const;

describe("calculateExchangeOutputForCurrency()", () => {
  test("calculates correct output when USDC is output", () => {
    const output = calculateExchangeOutputForCurrency(
      MOCK_CURRENCIES.SOL,
      MOCK_CURRENCIES.USDC,
      "1",
    );
    expect(output).toBe("176");

    const output2 = calculateExchangeOutputForCurrency(
      MOCK_CURRENCIES.JUP,
      MOCK_CURRENCIES.USDC,
      "1",
    );
    expect(output2).toBe("0.655841");
  });

  test("calculates correct output when converting between non-USDC currencies", () => {
    const output = calculateExchangeOutputForCurrency(
      MOCK_CURRENCIES.JUP,
      MOCK_CURRENCIES.SOL,
      "1",
    );
    expect(output).toBe("0.003726");

    const output2 = calculateExchangeOutputForCurrency(
      MOCK_CURRENCIES.SOL,
      MOCK_CURRENCIES.JUP,
      "1",
    );
    expect(output2).toBe("268.357727");
  });
});
