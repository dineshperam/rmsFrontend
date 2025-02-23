// Polyfill for ResizeObserver needed by Recharts in a JSDOM environment
global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  
  // Updated ResponsiveContainer mock that sets explicit width and height
  jest.mock("recharts", () => {
    const Recharts = jest.requireActual("recharts");
    return {
      ...Recharts,
      ResponsiveContainer: ({ children }) => (
        <div style={{ width: "500px", height: "500px" }}>{children}</div>
      ),
    };
  });
  
  import React from "react";
  import "@testing-library/jest-dom";
  import { render, screen, waitFor } from "@testing-library/react";
  import GenreDistributionChart from "./GenreDistributionChart";
  import ApiService from "../../../service/ApiService";
  
  // Mock the ApiService module
  jest.mock("../../../service/ApiService");

jest.mock("recharts", () => {
    const React = require("react");
    const Recharts = jest.requireActual("recharts");
    const ResponsiveContainer = ({ children }) => {
      return React.cloneElement(children, { width: 500, height: 500 });
    };
    return {
      ...Recharts,
      ResponsiveContainer,
    };
  });
  
  
  
  describe("GenreDistributionChart", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    test("renders the Genre Distribution title", async () => {
      ApiService.getUserId.mockReturnValue("123");
      ApiService.fetchGenreData.mockResolvedValue({
        Pop: 40,
        Rock: 30,
        Jazz: 20,
        HipHop: 10,
      });
  
      render(<GenreDistributionChart />);
  
      await waitFor(() => {
        expect(screen.getByText("Genre Distribution")).toBeInTheDocument();
      });
    });
  
    test("renders chart with correct data", async () => {
      ApiService.getUserId.mockReturnValue("123");
      const mockData = {
        Pop: 40,
        Rock: 30,
        Jazz: 20,
        HipHop: 10,
      };
      ApiService.fetchGenreData.mockResolvedValue(mockData);
  
      const { container } = render(<GenreDistributionChart />);
  
      // Wait for the title to ensure the component has rendered
      await waitFor(() => {
        expect(screen.getByText("Genre Distribution")).toBeInTheDocument();
      });
  
      // Now check that the SVG element is rendered and has the expected number of paths
      await waitFor(() => {
        const svg = container.querySelector("svg");
        expect(svg).toBeInTheDocument();
        const paths = svg.querySelectorAll("path");
        // We expect one <path> per data entry (i.e. 4 slices)
        expect(paths.length).toBe(Object.keys(mockData).length);
      });
    });
  
    test("logs error when API call fails", async () => {
      ApiService.getUserId.mockReturnValue("123");
      const error = new Error("API error");
      ApiService.fetchGenreData.mockRejectedValue(error);
  
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  
      render(<GenreDistributionChart />);
  
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching genre data:", error);
      });
  
      consoleErrorSpy.mockRestore();
    });
  });
  