import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from 'react-router-dom'
import { HandCoins, PencilLine, Trash2, Check, X, ChevronLeft, ChevronRight, Users, Scissors, Package, Star, ArrowLeft } from "lucide-react";

const statusConfig = {
    completed: { label: "Completed", bg: "bg-green-100", text: "text-green-700", border: "border-green-300" },
    cancelled: { label: "Cancelled", bg: "bg-red-100", text: "text-red-600", border: "border-red-300" },
    pending: { label: "Pending", bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-300" },
    confirmed: { label: "Confirmed", bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" },
};

// Component Confirmation Modal
const ConfirmationModal = ({ isOpen, onClose, onConfirm, bookingId, isProcessing }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white border-2 border-black px-6 py-8 shadow-xl max-w-md mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-black font-mono font-bold text-lg">Cancel Booking</h3>
                    <button onClick={onClose} className="text-black/60 hover:text-black">
                        <X size={20} />
                    </button>
                </div>
                <p className="text-black font-mono text-sm mb-6">
                    Are you sure you want to cancel this booking?
                </p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        disabled={isProcessing}
                        className="px-4 py-2 border border-black bg-white text-black font-mono text-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                        No, Keep It
                    </button>
                    <button
                        onClick={() => onConfirm(bookingId)}
                        disabled={isProcessing}
                        className="px-4 py-2 bg-red-600 text-white font-mono text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                        {isProcessing ? "Processing..." : "Yes, Cancel Booking"}
                    </button>
                </div>
            </div>
        </div>
    );
};

const AdminDashboard = () => {
    const { token, user } = useContext(AuthContext);
    const firstName = user?.name?.split(" ")[0] || "Admin";

    // State untuk loading
    const [loading, setLoading] = useState({
        revenue: false,
        bookings: false,
        allBookings: false,
        summary: false,
        topBarbers: false
    });

    // State untuk data
    const [revenue, setRevenue] = useState(null);
    const [summary, setSummary] = useState({
        total_customer: 0,
        total_barber: 0,
        low_stock_product: 0
    });

    // State untuk top barbers
    const [topBarbers, setTopBarbers] = useState([]);

    // State untuk booking stats (dari all bookings)
    const [bookingStats, setBookingStats] = useState({
        total: 0,
        completed: 0,
        cancelled: 0,
        pending: 0
    });

    // State untuk latest bookings (pagination)
    const [latestBookings, setLatestBookings] = useState({
        data: [],
        lastPage: 1,
        currentPage: 1,
        perPage: 5
    });

    // State untuk modal
    const [modal, setModal] = useState({
        isOpen: false,
        bookingId: null,
        isProcessing: false
    });

    // Fetch summary data
    const fetchSummary = async () => {
        setLoading(prev => ({ ...prev, summary: true }));
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/reports/summary`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSummary(response.data.data);
        } catch (err) {
            console.error("Error fetching summary:", err);
        } finally {
            setLoading(prev => ({ ...prev, summary: false }));
        }
    };

    // Fetch top rated barbers
    const fetchTopBarbers = async () => {
        setLoading(prev => ({ ...prev, topBarbers: true }));
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/reports/top-rated-barber`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTopBarbers(response.data.data);
        } catch (err) {
            console.error("Error fetching top barbers:", err);
        } finally {
            setLoading(prev => ({ ...prev, topBarbers: false }));
        }
    };

    // Fetch all bookings for statistics ONLY (limit=1000)
    const fetchAllBookingsForStats = async () => {
        setLoading(prev => ({ ...prev, allBookings: true }));
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/bookings?limit=1000`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const allBookings = response.data.data.data;

            // Hitung statistik dari semua data
            const completed = allBookings.filter(item => item.status === "completed").length;
            const cancelled = allBookings.filter(item => item.status === "cancelled").length;
            const pending = allBookings.filter(item => item.status !== "cancelled" && item.status !== "completed").length;

            setBookingStats({
                total: allBookings.length,
                completed,
                cancelled,
                pending
            });
        } catch (err) {
            console.error("Error fetching all bookings for stats:", err);
        } finally {
            setLoading(prev => ({ ...prev, allBookings: false }));
        }
    };

    // Fetch latest bookings with pagination (NO limit)
    const fetchLatestBookings = async (page = 1) => {
        setLoading(prev => ({ ...prev, bookings: true }));
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/bookings?page=${page}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setLatestBookings({
                data: response.data.data.data,
                lastPage: response.data.data.last_page,
                currentPage: response.data.data.current_page,
                perPage: response.data.data.per_page
            });
        } catch (err) {
            console.error("Error fetching latest bookings:", err);
        } finally {
            setLoading(prev => ({ ...prev, bookings: false }));
        }
    };

    // Fetch revenue
    const fetchRevenue = async () => {
        setLoading(prev => ({ ...prev, revenue: true }));
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/reports/revenue?period=monthly`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRevenue(response.data.data[0]);
        } catch (err) {
            console.error("Error fetching revenue:", err);
        } finally {
            setLoading(prev => ({ ...prev, revenue: false }));
        }
    };

    // Handle cancel booking
    const handleCancel = async (bookingId) => {
        setModal(prev => ({ ...prev, isProcessing: true }));
        try {
            await axios.patch(
                `${import.meta.env.VITE_BASE_URL}/bookings/${bookingId}/cancel`,
                { status: "cancelled" },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Refresh data
            await Promise.all([
                fetchLatestBookings(latestBookings.currentPage),
                fetchAllBookingsForStats()
            ]);

            // Close modal
            setModal({ isOpen: false, bookingId: null, isProcessing: false });
        } catch (err) {
            console.error("Error cancelling booking:", err);
            alert("Failed to cancel booking");
            setModal(prev => ({ ...prev, isProcessing: false }));
        }
    };

    // Open cancel modal
    const openCancelModal = (bookingId) => {
        setModal({ isOpen: true, bookingId, isProcessing: false });
    };

    // Handle edit booking
    const handleEdit = (id) => {
        console.log("Edit booking:", id);
    };

    // Handle confirm booking
    const handleConfirm = (id) => {
        console.log("Confirm booking:", id);
    };

    // Pagination handlers
    const goToPage = (page) => {
        if (page >= 1 && page <= latestBookings.lastPage) {
            fetchLatestBookings(page);
        }
    };

    const goToNextPage = () => {
        if (latestBookings.currentPage < latestBookings.lastPage) {
            fetchLatestBookings(latestBookings.currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (latestBookings.currentPage > 1) {
            fetchLatestBookings(latestBookings.currentPage - 1);
        }
    };

    // Calculate percentages for progress bar
    const completedPercentage = bookingStats.total > 0 ? (bookingStats.completed / bookingStats.total) * 100 : 0;
    const cancelledPercentage = bookingStats.total > 0 ? (bookingStats.cancelled / bookingStats.total) * 100 : 0;
    const pendingPercentage = bookingStats.total > 0 ? (bookingStats.pending / bookingStats.total) * 100 : 0;

    useEffect(() => {
        fetchRevenue();
        fetchLatestBookings(1);
        fetchAllBookingsForStats();
        fetchSummary();
        fetchTopBarbers();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="px-6 md:px-8 lg:px-12 py-6 md:py-10 border-b border-black/20">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 font-mono text-[10px] md:text-[12px] text-black/70 hover:text-black tracking-widest uppercase mb-6 md:mb-8 transition-all duration-200 hover:gap-3 group"
                >
                    <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Home</span>
                </Link>

                <div>
                    <p className="font-mono text-[10px] md:text-xs tracking-widest uppercase text-black/60 mb-1">
                        Admin Dashboard
                    </p>
                    <h1 className="font-mono font-black text-[40px] md:text-[64px] lg:text-[72px] uppercase leading-none text-black tracking-tight">
                        Halo, {firstName}
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-4 md:px-8 lg:px-12 py-6">

                {/* ROW 1: Revenue + Summary Cards - Grid 2 kolom di desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

                    {/* Revenue Card - Full width di mobile, 1 kolom di desktop */}
                    <div className="border-2 border-black py-4 px-5 bg-white shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 justify-between mb-3">
                            <p className="text-black font-mono text-[10px] uppercase tracking-wide font-bold">Total Revenue (Monthly)</p>
                            <HandCoins className="text-black" size={24} />
                        </div>
                        <div>
                            <p className="text-black font-inter font-bold text-2xl md:text-3xl">
                                {loading.revenue ? "Loading..." : `Rp. ${revenue?.total_revenue?.toLocaleString() || 0}`}
                            </p>
                        </div>
                    </div>

                    {/* Summary Cards Grid - 3 kolom di dalam grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Total Customers Card */}
                        <div className="border-2 border-black py-3 px-4 bg-gradient-to-br from-black to-gray-800 hover:from-gray-800 hover:to-black transition-all">
                            <div className="flex items-center gap-2 justify-between mb-2">
                                <p className="text-white/70 font-mono text-[8px] md:text-[10px] uppercase tracking-wide">Total Customers</p>
                                <Users className="text-white" size={18} />
                            </div>
                            <p className="text-white font-inter font-bold text-xl md:text-2xl">
                                {loading.summary ? "..." : summary.total_customer}
                            </p>
                        </div>

                        {/* Total Barbers Card */}
                        <div className="border-2 border-black py-3 px-4 bg-gradient-to-br from-black to-gray-800 hover:from-gray-800 hover:to-black transition-all">
                            <div className="flex items-center gap-2 justify-between mb-2">
                                <p className="text-white/70 font-mono text-[8px] md:text-[10px] uppercase tracking-wide">Total Barbers</p>
                                <Scissors className="text-white" size={18} />
                            </div>
                            <p className="text-white font-inter font-bold text-xl md:text-2xl">
                                {loading.summary ? "..." : summary.total_barber}
                            </p>
                        </div>

                        {/* Low Stock Products Card */}
                        <div className="border-2 border-black py-3 px-4 bg-gradient-to-br from-black to-gray-800 hover:from-gray-800 hover:to-black transition-all">
                            <div className="flex items-center gap-2 justify-between mb-2">
                                <p className="text-white/70 font-mono text-[8px] md:text-[10px] uppercase tracking-wide">Low Stock Products</p>
                                <Package className="text-white" size={18} />
                            </div>
                            <p className="text-white font-inter font-bold text-xl md:text-2xl">
                                {loading.summary ? "..." : summary.low_stock_product}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ROW 2: Booking Overview (Left) + Latest Bookings (Right) - Rasio 1:3 */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                    {/* Kolom Kiri - Booking Overview & Top Barbers (1 bagian) */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Booking Overview */}
                        <div className="border-2 border-black py-4 px-5 bg-black hover:shadow-lg transition-shadow">
                            <p className="text-white font-mono text-xs uppercase tracking-wide border-b border-white/30 pb-2 font-bold">
                                Booking Overview
                            </p>

                            <div className="flex items-center gap-3 mt-3">
                                <p className="text-white font-mono text-2xl md:text-3xl font-bold">{bookingStats.total}</p>
                                <p className="text-white font-azeretMono text-xs uppercase tracking-wide">Total Bookings</p>
                            </div>

                            {/* Progress Bars */}
                            <div className="mt-6 space-y-4">
                                {/* Completed */}
                                <div>
                                    <div className="flex justify-between font-mono font-bold text-[10px] tracking-widest mb-1">
                                        <p className="text-white">COMPLETED</p>
                                        <p className="text-white">{bookingStats.completed}</p>
                                    </div>
                                    <div className="w-full bg-gray-700 h-1.5 overflow-hidden">
                                        <div
                                            className="bg-green-500 h-1.5 transition-all duration-500 ease-out"
                                            style={{ width: `${completedPercentage}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Cancelled */}
                                <div>
                                    <div className="flex justify-between font-mono font-bold text-[10px] tracking-widest mb-1">
                                        <p className="text-white">CANCELLED</p>
                                        <p className="text-white">{bookingStats.cancelled}</p>
                                    </div>
                                    <div className="w-full bg-gray-700 h-1.5 overflow-hidden">
                                        <div
                                            className="bg-red-500 h-1.5 transition-all duration-500 ease-out"
                                            style={{ width: `${cancelledPercentage}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Pending & Confirmed */}
                                <div>
                                    <div className="flex justify-between font-mono font-bold text-[10px] tracking-widest mb-1">
                                        <p className="text-white">PENDING & CONFIRMED</p>
                                        <p className="text-white">{bookingStats.pending}</p>
                                    </div>
                                    <div className="w-full bg-gray-700 h-1.5 overflow-hidden">
                                        <div
                                            className="bg-yellow-500 h-1.5 transition-all duration-500 ease-out"
                                            style={{ width: `${pendingPercentage}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Top Rated Barbers */}
                        <div className="border-2 border-black py-4 px-5 bg-white hover:shadow-lg transition-shadow">
                            <div className="flex items-center gap-2 justify-between mb-3">
                                <p className="text-black font-mono text-[10px] uppercase tracking-wide font-bold">Top Rated Barbers</p>
                                <Star className="text-yellow-500" size={18} fill="currentColor" />
                            </div>

                            {loading.topBarbers ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="animate-pulse">
                                            <div className="h-4 bg-gray-200  w-3/4 mb-1"></div>
                                            <div className="h-3 bg-gray-100  w-1/2"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : topBarbers.length === 0 ? (
                                <p className="text-gray-500 font-mono text-xs text-center py-4">No data available</p>
                            ) : (
                                <div className="space-y-4">
                                    {topBarbers.map((barber, index) => (
                                        <div key={barber.id} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center justify-center w-6 h-6 bg-black text-white font-mono font-bold text-xs">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <p className="text-black font-mono font-semibold text-sm">
                                                        {barber.name}
                                                    </p>
                                                    <div className="flex items-center gap-1 mt-0.5">
                                                        <Star size={10} className="text-yellow-500 fill-yellow-500" />
                                                        <p className="text-gray-600 font-mono text-xs">
                                                            {parseFloat(barber.rating).toFixed(1)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={12}
                                                            className={`${i < Math.floor(parseFloat(barber.rating))
                                                                ? "text-yellow-500 fill-yellow-500"
                                                                : "text-gray-300"
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Latest Bookings - 3 bagian (kanan) */}
                    <div className="lg:col-span-3">
                        <div>
                            <div className="pb-1 border-b-2 border-black mb-4">
                                <p className="text-black font-mono font-bold text-sm uppercase tracking-wide">
                                    Latest Bookings
                                </p>
                            </div>

                            {/* Bookings Table dengan overflow-x-auto untuk scroll horizontal */}
                            <div className="overflow-x-auto md:mx-0">
                                <div className="min-w-max md:min-w-full">
                                    <table className="w-full text-black border border-collapse bg-white shadow-sm">
                                        <thead className="border bg-black/10">
                                            <tr>
                                                <th className="font-mono text-[10px] md:text-xs font-bold truncate px-3 py-3 text-left">Client Name</th>
                                                <th className="font-mono text-[10px] md:text-xs font-bold truncate px-3 py-3 text-left">Service</th>
                                                <th className="font-mono text-[10px] md:text-xs font-bold truncate px-3 py-3 text-left">Start Time</th>
                                                <th className="font-mono text-[10px] md:text-xs font-bold truncate px-3 py-3 text-left">Status</th>
                                                <th className="font-mono text-[10px] md:text-xs font-bold truncate px-3 py-3 text-left">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="font-mono text-[10px] md:text-xs">
                                            {loading.bookings && latestBookings.data.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" className="text-center py-8 text-gray-500">
                                                        <div className="flex justify-center items-center gap-2">
                                                            <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent"></div>
                                                            Loading bookings...
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : latestBookings.data.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" className="text-center py-8 text-gray-500">
                                                        No bookings found
                                                    </td>
                                                </tr>
                                            ) : (
                                                latestBookings.data.map((b) => (
                                                    <tr key={b.id} className="border-b hover:bg-gray-50 transition-colors">
                                                        <td className="truncate max-w-[120px] px-3 py-3 font-medium">
                                                            {b.user.name.split(" ").slice(0, 2).join(" ")}
                                                        </td>
                                                        <td className="truncate max-w-[180px] px-3 py-3">
                                                            {b.service.name}
                                                        </td>
                                                        <td className="px-3 py-3 font-mono">
                                                            {b.start_time.slice(0, 5)}
                                                        </td>
                                                        <td className="px-3 py-3">
                                                            <span className={`${statusConfig[b.status]?.bg || 'bg-gray-100'} ${statusConfig[b.status]?.border || 'border-gray-300'} ${statusConfig[b.status]?.text || 'text-gray-700'} px-2 py-1 text-[10px] md:text-xs whitespace-nowrap font-semibold`}>
                                                                {statusConfig[b.status]?.label || b.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-3">
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => handleConfirm(b.id)}
                                                                    className="border border-black p-1.5 md:p-2 transition-all hover:bg-green-600 hover:border-green-600 hover:text-white "
                                                                    title="Confirm"
                                                                >
                                                                    <Check size={14} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleEdit(b.id)}
                                                                    className="border border-black p-1.5 md:p-2 transition-all hover:bg-blue-600 hover:border-blue-600 hover:text-white "
                                                                    title="Edit"
                                                                >
                                                                    <PencilLine size={14} />
                                                                </button>
                                                                {b.status !== 'completed' && b.status !== 'cancelled' && (
                                                                    <button
                                                                        onClick={() => openCancelModal(b.id)}
                                                                        className="border border-black p-1.5 md:p-2 transition-all hover:bg-red-600 hover:border-red-600 hover:text-white "
                                                                        title="Cancel"
                                                                    >
                                                                        <Trash2 size={14} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Pagination */}
                            {latestBookings.lastPage > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-6">
                                    <button
                                        onClick={goToPreviousPage}
                                        disabled={latestBookings.currentPage === 1}
                                        className="font-bold text-black border border-black p-2 transition-all hover:bg-black hover:border-black hover:text-white disabled:opacity-40 disabled:cursor-not-allowed "
                                    >
                                        <ChevronLeft size={14} />
                                    </button>

                                    {(() => {
                                        const pageNumbers = [];
                                        const maxVisible = 5;
                                        const { lastPage, currentPage } = latestBookings;

                                        if (lastPage <= maxVisible) {
                                            for (let i = 1; i <= lastPage; i++) pageNumbers.push(i);
                                        } else if (currentPage <= 3) {
                                            for (let i = 1; i <= maxVisible; i++) pageNumbers.push(i);
                                        } else if (currentPage >= lastPage - 2) {
                                            for (let i = lastPage - maxVisible + 1; i <= lastPage; i++) pageNumbers.push(i);
                                        } else {
                                            for (let i = currentPage - 2; i <= currentPage + 2; i++) pageNumbers.push(i);
                                        }

                                        return pageNumbers.map((pageNum) => (
                                            <button
                                                key={pageNum}
                                                onClick={() => goToPage(pageNum)}
                                                className={`border border-black px-3 py-1 transition-all hover:bg-black/50  ${currentPage === pageNum ? 'bg-black text-white' : 'text-black'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        ));
                                    })()}

                                    <button
                                        onClick={goToNextPage}
                                        disabled={latestBookings.currentPage === latestBookings.lastPage}
                                        className="text-black font-bold border border-black p-2 transition-all hover:bg-black hover:border-black hover:text-white disabled:opacity-40 disabled:cursor-not-allowed "
                                    >
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={modal.isOpen}
                onClose={() => setModal({ isOpen: false, bookingId: null, isProcessing: false })}
                onConfirm={handleCancel}
                bookingId={modal.bookingId}
                isProcessing={modal.isProcessing}
            />
        </div>
    );
};

export default AdminDashboard;