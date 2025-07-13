import React, { useState, useCallback, useEffect } from "react";
import { Settings, Save } from "lucide-react";

const RangeAdjustmentComponent = React.memo(
  ({
    isEditingRanges,
    setIsEditingRanges,
    user1Start,
    user1End,
    user2Start,
    user2End,
    user1Ranges,
    user2Ranges,
    setUser1Ranges,
    setUser2Ranges,
    user1Candidates,
    user2Candidates,
    handleNumberInput, // Assuming this helper function is passed from a parent
    handleKeyPress, // Assuming this helper function is passed from a parent
  }) => {
    // State for temporary edits, localized to this component
    const [tempUser1Start, setTempUser1Start] = useState(""); // Start with empty string
    const [tempUser1End, setTempUser1End] = useState(""); // Start with empty string
    const [tempUser2Start, setTempUser2Start] = useState(""); // Start with empty string
    const [tempUser2End, setTempUser2End] = useState(""); // Start with empty string

    // State to track validation errors locally
    const [overlapError, setOverlapError] = useState(false);
    const [invalidRangeError, setInvalidRangeError] = useState(false);
    const [outOfBoundsError, setOutOfBoundsError] = useState(false);

    const formatRanges = useCallback((ranges) => {
      return ranges.map((range) => `${range.start}-${range.end}`).join(", ");
    }, []);

    // Effect to reset temp values when entering edit mode, or update when external ranges change
    useEffect(() => {
      if (!isEditingRanges) {
        // When NOT editing, keep temp values in sync with actual user ranges
        setTempUser1Start(user1Start);
        setTempUser1End(user1End);
        setTempUser2Start(user2Start);
        setTempUser2End(user2End);
        // Clear errors when not editing
        setOverlapError(false);
        setInvalidRangeError(false);
        setOutOfBoundsError(false);
      } else {
        // When ENTERING edit mode, clear the inputs
        setTempUser1Start("");
        setTempUser1End("");
        setTempUser2Start("");
        setTempUser2End("");
        // Clear errors
        setOverlapError(false);
        setInvalidRangeError(false);
        setOutOfBoundsError(false);
      }
    }, [isEditingRanges, user1Start, user1End, user2Start, user2End]); // Depend on external ranges and edit mode

    // Centralized validation logic
    const validateRanges = useCallback(() => {
      // Ensure inputs are treated as numbers, default to 0 for validation purposes if empty
      const u1Start = tempUser1Start === "" ? 0 : parseInt(tempUser1Start, 10);
      const u1End = tempUser1End === "" ? 0 : parseInt(tempUser1End, 10);
      const u2Start = tempUser2Start === "" ? 0 : parseInt(tempUser2Start, 10);
      const u2End = tempUser2End === "" ? 0 : parseInt(tempUser2End, 10);

      // Reset all errors at the start of validation
      setOverlapError(false);
      setInvalidRangeError(false);
      setOutOfBoundsError(false);

      // Check if any required field is empty (only relevant when saving)
      if (
        tempUser1Start === "" ||
        tempUser1End === "" ||
        tempUser2Start === "" ||
        tempUser2End === ""
      ) {
        // This case should ideally be prevented by the handleNumberInput or
        // the save logic, but good to have a catch.
        // For saving, we'll use a default of 1 if empty, as per your original logic.
        // However, for real-time validation, empty inputs mean invalid.
        return false; // Don't allow save with empty inputs
      }

      // 1. Validate start <= end for each user
      if (u1Start > u1End || u2Start > u2End) {
        setInvalidRangeError(true);
        return false;
      }

      // 2. Validate ranges within 1-100
      if (u1Start < 1 || u1End > 100 || u2Start < 1 || u2End > 100) {
        setOutOfBoundsError(true);
        return false;
      }

      // 3. Validate no overlap
      // A simple way to check for overlap is to see if one range starts before the other ends
      // AND the other range starts before the first ends.
      // Specifically, two ranges [A, B] and [C, D] overlap if A <= D AND C <= B.
      if (u1Start <= u2End && u2Start <= u1End) {
        setOverlapError(true);
        return false;
      }

      return true; // All validations passed
    }, [tempUser1Start, tempUser1End, tempUser2Start, tempUser2End]);

    // Effect to run validation whenever temp inputs change
    useEffect(() => {
      if (isEditingRanges) {
        // Only validate actively when in editing mode
        validateRanges();
      }
    }, [
      tempUser1Start,
      tempUser1End,
      tempUser2Start,
      tempUser2End,
      isEditingRanges,
      validateRanges,
    ]);

    const handleSaveRanges = useCallback(() => {
      // Use parsed integers, default to 1 if temp values are empty on save (as per original logic)
      const u1Start = tempUser1Start === "" ? 1 : parseInt(tempUser1Start, 10);
      const u1End = tempUser1End === "" ? 1 : parseInt(tempUser1End, 10);
      const u2Start = tempUser2Start === "" ? 1 : parseInt(tempUser2Start, 10);
      const u2End = tempUser2End === "" ? 1 : parseInt(tempUser2End, 10);

      // Re-run validation just before saving to ensure latest state
      const isValid = validateRanges();
      if (!isValid) {
        // If validation fails, don't proceed with save.
        // Alerts are removed in favor of visual error messages.
        return;
      }

      // Check for gaps
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
            return; // User cancelled due to gap
          }
        }
      }

      // If all checks pass, update actual ranges
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
      validateRanges, // Include validateRanges in deps
    ]);

    const handleCancelEdit = useCallback(() => {
      // When cancelling, revert temp states to actual user states
      setTempUser1Start(user1Start);
      setTempUser1End(user1End);
      setTempUser2Start(user2Start);
      setTempUser2End(user2End);
      setIsEditingRanges(false);
      // Clear any validation errors
      setOverlapError(false);
      setInvalidRangeError(false);
      setOutOfBoundsError(false);
    }, [user1Start, user1End, user2Start, user2End, setIsEditingRanges]);

    const isSaveDisabled =
      overlapError ||
      invalidRangeError ||
      outOfBoundsError ||
      tempUser1Start === "" ||
      tempUser1End === "" ||
      tempUser2Start === "" ||
      tempUser2End === "";

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
                className={`px-4 py-2 rounded-md transition-colors flex items-center ${
                  isSaveDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
                disabled={isSaveDisabled}
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
                    className={`w-20 px-2 py-1 border rounded-md text-gray-700 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      invalidRangeError || outOfBoundsError || overlapError
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="e.g., 1"
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
                    className={`w-20 px-2 py-1 border rounded-md text-gray-700 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      invalidRangeError || outOfBoundsError || overlapError
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="e.g., 50"
                  />
                </div>
              </div>
            ) : (
              <div className="text-gray-600">
                <p>Range: {formatRanges(user1Ranges)}</p>
                <p className="text-sm">
                  Total: {user1Candidates.length} candidates
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
                    className={`w-20 px-2 py-1 border rounded-md text-gray-700 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      invalidRangeError || outOfBoundsError || overlapError
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="e.g., 51"
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
                    className={`w-20 px-2 py-1 border rounded-md text-gray-700 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      invalidRangeError || outOfBoundsError || overlapError
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="e.g., 100"
                  />
                </div>
              </div>
            ) : (
              <div className="text-gray-600">
                <p>Range: {formatRanges(user2Ranges)}</p>
                <p className="text-sm">
                  Total: {user2Candidates.length} candidates
                </p>
              </div>
            )}
          </div>
        </div>

        {isEditingRanges &&
          (overlapError || invalidRangeError || outOfBoundsError) && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">
                <strong>Error:</strong>{" "}
                {overlapError && "Ranges cannot overlap. "}
                {invalidRangeError &&
                  "Start of a range must be less than or equal to its end. "}
                {outOfBoundsError && "Ranges must be within 1-100. "}
              </p>
            </div>
          )}

        {isEditingRanges &&
          !(overlapError || invalidRangeError || outOfBoundsError) && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Ranges must be within 1-100, cannot
                overlap, and start must be less than or equal to end. Only
                numbers are allowed.
              </p>
            </div>
          )}
      </div>
    );
  }
);

export default RangeAdjustmentComponent;
