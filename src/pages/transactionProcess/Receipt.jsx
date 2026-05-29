import React from "react";
import { CheckCircle2, Printer } from "lucide-react";

const Receipt = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-black w-full max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-h-[90vh] flex flex-col">
        {/* Header Success */}
        <div className="bg-green-50 border-b-2 border-black p-6 flex flex-col items-center justify-center text-center">
          <CheckCircle2 size={44} className="text-green-600 mb-2" />
          <h3 className="font-mono font-black text-lg uppercase tracking-tight text-green-800">
            Transaksi Sukses
          </h3>
          <p className="font-mono text-xs text-black/60 mt-1">Pembayaran telah berhasil diproses.</p>
        </div>

        {/* Printable Area / Invoice Content */}
        <div id="digital-receipt" className="p-6 overflow-y-auto space-y-4 font-mono text-xs text-black flex-1">
          {/* Header Toko */}
          <div className="text-center border-b border-dashed border-black pb-3 space-y-1">
            <h4 className="font-bold text-sm uppercase">BARBER-SHOP CO.</h4>
            <p className="text-[10px] text-black/60">Jl. Raya Barbershop No. 123</p>
            <p className="text-[10px] text-black/60">Telp: 0812-3456-7890</p>
          </div>

          {/* Metadata Transaksi */}
          <div className="space-y-1 pb-3 border-b border-dashed border-black">
            <div className="flex justify-between">
              <span>No. Booking:</span>
              <span className="font-bold">#{String(data.booking.id).padStart(4, "0")}</span>
            </div>
            <div className="flex justify-between">
              <span>Tanggal:</span>
              <span>{new Date().toLocaleDateString("id-ID")}</span>
            </div>
            <div className="flex justify-between">
              <span>Metode:</span>
              <span className="uppercase font-bold">{data.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>Customer:</span>
              <span className="font-bold">{data.booking.user?.name || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span>Barber:</span>
              <span>{data.booking.barber?.name || "—"}</span>
            </div>
          </div>

          {/* Rincian Item */}
          <div className="space-y-2 py-1 border-b border-dashed border-black">
            <p className="font-bold uppercase text-[10px] text-black/60">Rincian Layanan & Produk</p>
            
            {/* Layanan */}
            <div className="flex justify-between">
              <div className="pr-4">
                <span className="font-bold">[Layanan] {data.booking.service?.name}</span>
              </div>
              <span className="shrink-0">
                Rp {Number(data.booking.service?.price).toLocaleString("id-ID")}
              </span>
            </div>

            {/* Produk */}
            {data.cart.map((item) => (
              <div key={item.product_id} className="flex justify-between">
                <div>
                  <span>{item.name}</span>
                  <span className="text-black/60 ml-2">x{item.quantity}</span>
                </div>
                <span>
                  Rp {Number(item.subtotal).toLocaleString("id-ID")}
                </span>
              </div>
            ))}
          </div>

          {/* Total-total */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between">
              <span>Subtotal Layanan:</span>
              <span>Rp {Number(data.subtotalService).toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between">
              <span>Subtotal Produk:</span>
              <span>Rp {Number(data.subtotalProduct).toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between font-bold text-sm border-t border-black pt-2">
              <span>TOTAL:</span>
              <span>Rp {Number(data.total).toLocaleString("id-ID")}</span>
            </div>
          </div>

          {/* Thank You Note */}
          <div className="text-center pt-4 text-[10px] text-black/50 italic border-t border-dashed border-black">
            Thank you for visiting!
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t-2 border-black bg-gray-50 flex gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-1.5 font-mono text-xs font-bold border-2 border-black px-4 py-2 bg-white hover:bg-gray-100 transition-colors flex-1 cursor-pointer"
          >
            <Printer size={14} />
            <span>Cetak Struk</span>
          </button>
          <button
            onClick={onClose}
            className="font-mono text-xs font-bold border-2 border-black bg-black text-white hover:bg-white hover:text-black px-4 py-2 transition-colors flex-1 cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
