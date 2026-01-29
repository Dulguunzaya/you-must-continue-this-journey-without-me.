"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

interface Table {
  _id: string;
  name: string;
  status: "AVAILABLE" | "PLAYING" | "DISABLED";
  pricePerMinute: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTable, setNewTable] = useState({ name: "", pricePerMinute: "" });

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      router.push("/dashboard");
      return;
    }
    fetchTables();
  }, [user, router]);

  const fetchTables = async () => {
    try {
      const response = await fetch("/api/admin/tables", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tables");
      }

      const data = await response.json();
      setTables(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tables");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTable = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTable.name || !newTable.pricePerMinute) {
      setError("Please fill all fields");
      return;
    }

    try {
      const response = await fetch("/api/admin/tables", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newTable.name,
          pricePerMinute: parseFloat(newTable.pricePerMinute),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add table");
      }

      setShowAddModal(false);
      setNewTable({ name: "", pricePerMinute: "" });
      fetchTables();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add table");
    }
  };

  const handleDeleteTable = async (tableId: string) => {
    if (!confirm("Are you sure you want to delete this table?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/tables/${tableId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete table");
      }

      fetchTables();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete table");
    }
  };

  const handleStopTable = async (tableId: string) => {
    try {
      const response = await fetch(`/api/admin/tables/${tableId}/stop`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to stop table");
      }

      fetchTables();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to stop table");
    }
  };

  const handleToggleStatus = async (tableId: string, currentStatus: string) => {
    const newStatus = currentStatus === "AVAILABLE" ? "DISABLED" : "AVAILABLE";

    try {
      const response = await fetch(`/api/admin/tables/${tableId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update table status");
      }

      fetchTables();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update table status",
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Table
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button onClick={() => setError("")} className="float-right">
              &times;
            </button>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {tables.map((table) => (
              <li key={table._id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {table.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Price: ${table.pricePerMinute}/minute
                    </p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        table.status === "AVAILABLE"
                          ? "bg-green-100 text-green-800"
                          : table.status === "PLAYING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {table.status}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    {table.status === "PLAYING" && (
                      <button
                        onClick={() => handleStopTable(table._id)}
                        className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700 transition-colors"
                      >
                        Stop
                      </button>
                    )}
                    {table.status !== "PLAYING" && (
                      <button
                        onClick={() =>
                          handleToggleStatus(table._id, table.status)
                        }
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          table.status === "AVAILABLE"
                            ? "bg-gray-600 text-white hover:bg-gray-700"
                            : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                      >
                        {table.status === "AVAILABLE" ? "Disable" : "Enable"}
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteTable(table._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {tables.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No tables found. Add your first table to get started.
              </p>
            </div>
          )}
        </div>

        {showAddModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Add New Table
              </h3>
              <form onSubmit={handleAddTable}>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="name"
                  >
                    Table Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={newTable.name}
                    onChange={(e) =>
                      setNewTable({ ...newTable, name: e.target.value })
                    }
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Table 1"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="pricePerMinute"
                  >
                    Price Per Minute ($)
                  </label>
                  <input
                    type="number"
                    id="pricePerMinute"
                    value={newTable.pricePerMinute}
                    onChange={(e) =>
                      setNewTable({
                        ...newTable,
                        pricePerMinute: e.target.value,
                      })
                    }
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="0.50"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setNewTable({ name: "", pricePerMinute: "" });
                      setError("");
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Add Table
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
