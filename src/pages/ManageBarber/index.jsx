import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import BarberFilter from "./BarberFilter";
import BarberList from "./BarberList";
import BarberForm from "./BarberForm";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

const BASE = import.meta.env.VITE_BASE_URL;

const ManageBarber = () => {
  const { token } = useContext(AuthContext);

  // States matching the required structure
  const [barbers, setBarbers] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isScheduleFormOpen, setIsScheduleFormOpen] = useState(false);
  const [generateDate, setGenerateDate] = useState("");
  const [filterActive, setFilterActive] = useState(""); // "" (All), "true" (Active), "false" (Inactive)
  const [isLoading, setIsLoading] = useState(false);

  // Additional helper states
  const [formMode, setFormMode] = useState("add"); // "add" or "edit"
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch all barbers (handles GET /barbers or fallback GET /barber)
  const fetchBarbers = async () => {
    setIsLoading(true);
    try {
      // The user requested GET /barbers. We will attempt GET /barber first as it is confirmed working in the booking system, or fallback to /barbers
      let endpoint = `${BASE}/barber`;
      try {
        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });

        let fetchedData = [];
        if (response.data?.data?.data) {
          fetchedData = response.data.data.data;
        } else if (response.data?.data) {
          fetchedData = response.data.data;
        } else {
          fetchedData = response.data || [];
        }
        setBarbers(fetchedData);
      } catch (err) {
        // Fallback to /barbers
        const response = await axios.get(`${BASE}/barbers`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        let fetchedData = response.data?.data?.data || response.data?.data || response.data || [];
        setBarbers(fetchedData);
      }
    } catch (error) {
      console.error("Error fetching barbers:", error);
      showNotification("Failed to fetch barbers", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchBarbers();
    }
  }, [token]);

  // Handle toggle active/nonactive
  const handleToggleActive = async (barber) => {
    const updatedStatus = !barber.is_active;
    try {
      // Toggle PUT /barbers/{id} { is_active: true/false }
      // We will try both /barbers and /barber endpoint paths
      try {
        await axios.put(
          `${BASE}/barber/${barber.id}`,
          {
            name: barber.name,
            bio: barber.bio,
            rating: barber.rating,
            is_active: updatedStatus
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch {
        await axios.put(
          `${BASE}/barbers/${barber.id}`,
          { is_active: updatedStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      showNotification(`Barber ${barber.name} status updated successfully.`);
      fetchBarbers();
    } catch (error) {
      console.error("Error toggling active status:", error);
      showNotification("Failed to toggle barber status", "error");
    }
  };

  // Handle open add modal
  const handleAddBarberClick = () => {
    setFormMode("add");
    setSelectedBarber(null);
    setIsFormOpen(true);
  };

  // Handle open edit modal
  const handleEditBarberClick = (barber) => {
    setFormMode("edit");
    setSelectedBarber(barber);
    setIsFormOpen(true);
  };

  // Handle open delete confirmation
  const handleDeleteBarberClick = (barber) => {
    setSelectedBarber(barber);
    setIsDeleteOpen(true);
  };

  // Confirm delete barber
  const handleConfirmDelete = async () => {
    if (!selectedBarber) return;
    try {
      try {
        await axios.delete(`${BASE}/barber/${selectedBarber.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch {
        await axios.delete(`${BASE}/barbers/${selectedBarber.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      showNotification(`Barber ${selectedBarber.name} deleted successfully.`);
      setIsDeleteOpen(false);
      setSelectedBarber(null);
      fetchBarbers();
    } catch (error) {
      console.error("Error deleting barber:", error);
      showNotification("Failed to delete barber", "error");
    }
  };

  // Fetch schedule for expanded barber
  const fetchSchedules = async (barberId) => {
    try {
      const response = await axios.get(`${BASE}/barber/${barberId}/schedule`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Handle paginated response: response.data.data.data
      let scheduleData = [];
      if (response.data?.data?.data) {
        scheduleData = response.data.data.data;
      } else if (response.data?.data) {
        scheduleData = response.data.data;
      } else {
        scheduleData = response.data || [];
      }
      setSchedules(Array.isArray(scheduleData) ? scheduleData : []);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setSchedules([]);
    }
  };

  // Filtered barbers
  const filteredBarbers = barbers.filter((barber) => {
    if (filterActive === "") return true;
    const isActiveString = String(barber.is_active);
    return isActiveString === filterActive;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 border-2 border-black font-mono text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${notification.type === "success" ? "bg-green-100 text-green-950" : "bg-red-100 text-red-950"
          }`}>
          {notification.message}
        </div>
      )}

      {/* Header Section */}
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
              Manage Barbers
            </h1>
          </div>
          <div>
            <button
              onClick={handleAddBarberClick}
              className="inline-flex items-center gap-2 border-2 border-black bg-black text-white hover:bg-white hover:text-black font-mono text-xs md:text-sm font-bold uppercase tracking-wider px-6 py-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all duration-200"
            >
              <Plus size={16} />
              <span>Add New Barber</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-8 lg:px-12 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <BarberFilter filterActive={filterActive} onFilterChange={setFilterActive} />

          <BarberList
            barbers={filteredBarbers}
            isLoading={isLoading}
            onToggleActive={handleToggleActive}
            onEdit={handleEditBarberClick}
            onDelete={handleDeleteBarberClick}
            schedules={schedules}
            fetchSchedules={fetchSchedules}
            setSchedules={setSchedules}
            showNotification={showNotification}
            token={token}
            BASE={BASE}
          />
        </div>
      </div>

      {/* Barber Form Modal */}
      <BarberForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        mode={formMode}
        barber={selectedBarber}
        onSuccess={(message) => {
          showNotification(message);
          fetchBarbers();
        }}
        token={token}
        BASE={BASE}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedBarber(null);
        }}
        onConfirm={handleConfirmDelete}
        barberName={selectedBarber?.name || "this barber"}
      />
    </div>
  );
};

export default ManageBarber;
