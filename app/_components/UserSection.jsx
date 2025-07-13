import React from "react";

import { User } from "lucide-react";
import CandidateCard from "./CandidateCard";

const UserSection = React.memo(({ user }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <div className={`w-3 h-3 rounded-full ${user.color} mr-3`}></div>
        <User className="w-5 h-5 mr-2 text-gray-600" />
        <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
        <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm font-medium">
          {user.candidates.length} candidates
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {user.candidates.map((candidate) => (
          <CandidateCard key={candidate.id} candidate={candidate} />
        ))}
      </div>
    </div>
  );
});

export default UserSection;
