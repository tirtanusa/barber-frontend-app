import React from "react";
import { CreditCard, DollarSign, Receipt } from "lucide-react";

const PaymentSummary = ({
  subtotalService,
  subtotalProduct,
  total,
  paymentMethod,
  onPaymentMethodChange,
  onProcessPayment,
  isProcessing,
  canProcess,
}) => {
  const methods = [
    { value: "cash", label: "Cash", icon: DollarSign },
    { value: "debit", label: "Debit Card", icon: CreditCard },
    { value: "credit", label: "Credit Card", icon: Receipt },
  ];

  return (
    <div className="border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="font-mono font-black text-xl uppercase tracking-tight border-b-2 border-black pb-3 mb-4">
        Ringkasan & Pembayaran
      </h2>

      {/* Breakdowns */}
      <div className="space-y-2 border-b border-black/10 pb-4 mb-4">
        <div className="flex justify-between items-center">
          <span className="font-mono text-xs text-black/60 uppercase">Subtotal Layanan</span>
          <span className="font-mono text-sm font-bold">
            Rp {Number(subtotalService).toLocaleString("id-ID")}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-mono text-xs text-black/60 uppercase">Subtotal Produk</span>
          <span className="font-mono text-sm font-bold">
            Rp {Number(subtotalProduct).toLocaleString("id-ID")}
          </span>
        </div>
      </div>

      {/* Grand Total */}
      <div className="flex justify-between items-baseline mb-6">
        <span className="font-mono text-sm font-black uppercase tracking-wider">Grand Total</span>
        <span className="font-mono text-2xl font-black text-black">
          Rp {Number(total).toLocaleString("id-ID")}
        </span>
      </div>

      {/* Payment Method Selector */}
      <div className="mb-6">
        <label className="block font-mono text-[10px] text-black/60 uppercase tracking-wider mb-2 font-bold">
          Metode Pembayaran
        </label>
        <div className="grid grid-cols-3 gap-2">
          {methods.map((method) => {
            const Icon = method.icon;
            const isSelected = paymentMethod === method.value;
            return (
              <button
                key={method.value}
                type="button"
                onClick={() => onPaymentMethodChange(method.value)}
                className={`flex flex-col items-center gap-1.5 py-3 border-2 border-black font-mono text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]"
                    : "bg-white text-black hover:bg-gray-50"
                }`}
              >
                <Icon size={16} />
                <span>{method.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Process Button */}
      <button
        onClick={onProcessPayment}
        disabled={!canProcess || isProcessing}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-mono font-bold py-3.5 px-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all active:translate-x-[2px] active:translate-y-[2px] disabled:bg-gray-200 disabled:text-black/40 disabled:border-black/20 disabled:shadow-none disabled:cursor-not-allowed cursor-pointer uppercase tracking-wider text-sm flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span>Memproses...</span>
          </>
        ) : (
          <span>Proses Pembayaran</span>
        )}
      </button>
    </div>
  );
};

export default PaymentSummary;
