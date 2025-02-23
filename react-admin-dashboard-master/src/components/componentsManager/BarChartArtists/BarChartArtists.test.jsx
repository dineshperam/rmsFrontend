// BarChartArtists.test.jsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import BarChartArtists from "./BarChartArtists";
import ApiService from "../../../service/ApiService";

// Mock the ApiService module
jest.mock("../../../service/ApiService");

describe("BarChartArtists Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the heading and calls fetchArtistsWithStreams", async () => {
    // Arrange: Set up the mock implementations
    ApiService.getManagerId.mockReturnValue("test-manager-id");
    ApiService.fetchArtistsWithStreams.mockResolvedValue([
      { artist: "Artist A", streams: 1000 },
      { artist: "Artist B", streams: 2000 },
    ]);

    // Act: Render the component
    render(<BarChartArtists />);

    // Assert: Verify the heading is in the document
    expect(screen.getByText("Total Streams Per Artist")).toBeInTheDocument();

    // Wait for the async API call to finish and verify it was called with the manager id
    await waitFor(() => {
      expect(ApiService.fetchArtistsWithStreams).toHaveBeenCalledWith("test-manager-id");
    });
  });

  test("handles API errors gracefully", async () => {
    // Arrange: Spy on console.error to catch error logging
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    ApiService.getManagerId.mockReturnValue("test-manager-id");
    ApiService.fetchArtistsWithStreams.mockRejectedValue(new Error("API error"));

    // Act: Render the component
    render(<BarChartArtists />);

    // Assert: Wait for the API call and verify that an error is logged
    await waitFor(() => {
      expect(ApiService.fetchArtistsWithStreams).toHaveBeenCalledWith("test-manager-id");
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching chart data:",
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });
});
