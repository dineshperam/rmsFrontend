
// AddUser.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddUser from './AddUser';
import ApiService from '../../../service/ApiService';
import '@testing-library/jest-dom';


jest.mock('../../../service/ApiService');

describe('AddUser Component', () => {
  beforeEach(() => {
    // Clear any previous calls to the mock
    ApiService.addUser.mockClear();
  });

  test('renders all form fields', () => {
    render(<AddUser />);
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mobile Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Role/i)).toBeInTheDocument();
  });

  test('shows validation error for invalid email', () => {
    render(<AddUser />);
    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
    expect(screen.getByText(/Invalid email format/i)).toBeInTheDocument();
  });

  test('shows validation error for username less than 3 characters', () => {
    render(<AddUser />);
    const usernameInput = screen.getByLabelText(/Username/i);
    fireEvent.change(usernameInput, { target: { value: 'ab' } });
    expect(screen.getByText(/Username must be at least 3 characters/i)).toBeInTheDocument();
  });

  test('shows validation error for weak password', () => {
    render(<AddUser />);
    const passwordInput = screen.getByLabelText(/^Password \*/i);
    fireEvent.change(passwordInput, { target: { value: 'pass' } });
    expect(
      screen.getByText(
        /Password must be at least 8 characters, include uppercase, lowercase, number, and special character/i
      )
    ).toBeInTheDocument();
  });

  test('shows validation error when confirm password does not match', () => {
    render(<AddUser />);
    const passwordInput = screen.getByLabelText(/^Password \*/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
    fireEvent.change(passwordInput, { target: { value: 'Valid1@Password' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'DifferentPassword' } });
    expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
  });

  test('shows validation error for invalid mobile number', () => {
    render(<AddUser />);
    const mobileInput = screen.getByLabelText(/Mobile Number/i);
    fireEvent.change(mobileInput, { target: { value: '12345' } });
    expect(screen.getByText(/Mobile number must be exactly 10 digits/i)).toBeInTheDocument();
  });

  test('disables the submit button when there are errors', () => {
    render(<AddUser />);
    // Trigger an error by entering an invalid email
    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
    const submitButton = screen.getByRole('button', { name: /Add User/i });
    expect(submitButton).toBeDisabled();
  });

  test('submits the form successfully with valid data', async () => {
    // Setup the mock to resolve successfully
    ApiService.addUser.mockResolvedValue({
      success: true,
      message: 'User added successfully',
    });

    render(<AddUser />);

    // Fill out all required fields with valid data
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'johndoe' } });
    fireEvent.change(screen.getByLabelText(/^Password \*/i), {
      target: { value: 'Valid1@Password' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'Valid1@Password' },
    });
    fireEvent.change(screen.getByLabelText(/Mobile Number/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: '123 Street' } });
    fireEvent.change(screen.getByLabelText(/Role/i), { target: { value: 'Admin' } });

    const submitButton = screen.getByRole('button', { name: /Add User/i });
    fireEvent.click(submitButton);

    // Check if the button displays a loading state
    expect(submitButton).toHaveTextContent(/Adding.../i);

    await waitFor(() => {
      expect(ApiService.addUser).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        username: 'johndoe',
        mobileNo: '1234567890',
        address: '123 Street',
        role: 'Admin',
        password: 'Valid1@Password',
        passwordHash: 'Valid1@Password',
        managerId: 0,
      });
    });

    // Wait for the success message to appear
    await waitFor(() => {
      expect(screen.getByText(/User added successfully/i)).toBeInTheDocument();
    });

    // Check that form fields have been reset after a successful submission
    expect(screen.getByLabelText(/First Name/i).value).toBe('');
    expect(screen.getByLabelText(/Email/i).value).toBe('');
  });
});
