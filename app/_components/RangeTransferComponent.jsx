import React from "react";

import { ArrowRight, ArrowRightLeft } from "lucide-react";

const RangeTransferComponent = React.memo(
  ({
    user1Ranges,
    user2Ranges,
    transferFrom,
    setTransferFrom,
    transferStart,
    setTransferStart,
    transferEnd,
    setTransferEnd,
    handleTransferRange,
    formatRanges,
    user1Candidates,
    user2Candidates,
    handleNumberInput,
    handleKeyPress,
  }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center mb-4">
        <ArrowRightLeft className="w-5 h-5 mr-2 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Transfer Candidates
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-3">
            Current Assignments
          </h4>
          <div className="space-y-2">
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
              <div>
                <p className="font-medium text-blue-900">Examiner 1</p>
                <p className="text-sm text-blue-700">
                  {formatRanges(user1Ranges)}
                </p>
                <p className="text-xs text-blue-600">
                  {user1Candidates.length} candidates
                </p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
              <div>
                <p className="font-medium text-green-900">Examiner 2</p>
                <p className="text-sm text-green-700">
                  {formatRanges(user2Ranges)}
                </p>
                <p className="text-xs text-green-600">
                  {user2Candidates.length} candidates
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-3">Transfer Range</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transfer from:
              </label>
              <select
                value={transferFrom}
                onChange={(e) => setTransferFrom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="user1">Examiner 1</option>
                <option value="user2">Examiner 2</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start:
                </label>
                <input
                  type="text"
                  value={transferStart}
                  onChange={(e) =>
                    handleNumberInput(e, setTransferStart, 1, 100)
                  }
                  onKeyDown={handleKeyPress}
                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-gray-700 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End:
                </label>
                <input
                  type="text"
                  value={transferEnd}
                  onChange={(e) => handleNumberInput(e, setTransferEnd, 1, 100)}
                  onKeyDown={handleKeyPress}
                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-gray-700 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="10"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">
                Transfer {transferEnd - transferStart + 1} candidates (
                {transferStart}-{transferEnd})
              </span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900">
                {transferFrom === "user1" ? "Examiner 2" : "Examiner 1"}
              </span>
            </div>

            <button
              onClick={handleTransferRange}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Transfer Range
            </button>
          </div>
        </div>
      </div>

      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-sm text-yellow-800">
          <strong>How it works:</strong> Select a range to transfer from one
          examiner to another. The candidates will be removed from the source
          examiner and added to the destination examiner's list. Multiple ranges
          are automatically merged and sorted.
        </p>
      </div>
    </div>
  )
);

export default RangeTransferComponent;
