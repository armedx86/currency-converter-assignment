import CurrencyExchangeForm from "@/components/forms/CurrencyExchangeForm";

export default function Home() {
  return (
    <div className="card card-border bg-base-300 w-full sm:w-[400px]">
      <div className="card-body">
        <CurrencyExchangeForm />
      </div>
    </div>
  );
}
