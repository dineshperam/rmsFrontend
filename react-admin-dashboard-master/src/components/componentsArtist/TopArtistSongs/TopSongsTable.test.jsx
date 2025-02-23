// TopSongsTable.test.jsx
import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import TopArtistSongs from "./TopSongsTable";
import ApiService from "../../../service/ApiService";

// Mock the ApiService module to control API responses
jest.mock("../../../service/ApiService");

describe("TopArtistSongs", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("shows loading state initially", () => {
    // Simulate a pending API call by returning a promise that never resolves
    ApiService.fetchArtistSongsTop.mockReturnValue(new Promise(() => {}));
    render(<TopArtistSongs />);
    expect(screen.getByText(/loading songs/i)).toBeInTheDocument();
  });

  test("renders songs table after fetching songs", async () => {
    const mockSongs = [
      {
        songId: "1",
        title: "Song One",
        releaseDate: "2020-01-01",
        collaborators: "Artist A",
      },
      {
        songId: "2",
        title: "Song Two",
        releaseDate: "2020-02-01",
        collaborators: "",
      },
    ];

    ApiService.fetchArtistSongsTop.mockResolvedValue(mockSongs);
    render(<TopArtistSongs />);

    // Wait for the loading state to disappear by confirming a song title is rendered
    await waitFor(() => {
      expect(screen.getByText("Song One")).toBeInTheDocument();
    });

    // Check the table title and song data are rendered
    expect(screen.getByText("My Top Songs List")).toBeInTheDocument();
    expect(screen.getByText("Song One")).toBeInTheDocument();
    expect(screen.getByText("Song Two")).toBeInTheDocument();

    // Check release date formatting
    const formattedDate1 = new Date("2020-01-01").toLocaleDateString();
    expect(screen.getByText(formattedDate1)).toBeInTheDocument();

    // Verify collaborators – when empty, "None" should be displayed
    expect(screen.getByText("Artist A")).toBeInTheDocument();
    expect(screen.getByText("None")).toBeInTheDocument();
  });

  test("displays error message when API call fails", async () => {
    ApiService.fetchArtistSongsTop.mockRejectedValue(new Error("API error"));
    render(<TopArtistSongs />);

    await waitFor(() => {
      // The error message in the component is hard-coded to "Failed to fetch songs."
      expect(screen.getByText(/failed to fetch songs/i)).toBeInTheDocument();
    });
  });

  test("filters songs based on search term", async () => {
    const mockSongs = [
      {
        songId: "1",
        title: "Hello World",
        releaseDate: "2020-01-01",
        collaborators: "Artist A",
      },
      {
        songId: "2",
        title: "Goodbye",
        releaseDate: "2020-02-01",
        collaborators: "Artist B",
      },
    ];

    ApiService.fetchArtistSongsTop.mockResolvedValue(mockSongs);
    render(<TopArtistSongs />);

    // Wait for the song data to render
    await waitFor(() => {
      expect(screen.getByText("Hello World")).toBeInTheDocument();
    });

    // Find the search input and simulate typing a search term
    const searchInput = screen.getByPlaceholderText("Search songs...");
    fireEvent.change(searchInput, { target: { value: "good" } });

    // "Goodbye" should match the search term, while "Hello World" should be filtered out
    expect(screen.getByText("Goodbye")).toBeInTheDocument();
    expect(screen.queryByText("Hello World")).not.toBeInTheDocument();
  });
});
