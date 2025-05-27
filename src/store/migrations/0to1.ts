// import { CURRENCIES } from "../../constants";
//
// interface StateV0 {
//   conversionHistory: {
//     inputMint: string;
//     inputSymbol: string;
//     inputAmount: string;
//     outputMint: string;
//     outputSymbol: string;
//     outputAmount: string;
//     timestamp: number;
//   }[];
// }
//
// export interface StateV1 {
//   ...,
//   conversionHistory: {
//     inputMint: string;
//     inputSymbol: string;
//     inputAmount: string;
//     outputMint: string;
//     outputSymbol: string;
//     outputAmount: string;
//     timestamp: number;
//   }[];
// }
//
// export function migrateV0ToV1(state: StateV0): StateV1 {
//   return {
//     selectedInputMint: CURRENCIES.USDC.mint,
//     selectedOutputMint: CURRENCIES.SOL.mint,
//     ...state,
//   };
// }
