import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { CURRENCIES } from "./constants";

type State = {
  selectedInputMint: string;
  selectedOutputMint: string;
  conversionHistory: ConversionEntry[];
};

interface ConversionEntry {
  inputMint: string;
  inputSymbol: string;
  inputAmount: string;
  outputMint: string;
  outputSymbol: string;
  outputAmount: string;
  timestamp: number;
}

type Actions = {
  selectInputMint: (mint: string) => void;
  selectOutputMint: (mint: string) => void;
  addConversionHistoryEntry: (conversionEntry: ConversionEntry) => void;
};

export const useCalculatorStore = create<State & Actions>()(
  persist(
    immer((set) => ({
      selectedInputMint: CURRENCIES.USDC.mint,
      selectedOutputMint: CURRENCIES.SOL.mint,
      conversionHistory: [],

      selectInputMint: (mint: string) =>
        set((state) => {
          state.selectedInputMint = mint;
        }),
      selectOutputMint: (mint: string) =>
        set((state) => {
          state.selectedOutputMint = mint;
        }),
      addConversionHistoryEntry: (conversionEntry: ConversionEntry) =>
        set((state) => {
          state.conversionHistory.unshift(conversionEntry);
        }),
    })),
    {
      name: "converter-store",
      partialize: (state) => {
        const { conversionHistory } = state;
        return { conversionHistory };
      },
    },
  ),
);
