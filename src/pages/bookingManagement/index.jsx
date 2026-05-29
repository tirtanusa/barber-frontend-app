import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import BookingFilters from "./BookingFilters";
import BookingTable from "./BookingTable";
import BookingDetail from "./BookingDetail";
import Pagination from "./Pagination";

const BASE = import.meta.env.VITE_BASE_URL;

const BookingManagement = () => {
  const { token } = useContext(AuthContext);

  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    date: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchBookings = async (page = 1) => {
    setIsLoading(true);
    try {
      const params = {
        page,
        limit: 10,
      };
      if (filters.status) params.status = filters.status;
      if (filters.date) params.date = filters.date;

      const response = await axios.get(`${BASE}/bookings`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = response.data.data;
      setBookings(result.data || []);
      setPagination({
        currentPage: result.current_page || 1,
        lastPage: result.last_page || 1,
        total: result.total || 0,
      });
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedBooking) return;
    setIsProcessing(true);
    try {
      await axios.patch(
        `${BASE}/bookings/${selectedBooking.id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refetch page
      await fetchBookings(pagination.currentPage);

      // Update selected booking with the new status locally to update UI inside modal
      setSelectedBooking((prev) =>
        prev ? { ...prev, status: newStatus } : null
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Trigger refetch on page change or filter changes
  useEffect(() => {
    if (token) {
      fetchBookings(1);
    }
  }, [filters, token]);

  const handlePageChange = (page) => {
    fetchBookings(page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="px-6 md:px-8 lg:px-12 py-6 md:py-10 border-b border-black/20">
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center gap-2 font-mono text-[10px] md:text-[12px] text-black/70 hover:text-black tracking-widest uppercase mb-6 md:mb-8 transition-all duration-200 hover:gap-3 group"
        >
          <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>

        <div>
          <p className="font-mono text-[10px] md:text-xs tracking-widest uppercase text-black/60 mb-1">
            System Admin
          </p>
          <h1 className="font-mono font-black text-[32px] md:text-[48px] uppercase leading-none text-black tracking-tight">
            Booking Management
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-8 lg:px-12 py-6">
        <BookingFilters filters={filters} onFilterChange={handleFilterChange} />

        <BookingTable
          bookings={bookings}
          isLoading={isLoading}
          onViewDetail={setSelectedBooking}
        />

        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Booking Detail Modal */}
      <BookingDetail
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        booking={selectedBooking}
        onUpdateStatus={handleUpdateStatus}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default BookingManagement;
