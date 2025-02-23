// AllSongs.test.jsx
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import AllSongs from "./AllSongsTable";
import "@testing-library/jest-dom";
import ApiService from "../../../service/ApiService";

// Mock the ApiService module
jest.mock("../../../service/ApiService");

const sampleSongs = [
  {
    songId: 1,
    artistId: 101,
    title: "Song One",
    releaseDate: "2020-01-01T00:00:00Z",
    collaborators: "Artist A",
  },
  {
    songId: 2,
    artistId: 102,
    title: "Song Two",
    releaseDate: "2021-01-01T00:00:00Z",
    collaborators: null,
  },
];

describe("AllSongs Component", () => {
  beforeEach(() => {
    // Reset the mock before each test
    ApiService.fetchSongs.mockResolvedValue(sampleSongs);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("displays loading state initially", () => {
    render(<AllSongs />);
    expect(screen.getByText(/Loading data.../i)).toBeInTheDocument();
  });

  test("renders songs after successful fetch", async () => {
    render(<AllSongs />);
    // Wait for the component to finish loading and rendering the songs
    await waitFor(() => {
      expect(screen.getByText("All Songs")).toBeInTheDocument();
    });
    // Check that song titles are rendered
    expect(screen.getByText("Song One")).toBeInTheDocument();
    expect(screen.getByText("Song Two")).toBeInTheDocument();
  });

  test("displays an error message if API fetch fails", async () => {
    ApiService.fetchSongs.mockRejectedValue(new Error("API error"));
    render(<AllSongs />);
    await waitFor(() => {
      expect(screen.getByText(/Error:/i)).toBeInTheDocument();
    });
    expect(screen.getByText("Error: API error")).toBeInTheDocument();
  });

  test("filters songs based on title input", async () => {
    render(<AllSongs />);
    await waitFor(() => {
      expect(screen.getByText("Song One")).toBeInTheDocument();
    });
    // Find the search title input and type "One"
    const titleInput = screen.getByPlaceholderText("Search Title...");
    fireEvent.change(titleInput, { target: { value: "One" } });
    // Wait for filtering to take effect
    await waitFor(() => {
      expect(screen.getByText("Song One")).toBeInTheDocument();
    });
    // "Song Two" should not be visible
    expect(screen.queryByText("Song Two")).toBeNull();
  });

  test("filters songs based on artist ID input", async () => {
    render(<AllSongs />);
    await waitFor(() => {
      expect(screen.getByText("Song One")).toBeInTheDocument();
    });
    // Type in the artist ID search field for artist 101
    const artistInput = screen.getByPlaceholderText("Search Artist ID...");
    fireEvent.change(artistInput, { target: { value: "101" } });
    await waitFor(() => {
      expect(screen.getByText("Song One")).toBeInTheDocument();
    });
    expect(screen.queryByText("Song Two")).toBeNull();
  });

  test("filters songs based on release year selection", async () => {
    render(<AllSongs />);
    await waitFor(() => {
      expect(screen.getByText("Song One")).toBeInTheDocument();
    });
    // Find the release filter dropdown (combobox)
    const select = screen.getByRole("combobox");
    // Change the selection to 2021
    fireEvent.change(select, { target: { value: "2021" } });
    await waitFor(() => {
      expect(screen.getByText("Song Two")).toBeInTheDocument();
    });
    expect(screen.queryByText("Song One")).toBeNull();
  });

  test("toggles sorting when header is clicked", async () => {
    render(<AllSongs />);
    await waitFor(() => {
      expect(screen.getByText("Song One")).toBeInTheDocument();
    });
    // Initially, the header for "Title" should have no arrow until clicked.
    const titleHeader = screen.getByText(/Title/i);
    // Click to trigger sorting by title (and toggle sort order)
    fireEvent.click(titleHeader);
    // The header text should now include an arrow (▲ or ▼)
    expect(titleHeader.textContent).toMatch(/▲|▼/);
  });

  test("paginates songs when there are more than one page", async () => {
    // Create more sample songs so that there are at least 10 (with pageSize = 5)
    const manySongs = [];
    for (let i = 1; i <= 10; i++) {
      manySongs.push({
        songId: i,
        artistId: 100 + i,
        title: `Song ${i}`,
        releaseDate: `2020-01-0${i < 10 ? i : "10"}T00:00:00Z`,
        collaborators: null,
      });
    }
    ApiService.fetchSongs.mockResolvedValue(manySongs);
    render(<AllSongs />);
    await waitFor(() => {
      expect(screen.getByText("Song 1")).toBeInTheDocument();
    });
    // Check that pagination buttons are rendered
    const pageButton1 = screen.getByRole("button", { name: "1" });
    const pageButton2 = screen.getByRole("button", { name: "2" });
    expect(pageButton1).toBeInTheDocument();
    expect(pageButton2).toBeInTheDocument();
    // Click page 2 and verify that songs from the second page are displayed
    fireEvent.click(pageButton2);
    await waitFor(() => {
      expect(screen.getByText("Song 6")).toBeInTheDocument();
    });
    // Verify that a song from the first page is no longer visible
    expect(screen.queryByText("Song 1")).toBeNull();
  });
});
