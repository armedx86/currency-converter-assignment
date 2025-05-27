import CurrencyExchangeForm from "@/components/forms/CurrencyExchangeForm";
import ConversionHistory from "@/components/conversion-history/ConversionHistory";

export default function Home() {
  return (
    <>
      <div className="card card-border bg-base-300 w-full">
        <div className="card-body">
          <CurrencyExchangeForm />
        </div>
      </div>
      <div className="card card-border bg-base-300 w-full lg:col-span-2">
        <div className="card-body">
          <h2 className="card-title">Conversion History</h2>
          <ConversionHistory />
        </div>
      </div>
    </>
  );
}
