import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { CURRENCIES } from "@/constants";

type State = {
  selectedInputMint: string;
  selectedOutputMint: string;
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
  selectOutputMint: (mint: string) => void;
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
      version: STORE_VERSION,
      migrate: (persistedState, version) => {
        if (version === STORE_VERSION) {
          return persistedState;
        }

        const migrationsStartIndex = migrations.findIndex(
          ({ fromVersion }) => fromVersion === version,
        );
        if (migrationsStartIndex === -1) {
          return persistedState;
        }

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
