import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";

const CartItem = ({ item, onUpdateQty, onRemove }) => {
  return (
    <div className="flex items-center justify-between border-b border-black/10 py-3 gap-2">
      <div className="flex-1 min-w-0">
        <h4 className="font-mono font-bold text-sm text-black truncate">{item.name}</h4>
        <p className="font-mono text-xs text-black/60">
          Rp {Number(item.price).toLocaleString("id-ID")}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Quantity Controls */}
        <div className="flex items-center border border-black">
          <button
            onClick={() => onUpdateQty(item.product_id, item.quantity - 1)}
            className="p-1 hover:bg-black hover:text-white transition-colors"
          >
            <Minus size={12} />
          </button>
          <span className="px-3 font-mono text-xs font-bold min-w-[24px] text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQty(item.product_id, item.quantity + 1)}
            className="p-1 hover:bg-black hover:text-white transition-colors"
          >
            <Plus size={12} />
          </button>
        </div>

        {/* Subtotal */}
        <div className="text-right min-w-[90px]">
          <span className="font-mono text-xs font-bold">
            Rp {Number(item.subtotal).toLocaleString("id-ID")}
          </span>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(item.product_id)}
          className="text-red-600 hover:bg-red-50 p-1 border border-transparent hover:border-red-300 transition-all"
          title="Hapus"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

const Cart = ({ cart, onUpdateQty, onRemove }) => {
  return (
    <div className="border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="font-mono font-black text-xl uppercase tracking-tight border-b-2 border-black pb-3 mb-4">
        Keranjang Produk
      </h2>

      {cart.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-black/20 bg-gray-50">
          <p className="font-mono text-xs text-black/50">Keranjang masih kosong.</p>
        </div>
      ) : (
        <div className="space-y-1 max-h-[250px] overflow-y-auto pr-1">
          {cart.map((item) => (
            <CartItem
              key={item.product_id}
              item={item}
              onUpdateQty={onUpdateQty}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
