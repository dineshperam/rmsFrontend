// ManagersTable.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ManagersTable from "./ManagersTable";
import ApiService from "../../../service/ApiService";

// Mock the ApiService so that we control its response
jest.mock("../../../service/ApiService");

describe("ManagersTable", () => {
  // Sample data to be returned from the API mock
  const mockManagersData = [
    {
      fullName: "Alice Smith",
      email: "alice@example.com",
      role: "Manager",
      totalRoyalty: 100000,
      active: true,
    },
    {
      fullName: "Bob Johnson",
      email: "bob@example.com",
      role: "Manager",
      totalRoyalty: 80000,
      active: false,
    },
  ];

  beforeEach(() => {
    // Resolve the API call with our dummy data
    ApiService.fetchTop5ManagersTable.mockResolvedValue(mockManagersData);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders table with fetched data and correct headers", async () => {
    render(<ManagersTable />);

    // The component fetches data for the default year "2024"
    expect(ApiService.fetchTop5ManagersTable).toHaveBeenCalledWith("2024");

    // Wait for the data to be rendered
    await waitFor(() => {
      expect(screen.getByText("Alice Smith")).toBeInTheDocument();
      expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
    });

    // Check table headers
    expect(screen.getByText(/Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Email/i)).toBeInTheDocument();
    expect(screen.getByText(/Role/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Royalty/i)).toBeInTheDocument();
    expect(screen.getByText(/Status/i)).toBeInTheDocument();

    // Check formatted royalty value (assuming locale formatting adds commas)
    expect(screen.getByText("₹100,000")).toBeInTheDocument();
  });

  test("filters managers based on search input", async () => {
    render(<ManagersTable />);
    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    });

    // Locate the search input and simulate typing "alice"
    const searchInput = screen.getByPlaceholderText("Search Name or Email...");
    fireEvent.change(searchInput, { target: { value: "alice" } });

    // Only "Alice Smith" should be visible, and "Bob Johnson" should be filtered out
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.queryByText("Bob Johnson")).not.toBeInTheDocument();
  });

  test("calls API with new year when year selection is changed", async () => {
    render(<ManagersTable />);
    // Wait for the initial render
    await waitFor(() => {
      expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    });

    // Find the select input (default value "2024") and change its value to "2023"
    const selectInput = screen.getByDisplayValue("2024");
    fireEvent.change(selectInput, { target: { value: "2023" } });

    // The API should be called with the new year "2023"
    await waitFor(() => {
      expect(ApiService.fetchTop5ManagersTable).toHaveBeenCalledWith("2023");
    });
  });

  test("displays active/inactive status correctly", async () => {
    render(<ManagersTable />);
    await waitFor(() => {
      expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    });

    // Check that the active/inactive text is rendered for each manager
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Inactive")).toBeInTheDocument();
  });
});
