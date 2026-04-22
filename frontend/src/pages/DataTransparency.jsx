import React, { useState, useEffect } from "react";
import { fetchGlobalSpending } from "../services/api";

export default function Transparency() {
  const [filings, setFilings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await fetchGlobalSpending();

        setFilings(data);
      } catch (err) {
        console.error("Error fetching filings:", err);
        setError(
          "Failed to load data from the server. Ensure the backend is running.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const getFilteredData = () => {
    if (!Array.isArray(filings)) return [];

    let data = [...filings];

    if (activeFilter === "Top Spenders") {
      return data.sort((a, b) => b.amount - a.amount).slice(0, 3);
    }
    if (activeFilter === "Tech Sector") {
      return data.filter((item) => item.issue && item.issue.includes("Tech"));
    }
    if (activeFilter === "Recent") {
      return data.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return data;
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const displayData = getFilteredData();

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Transparency Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Tracking corporate influence and lobbying expenditures in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 shadow-sm">
          <h3 className="text-blue-800 text-sm font-semibold uppercase tracking-wider">
            Total Tracked (2024)
          </h3>
          <p className="text-3xl font-bold text-blue-900 mt-2">$18.05M</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg border border-green-100 shadow-sm">
          <h3 className="text-green-800 text-sm font-semibold uppercase tracking-wider">
            Active Filings
          </h3>
          <p className="text-3xl font-bold text-green-900 mt-2">
            {filings.length > 0 ? filings.length : "..."}
          </p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-100 shadow-sm">
          <h3 className="text-purple-800 text-sm font-semibold uppercase tracking-wider">
            Top Issue Area
          </h3>
          <p className="text-3xl font-bold text-purple-900 mt-2">Technology</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Recent Disclosures
          </h2>

          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {["All", "Recent", "Top Spenders", "Tech Sector"].map(
              (filterName) => (
                <button
                  key={filterName}
                  onClick={() => setActiveFilter(filterName)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                    activeFilter === filterName
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {filterName}
                </button>
              ),
            )}
          </div>
        </div>

        {error ? (
          <div className="p-12 text-center text-red-600 bg-red-50">
            <p className="font-semibold">{error}</p>
          </div>
        ) : isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            Loading lobbying data from database...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                  <th className="px-6 py-3 font-medium">Company</th>
                  <th className="px-6 py-3 font-medium">Amount Spent</th>
                  <th className="px-6 py-3 font-medium">Primary Issue</th>
                  <th className="px-6 py-3 font-medium">Lobbying Firm</th>
                  <th className="px-6 py-3 font-medium">Date Filed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {displayData.map((filing) => (
                  <tr
                    key={filing.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {filing.company || filing.name}
                    </td>
                    <td className="px-6 py-4 font-semibold text-red-600">
                      {formatCurrency(filing.amount)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {filing.issue || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {filing.lobbyist || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {filing.date || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {displayData.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No filings found for this filter.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
