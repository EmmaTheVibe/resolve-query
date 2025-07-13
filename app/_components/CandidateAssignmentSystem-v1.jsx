"use client";
import React, { useState } from "react";
import { faker } from "@faker-js/faker";
import {
  Users,
  User,
  MapPin,
  Settings,
  Save,
  ArrowRight,
  ArrowRightLeft,
} from "lucide-react";

const CandidateAssignmentSystem = () => {
  // Mock data for 100 candidates (you would replace this with your actual data)
  const candidates = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: faker.person.fullName(),
    centerNo: "4250101",
    candidateNo: `${String(i + 1).padStart(3, "0")}`,
    status: "Active",
  }));

  const [activeTab, setActiveTab] = useState("overview");

  // Range settings - now supporting multiple ranges per user
  const [user1Ranges, setUser1Ranges] = useState([{ start: 1, end: 50 }]);
  const [user2Ranges, setUser2Ranges] = useState([{ start: 51, end: 100 }]);

  // For the original range editor
  const [user1Start, setUser1Start] = useState(1);
  const [user1End, setUser1End] = useState(50);
  const [user2Start, setUser2Start] = useState(51);
  const [user2End, setUser2End] = useState(100);

  // Temporary range values for editing
  const [tempUser1Start, setTempUser1Start] = useState(1);
  const [tempUser1End, setTempUser1End] = useState(50);
  const [tempUser2Start, setTempUser2Start] = useState(51);
  const [tempUser2End, setTempUser2End] = useState(100);

  const [isEditingRanges, setIsEditingRanges] = useState(false);

  // For range transfer
  const [transferFrom, setTransferFrom] = useState("user1");
  const [transferStart, setTransferStart] = useState(1);
  const [transferEnd, setTransferEnd] = useState(10);

  // Helper function to get candidates from multiple ranges
  const getCandidatesFromRanges = (ranges) => {
    const candidatesList = [];
    ranges.forEach((range) => {
      const rangeCandidates = candidates.slice(range.start - 1, range.end);
      candidatesList.push(...rangeCandidates);
    });
    return candidatesList;
  };

  // Helper function to format ranges for display
  const formatRanges = (ranges) => {
    return ranges.map((range) => `${range.start}-${range.end}`).join(", ");
  };

  // Split candidates between users based on current ranges
  const user1Candidates = getCandidatesFromRanges(user1Ranges);
  const user2Candidates = getCandidatesFromRanges(user2Ranges);

  const users = [
    {
      id: 1,
      name: "Examiner 1",
      candidates: user1Candidates,
      color: "bg-blue-500",
      range: formatRanges(user1Ranges),
    },
    {
      id: 2,
      name: "Examiner 2",
      candidates: user2Candidates,
      color: "bg-green-500",
      range: formatRanges(user2Ranges),
    },
  ];

  const handleTransferRange = () => {
    if (transferStart > transferEnd || transferStart < 1 || transferEnd > 100) {
      alert(
        "Invalid transfer range! Please ensure start ≤ end and range is within 1-100."
      );
      return;
    }

    if (transferFrom === "user1") {
      // Remove from Examiner 1 and add to Examiner 2
      const newUser1Ranges = [];
      const newUser2Ranges = [...user2Ranges];

      user1Ranges.forEach((range) => {
        if (transferEnd < range.start || transferStart > range.end) {
          // No overlap, keep the range
          newUser1Ranges.push(range);
        } else {
          // There's overlap, split the range
          if (transferStart > range.start) {
            newUser1Ranges.push({ start: range.start, end: transferStart - 1 });
          }
          if (transferEnd < range.end) {
            newUser1Ranges.push({ start: transferEnd + 1, end: range.end });
          }
        }
      });

      // Add transferred range to Examiner 2
      newUser2Ranges.push({ start: transferStart, end: transferEnd });

      setUser1Ranges(newUser1Ranges);
      setUser2Ranges(newUser2Ranges.sort((a, b) => a.start - b.start));
    } else {
      // Remove from Examiner 2 and add to Examiner 1
      const newUser2Ranges = [];
      const newUser1Ranges = [...user1Ranges];

      user2Ranges.forEach((range) => {
        if (transferEnd < range.start || transferStart > range.end) {
          // No overlap, keep the range
          newUser2Ranges.push(range);
        } else {
          // There's overlap, split the range
          if (transferStart > range.start) {
            newUser2Ranges.push({ start: range.start, end: transferStart - 1 });
          }
          if (transferEnd < range.end) {
            newUser2Ranges.push({ start: transferEnd + 1, end: range.end });
          }
        }
      });

      // Add transferred range to Examiner 1
      newUser1Ranges.push({ start: transferStart, end: transferEnd });

      setUser2Ranges(newUser2Ranges);
      setUser1Ranges(newUser1Ranges.sort((a, b) => a.start - b.start));
    }
  };

  // Add these functions to your CandidateAssignmentSystem component

  const handleSaveRanges = () => {
    // Validation
    if (tempUser1Start > tempUser1End || tempUser2Start > tempUser2End) {
      alert("Invalid range! Start must be less than or equal to end.");
      return;
    }

    if (
      tempUser1Start < 1 ||
      tempUser1End > 100 ||
      tempUser2Start < 1 ||
      tempUser2End > 100
    ) {
      alert("Ranges must be within 1-100!");
      return;
    }

    // Check for overlaps
    if (tempUser1Start <= tempUser2End && tempUser2Start <= tempUser1End) {
      alert("Ranges cannot overlap!");
      return;
    }

    // Check for gaps (optional - remove if gaps are allowed)
    const allRanges = [
      { start: tempUser1Start, end: tempUser1End },
      { start: tempUser2Start, end: tempUser2End },
    ].sort((a, b) => a.start - b.start);

    for (let i = 0; i < allRanges.length - 1; i++) {
      if (allRanges[i].end + 1 < allRanges[i + 1].start) {
        const gapStart = allRanges[i].end + 1;
        const gapEnd = allRanges[i + 1].start - 1;
        if (
          !confirm(
            `There will be a gap in candidates ${gapStart}-${gapEnd}. Continue?`
          )
        ) {
          return;
        }
      }
    }

    // Save the ranges
    setUser1Start(tempUser1Start);
    setUser1End(tempUser1End);
    setUser2Start(tempUser2Start);
    setUser2End(tempUser2End);

    // Update the ranges arrays for the new system
    setUser1Ranges([{ start: tempUser1Start, end: tempUser1End }]);
    setUser2Ranges([{ start: tempUser2Start, end: tempUser2End }]);

    setIsEditingRanges(false);
  };

  const handleCancelEdit = () => {
    // Reset temp values to current values
    setTempUser1Start(user1Start);
    setTempUser1End(user1End);
    setTempUser2Start(user2Start);
    setTempUser2End(user2End);
    setIsEditingRanges(false);
  };

  const RangeTransferComponent = () => (
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
                  type="number"
                  min="1"
                  max="100"
                  value={transferStart}
                  onChange={(e) =>
                    setTransferStart(parseInt(e.target.value) || 1)
                  }
                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-gray-700 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End:
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={transferEnd}
                  onChange={(e) =>
                    setTransferEnd(parseInt(e.target.value) || 1)
                  }
                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-gray-700 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
  );

  const RangeAdjustmentComponent = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Settings className="w-5 h-5 mr-2 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Range Assignment
          </h3>
        </div>
        {!isEditingRanges ? (
          <button
            onClick={() => setIsEditingRanges(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Edit Ranges
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSaveRanges}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
            <h4 className="font-medium text-gray-900">Examiner 1</h4>
          </div>

          {isEditingRanges ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600 w-12">Start:</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={tempUser1Start}
                  onChange={(e) =>
                    setTempUser1Start(parseInt(e.target.value) || 1)
                  }
                  className="w-20 px-2 py-1 border border-gray-300 rounded-md text-gray-700 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600 w-12">End:</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={tempUser1End}
                  onChange={(e) =>
                    setTempUser1End(parseInt(e.target.value) || 1)
                  }
                  className="w-20 px-2 py-1 border border-gray-300 rounded-md text-gray-700 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          ) : (
            <div className="text-gray-600">
              <p>
                Range: {user1Start}-{user1End}
              </p>
              <p className="text-sm">
                Total: {user1End - user1Start + 1} candidates
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
            <h4 className="font-medium text-gray-900">Examiner 2</h4>
          </div>

          {isEditingRanges ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600 w-12">Start:</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={tempUser2Start}
                  onChange={(e) =>
                    setTempUser2Start(parseInt(e.target.value) || 1)
                  }
                  className="w-20 px-2 py-1 border border-gray-300 text-gray-700 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600 w-12">End:</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={tempUser2End}
                  onChange={(e) =>
                    setTempUser2End(parseInt(e.target.value) || 1)
                  }
                  className="w-20 px-2 py-1 border border-gray-300 rounded-md text-gray-700 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          ) : (
            <div className="text-gray-600">
              <p>
                Range: {user2Start}-{user2End}
              </p>
              <p className="text-sm">
                Total: {user2End - user2Start + 1} candidates
              </p>
            </div>
          )}
        </div>
      </div>

      {isEditingRanges && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Ranges must be within 1-100, cannot overlap,
            and start must be less than or equal to end.
          </p>
        </div>
      )}
    </div>
  );

  const CandidateCard = ({ candidate }) => (
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

  const UserSection = ({ user }) => (
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

  const OverviewStats = () => (
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
            <p className="text-sm font-medium text-gray-600">
              Total Candidates
            </p>
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
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Candidate Assignment System
          </h1>
          <p className="text-gray-600">
            Center with 100 candidates assigned to 2 examiners
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8 overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:h-0">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "overview"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("transfer")}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "transfer"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Transfer Ranges
            </button>
            <button
              onClick={() => setActiveTab("ranges")}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "ranges"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Manage Ranges
            </button>
            <button
              onClick={() => setActiveTab("user1")}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "user1"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Examiner 1 ({formatRanges(user1Ranges)})
            </button>
            <button
              onClick={() => setActiveTab("user2")}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "user2"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Examiner 2 ({formatRanges(user2Ranges)})
            </button>
          </nav>
        </div>

        {/* Content based on active tab */}
        {activeTab === "overview" && (
          <div>
            <OverviewStats />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Examiner 1 Assignment
                  </h3>
                </div>
                <p className="text-gray-600 mb-2">
                  Candidates: {formatRanges(user1Ranges)}
                </p>
                <p className="text-sm text-gray-500">
                  Total assigned: {user1Candidates.length} candidates
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Examiner 2 Assignment
                  </h3>
                </div>
                <p className="text-gray-600 mb-2">
                  Candidates: {formatRanges(user2Ranges)}
                </p>
                <p className="text-sm text-gray-500">
                  Total assigned: {user2Candidates.length} candidates
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "transfer" && <RangeTransferComponent />}
        {activeTab === "ranges" && <RangeAdjustmentComponent />}
        {activeTab === "user1" && <UserSection user={users[0]} />}
        {activeTab === "user2" && <UserSection user={users[1]} />}
      </div>
    </div>
  );
};

export default CandidateAssignmentSystem;
