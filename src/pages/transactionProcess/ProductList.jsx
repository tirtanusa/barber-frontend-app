import React from "react";
import { Plus } from "lucide-react";

const ProductCard = ({ product, onAddToCart }) => {
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="border-2 border-black bg-white p-4 flex flex-col justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
      <div>
        <div className="flex justify-between items-start gap-2 mb-1">
          <h4 className="font-mono font-bold text-sm text-black truncate">{product.name}</h4>
          <span className="font-mono text-[10px] uppercase bg-gray-100 px-1.5 py-0.5 border border-black/20 shrink-0">
            {product.category || "General"}
          </span>
        </div>
        <p className="font-mono text-xs text-black/60 mb-2 truncate">{product.description || "Tidak ada deskripsi"}</p>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-baseline mb-3">
          <span className="font-mono text-xs font-bold text-black">
            Rp {Number(product.price).toLocaleString("id-ID")}
          </span>
          <span className={`font-mono text-[10px] font-bold ${isOutOfStock ? "text-red-600" : "text-black/60"}`}>
            Stok: {product.stock}
          </span>
        </div>

        <button
          onClick={() => onAddToCart(product)}
          disabled={isOutOfStock}
          className="w-full bg-black text-white hover:bg-white hover:text-black border border-black font-mono text-xs font-bold py-2 px-3 flex items-center justify-center gap-1.5 transition-colors disabled:bg-gray-200 disabled:text-black/40 disabled:border-black/20 disabled:cursor-not-allowed cursor-pointer"
        >
          <Plus size={14} />
          <span>Tambah ke Keranjang</span>
        </button>
      </div>
    </div>
  );
};

const ProductList = ({ products, onAddToCart, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin h-6 w-6 border-2 border-black border-t-transparent"></div>
        <span className="ml-2 font-mono text-sm">Loading produk...</span>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8 border-2 border-dashed border-black/20 bg-gray-50">
        <p className="font-mono text-sm text-black/60">Tidak ada produk tersedia.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-1">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductList;
