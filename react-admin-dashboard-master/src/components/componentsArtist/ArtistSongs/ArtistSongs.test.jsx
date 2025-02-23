import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ArtistSongs from "./ArtistSongsTable";
import ApiService from "../../../service/ApiService";

// Mock the ApiService module
jest.mock("../../../service/ApiService");

describe("ArtistSongs Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("displays loading state initially", () => {
    // Return a never-resolving promise to simulate loading
    ApiService.fetchArtistSongs.mockReturnValue(new Promise(() => {}));
    render(<ArtistSongs />);
    expect(screen.getByText("Loading songs...")).toBeInTheDocument();
  });

  test("displays error message when fetching songs fails", async () => {
    ApiService.fetchArtistSongs.mockRejectedValue(new Error("Network error"));
    render(<ArtistSongs />);
    await waitFor(() => {
      expect(screen.getByText("Failed to fetch songs.")).toBeInTheDocument();
    });
  });

  test("renders songs in table when fetch is successful", async () => {
    const songsMock = [
      {
        songId: 1,
        title: "Song One",
        releaseDate: "2022-01-01T00:00:00.000Z",
        collaborators: "Artist A",
      },
      {
        songId: 2,
        title: "Song Two",
        releaseDate: "2022-02-01T00:00:00.000Z",
        collaborators: null,
      },
    ];
    ApiService.fetchArtistSongs.mockResolvedValue(songsMock);
    render(<ArtistSongs />);
    
    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.getByText("My Songs")).toBeInTheDocument();
    });
    
    // Verify each song's title is displayed
    expect(screen.getByText("Song One")).toBeInTheDocument();
    expect(screen.getByText("Song Two")).toBeInTheDocument();
    
    // Check for collaborators: second song should display "None"
    expect(screen.getByText("Artist A")).toBeInTheDocument();
    expect(screen.getByText("None")).toBeInTheDocument();
  });

  test("filters songs based on search term", async () => {
    const songsMock = [
      {
        songId: 1,
        title: "Hello World",
        releaseDate: "2022-01-01T00:00:00.000Z",
        collaborators: "Artist A",
      },
      {
        songId: 2,
        title: "Goodbye",
        releaseDate: "2022-02-01T00:00:00.000Z",
        collaborators: "Artist B",
      },
    ];
    ApiService.fetchArtistSongs.mockResolvedValue(songsMock);
    render(<ArtistSongs />);
    
    await waitFor(() => {
      expect(screen.getByText("Hello World")).toBeInTheDocument();
    });
    
    // Type into the search input
    const searchInput = screen.getByPlaceholderText("Search songs...");
    fireEvent.change(searchInput, { target: { value: "hello" } });
    
    // Verify search input value
    expect(searchInput.value).toBe("hello");
    
    // Only "Hello World" should be visible
    expect(screen.getByText("Hello World")).toBeInTheDocument();
    expect(screen.queryByText("Goodbye")).not.toBeInTheDocument();
    
    // Clear search and verify both songs are visible again
    fireEvent.change(searchInput, { target: { value: "" } });
    await waitFor(() => {
      expect(screen.getByText("Goodbye")).toBeInTheDocument();
    });
  });

  test('shows "No songs available" when filter returns no results', async () => {
    const songsMock = [
      {
        songId: 1,
        title: "Hello World",
        releaseDate: "2022-01-01T00:00:00.000Z",
        collaborators: "Artist A",
      },
    ];
    ApiService.fetchArtistSongs.mockResolvedValue(songsMock);
    render(<ArtistSongs />);
    
    await waitFor(() => {
      expect(screen.getByText("Hello World")).toBeInTheDocument();
    });
    
    // Enter a search term that does not match any song
    const searchInput = screen.getByPlaceholderText("Search songs...");
    fireEvent.change(searchInput, { target: { value: "xyz" } });
    
    await waitFor(() => {
      expect(screen.getByText("No songs available")).toBeInTheDocument();
    });
  });
});
