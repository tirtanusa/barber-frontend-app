import React, { useState, useEffect, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import ServiceSearch from "./ServiceSearch";
import ServiceTable from "./ServiceTable";
import ServiceForm from "./ServiceForm";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

const BASE = import.meta.env.VITE_BASE_URL;

const ManageService = () => {
  const { token } = useContext(AuthContext);

  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formMode, setFormMode] = useState("add"); // "add" or "edit"
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE}/services`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Handle potential pagination format
      let fetchedData = [];
      if (response.data?.data?.data) {
        fetchedData = response.data.data.data;
      } else if (response.data?.data) {
        fetchedData = response.data.data;
      } else {
        fetchedData = response.data || [];
      }
      setServices(Array.isArray(fetchedData) ? fetchedData : []);
    } catch (error) {
      console.error("Error fetching services:", error);
      showNotification("Failed to fetch services", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchServices();
    }
  }, [token]);

  const handleAddClick = () => {
    setFormMode("add");
    setSelectedService(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (service) => {
    setFormMode("edit");
    setSelectedService(service);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (service) => {
    setSelectedService(service);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedService) return;
    try {
      await axios.delete(`${BASE}/services/${selectedService.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showNotification(`Service "${selectedService.name}" deleted successfully.`);
      setIsDeleteConfirmOpen(false);
      setSelectedService(null);
      fetchServices();
    } catch (error) {
      console.error("Error deleting service:", error);
      showNotification(
        error.response?.data?.message || "Failed to delete service",
        "error"
      );
    }
  };

  // Filter services by search query
  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return services;
    const lowerQuery = searchQuery.toLowerCase();
    return services.filter((service) =>
      service.name.toLowerCase().includes(lowerQuery)
    );
  }, [services, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 border-2 border-black font-mono text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
          notification.type === "success" ? "bg-green-100 text-green-950" : "bg-red-100 text-red-950"
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
              Manage Services
            </h1>
          </div>
          <div>
            <button
              onClick={handleAddClick}
              className="inline-flex items-center gap-2 border-2 border-black bg-black text-white hover:bg-white hover:text-black font-mono text-xs md:text-sm font-bold uppercase tracking-wider px-6 py-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all duration-200"
            >
              <Plus size={16} />
              <span>Add New Service</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-8 lg:px-12 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white p-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <ServiceSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-black/60">
              Total Services: {filteredServices.length}
            </div>
          </div>

          <ServiceTable
            services={filteredServices}
            isLoading={isLoading}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        </div>
      </div>

      {/* Modals */}
      <ServiceForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        mode={formMode}
        service={selectedService}
        onSuccess={(message) => {
          showNotification(message);
          fetchServices();
        }}
        token={token}
        BASE={BASE}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setSelectedService(null);
        }}
        onConfirm={handleConfirmDelete}
        serviceName={selectedService?.name || "this service"}
      />
    </div>
  );
};

export default ManageService;
