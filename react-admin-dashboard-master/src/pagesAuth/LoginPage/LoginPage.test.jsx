import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "./LoginPage"; // Adjust path if needed
import ApiService from "../../service/ApiService";
import { useNavigate } from "react-router-dom";

// Mock react-router-dom's useNavigate
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

// Mock ApiService methods
jest.mock("../../service/ApiService", () => ({
  loginUser: jest.fn(),
  saveAuthData: jest.fn(),
}));

describe("LoginPage", () => {
  let navigateMock;

  beforeEach(() => {
    navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders login page with email and password inputs", () => {
    render(<LoginPage />);
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  test("shows validation errors when submitting empty form", async () => {
    render(<LoginPage />);
    const loginButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
    });
  });

  test("shows error for invalid email format", async () => {
    render(<LoginPage />);
    const emailInput = screen.getByPlaceholderText(/email/i);
    fireEvent.change(emailInput, { target: { value: "invalidemail" } });

    await waitFor(() => {
      expect(screen.getByText(/Invalid email format/i)).toBeInTheDocument();
    });
  });

  test("toggles password visibility when clicking the eye icon", () => {
    const { container } = render(<LoginPage />);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    expect(passwordInput.type).toBe("password");

    // Find the toggle icon element by its classes
    const toggleIcon = container.querySelector("span.absolute.right-4.cursor-pointer");
    expect(toggleIcon).toBeInTheDocument();
    fireEvent.click(toggleIcon);
    expect(passwordInput.type).toBe("text");

    // Click again to toggle back
    fireEvent.click(toggleIcon);
    expect(passwordInput.type).toBe("password");
  });

  test("navigates to forgot password page with provided email", () => {
    render(<LoginPage />);
    const emailInput = screen.getByPlaceholderText(/email/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    const forgotButton = screen.getByRole("button", { name: /forgot password\?/i });
    fireEvent.click(forgotButton);
    expect(navigateMock).toHaveBeenCalledWith("/forgot-password", {
      state: { email: "test@example.com" },
    });
  });

  test("handles successful login for first-time login", async () => {
    const response = {
      status: 200,
      active: true,
      firstLogin: true,
      message: "Login successful",
      role: "Artist",
    };
    ApiService.loginUser.mockResolvedValue(response);

    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(ApiService.loginUser).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/change-password");
    });
  });

  test("redirects to artist dashboard on successful login with Artist role", async () => {
    const response = {
      status: 200,
      active: true,
      firstLogin: false,
      message: "Login successful",
      role: "Artist",
    };
    ApiService.loginUser.mockResolvedValue(response);

    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "artist@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(ApiService.loginUser).toHaveBeenCalledWith({
        email: "artist@example.com",
        password: "password123",
      });
    });
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/artist-dashboard");
    });
  });

  test("redirects to manager dashboard on successful login with Manager role", async () => {
    const response = {
      status: 200,
      active: true,
      firstLogin: false,
      message: "Login successful",
      role: "Manager",
    };
    ApiService.loginUser.mockResolvedValue(response);

    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "manager@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(ApiService.loginUser).toHaveBeenCalledWith({
        email: "manager@example.com",
        password: "password123",
      });
    });
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/manager-dashboard");
    });
  });

  test("redirects to admin dashboard on successful login with Admin role", async () => {
    const response = {
      status: 200,
      active: true,
      firstLogin: false,
      message: "Login successful",
      role: "Admin",
    };
    ApiService.loginUser.mockResolvedValue(response);

    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "admin@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(ApiService.loginUser).toHaveBeenCalledWith({
        email: "admin@example.com",
        password: "password123",
      });
    });
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/admin-dashboard");
    });
  });

  test("displays error message for inactive account", async () => {
    const response = {
      status: 200,
      active: false,
      firstLogin: false,
      message: "Account inactive",
      role: "Artist",
    };
    ApiService.loginUser.mockResolvedValue(response);

    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "inactive@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(ApiService.loginUser).toHaveBeenCalledWith({
        email: "inactive@example.com",
        password: "password123",
      });
    });
    await waitFor(() => {
      expect(
        screen.getByText(/Account is inactive. Please contact support./i)
      ).toBeInTheDocument();
    });
  });

  test("displays error message when API returns an error", async () => {
    ApiService.loginUser.mockRejectedValue({
      response: { data: { message: "Invalid credentials" } },
    });

    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "error@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(ApiService.loginUser).toHaveBeenCalledWith({
        email: "error@example.com",
        password: "password123",
      });
    });
    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });
});
