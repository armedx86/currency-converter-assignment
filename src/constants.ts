export const MINTS_WITH_PRICES = {
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

export type MintDataWithPrice = (typeof MINTS_WITH_PRICES)[keyof typeof MINTS_WITH_PRICES];
