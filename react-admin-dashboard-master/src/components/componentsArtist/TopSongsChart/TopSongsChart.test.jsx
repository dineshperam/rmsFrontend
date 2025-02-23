// TopSongsChart.test.jsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import TopSongsChart from "./TopSongsChart";
import ApiService from "../../../service/ApiService";
import "@testing-library/jest-dom";

// Mock the ApiService module to control its responses
jest.mock("../../../service/ApiService");

// Update the Recharts mock so ResponsiveContainer clones its child with dimensions
jest.mock("recharts", () => {
  const Recharts = jest.requireActual("recharts");
  const React = require("react");
  const ResponsiveContainer = ({ children }) =>
    React.cloneElement(children, { width: 500, height: 300 });
  return {
    ...Recharts,
    ResponsiveContainer,
  };
});

describe("TopSongsChart", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders top songs chart with fetched data", async () => {
    // Mock data to be returned by the API call
    const mockData = [
      { songName: "Song A", totalStreams: 1000 },
      { songName: "Song B", totalStreams: 5000 },
    ];
    ApiService.fetchTopSongs.mockResolvedValue(mockData);

    const { container } = render(<TopSongsChart />);

    // Wait for the heading to ensure the component has rendered
    await waitFor(() => {
      expect(
        screen.getByText("My Top Songs Based on Streams")
      ).toBeInTheDocument();
    });

    // Wait for the <svg> element to appear
    await waitFor(() => {
      const svgElement = container.querySelector("svg");
      expect(svgElement).toBeInTheDocument();
    });
  });

  test("logs error when API call fails", async () => {
    // Force the API call to reject with an error
    const error = new Error("API error");
    ApiService.fetchTopSongs.mockRejectedValue(error);

    // Spy on console.error to verify that error is logged
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(<TopSongsChart />);

    // Wait for the heading to ensure the component has rendered
    await waitFor(() => {
      expect(
        screen.getByText("My Top Songs Based on Streams")
      ).toBeInTheDocument();
    });

    // Verify that the error was logged to the console
    expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to fetch top songs");

    consoleErrorSpy.mockRestore();
  });
});
