import { debounce } from "lodash";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { MINTS_WITH_PRICES } from "@/constants";

type State = {
  currencyExchangeForm: {
    inputMint: string;
    inputAmount: string | null;
    outputMint: string;
    outputAmount: string | null;
  };
  conversionHistory: ConversionEntry[];
};

export interface ConversionEntry {
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
  setInputAmount: (amount: string | null) => void;
  selectOutputMint: (mint: string) => void;
  setOutputAmount: (amount: string | null) => void;
  setInputOutputPair: (inputAmount: string | null, outputAmount: string | null) => void;
  addConversionHistoryEntry: (conversionEntry: ConversionEntry) => void;
};

// **Important**: Increment this version number when making changes to the store structure.
// Don't forget to add a migration below if needed.
const STORE_VERSION = 1;
const migrations: { fromVersion: number; toVersion: number; migrate: (state: object) => object }[] =
  [
    // { fromVersion: 0, toVersion: 1, migrate: migrateV0ToV1 as (state: object) => object },
    // New migrations must be added at the end of this array!
  ];

export const useCalculatorStore = create<State & Actions>()(
  persist(
    immer((set) => {
      const addConversionHistoryEntry = () => {
        set((state) => {
          if (
            !state.currencyExchangeForm.inputMint ||
            !state.currencyExchangeForm.outputMint ||
            !state.currencyExchangeForm.inputAmount ||
            !state.currencyExchangeForm.outputAmount
          ) {
            return;
          }

          const inputMintData = Object.values(MINTS_WITH_PRICES).find(
            ({ mint }) => mint === state.currencyExchangeForm.inputMint,
          );
          const outputMintData = Object.values(MINTS_WITH_PRICES).find(
            ({ mint }) => mint === state.currencyExchangeForm.outputMint,
          );

          if (!inputMintData || !outputMintData) {
            console.error("Invalid currency selected for conversion history entry.");
            return;
          }
          state.conversionHistory.unshift({
            timestamp: Date.now(),
            inputMint: state.currencyExchangeForm.inputMint,
            inputSymbol: inputMintData.symbol,
            inputAmount: state.currencyExchangeForm.inputAmount || "0",
            outputMint: state.currencyExchangeForm.outputMint,
            outputSymbol: outputMintData.symbol,
            outputAmount: state.currencyExchangeForm.outputAmount || "0",
          });
        });
      };

      const debouncedAddConversionHistoryEntry = debounce(addConversionHistoryEntry, 300);

      return {
        currencyExchangeForm: {
          inputMint: MINTS_WITH_PRICES.USDC.mint,
          inputAmount: null,
          outputMint: MINTS_WITH_PRICES.SOL.mint,
          outputAmount: null,
        },
        conversionHistory: [],

        selectInputMint(mint: string) {
          set((state) => {
            state.currencyExchangeForm.inputMint = mint;
            state.currencyExchangeForm.inputAmount = null;
            state.currencyExchangeForm.outputAmount = null;
          });
        },
        setInputAmount(amount: string | null) {
          set((state) => {
            state.currencyExchangeForm.inputAmount = amount;
          });
        },
        selectOutputMint(mint: string) {
          set((state) => {
            state.currencyExchangeForm.outputMint = mint;
            state.currencyExchangeForm.inputAmount = null;
            state.currencyExchangeForm.outputAmount = null;
          });
        },
        setOutputAmount(amount: string | null) {
          set((state) => {
            state.currencyExchangeForm.outputAmount = amount;
          });
        },
        setInputOutputPair(inputAmount: string | null, outputAmount: string | null) {
          set((state) => {
            state.currencyExchangeForm.inputAmount = inputAmount;
            state.currencyExchangeForm.outputAmount = outputAmount;
          });

          debouncedAddConversionHistoryEntry();
        },
        addConversionHistoryEntry,
      };
    }),
    {
      name: "converter-store",
      version: STORE_VERSION,
      partialize(state) {
        const { inputMint, outputMint } = state.currencyExchangeForm;
        return {
          currencyExchangeForm: { inputMint, outputMint },
          conversionHistory: state.conversionHistory,
        };
      },
      merge(persistedState, currentState) {
        // TODO: need to validate persistedState to ensure it has the correct structure
        const state = persistedState as State;
        return {
          ...currentState,
          ...state,
          currencyExchangeForm: {
            ...currentState.currencyExchangeForm,
            ...state.currencyExchangeForm,
          },
        };
      },
      migrate(persistedState, version) {
        if (version === STORE_VERSION) {
          return persistedState;
        }

        const migrationsStartIndex = migrations.findIndex(
          ({ fromVersion }) => fromVersion === version,
        );
        if (migrationsStartIndex === -1) {
          return persistedState;
        }

        // TODO: need to validate result to ensure it has the correct structure
        return migrations
          .slice(migrationsStartIndex)
          .reduce((state, { fromVersion, toVersion, migrate }) => {
            console.debug(`Migrating store from version ${fromVersion} to ${toVersion}`);
            return migrate(state as object) as State;
          }, persistedState);
      },
    },
  ),
);
