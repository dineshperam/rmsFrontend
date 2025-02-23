// ArtistsTrans.test.jsx
import React from "react";
import { render, screen, waitFor, fireEvent, within } from "@testing-library/react";
import ArtistsTrans from "./ArtistsTrans";
import ApiService from "../../../service/ApiService";

// Mock the ApiService module
jest.mock("../../../service/ApiService", () => ({
  fetchTransactionsArtists: jest.fn(),
  exportTransactionsPDF: jest.fn(),
}));

// Sample transactions data for testing
const mockTransactions = [
  {
    transactionId: "1",
    sender: "Alice",
    receiver: "Bob",
    transactionAmount: 100,
    transactionDate: new Date("2020-01-01"),
  },
  {
    transactionId: "2",
    sender: "Charlie",
    receiver: "Dave",
    transactionAmount: 200,
    transactionDate: new Date("2020-02-01"),
  },
  {
    transactionId: "3",
    sender: "Eve",
    receiver: "Frank",
    transactionAmount: 300,
    transactionDate: new Date("2020-03-01"),
  },
  {
    transactionId: "4",
    sender: "Grace",
    receiver: "Heidi",
    transactionAmount: 400,
    transactionDate: new Date("2020-04-01"),
  },
  {
    transactionId: "5",
    sender: "Ivan",
    receiver: "Judy",
    transactionAmount: 500,
    transactionDate: new Date("2020-05-01"),
  },
  {
    transactionId: "6",
    sender: "Ken",
    receiver: "Laura",
    transactionAmount: 600,
    transactionDate: new Date("2020-06-01"),
  },
];

describe("ArtistsTrans Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("shows loading state initially and then renders transactions", async () => {
    ApiService.fetchTransactionsArtists.mockResolvedValue(mockTransactions);
    const { container } = render(<ArtistsTrans />);

    // Initially, a loading message should be displayed.
    expect(screen.getByText(/Loading data/i)).toBeInTheDocument();

    // Wait until the header is rendered after data fetch.
    await waitFor(() => {
      expect(screen.getByText(/Artist's Transactions/i)).toBeInTheDocument();
    });

    // Scope search to the table body to avoid ambiguity with pagination buttons.
    const tbody = container.querySelector("tbody");
    // Check that the first 5 transactions (pageSize is 5) appear in the table body.
    mockTransactions.slice(0, 5).forEach((transaction) => {
      expect(within(tbody).getByText(String(transaction.transactionId), { exact: true })).toBeInTheDocument();
    });
  });

  test("displays error message if API call fails", async () => {
    ApiService.fetchTransactionsArtists.mockRejectedValue(new Error("API Error"));
    render(<ArtistsTrans />);

    await waitFor(() => {
      expect(screen.getByText(/Error: API Error/i)).toBeInTheDocument();
    });
  });

  test("calls exportTransactionsPDF when export button is clicked", async () => {
    ApiService.fetchTransactionsArtists.mockResolvedValue(mockTransactions);
    ApiService.exportTransactionsPDF.mockResolvedValue();

    render(<ArtistsTrans />);

    await waitFor(() => {
      expect(screen.getByText(/Artist's Transactions/i)).toBeInTheDocument();
    });

    // Find and click the Export PDF button.
    const exportButton = screen.getByRole("button", { name: /Export PDF/i });
    fireEvent.click(exportButton);

    expect(ApiService.exportTransactionsPDF).toHaveBeenCalledTimes(1);
  });

  test("filters transactions based on transaction ID search input", async () => {
    ApiService.fetchTransactionsArtists.mockResolvedValue(mockTransactions);
    const { container } = render(<ArtistsTrans />);

    await waitFor(() => {
      expect(screen.getByText(/Artist's Transactions/i)).toBeInTheDocument();
    });

    // Type into the transaction ID search input.
    const transactionSearchInput = screen.getByPlaceholderText(/Search Transaction ID/i);
    fireEvent.change(transactionSearchInput, { target: { value: "1" } });

    await waitFor(() => {
      // Scope the search to the table body.
      const tbody = container.querySelector("tbody");
      // Only the transaction with ID "1" should be visible.
      expect(within(tbody).getByText("1", { exact: true })).toBeInTheDocument();
      // Ensure that a transaction with ID "2" is not present.
      expect(within(tbody).queryByText("2")).not.toBeInTheDocument();
    });
  });

  test("filters transactions based on receiver ID search input", async () => {
    ApiService.fetchTransactionsArtists.mockResolvedValue(mockTransactions);
    const { container } = render(<ArtistsTrans />);

    await waitFor(() => {
      expect(screen.getByText(/Artist's Transactions/i)).toBeInTheDocument();
    });

    // Type into the receiver ID search input.
    const receiverSearchInput = screen.getByPlaceholderText(/Search Receiver ID/i);
    fireEvent.change(receiverSearchInput, { target: { value: "Bob" } });

    await waitFor(() => {
      const tbody = container.querySelector("tbody");
      // Only the transaction with receiver "Bob" should be visible.
      expect(within(tbody).getByText("Bob", { exact: true })).toBeInTheDocument();
      // Ensure that a transaction with receiver "Dave" is not present.
      expect(within(tbody).queryByText("Dave")).not.toBeInTheDocument();
    });
  });

  test("handles pagination correctly", async () => {
    // With 6 transactions and a pageSize of 5, there should be 2 pages.
    ApiService.fetchTransactionsArtists.mockResolvedValue(mockTransactions);
    const { container } = render(<ArtistsTrans />);

    await waitFor(() => {
      expect(screen.getByText(/Artist's Transactions/i)).toBeInTheDocument();
    });

    // Initially, page 1 is shown, so transaction with ID "6" (on page 2) should not be visible in the table.
    const tbody = container.querySelector("tbody");
    expect(within(tbody).queryByText("6")).not.toBeInTheDocument();

    // Click on the pagination button for page 2.
    const page2Button = screen.getByRole("button", { name: "2" });
    fireEvent.click(page2Button);

    await waitFor(() => {
      // Now transaction with ID "6" should be visible in the table.
      expect(within(tbody).getByText("6", { exact: true })).toBeInTheDocument();
    });
  });
});
