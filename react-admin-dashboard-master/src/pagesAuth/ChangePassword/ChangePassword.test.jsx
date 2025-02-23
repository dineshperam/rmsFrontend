import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import ChangePassword from "./ChangePassword";
import ApiService from "../../service/ApiService";
import { BrowserRouter } from "react-router-dom";
import { toast } from "react-toastify";

// Custom render to include routing context
const renderComponent = () =>
  render(
    <BrowserRouter>
      <ChangePassword />
    </BrowserRouter>
  );

// Mock ApiService
jest.mock("../../service/ApiService");

// Create a mock for useNavigate from react-router-dom
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock toast
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe("ChangePassword Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("renders with empty username when localStorage is empty", () => {
    renderComponent();
    const usernameInput = screen.getByPlaceholderText("Username");
    expect(usernameInput.value).toBe("");
  });

  test("handles OTP request failure", async () => {
    localStorage.setItem("changePasswordUser", "testuser");
    ApiService.requestOtp.mockResolvedValue(false);
    renderComponent();

    const requestButton = screen.getByRole("button", { name: /Request OTP/i });
    fireEvent.click(requestButton);
    // Button should be disabled during OTP request
    expect(requestButton).toBeDisabled();

    await waitFor(() => {
      expect(ApiService.requestOtp).toHaveBeenCalledWith("testuser");
    });
    // OTP input should not be rendered since request failed
    expect(screen.queryByPlaceholderText("Enter OTP")).toBeNull();
    // Button should be re-enabled after failure
    expect(requestButton).not.toBeDisabled();
  });

  test("shows error if passwords do not match on form submission", async () => {
    localStorage.setItem("changePasswordUser", "testuser");
    ApiService.requestOtp.mockResolvedValue(true);
    ApiService.updatePassword.mockResolvedValue(true);

    renderComponent();

    // Trigger OTP request
    const requestButton = screen.getByRole("button", { name: /Request OTP/i });
    fireEvent.click(requestButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Enter OTP")).toBeInTheDocument();
    });

    // Fill OTP and provide mismatching passwords
    fireEvent.change(screen.getByPlaceholderText("Enter OTP"), { target: { value: "123456" } });
    fireEvent.change(screen.getByPlaceholderText("New Password"), { target: { value: "password1" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "password2" } });

    fireEvent.submit(screen.getByRole("button", { name: /Change Password/i }));
    expect(toast.error).toHaveBeenCalledWith("Passwords do not match!");
    expect(ApiService.updatePassword).not.toHaveBeenCalled();
  });

  test("toggles password visibility", async () => {
    localStorage.setItem("changePasswordUser", "testuser");
    ApiService.requestOtp.mockResolvedValue(true);
    const { container } = renderComponent();

    // Trigger OTP request
    const requestButton = screen.getByRole("button", { name: /Request OTP/i });
    fireEvent.click(requestButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Enter OTP")).toBeInTheDocument();
    });

    const newPasswordInput = screen.getByPlaceholderText("New Password");
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");

    // Initially, password fields should be of type "password"
    expect(newPasswordInput.type).toBe("password");
    expect(confirmPasswordInput.type).toBe("password");

    // Get one of the toggle icons using a query selector (they share the same class)
    const toggleIcon = container.querySelector("span.absolute.right-4.cursor-pointer.text-white.text-lg");
    fireEvent.click(toggleIcon);

    // After clicking, the inputs should change to type "text"
    expect(newPasswordInput.type).toBe("text");
    expect(confirmPasswordInput.type).toBe("text");

    // Toggle back to "password"
    fireEvent.click(toggleIcon);
    expect(newPasswordInput.type).toBe("password");
    expect(confirmPasswordInput.type).toBe("password");
  });

  test("navigates back to login when clicking Back to Login button", () => {
    renderComponent();
    const backButton = screen.getByText("Back to Login");
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("username input is disabled after OTP is requested", async () => {
    localStorage.setItem("changePasswordUser", "testuser");
    ApiService.requestOtp.mockResolvedValue(true);
    renderComponent();

    const usernameInput = screen.getByPlaceholderText("Username");
    expect(usernameInput).not.toBeDisabled();

    const requestButton = screen.getByRole("button", { name: /Request OTP/i });
    fireEvent.click(requestButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Enter OTP")).toBeInTheDocument();
    });
    // Username input should now be disabled
    expect(usernameInput).toBeDisabled();
  });

  test("updates password and navigates to login on successful submission", async () => {
    jest.useFakeTimers();
    localStorage.setItem("changePasswordUser", "testuser");
    ApiService.requestOtp.mockResolvedValue(true);
    ApiService.updatePassword.mockResolvedValue(true);

    renderComponent();

    // Request OTP
    fireEvent.click(screen.getByRole("button", { name: /Request OTP/i }));

    // Wait for OTP input to appear
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Enter OTP")).toBeInTheDocument();
    });

    // Fill in OTP and matching passwords
    fireEvent.change(screen.getByPlaceholderText("Enter OTP"), { target: { value: "123456" } });
    fireEvent.change(screen.getByPlaceholderText("New Password"), { target: { value: "password1" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "password1" } });

    // Submit the form
    fireEvent.submit(screen.getByRole("button", { name: /Change Password/i }));

    await waitFor(() => {
      expect(ApiService.updatePassword).toHaveBeenCalledWith("testuser", "123456", "password1");
    });

    await waitFor(() => {
      expect(localStorage.getItem("changePasswordUser")).toBeNull();
    });

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(mockNavigate).toHaveBeenCalledWith("/login");
    jest.useRealTimers();
  });
});
