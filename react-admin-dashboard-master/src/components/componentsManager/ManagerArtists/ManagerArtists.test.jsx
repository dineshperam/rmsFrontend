// ManagerArtists.test.jsx
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ManagerArtists from "./ManagerArtists";
import ApiService from "../../../service/ApiService";

// Mock the ApiService module
jest.mock("../../../service/ApiService", () => ({
  getManagerId: jest.fn(),
  fetchArtistsUnderManager: jest.fn(),
  exportPartnershipPDFMan: jest.fn(),
}));

describe("ManagerArtists Component", () => {
  const sampleArtists = [
    {
      userid: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      address: "123 Street",
      mobileNo: "1234567890",
    },
    {
      userid: "2",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      address: "456 Avenue",
      mobileNo: "0987654321",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    ApiService.getManagerId.mockReturnValue("manager-123");
  });

  test("shows loading state initially", async () => {
    ApiService.fetchArtistsUnderManager.mockResolvedValue(sampleArtists);

    render(<ManagerArtists />);

    // The loading text should be visible initially
    expect(screen.getByText(/Loading artists.../i)).toBeInTheDocument();

    // Wait for fetch to be called with the manager ID
    await waitFor(() =>
      expect(ApiService.fetchArtistsUnderManager).toHaveBeenCalledWith("manager-123")
    );
  });

  test("displays error message when fetch fails", async () => {
    ApiService.fetchArtistsUnderManager.mockRejectedValue(new Error("Fetch error"));

    render(<ManagerArtists />);

    await waitFor(() => expect(screen.getByText(/Error:/i)).toBeInTheDocument());
    expect(screen.getByText(/Failed to fetch artists/i)).toBeInTheDocument();
  });

  test("renders artist data after successful fetch", async () => {
    ApiService.fetchArtistsUnderManager.mockResolvedValue(sampleArtists);

    render(<ManagerArtists />);

    // Wait until artist first names appear in the document
    for (const artist of sampleArtists) {
      await waitFor(() => expect(screen.getByText(artist.firstName)).toBeInTheDocument());
    }

    // Verify that data is rendered correctly
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Jane")).toBeInTheDocument();
  });

  test("filters artists based on search input", async () => {
    ApiService.fetchArtistsUnderManager.mockResolvedValue(sampleArtists);

    render(<ManagerArtists />);

    // Wait until the artists are rendered
    await waitFor(() => expect(screen.getByText("John")).toBeInTheDocument());

    // Get the search input field
    const searchInput = screen.getByPlaceholderText("Search artists...");

    // Change the input value to filter out "John"
    fireEvent.change(searchInput, { target: { value: "Jane" } });

    // "John" should no longer be visible while "Jane" remains
    await waitFor(() => {
      expect(screen.queryByText("John")).not.toBeInTheDocument();
      expect(screen.getByText("Jane")).toBeInTheDocument();
    });
  });

  test("calls exportPartnershipPDFMan when download button is clicked", async () => {
    ApiService.fetchArtistsUnderManager.mockResolvedValue(sampleArtists);
    ApiService.exportPartnershipPDFMan.mockResolvedValue({});

    render(<ManagerArtists />);

    // Wait until the artists are rendered
    await waitFor(() => expect(screen.getByText("John")).toBeInTheDocument());

    // Find all buttons; assuming each row has one download button.
    const downloadButtons = screen.getAllByRole("button");
    // Click the download button for the first artist (John with userid "1")
    fireEvent.click(downloadButtons[0]);

    expect(ApiService.exportPartnershipPDFMan).toHaveBeenCalledWith("1");
  });
});
