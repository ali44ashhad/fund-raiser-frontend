import React, { useState, useEffect } from "react";

const TournamentManagement = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // simulate loading delay
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF7F11]"
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-[#FF7F11]">
          Tournament Management
        </h1>
      </div>

      <div className="bg-[#0B1D13] border border-[#2A2A2A] rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#2A2A2A]">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Tournament Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              <tr>
                <td
                  colSpan={2}
                  className="px-4 py-6 text-center text-gray-400 text-lg"
                >
                  Coming Soon...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TournamentManagement;
