import React from "react";

const CandidateCard = React.memo(({ candidate }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
          <p className="text-sm text-gray-600">
            Center no: {candidate.centerNo}
          </p>
          <p className="text-sm text-gray-600">
            Candidate no: {candidate.candidateNo}
          </p>
        </div>
        <div className="flex items-center">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {candidate.status}
          </span>
        </div>
      </div>
    </div>
  );
});

export default CandidateCard;
