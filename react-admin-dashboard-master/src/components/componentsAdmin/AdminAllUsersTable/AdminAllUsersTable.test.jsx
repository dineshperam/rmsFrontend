// AdminAllUsersTable.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import AdminAllUsersTable from "./AdminAllUsersTable";
import ApiService from "../../../service/ApiService";

// Mock the ApiService
jest.mock("../../../service/ApiService");

const mockUsers = [
  { id: 1, name: "Alice", email: "alice@example.com", role: "Admin", status: true },
  { id: 2, name: "Bob", email: "bob@example.com", role: "User", status: true },
  { id: 3, name: "Charlie", email: "charlie@example.com", role: "User", status: false },
  { id: 4, name: "David", email: "david@example.com", role: "User", status: true },
  { id: 5, name: "Eve", email: "eve@example.com", role: "User", status: false },
  { id: 6, name: "Frank", email: "frank@example.com", role: "User", status: true },
];

describe("AdminAllUsersTable Component", () => {
  beforeEach(() => {
    // Default fetchUsers resolves with mockUsers
    ApiService.fetchUsers.mockResolvedValue(mockUsers);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("displays loading state initially", async () => {
    render(<AdminAllUsersTable />);
    expect(screen.getByText(/Loading users.../i)).toBeInTheDocument();
    await waitFor(() => expect(ApiService.fetchUsers).toHaveBeenCalled());
  });

  test("renders users after API call and paginates correctly", async () => {
    render(<AdminAllUsersTable />);
    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
    });
    // Check first page: should show first 5 users (Alice, Bob, Charlie, David, Eve)
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();
    expect(screen.getByText("David")).toBeInTheDocument();
    expect(screen.getByText("Eve")).toBeInTheDocument();
    // "Frank" should not be visible on the first page
    expect(screen.queryByText("Frank")).not.toBeInTheDocument();
  });

  test("filters users based on search input", async () => {
    render(<AdminAllUsersTable />);
    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Search users...");
    fireEvent.change(searchInput, { target: { value: "Bob" } });
    
    await waitFor(() => {
      expect(screen.getByText("Bob")).toBeInTheDocument();
    });
    // Other users should not appear when filtering by "Bob"
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
    expect(screen.queryByText("Charlie")).not.toBeInTheDocument();
  });

  test("handles pagination controls correctly", async () => {
    render(<AdminAllUsersTable />);
    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
    });
    
    // Use the test id assigned to the next page button
    const nextButton = screen.getByTestId("next-page");
    fireEvent.click(nextButton);

    await waitFor(() => {
      // On page 2, "Frank" should be visible, and "Alice" should not be visible.
      expect(screen.getByText("Frank")).toBeInTheDocument();
    });
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
  });

  test("toggles user status when action button is clicked", async () => {
    ApiService.toggleUserStatus.mockResolvedValue({});
    render(<AdminAllUsersTable />);
    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
    });
    
    // Locate Alice's table row and find the "Delete" button within it.
    const aliceRow = screen.getByText("Alice").closest("tr");
    const toggleButton = within(aliceRow).getByText("Delete");
    fireEvent.click(toggleButton);

    await waitFor(() => {
      // Verify the API call was made with Alice's id (1)
      expect(ApiService.toggleUserStatus).toHaveBeenCalledWith(1);
    });

    await waitFor(() => {
      // After toggling, the button text in Alice's row should change to "Retrieve"
      expect(within(aliceRow).getByText("Retrieve")).toBeInTheDocument();
    });
  });

  test("renders error message when API call fails", async () => {
    ApiService.fetchUsers.mockRejectedValue(new Error("API error"));
    render(<AdminAllUsersTable />);
    await waitFor(() => {
      expect(screen.getByText(/Error: API error/i)).toBeInTheDocument();
    });
  });
});
