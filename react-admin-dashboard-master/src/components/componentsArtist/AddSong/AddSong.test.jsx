import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddSong from "./AddSongs";
import ApiService from "../../../service/ApiService";

// Mock the ApiService functions
jest.mock("../../../service/ApiService");

// Mock the Header component so we don't depend on its implementation
jest.mock("../../common/Header/Header", () => () => <div>Header</div>);

describe("AddSong Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Provide a mock return value for getUserId
    ApiService.getUserId.mockReturnValue("testUserId");
  });

  test("renders form fields", () => {
    render(<AddSong />);
    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByLabelText(/Title:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Release Date:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Collaborators:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Genre:/i)).toBeInTheDocument();
  });

  test("displays validation errors when fields are empty", async () => {
    render(<AddSong />);
    const addButton = screen.getByRole("button", { name: /Add Song/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("Title is required.")).toBeInTheDocument();
      expect(screen.getByText("Release date is required.")).toBeInTheDocument();
      expect(screen.getByText("Genre is required.")).toBeInTheDocument();
    });
  });

  test("displays validation error for future release date", async () => {
    render(<AddSong />);
    const titleInput = screen.getByLabelText(/Title:/i);
    const releaseDateInput = screen.getByLabelText(/Release Date:/i);
    const genreSelect = screen.getByLabelText(/Genre:/i);
    const collaboratorsInput = screen.getByLabelText(/Collaborators:/i);
    const addButton = screen.getByRole("button", { name: /Add Song/i });

    // Fill fields with valid values except release date
    fireEvent.change(titleInput, { target: { value: "Test Song" } });
    // Set a future date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const futureDate = tomorrow.toISOString().split("T")[0];
    fireEvent.change(releaseDateInput, { target: { value: futureDate } });
    fireEvent.change(genreSelect, { target: { value: "Pop" } });
    fireEvent.change(collaboratorsInput, { target: { value: "Test Collaborator" } });

    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/Release date cannot be in the future\./i)).toBeInTheDocument();
    });
  });

  test("submits the form successfully with valid data and resets fields", async () => {
    // Mock a successful submission response
    ApiService.addSong.mockResolvedValueOnce({
      message: "Song added successfully",
      success: true,
    });

    render(<AddSong />);
    const titleInput = screen.getByLabelText(/Title:/i);
    const releaseDateInput = screen.getByLabelText(/Release Date:/i);
    const genreSelect = screen.getByLabelText(/Genre:/i);
    const collaboratorsInput = screen.getByLabelText(/Collaborators:/i);
    const addButton = screen.getByRole("button", { name: /Add Song/i });

    // Use today or any valid past date
    const today = new Date().toISOString().split("T")[0];

    // Fill the form with valid data
    fireEvent.change(titleInput, { target: { value: "Valid Song" } });
    fireEvent.change(releaseDateInput, { target: { value: today } });
    fireEvent.change(genreSelect, { target: { value: "Rock" } });
    fireEvent.change(collaboratorsInput, { target: { value: "John Doe" } });

    fireEvent.click(addButton);

    await waitFor(() => {
      // Check that ApiService.addSong was called with the correct arguments
      expect(ApiService.addSong).toHaveBeenCalledWith(
        {
          title: "Valid Song",
          releaseDate: today,
          collaborators: "John Doe",
          genre: "Rock",
        },
        "testUserId"
      );
      // Verify the success message is shown
      expect(screen.getByText("Song added successfully")).toBeInTheDocument();
    });

    // Check that the form fields have been reset
    expect(titleInput.value).toBe("");
    expect(releaseDateInput.value).toBe("");
    expect(collaboratorsInput.value).toBe("");
    expect(genreSelect.value).toBe("");
  });

  test("displays error message when submission fails", async () => {
    // Mock a failure submission response
    ApiService.addSong.mockResolvedValueOnce({
      message: "Failed to add song",
      success: false,
    });

    render(<AddSong />);
    const titleInput = screen.getByLabelText(/Title:/i);
    const releaseDateInput = screen.getByLabelText(/Release Date:/i);
    const genreSelect = screen.getByLabelText(/Genre:/i);
    const collaboratorsInput = screen.getByLabelText(/Collaborators:/i);
    const addButton = screen.getByRole("button", { name: /Add Song/i });

    // Fill the form with valid data
    fireEvent.change(titleInput, { target: { value: "Another Song" } });
    const today = new Date().toISOString().split("T")[0];
    fireEvent.change(releaseDateInput, { target: { value: today } });
    fireEvent.change(genreSelect, { target: { value: "Jazz" } });
    fireEvent.change(collaboratorsInput, { target: { value: "Jane Doe" } });

    fireEvent.click(addButton);

    await waitFor(() => {
      expect(ApiService.addSong).toHaveBeenCalledWith(
        {
          title: "Another Song",
          releaseDate: today,
          collaborators: "Jane Doe",
          genre: "Jazz",
        },
        "testUserId"
      );
      // Check that the error message is shown
      expect(screen.getByText("Failed to add song")).toBeInTheDocument();
    });

    // In case of failure, the form values remain unchanged
    expect(titleInput.value).toBe("Another Song");
  });
});
