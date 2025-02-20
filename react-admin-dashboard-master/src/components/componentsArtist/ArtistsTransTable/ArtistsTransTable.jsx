import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import ApiService from "../../../service/ApiService";
import { sortTransactions, filterByField } from "../../../utils/SortFilter";
import { paginate, getPageNumbers } from "../../../utils/Paginate";

const pageSize = 10; // Records per page

const ArtistsTransTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [transactionSearch, setTransactionSearch] = useState("");
  const [receiverSearch, setReceiverSearch] = useState("");

  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchData = async () => {
      try {
          const data = await ApiService.fetchTransactionsById();
          setTransactions(data);
          setFilteredTransactions(data);
      } catch (err) {
          setError(err.message);
      } finally {
          setLoading(false);
      }
  };
  fetchData();
  }, []);

  // ✅ Filtering logic
  useEffect(() => {
    let result = transactions;
    if (transactionSearch) {
      result = filterByField(result, "transactionId", transactionSearch);
    }
    if (receiverSearch) {
      result = filterByField(result, "receiver", receiverSearch);
    }
    if (sortField) {
      result = sortTransactions(result, sortField, sortOrder);
    }
    setFilteredTransactions(result);
    setCurrentPage(1); // Reset to first page when filtering
  }, [transactionSearch, receiverSearch, sortField, sortOrder, transactions]);

  // ✅ Paginate data
  const paginatedTransactions = paginate(filteredTransactions, currentPage, pageSize);
  const { startPage, endPage, totalPages } = getPageNumbers(filteredTransactions.length, currentPage, pageSize);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // ✅ Handle Export as PDF
  const handleExportPDF = async () => {
    try {
      const userId = ApiService.getUserId();
      if (!userId) {
        console.error("User ID not found!");
        return;
      }
      const pdfBlob = await ApiService.exportTransByUsersPDF(userId);
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([pdfBlob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "transactions.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting transactions PDF:", error);
    }
  };

  if (loading) return <div className="text-gray-300">Loading data...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Header with Export as PDF button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">My Transactions</h2>
        <div className="flex gap-4">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            onClick={handleExportPDF}
          >
            Export as PDF
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              {[
                { label: "Transaction ID", field: "transactionId" },
                { label: "Sender ID", field: "sender" },
                { label: "Receiver ID", field: "receiver" },
                { label: "Royalty ID", field: "royaltyId" },
                { label: "Transaction Date", field: "transactionDate" },
                { label: "Amount", field: "transactionAmount" },
                { label: "Manager ID", field: "managerId" },
                { label: "Transaction Type", field: "transactionType" },
              ].map(({ label, field }) => (
                <th
                  key={field}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => {
                    setSortField(field);
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                >
                  {label}
                  <ChevronDown
                    className={`inline ml-1 transition-transform duration-200 ${
                      sortField === field ? (sortOrder === "desc" ? "rotate-180" : "rotate-0") : ""
                    }`}
                    size={16}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {paginatedTransactions.map((transaction) => (
              <motion.tr key={transaction.transactionId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{transaction.transactionId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{transaction.sender}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{transaction.receiver}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{transaction.royaltyId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {new Date(transaction.transactionDate).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${transaction.transactionAmount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{transaction.managerId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{transaction.transactionType}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <button className="mx-1 px-3 py-1 rounded-lg bg-gray-700 text-gray-300" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          <ChevronLeft />
        </button>
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => i + startPage).map((page) => (
          <button key={page} className={`mx-1 px-3 py-1 rounded-lg ${currentPage === page ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"}`} onClick={() => handlePageChange(page)}>
            {page}
          </button>
        ))}
        <button className="mx-1 px-3 py-1 rounded-lg bg-gray-700 text-gray-300" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          <ChevronRight />
        </button>
      </div>
    </motion.div>
  );
};

export default ArtistsTransTable;
