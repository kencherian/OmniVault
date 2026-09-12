import {
  convertFileSize,
  calculatePercentage,
  getFileType,
  getFileIcon,
  getFileTypesParams,
} from "../lib/utils";
import { describe, it, expect } from "@jest/globals";

describe("Utility Functions", () => {
  // Test 1: File Size Conversion
  it("should convert file size accurately to KB and MB", () => {
    expect(convertFileSize(1024)).toBe("1.0 KB");
    expect(convertFileSize(1024 * 1024)).toBe("1.0 MB");
  });

  // Test 2: Storage Percentage Calculation
  it("should calculate correct storage percentage based on 2GB limit", () => {
    const oneGigabyte = 1024 * 1024 * 1024;
    // 1GB out of 2GB total is 50%
    expect(calculatePercentage(oneGigabyte)).toBe(50);
  });

  // Test 3: File Type Parsing
  it("should correctly identify file types based on extension", () => {
    const result = getFileType("document.pdf");
    expect(result.type).toBe("document");
    expect(result.extension).toBe("pdf");
  });

  // Test 4: File Icon Mapping
  it("should return the correct icon path for an extension", () => {
    const iconPath = getFileIcon("pdf", "document");
    expect(iconPath).toBe("/assets/icons/file-pdf.svg");
  });

  // Test 5: Dashboard Filter Params mapping
  it("should map dashboard filter strings to their array of accepted types", () => {
    const mediaTypes = getFileTypesParams("media");
    expect(mediaTypes).toEqual(["video", "audio"]);
  });
});
