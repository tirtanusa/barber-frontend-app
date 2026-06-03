import React from "react";
import ServiceRow from "./ServiceRow";

const ServiceTable = ({ services, onEdit, onDelete, isLoading }) => {
  if (isLoading) {
    return (
      <div className="border-2 border-black bg-white p-12 text-center">
        <p className="font-mono text-sm font-bold uppercase tracking-widest animate-pulse">
          Loading Services...
        </p>
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className="border-2 border-black bg-white p-12 text-center">
        <p className="font-mono text-sm font-bold uppercase tracking-widest text-black/50">
          No services found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="bg-black/5 border-b-2 border-black font-mono text-xs uppercase font-bold text-black tracking-wider">
            <th className="px-6 py-4 w-16">ID</th>
            <th className="px-6 py-4 w-1/4">Name</th>
            <th className="px-6 py-4 w-1/4">Description</th>
            <th className="px-6 py-4 w-32">Price</th>
            <th className="px-6 py-4 w-32">Duration</th>
            <th className="px-6 py-4 text-right w-24">Actions</th>
          </tr>
        </thead>
        <tbody className="font-mono text-xs text-black">
          {services.map((service) => (
            <ServiceRow
              key={service.id}
              service={service}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceTable;
