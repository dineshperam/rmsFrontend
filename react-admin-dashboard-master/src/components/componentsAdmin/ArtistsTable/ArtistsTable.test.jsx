// ArtistsTable.test.jsx
import React from "react";
import { render, screen, waitFor, fireEvent, within } from "@testing-library/react";
import ArtistsTable from "./ArtistsTable";
import "@testing-library/jest-dom";
import ApiService from "../../../service/ApiService";

// Mock the API service to avoid real HTTP requests
jest.mock("../../../service/ApiService");

describe("ArtistsTable", () => {
  // Sample data to be returned by the mocked API
  const mockArtists = [
    { id: 1, name: "Alice", email: "alice@example.com", role: "Singer", status: "Active" },
    { id: 2, name: "Bob", email: "bob@example.com", role: "Guitarist", status: "Inactive" },
    { id: 3, name: "Charlie", email: "charlie@example.com", role: "Drummer", status: "Active" },
    { id: 4, name: "David", email: "david@example.com", role: "Bassist", status: "Active" },
    { id: 5, name: "Eve", email: "eve@example.com", role: "Vocalist", status: "Inactive" },
  ];

  beforeEach(() => {
    ApiService.fetchTop5Artists.mockResolvedValue(mockArtists);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders table headers correctly", async () => {
    render(<ArtistsTable />);
    await waitFor(() => expect(ApiService.fetchTop5Artists).toHaveBeenCalled());

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  test("renders artists data correctly", async () => {
    render(<ArtistsTable />);
    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
    });

    // For each artist, find the row based on their unique name and check the cells
    mockArtists.forEach((artist) => {
      const row = screen.getByText(artist.name).closest("tr");
      expect(row).toBeInTheDocument();

      const rowWithin = within(row);
      expect(rowWithin.getByText(artist.email)).toBeInTheDocument();
      expect(rowWithin.getByText(artist.role)).toBeInTheDocument();
      expect(rowWithin.getByText(artist.status)).toBeInTheDocument();
    });
  });

  test("filters artists based on search input", async () => {
    render(<ArtistsTable />);
    await waitFor(() => expect(screen.getByText("Alice")).toBeInTheDocument());

    const searchInput = screen.getByPlaceholderText("Search Name or Email...");
    fireEvent.change(searchInput, { target: { value: "Bob" } });

    await waitFor(() => {
      expect(screen.getByText("Bob")).toBeInTheDocument();
    });

    // Confirm that an artist that doesn't match is no longer in the document
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
  });
});
