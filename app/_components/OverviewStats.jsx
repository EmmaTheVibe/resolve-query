import React from "react";

import { MapPin, Users, User } from "lucide-react";

const OverviewStats = React.memo(() => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center">
        <MapPin className="w-8 h-8 text-indigo-600 mr-3" />
        <div>
          <p className="text-sm font-medium text-gray-600">Center</p>
          <p className="text-2xl font-bold text-gray-900">4250101</p>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center">
        <Users className="w-8 h-8 text-blue-600 mr-3" />
        <div>
          <p className="text-sm font-medium text-gray-600">Total Candidates</p>
          <p className="text-2xl font-bold text-gray-900">100</p>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center">
        <User className="w-8 h-8 text-green-600 mr-3" />
        <div>
          <p className="text-sm font-medium text-gray-600">
            Assigned Examiners
          </p>
          <p className="text-2xl font-bold text-gray-900">2</p>
        </div>
      </div>
    </div>
  </div>
));

export default OverviewStats;
