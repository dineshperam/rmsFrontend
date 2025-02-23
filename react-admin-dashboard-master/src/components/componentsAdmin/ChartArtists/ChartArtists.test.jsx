import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChartArtists from "./ChartArtists";
import ApiService from "../../../service/ApiService";

// Mock the ApiService module
jest.mock("../../../service/ApiService");

// Mock ResponsiveContainer from Recharts to bypass ResizeObserver and rendering issues
jest.mock("recharts", () => {
  const originalModule = jest.requireActual("recharts");
  return {
    ...originalModule,
    ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  };
});

describe("ChartArtists", () => {
  const mockData = [
    { month: "January", Artist1: 1000, Artist2: 2000, Artist3: 3000, Artist4: 4000, Artist5: 5000 },
    { month: "February", Artist1: 1500, Artist2: 2500, Artist3: 3500, Artist4: 4500, Artist5: 5500 },
  ];

  beforeEach(() => {
    // Resolve with mock data for the default time range ("2024")
    ApiService.getTop5Artists.mockResolvedValue(mockData);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders header and select with default value", async () => {
    render(<ChartArtists />);

    // Check header text is rendered
    expect(screen.getByText("Top 5 Artists Based on Streams")).toBeInTheDocument();

    // Check select element with default value "2024" is rendered
    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("2024");

    // Wait for the API call to be made on mount
    await waitFor(() => {
      expect(ApiService.getTop5Artists).toHaveBeenCalledWith("2024");
    });

    // Check that the mocked ResponsiveContainer is rendered
    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
  });

  test("updates chart when time range is changed", async () => {
    render(<ChartArtists />);

    // Wait for initial API call
    await waitFor(() => {
      expect(ApiService.getTop5Artists).toHaveBeenCalledWith("2024");
    });

    // Change the select value to "2025"
    const select = screen.getByRole("combobox");
    userEvent.selectOptions(select, "2025");

    // Wait for the API call with the new time range
    await waitFor(() => {
      expect(ApiService.getTop5Artists).toHaveBeenCalledWith("2025");
    });
  });

  test("handles API errors gracefully", async () => {
    const error = new Error("API Error");
    // Force the API call to reject with an error
    ApiService.getTop5Artists.mockRejectedValueOnce(error);

    // Spy on console.error to verify error logging
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(<ChartArtists />);

    await waitFor(() => {
      expect(ApiService.getTop5Artists).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching data:", error);
    });

    consoleErrorSpy.mockRestore();
  });
});
