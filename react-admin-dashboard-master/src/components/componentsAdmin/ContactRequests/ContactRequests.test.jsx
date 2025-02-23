 // ContactRequests.test.jsx

 import React from "react";
 import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
 import ContactRequests from "./ContactRequests";
 import ApiService from "../../../service/ApiService";
 
 // Mock the ApiService module
 jest.mock("../../../service/ApiService");
 
 describe("ContactRequests component", () => {
   // Sample data for testing
   const sampleRequests = [
     {
       id: 1,
       firstname: "John",
       lastname: "Doe",
       email: "john@example.com",
       mobileno: "1234567890",
     },
     {
       id: 2,
       firstname: "Jane",
       lastname: "Smith",
       email: "jane@example.com",
       mobileno: "0987654321",
     },
   ];
 
   beforeEach(() => {
     jest.clearAllMocks();
   });
 
   test("renders contact requests fetched from ApiService", async () => {
     // Resolve the fetch request with sample data
     ApiService.fetchContactRequests.mockResolvedValue(sampleRequests);
 
     render(<ContactRequests />);
 
     // Query the header by role to ensure we get a unique element
     expect(
       screen.getByRole("heading", { name: /Contact Requests/i })
     ).toBeInTheDocument();
 
     // Wait for the table rows to appear with fetched data
     await waitFor(() => {
       expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
       expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();
     });
   });
 
   test("filters contact requests based on search input", async () => {
     ApiService.fetchContactRequests.mockResolvedValue(sampleRequests);
     render(<ContactRequests />);
 
     // Wait for the data to be rendered
     await waitFor(() => {
       expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
       expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();
     });
 
     const searchInput = screen.getByPlaceholderText(/Search.../i);
     // Type a search term that matches only one contact
     fireEvent.change(searchInput, { target: { value: "john" } });
 
     // "John Doe" should be visible while "Jane Smith" should not be
     expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
     expect(screen.queryByText(/Jane Smith/i)).not.toBeInTheDocument();
 
     // Clear the search input and both contacts should reappear
     fireEvent.change(searchInput, { target: { value: "" } });
     expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();
   });
 
   test("handles Accept action and removes the contact request", async () => {
     ApiService.fetchContactRequests.mockResolvedValue(sampleRequests);
     ApiService.handleContactAction.mockResolvedValue(true);
 
     render(<ContactRequests />);
 
     // Wait for the contact data to be rendered
     await waitFor(() => {
       expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
     });
 
     // Click the Accept button for the first request (John Doe)
     const acceptButtons = screen.getAllByText(/Accept/i);
     fireEvent.click(acceptButtons[0]);
 
     // Wait for the ApiService.handleContactAction to be called with the correct arguments
     await waitFor(() => {
       expect(ApiService.handleContactAction).toHaveBeenCalledWith(1, "accept");
       // Verify that the row for John Doe has been removed
       expect(screen.queryByText(/John Doe/i)).not.toBeInTheDocument();
     });
   });
 
   test("handles Reject action and removes the contact request", async () => {
     ApiService.fetchContactRequests.mockResolvedValue(sampleRequests);
     ApiService.handleContactAction.mockResolvedValue(true);
 
     render(<ContactRequests />);
 
     // Wait for the data to be rendered
     await waitFor(() => {
       expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();
     });
 
     // Locate the row for Jane Smith
     const janeRow = screen.getByText(/Jane Smith/i).closest("tr");
     expect(janeRow).toBeInTheDocument();
 
     // Get the Reject button within Jane Smith's row
     const rejectButton = within(janeRow).getByText(/Reject/i);
     fireEvent.click(rejectButton);
 
     await waitFor(() => {
       expect(ApiService.handleContactAction).toHaveBeenCalledWith(2, "reject");
       // Verify that the row for Jane Smith has been removed
       expect(screen.queryByText(/Jane Smith/i)).not.toBeInTheDocument();
     });
   });
 
   test("disables button during loading state", async () => {
     ApiService.fetchContactRequests.mockResolvedValue(sampleRequests);
     let resolvePromise;
     const handleActionPromise = new Promise((resolve) => {
       resolvePromise = resolve;
     });
     ApiService.handleContactAction.mockReturnValue(handleActionPromise);
 
     render(<ContactRequests />);
 
     await waitFor(() => {
       expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
     });
 
     const acceptButtons = screen.getAllByText(/Accept/i);
     const acceptButton = acceptButtons[0];
 
     // Ensure the button is enabled before clicking
     expect(acceptButton).not.toBeDisabled();
 
     // Click the Accept button
     fireEvent.click(acceptButton);
     // Immediately after clicking, the button should be disabled while loading
     expect(acceptButton).toBeDisabled();
 
     // Resolve the pending promise to simulate a successful API call
     resolvePromise(true);
 
     // Wait for the state update (the row should be removed)
     await waitFor(() => {
       expect(screen.queryByText(/John Doe/i)).not.toBeInTheDocument();
     });
   });
 });
 