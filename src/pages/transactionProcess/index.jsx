import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import BookingInfo from "./BookingInfo";
import ProductSearch from "./ProductSearch";
import ProductList from "./ProductList";
import Cart from "./Cart";
import PaymentSummary from "./PaymentSummary";
import Receipt from "./Receipt";

const BASE = import.meta.env.VITE_BASE_URL;

const TransactionProcess = () => {
  const { token } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Booking states
  const [booking, setBooking] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [bookingsList, setBookingsList] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  // Product states
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Cart state
  const [cart, setCart] = useState([]);

  // Summary states
  const [subtotalService, setSubtotalService] = useState(0);
  const [subtotalProduct, setSubtotalProduct] = useState(0);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  // Meta states
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  // Get booking ID from query parameter on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("bookingId") || params.get("booking_id");
    if (id) {
      setBookingId(id);
    } else {
      fetchActiveBookings();
    }
    fetchProducts();
  }, [location, token]);

  // Fetch single booking details
  useEffect(() => {
    if (bookingId && token) {
      fetchBookingDetails(bookingId);
    }
  }, [bookingId, token]);

  // Calculate subtotals and total dynamically whenever booking or cart changes
  useEffect(() => {
    const servicePrice = booking?.service ? Number(booking.service.price) : 0;
    const productPrice = cart.reduce((sum, item) => sum + Number(item.subtotal), 0);

    setSubtotalService(servicePrice);
    setSubtotalProduct(productPrice);
    setTotal(servicePrice + productPrice);
  }, [booking, cart]);

  const fetchBookingDetails = async (id) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE}/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data.data;

      // Validation: Status must be confirmed or in_progress to proceed
      if (data.status !== "confirmed" && data.status !== "in_progress") {
        alert("Booking status harus 'confirmed' atau 'in_progress' untuk dapat diproses.");
        setBooking(null);
        setBookingId(null);
        fetchActiveBookings();
      } else {
        setBooking(data);
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
      alert("Gagal memuat detail booking.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchActiveBookings = async () => {
    if (!token) return;
    setIsLoadingBookings(true);
    try {
      // Fetch confirmed bookings
      const confirmedRes = await axios.get(`${BASE}/bookings`, {
        params: { status: "confirmed", limit: 50 },
        headers: { Authorization: `Bearer ${token}` },
      });
      // Fetch in_progress bookings
      const inProgressRes = await axios.get(`${BASE}/bookings`, {
        params: { status: "in_progress", limit: 50 },
        headers: { Authorization: `Bearer ${token}` },
      });

      const confirmedData = confirmedRes.data?.data?.data || [];
      const inProgressData = inProgressRes.data?.data?.data || [];

      // Combine both lists
      setBookingsList([...inProgressData, ...confirmedData]);
    } catch (error) {
      console.error("Error fetching active bookings:", error);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const fetchProducts = async () => {
    if (!token) return;
    setIsLoadingProducts(true);
    try {
      const response = await axios.get(`${BASE}/products`, {
        params: { limit: 100 },
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data?.data?.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Add product to cart
  const handleAddToCart = (product) => {
    if (product.stock <= 0) {
      alert("Stok produk habis!");
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product_id === product.id);

      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          alert(`Jumlah melebihi stok yang tersedia (${product.stock}).`);
          return prevCart;
        }
        return prevCart.map((item) =>
          item.product_id === product.id
            ? {
              ...item,
              quantity: item.quantity + 1,
              subtotal: (item.quantity + 1) * product.price,
            }
            : item
        );
      } else {
        return [
          ...prevCart,
          {
            product_id: product.id,
            name: product.name,
            price: Number(product.price),
            quantity: 1,
            subtotal: Number(product.price),
          },
        ];
      }
    });
  };

  // Update quantity of product in cart
  const handleUpdateQty = (productId, newQty) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    if (newQty <= 0) {
      handleRemoveFromCart(productId);
      return;
    }

    if (newQty > product.stock) {
      alert(`Jumlah melebihi stok yang tersedia (${product.stock}).`);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product_id === productId
          ? {
            ...item,
            quantity: newQty,
            subtotal: newQty * item.price,
          }
          : item
      )
    );
  };

  // Remove product from cart
  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.product_id !== productId));
  };

  // Checkout process
  const handleProcessPayment = async () => {
    if (!booking) {
      alert("Silakan pilih booking terlebih dahulu.");
      return;
    }

    setIsLoading(true);
    try {
      // 1. Create Transaction
      const transactionPayload = {
        user_id: booking.user_id,
        booking_id: booking.id,
        payment_method: paymentMethod,
        items: cart.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      };

      await axios.post(`${BASE}/transactions`, transactionPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });


      // 2. Update Transaction Status to completed
      const transactionStatusResponse = await axios.patch(`${BASE}/transactions/${booking.id}/status`,
        { status: "success" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(transactionStatusResponse);
      // 3. Update Booking Status to completed
      await axios.patch(
        `${BASE}/bookings/${booking.id}/status`,
        { status: "completed" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Save checkout receipt data
      setReceiptData({
        booking,
        cart,
        subtotalService,
        subtotalProduct,
        total,
        paymentMethod,
      });

      setIsSuccess(true);
    } catch (error) {
      console.error("Error processing transaction:", error);
      const errMsg = error.response?.data?.message || "Gagal memproses pembayaran.";
      alert(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReceiptClose = () => {
    setIsSuccess(false);
    setReceiptData(null);
    setCart([]);
    setBooking(null);
    setBookingId(null);
    navigate("/admin/booking-management");
  };

  // Filter products by search query
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      {/* Header Section */}
      <div className="px-6 md:px-8 lg:px-12 py-6 md:py-10 border-b border-black/20">
        <Link
          to="/admin/booking-management"
          className="inline-flex items-center gap-2 font-mono text-[10px] md:text-[12px] text-black/70 hover:text-black tracking-widest uppercase mb-6 md:mb-8 transition-all duration-200 hover:gap-3 group"
        >
          <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Booking Management</span>
        </Link>

        <div>
          <p className="font-mono text-[10px] md:text-xs tracking-widest uppercase text-black/60 mb-1">
            System POS
          </p>
          <h1 className="font-mono font-black text-[32px] md:text-[48px] uppercase leading-none text-black tracking-tight">
            Transaction Process
          </h1>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="px-4 md:px-8 lg:px-12 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Booking & Products (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          <BookingInfo
            booking={booking}
            bookingsList={bookingsList}
            onSelectBooking={(b) => {
              setBooking(b);
              if (b) setBookingId(b.id);
            }}
            isLoadingBookings={isLoadingBookings}
          />

          {/* Product Section */}
          <div className="border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black pb-4 mb-6">
              <h2 className="font-mono font-black text-xl uppercase tracking-tight">
                Pilih Produk
              </h2>
              <div className="sm:max-w-xs w-full">
                <ProductSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />
              </div>
            </div>

            <ProductList
              products={filteredProducts}
              onAddToCart={handleAddToCart}
              isLoading={isLoadingProducts}
            />
          </div>
        </div>

        {/* Right Side: Cart & Checkout Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-8">
          <Cart
            cart={cart}
            onUpdateQty={handleUpdateQty}
            onRemove={handleRemoveFromCart}
          />

          <PaymentSummary
            subtotalService={subtotalService}
            subtotalProduct={subtotalProduct}
            total={total}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
            onProcessPayment={handleProcessPayment}
            isProcessing={isLoading}
            canProcess={!!booking}
          />
        </div>
      </div>

      {/* Digital Receipt Modal */}
      <Receipt isOpen={isSuccess} onClose={handleReceiptClose} data={receiptData} />
    </div>
  );
};

export default TransactionProcess;
