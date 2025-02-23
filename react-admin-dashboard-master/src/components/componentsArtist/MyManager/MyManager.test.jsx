// MyManager.test.jsx
import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import MyManager from "./MyManager";
import ApiService from "../../../service/ApiService";

// Mock the ApiService module so that you can control its behavior in tests
jest.mock("../../../service/ApiService");

// If SettingSection isn't relevant to your tests, you can mock it so that it simply renders its children.
jest.mock("../../componentsAdmin/Security/SettingSection", () => ({ children }) => <div>{children}</div>);

describe("MyManager", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders manager profile data when API call is successful", async () => {
    // Define the fake user data to be returned by the API call.
    const mockUser = {
      username: "manager123",
      email: "manager@example.com",
      firstName: "John",
      lastName: "Doe",
      mobileNo: "1234567890",
      address: "123 Main St",
      role: "Manager",
      managerId: "mgr-001"
    };

    // Make getManagerInfo resolve with the fake user data.
    ApiService.getManagerInfo.mockResolvedValue(mockUser);

    render(<MyManager />);

    // Wait for the component to render the user's name
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Check that all the expected fields are rendered
    expect(screen.getByText("Username:")).toBeInTheDocument();
    expect(screen.getByText("manager123")).toBeInTheDocument();

    expect(screen.getByText("Email:")).toBeInTheDocument();
    expect(screen.getByText("manager@example.com")).toBeInTheDocument();

    expect(screen.getByText("Phone Number:")).toBeInTheDocument();
    expect(screen.getByText("1234567890")).toBeInTheDocument();

    expect(screen.getByText("Address:")).toBeInTheDocument();
    expect(screen.getByText("123 Main St")).toBeInTheDocument();

    expect(screen.getByText("Role:")).toBeInTheDocument();
    expect(screen.getByText("Manager")).toBeInTheDocument();

    expect(screen.getByText("Manager Id:")).toBeInTheDocument();
    expect(screen.getByText("mgr-001")).toBeInTheDocument();
  });

  test("displays error message when API call fails", async () => {
    // Create an error with a response containing a message.
    const errorMessage = "Failed to fetch manager info";
    const error = { response: { data: { message: errorMessage } } };

    // Make the API call reject with the error.
    ApiService.getManagerInfo.mockRejectedValue(error);

    render(<MyManager />);

    // Wait for the error message to be rendered
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
