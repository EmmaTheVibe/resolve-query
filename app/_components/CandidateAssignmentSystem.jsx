"use client";
import React, { useState, useCallback, useMemo } from "react";
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

// --- Extracted and Memoized Child Components ---

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

const RangeAdjustmentComponent = React.memo(
  ({
    isEditingRanges,
    setIsEditingRanges,
    user1Start,
    user1End,
    user2Start,
    user2End,
    setUser1Ranges,
    setUser2Ranges,
    handleNumberInput,
    handleKeyPress,
  }) => {
    // State for temporary edits, localized to this component
    const [tempUser1Start, setTempUser1Start] = useState(user1Start);
    const [tempUser1End, setTempUser1End] = useState(user1End);
    const [tempUser2Start, setTempUser2Start] = useState(user2Start);
    const [tempUser2End, setTempUser2End] = useState(user2End);

    // Effect to update temp values when external user1Start/user1End change
    React.useEffect(() => {
      setTempUser1Start(user1Start);
      setTempUser1End(user1End);
    }, [user1Start, user1End]);

    React.useEffect(() => {
      setTempUser2Start(user2Start);
      setTempUser2End(user2End);
    }, [user2Start, user2End]);

    const handleSaveRanges = useCallback(() => {
      const u1Start = tempUser1Start === "" ? 1 : tempUser1Start;
      const u1End = tempUser1End === "" ? 1 : tempUser1End;
      const u2Start = tempUser2Start === "" ? 1 : tempUser2Start;
      const u2End = tempUser2End === "" ? 1 : tempUser2End;

      if (u1Start > u1End || u2Start > u2End) {
        alert("Invalid range! Start must be less than or equal to end.");
        return;
      }

      if (u1Start < 1 || u1End > 100 || u2Start < 1 || u2End > 100) {
        alert("Ranges must be within 1-100!");
        return;
      }

      if (u1Start <= u2End && u2Start <= u1End) {
        alert("Ranges cannot overlap!");
        return;
      }

      const allRanges = [
        { start: u1Start, end: u1End },
        { start: u2Start, end: u2End },
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

      // Call setters passed from parent to update actual ranges
      setUser1Ranges([{ start: u1Start, end: u1End }]);
      setUser2Ranges([{ start: u2Start, end: u2End }]);

      setIsEditingRanges(false);
    }, [
      tempUser1Start,
      tempUser1End,
      tempUser2Start,
      tempUser2End,
      setUser1Ranges,
      setUser2Ranges,
      setIsEditingRanges,
    ]);

    const handleCancelEdit = useCallback(() => {
      setTempUser1Start(user1Start);
      setTempUser1End(user1End);
      setTempUser2Start(user2Start);
      setTempUser2End(user2End);
      setIsEditingRanges(false);
    }, [user1Start, user1End, user2Start, user2End, setIsEditingRanges]);

    return (
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
                    type="text"
                    value={tempUser1Start}
                    onChange={(e) =>
                      handleNumberInput(e, setTempUser1Start, 1, 100)
                    }
                    onKeyDown={handleKeyPress}
                    className="w-20 px-2 py-1 border border-gray-300 rounded-md text-gray-700 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="1"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600 w-12">End:</label>
                  <input
                    type="text"
                    value={tempUser1End}
                    onChange={(e) =>
                      handleNumberInput(e, setTempUser1End, 1, 100)
                    }
                    onKeyDown={handleKeyPress}
                    className="w-20 px-2 py-1 border border-gray-300 rounded-md text-gray-700 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="50"
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
                    type="text"
                    value={tempUser2Start}
                    onChange={(e) =>
                      handleNumberInput(e, setTempUser2Start, 1, 100)
                    }
                    onKeyDown={handleKeyPress}
                    className="w-20 px-2 py-1 border border-gray-300 rounded-md text-gray-700 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="51"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600 w-12">End:</label>
                  <input
                    type="text"
                    value={tempUser2End}
                    onChange={(e) =>
                      handleNumberInput(e, setTempUser2End, 1, 100)
                    }
                    onKeyDown={handleKeyPress}
                    className="w-20 px-2 py-1 border border-gray-300 rounded-md text-gray-700 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="100"
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
              <strong>Note:</strong> Ranges must be within 1-100, cannot
              overlap, and start must be less than or equal to end. Only numbers
              are allowed.
            </p>
          </div>
        )}
      </div>
    );
  }
);

