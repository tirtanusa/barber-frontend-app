import React, { useState, useEffect, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import ProductSearch from "./ProductSearch";
import ProductFilter from "./ProductFilter";
import ProductTable from "./ProductTable";
import ProductForm from "./ProductForm";
import UpdateStockForm from "./UpdateStockForm";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

const BASE = import.meta.env.VITE_BASE_URL;

const ManageProduct = () => {
  const { token } = useContext(AuthContext);

  // ── State ──────────────────────────────────────────────
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isStockFormOpen, setIsStockFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [filters, setFilters] = useState({ category: "", status: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({ currentPage: 1, lastPage: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // ── Notification ───────────────────────────────────────
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // ── Fetch ──────────────────────────────────────────────
  const fetchProducts = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      console.log("BASE:", BASE);                              // ← cek BASE
      console.log("Full URL:", `${BASE}/products?page=${page}`); // ← cek full URL
      try {
        const params = { page };
        if (filters.category) params.category = filters.category;
        if (filters.status) params.status = filters.status;
        if (searchQuery.trim()) params.search = searchQuery.trim();

        const response = await axios.get(`${BASE}/products`, {
          headers: { Authorization: `Bearer ${token}` },
          params,
        });

        console.log("raw response: ", response.data)

        const data = response.data?.data;

        if (data?.data !== undefined) {
          // Paginated response
          setProducts(Array.isArray(data.data) ? data.data : []);
          setPagination({
            currentPage: data.current_page ?? 1,
            lastPage: data.last_page ?? 1,
            total: data.total ?? 0,
          });
        } else if (Array.isArray(data)) {
          // Flat array response
          setProducts(data);
          setPagination({ currentPage: 1, lastPage: 1, total: data.length });
        } else if (Array.isArray(response.data)) {
          // Response langsung array
          setProducts(response.data);
          setPagination({ currentPage: 1, lastPage: 1, total: response.data.length });
        } else {
          // Fallback — kosong, jangan error
          setProducts([]);
          setPagination({ currentPage: 1, lastPage: 1, total: 0 });
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        showNotification("Failed to fetch products", "error");
      } finally {
        setIsLoading(false);
      }
    },
    [token, filters, searchQuery]
  );

  useEffect(() => {
    if (token) fetchProducts(1);
  }, [token, filters, searchQuery]);

  // ── Handlers ───────────────────────────────────────────
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handlePageChange = (page) => {
    fetchProducts(page);
  };

  const handleAddClick = () => {
    setFormMode("add");
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (product) => {
    setFormMode("edit");
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleUpdateStockClick = (product) => {
    setSelectedProduct(product);
    setIsStockFormOpen(true);
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedProduct) return;
    try {
      await axios.delete(`${BASE}/products/${selectedProduct.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showNotification(`Product "${selectedProduct.name}" deleted successfully.`);
      setIsDeleteConfirmOpen(false);
      setSelectedProduct(null);

      // Jika halaman sekarang hanya ada 1 item, kembali ke halaman sebelumnya
      const isLastItemOnPage = products.length === 1 && pagination.currentPage > 1;
      const targetPage = isLastItemOnPage
        ? pagination.currentPage - 1
        : pagination.currentPage;

      await fetchProducts(targetPage); // ← await agar benar-benar selesai
    } catch (error) {
      console.error("Error deleting product:", error);
      showNotification(
        error.response?.data?.message || "Failed to delete product",
        "error"
      );
    }
  };

  // ── Render ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-4 border-2 border-black font-mono text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${notification.type === "success"
            ? "bg-green-100 text-green-950"
            : "bg-red-100 text-red-950"
            }`}
        >
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="px-6 md:px-8 lg:px-12 py-6 md:py-10 border-b border-black/20 bg-white">
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center gap-2 font-mono text-[10px] md:text-[12px] text-black/70 hover:text-black tracking-widest uppercase mb-6 md:mb-8 transition-all duration-200 hover:gap-3 group"
        >
          <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[10px] md:text-xs tracking-widest uppercase text-black/60 mb-1">
              System Admin
            </p>
            <h1 className="font-mono font-black text-[32px] md:text-[48px] uppercase leading-none text-black tracking-tight">
              Manage Products
            </h1>
          </div>
          <div>
            <button
              onClick={handleAddClick}
              className="inline-flex items-center gap-2 border-2 border-black bg-black text-white hover:bg-white hover:text-black font-mono text-xs md:text-sm font-bold uppercase tracking-wider px-6 py-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all duration-200"
            >
              <Plus size={16} />
              <span>Add New Product</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-8 lg:px-12 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col gap-4 bg-white p-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <ProductSearch
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
              <div className="font-mono text-xs font-bold uppercase tracking-widest text-black/60">
                Total: {pagination.total} product{pagination.total !== 1 ? "s" : ""}
              </div>
            </div>
            <div className="border-t border-black/10 pt-3">
              <ProductFilter filters={filters} onFilterChange={handleFilterChange} />
            </div>
          </div>

          {/* Table */}
          <ProductTable
            products={products}
            isLoading={isLoading}
            onEdit={handleEditClick}
            onUpdateStock={handleUpdateStockClick}
            onDelete={handleDeleteClick}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* ── Modals ── */}
      <ProductForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        mode={formMode}
        product={selectedProduct}
        onSuccess={(msg) => {
          showNotification(msg);
          fetchProducts(pagination.currentPage);
        }}
        token={token}
        BASE={BASE}
      />

      <UpdateStockForm
        isOpen={isStockFormOpen}
        onClose={() => {
          setIsStockFormOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onSuccess={(msg) => {
          showNotification(msg);
          fetchProducts(pagination.currentPage);
        }}
        token={token}
        BASE={BASE}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setSelectedProduct(null);
        }}
        onConfirm={handleConfirmDelete}
        productName={selectedProduct?.name || "this product"}
      />
    </div>
  );
};

export default ManageProduct;
