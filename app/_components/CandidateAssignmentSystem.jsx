"use client";
import { faker } from "@faker-js/faker";
import { useCallback, useMemo, useState } from "react";
import OverviewStats from "./OverviewStats";
import RangeTransferComponent from "./RangeTransferComponent";
import RangeAdjustmentComponent from "./RangeAdjustmentComponent";
import UserSection from "./UserSection";

const CandidateAssignmentSystem = () => {
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

  const [user1Ranges, setUser1Ranges] = useState([{ start: 1, end: 50 }]);
  const [user2Ranges, setUser2Ranges] = useState([{ start: 51, end: 100 }]);

  const [user1Start, setUser1Start] = useState(1);
  const [user1End, setUser1End] = useState(50);
  const [user2Start, setUser2Start] = useState(51);
  const [user2End, setUser2End] = useState(100);

  const [isEditingRanges, setIsEditingRanges] = useState(false);

  const [transferFrom, setTransferFrom] = useState("user1");
  const [transferStart, setTransferStart] = useState(1);
  const [transferEnd, setTransferEnd] = useState(10);

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
  );

  const formatRanges = useCallback((ranges) => {
    return ranges.map((range) => `${range.start}-${range.end}`).join(", ");
  }, []);

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
          newRanges.push(existingRange);
        } else {
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
  }, [transferStart, transferEnd, transferFrom, user1Ranges, user2Ranges]);

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
            user1Ranges={user1Ranges}
            user2Ranges={user2Ranges}
            setUser1Ranges={setUser1Ranges}
            setUser2Ranges={setUser2Ranges}
            user1Candidates={user1Candidates}
            user2Candidates={user2Candidates}
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
