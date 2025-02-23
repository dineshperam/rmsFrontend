// ContactForm.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ContactForm from "./ContactForm";
import ApiService from "../../service/ApiService";

// Mock the ApiService module
jest.mock("../../service/ApiService");

describe("ContactForm Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders form inputs, labels, and the submit button", () => {
    render(<ContactForm />);
    expect(screen.getByPlaceholderText("First Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Last Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Mobile No")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your Query")).toBeInTheDocument();
    expect(screen.getByText("Contact Us")).toBeInTheDocument();
    expect(screen.getByLabelText("Artist")).toBeInTheDocument();
    expect(screen.getByLabelText("Manager")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  test("displays validation errors when submitting an empty form", async () => {
    render(<ContactForm />);
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    
    expect(await screen.findByText("First Name is required.")).toBeInTheDocument();
    expect(screen.getByText("Last Name is required.")).toBeInTheDocument();
    expect(screen.getByText("Email is required.")).toBeInTheDocument();
    expect(screen.getByText("Mobile Number is required.")).toBeInTheDocument();
    expect(screen.getByText("Query is required.")).toBeInTheDocument();
  });

  test("submits the form successfully when provided valid data", async () => {
    // Set the ApiService to resolve as a success
    ApiService.submitContactForm.mockResolvedValue(true);

    render(<ContactForm />);
    fireEvent.change(screen.getByPlaceholderText("First Name"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Last Name"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Mobile No"), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByPlaceholderText("Your Query"), {
      target: { value: "This is a valid query." },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    // Wait for the ApiService to be called with correct form data
    await waitFor(() => {
      expect(ApiService.submitContactForm).toHaveBeenCalledWith({
        firstname: "John",
        lastname: "Doe",
        email: "john@example.com",
        mobileno: "1234567890",
        query: "This is a valid query.",
        role: "Artist",
      });
    });

    // Check for success message and that the inputs are cleared
    expect(await screen.findByText("Your query has been submitted successfully.")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("First Name").value).toBe("");
    expect(screen.getByPlaceholderText("Last Name").value).toBe("");
    expect(screen.getByPlaceholderText("Email").value).toBe("");
    expect(screen.getByPlaceholderText("Mobile No").value).toBe("");
    expect(screen.getByPlaceholderText("Your Query").value).toBe("");
  });

  test("displays error message when submission fails", async () => {
    // Set the ApiService to simulate a submission failure
    ApiService.submitContactForm.mockResolvedValue(false);

    render(<ContactForm />);
    fireEvent.change(screen.getByPlaceholderText("First Name"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Last Name"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Mobile No"), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByPlaceholderText("Your Query"), {
      target: { value: "This is a valid query." },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findByText("Error submitting the form. Please try again.")).toBeInTheDocument();
  });

  test("displays validation error when the query is too short", async () => {
    render(<ContactForm />);
    fireEvent.change(screen.getByPlaceholderText("First Name"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Last Name"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Mobile No"), {
      target: { value: "1234567890" },
    });
    // Query less than 10 characters
    fireEvent.change(screen.getByPlaceholderText("Your Query"), {
      target: { value: "Too short" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findByText("Query must be at least 10 characters long.")).toBeInTheDocument();
  });
});
