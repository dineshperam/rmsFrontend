import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import AllSongsArtists from "./AllSongsArtists";
import ApiService from "../../../service/ApiService";

// Mock the API service
jest.mock("../../../service/ApiService");

const songsData = [
  { songId: 1, artistId: 101, title: "Alpha Song", releaseDate: "2020-01-01", collaborators: "Artist A" },
  { songId: 2, artistId: 102, title: "Beta Song", releaseDate: "2020-01-02", collaborators: "Artist B" },
  { songId: 3, artistId: 103, title: "Gamma Song", releaseDate: "2020-01-03", collaborators: "Artist C" },
  { songId: 4, artistId: 104, title: "Delta Song", releaseDate: "2020-01-04", collaborators: "Artist D" },
  { songId: 5, artistId: 105, title: "Epsilon Song", releaseDate: "2020-01-05", collaborators: "Artist E" },
  { songId: 6, artistId: 106, title: "Zeta Song", releaseDate: "2020-01-06", collaborators: "Artist F" },
];

describe("AllSongsArtists Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("displays loading state initially", () => {
    // Return a pending promise to simulate loading
    ApiService.fetchSongsArtists.mockReturnValue(new Promise(() => {}));
    render(<AllSongsArtists />);
    expect(screen.getByText(/Loading data.../i)).toBeInTheDocument();
  });

  test("displays error message when API call fails", async () => {
    ApiService.fetchSongsArtists.mockRejectedValue(new Error("Failed to fetch"));
    render(<AllSongsArtists />);
    await waitFor(() => {
      expect(screen.getByText(/Error: Failed to fetch/i)).toBeInTheDocument();
    });
  });

  test("renders songs and handles search, sort, and pagination", async () => {
    ApiService.fetchSongsArtists.mockResolvedValue(songsData);
    const { container } = render(<AllSongsArtists />);

    // Wait for the data to load and display a known song
    await waitFor(() => expect(screen.getByText("Alpha Song")).toBeInTheDocument());

    // --- Verify Pagination (Initial Page) ---
    // With 6 songs and itemsPerPage = 5, page 1 should show the first 5 songs.
    expect(screen.getByText("Alpha Song")).toBeInTheDocument();
    expect(screen.getByText("Beta Song")).toBeInTheDocument();
    expect(screen.getByText("Gamma Song")).toBeInTheDocument();
    expect(screen.getByText("Delta Song")).toBeInTheDocument();
    expect(screen.getByText("Epsilon Song")).toBeInTheDocument();
    // "Zeta Song" should be on page 2 so it should not be in the document yet.
    expect(screen.queryByText("Zeta Song")).not.toBeInTheDocument();

    // --- Test Search Functionality ---
    const searchInput = screen.getByPlaceholderText(/Search Title.../i);
    fireEvent.change(searchInput, { target: { value: "Gamma" } });
    await waitFor(() => {
      expect(screen.getByText("Gamma Song")).toBeInTheDocument();
      // Other songs should be filtered out
      expect(screen.queryByText("Alpha Song")).not.toBeInTheDocument();
    });

    // Clear the search input to reset the list
    fireEvent.change(searchInput, { target: { value: "" } });
    await waitFor(() => {
      expect(screen.getByText("Alpha Song")).toBeInTheDocument();
    });

    // --- Test Sorting Functionality ---
    // The "Release Date" header is clickable. On the first click it sorts ascending,
    // and on the second click it sorts descending.
    const releaseDateHeader = screen.getByText(/Release Date/i);
    // First click (ascending) – since the data is already in ascending order this won't change the order.
    fireEvent.click(releaseDateHeader);
    // Second click: should sort in descending order.
    fireEvent.click(releaseDateHeader);
    // Check the order by examining the first row in the table body.
    const rows = container.querySelectorAll("tbody tr");
    // In descending order the first song should be "Zeta Song"
    expect(rows[0].textContent).toContain("Zeta Song");

    // --- Test Pagination After Sorting ---
    // In descending order, the sorted list is:
    // [Zeta Song, Epsilon Song, Delta Song, Gamma Song, Beta Song, Alpha Song]
    // Page 1: first 5 songs; Page 2: "Alpha Song"
    // Click the pagination button for page 2.
    const page2Button = screen.getByRole("button", { name: "2" });
    fireEvent.click(page2Button);
    await waitFor(() => {
      expect(screen.getByText("Alpha Song")).toBeInTheDocument();
    });
    // Verify that a song from page 1 (e.g. "Zeta Song") is no longer visible.
    expect(screen.queryByText("Zeta Song")).not.toBeInTheDocument();
  });
});
