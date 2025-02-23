import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ForgotPassword from "./ForgotPassword";
import ApiService from "../../service/ApiService";
import { BrowserRouter } from "react-router-dom";

// Mock ApiService methods
jest.mock("../../service/ApiService", () => ({
  requestOtp: jest.fn(),
  resetPassword: jest.fn(),
}));

// Mock useNavigate from react-router-dom
const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

describe("ForgotPassword component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>
    );
  };

  test("renders initial form for sending OTP", () => {
    renderComponent();
    expect(screen.getByText("Forgot Password")).toBeInTheDocument();
    expect(
      screen.getByText("Enter your username and we'll send an OTP to your registered email.")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your username")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Send OTP/i })).toBeInTheDocument();
  });

  test("calls requestOtp and switches to OTP form on success", async () => {
    ApiService.requestOtp.mockResolvedValue({ success: true });
    renderComponent();

    // Fill in username and submit the form
    const usernameInput = screen.getByPlaceholderText("Enter your username");
    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    const sendOtpButton = screen.getByRole("button", { name: /Send OTP/i });
    fireEvent.click(sendOtpButton);

    // Wait for the OTP form to appear
    await waitFor(() =>
      expect(
        screen.getByText("Enter the OTP sent to your email and your new password.")
      ).toBeInTheDocument()
    );
    expect(ApiService.requestOtp).toHaveBeenCalledWith("testuser");
  });

  test("calls resetPassword and navigates to login on success", async () => {
    // First, mock a successful OTP request
    ApiService.requestOtp.mockResolvedValue({ success: true });
    // Then, mock a successful reset password call
    ApiService.resetPassword.mockResolvedValue({ success: true });
    jest.useFakeTimers();

    renderComponent();

    // Request OTP flow
    const usernameInput = screen.getByPlaceholderText("Enter your username");
    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    const sendOtpButton = screen.getByRole("button", { name: /Send OTP/i });
    fireEvent.click(sendOtpButton);

    await waitFor(() =>
      expect(
        screen.getByText("Enter the OTP sent to your email and your new password.")
      ).toBeInTheDocument()
    );

    // Fill out the OTP form
    fireEvent.change(screen.getByPlaceholderText("Enter OTP"), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByPlaceholderText("New Password"), {
      target: { value: "newpass" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "newpass" },
    });
    const resetButton = screen.getByRole("button", { name: /Reset Password/i });
    fireEvent.click(resetButton);

    await waitFor(() =>
      expect(ApiService.resetPassword).toHaveBeenCalledWith(
        "testuser",
        "123456",
        "newpass",
        "newpass"
      )
    );

    // Fast-forward timers (simulate the 2000ms delay)
    jest.runAllTimers();
    expect(mockedUsedNavigate).toHaveBeenCalledWith("/login");

    jest.useRealTimers();
  });

  test("handles OTP request error by re-enabling the button", async () => {
    ApiService.requestOtp.mockResolvedValue({ success: false });
    renderComponent();

    const usernameInput = screen.getByPlaceholderText("Enter your username");
    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    const sendOtpButton = screen.getByRole("button", { name: /Send OTP/i });
    fireEvent.click(sendOtpButton);

    await waitFor(() => {
      expect(ApiService.requestOtp).toHaveBeenCalledWith("testuser");
    });
    // On failure, the OTP button should be re-enabled.
    expect(sendOtpButton).not.toBeDisabled();
  });
});