// --- Main Component ---
const CandidateAssignmentSystem = () => {
  // Mock data for 100 candidates (you would replace this with your actual data)
  const candidates = useMemo(
    () =>
      Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: faker.person.fullName(),
        centerNo: "4250101",
        candidateNo: `${String(i + 1).padStart(3, "0")}`,
        status: "Active",
      })),
    []
  );

  const [activeTab, setActiveTab] = useState("overview");

  // Range settings - now supporting multiple ranges per user
  const [user1Ranges, setUser1Ranges] = useState([{ start: 1, end: 50 }]);
  const [user2Ranges, setUser2Ranges] = useState([{ start: 51, end: 100 }]);

  // For the original range editor
  const [user1Start, setUser1Start] = useState(1);
  const [user1End, setUser1End] = useState(50);
  const [user2Start, setUser2Start] = useState(51);
  const [user2End, setUser2End] = useState(100);

  const [isEditingRanges, setIsEditingRanges] = useState(false);

  // For range transfer
  const [transferFrom, setTransferFrom] = useState("user1");
  const [transferStart, setTransferStart] = useState(1);
  const [transferEnd, setTransferEnd] = useState(10);

  // Number-only input handler
  const handleNumberInput = useCallback((e, setter, min = 1, max = 100) => {
    const value = e.target.value;
    if (value === "") {
      setter("");
      return;
    }
    if (!/^\d+$/.test(value)) {
      return;
    }
    const numValue = parseInt(value);
    if (numValue >= min && numValue <= max) {
      setter(numValue);
    }
  }, []);

  // Handle key press to prevent non-numeric input
  const handleKeyPress = useCallback((e) => {
    if (
      ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
    ) {
      return;
    }
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  }, []);

  // Helper function to get candidates from multiple ranges
  const getCandidatesFromRanges = useCallback(
    (ranges) => {
      const candidatesList = [];
      ranges.forEach((range) => {
        const rangeCandidates = candidates.slice(range.start - 1, range.end);
        candidatesList.push(...rangeCandidates);
      });
      return candidatesList;
    },
    [candidates]
  ); // Dependency on 'candidates'

  // Helper function to format ranges for display
  const formatRanges = useCallback((ranges) => {
    return ranges.map((range) => `${range.start}-${range.end}`).join(", ");
  }, []);

  // Split candidates between users based on current ranges
  const user1Candidates = useMemo(
    () => getCandidatesFromRanges(user1Ranges),
    [user1Ranges, getCandidatesFromRanges]
  );
  const user2Candidates = useMemo(
    () => getCandidatesFromRanges(user2Ranges),
    [user2Ranges, getCandidatesFromRanges]
  );

  const users = useMemo(
    () => [
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
    ],
    [user1Candidates, user2Candidates, user1Ranges, user2Ranges, formatRanges]
  );

  const handleTransferRange = useCallback(() => {
    if (transferStart > transferEnd || transferStart < 1 || transferEnd > 100) {
      alert(
        "Invalid transfer range! Please ensure start ≤ end and range is within 1-100."
      );
      return;
    }

    // Deep copy current ranges to avoid direct mutation
    let updatedUser1Ranges = JSON.parse(JSON.stringify(user1Ranges));
    let updatedUser2Ranges = JSON.parse(JSON.stringify(user2Ranges));

    const transferRange = { start: transferStart, end: transferEnd };

    const removeRange = (sourceRanges, rangeToRemove) => {
      const newRanges = [];
      sourceRanges.forEach((existingRange) => {
        if (
          rangeToRemove.end < existingRange.start ||
          rangeToRemove.start > existingRange.end
        ) {
          // No overlap, keep the existing range
          newRanges.push(existingRange);
        } else {
          // Overlap exists, split or trim the existing range
          if (rangeToRemove.start > existingRange.start) {
            newRanges.push({
              start: existingRange.start,
              end: rangeToRemove.start - 1,
            });
          }
          if (rangeToRemove.end < existingRange.end) {
            newRanges.push({
              start: rangeToRemove.end + 1,
              end: existingRange.end,
            });
          }
        }
      });
      return newRanges;
    };

    const addRange = (targetRanges, rangeToAdd) => {
      let merged = [...targetRanges, rangeToAdd];
      merged.sort((a, b) => a.start - b.start);

      const result = [];
      let last = null;

      merged.forEach((current) => {
        if (!last || current.start > last.end + 1) {
          result.push(current);
          last = current;
        } else {
          last.end = Math.max(last.end, current.end);
        }
      });
      return result;
    };

    if (transferFrom === "user1") {
      updatedUser1Ranges = removeRange(updatedUser1Ranges, transferRange);
      updatedUser2Ranges = addRange(updatedUser2Ranges, transferRange);
    } else {
      updatedUser2Ranges = removeRange(updatedUser2Ranges, transferRange);
      updatedUser1Ranges = addRange(updatedUser1Ranges, transferRange);
    }

    setUser1Ranges(updatedUser1Ranges);
    setUser2Ranges(updatedUser2Ranges);
  }, [transferStart, transferEnd, transferFrom, user1Ranges, user2Ranges]); // Dependencies for useCallback

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

        {activeTab === "transfer" && (
          <RangeTransferComponent
            user1Ranges={user1Ranges}
            user2Ranges={user2Ranges}
            transferFrom={transferFrom}
            setTransferFrom={setTransferFrom}
            transferStart={transferStart}
            setTransferStart={setTransferStart}
            transferEnd={transferEnd}
            setTransferEnd={setTransferEnd}
            handleTransferRange={handleTransferRange}
            formatRanges={formatRanges}
            user1Candidates={user1Candidates}
            user2Candidates={user2Candidates}
            handleNumberInput={handleNumberInput}
            handleKeyPress={handleKeyPress}
          />
        )}
        {activeTab === "ranges" && (
          <RangeAdjustmentComponent
            isEditingRanges={isEditingRanges}
            setIsEditingRanges={setIsEditingRanges}
            user1Start={user1Start}
            user1End={user1End}
            user2Start={user2Start}
            user2End={user2End}
            setUser1Ranges={setUser1Ranges}
            setUser2Ranges={setUser2Ranges}
            handleNumberInput={handleNumberInput}
            handleKeyPress={handleKeyPress}
          />
        )}
        {activeTab === "user1" && <UserSection user={users[0]} />}
        {activeTab === "user2" && <UserSection user={users[1]} />}
      </div>
    </div>
  );
};

export default CandidateAssignmentSystem;
