// ChartManagers.test.jsx
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ChartManagers from "./ChartManagers";
import ApiService from "../../../service/ApiService";

// Mock the ApiService module
jest.mock("../../../service/ApiService");

describe("ChartManagers Component", () => {
  const mockData = {
    revenueData: [
      { month: "January", manager1: 1000, manager2: 2000 },
      { month: "February", manager1: 1500, manager2: 2500 },
    ],
    managerKeys: ["manager1", "manager2"],
  };

  beforeEach(() => {
    // Resolve the API call with sample data
    ApiService.fetchTop5Managers.mockResolvedValue(mockData);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the title and select element with default value", async () => {
    render(<ChartManagers />);

    // Check that the title is rendered
    expect(
      screen.getByText(/Top 5 Managers Based on Revenue/i)
    ).toBeInTheDocument();

    // Verify the select element is present and default value is "2024"
    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("2024");

    // Wait for the API call to be made with "2024" as the parameter
    await waitFor(() =>
      expect(ApiService.fetchTop5Managers).toHaveBeenCalledWith("2024")
    );
  });

  test("fetches new data when the time range is changed", async () => {
    render(<ChartManagers />);

    // Wait for the initial API call
    await waitFor(() =>
      expect(ApiService.fetchTop5Managers).toHaveBeenCalledWith("2024")
    );

    // Change the select value to "2023"
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "2023" } });

    // Wait for the API to be called again with "2023"
    await waitFor(() =>
      expect(ApiService.fetchTop5Managers).toHaveBeenCalledWith("2023")
    );
  });

  test("handles API errors gracefully", async () => {
    // Simulate an error response from the API
    const error = new Error("API Error");
    ApiService.fetchTop5Managers.mockRejectedValueOnce(error);
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<ChartManagers />);

    // Wait for the error to be logged to the console
    await waitFor(() =>
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching data:", error)
    );

    consoleErrorSpy.mockRestore();
  });
});
