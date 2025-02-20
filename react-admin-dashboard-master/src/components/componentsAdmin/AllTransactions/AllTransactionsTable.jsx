import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, ChevronDown, Download } from "lucide-react";
import ApiService from "../../../service/ApiService";
import { sortTransactions, filterTransactions } from "../../../utils/SortFilter";
import { paginate, getPageNumbers } from "../../../utils/Paginate";

const pageSize = 7; // Records per page

const AllTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [receiverSearch, setReceiverSearch] = useState("");
  const [dateSearch, setDateSearch] = useState("");

  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await ApiService.fetchTransactions();
        setTransactions(data);
        setFilteredTransactions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  // Handle filtering
  useEffect(() => {
    setFilteredTransactions(filterTransactions(transactions, searchTerm, receiverSearch, dateSearch));
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, receiverSearch, dateSearch, transactions]);

  // Handle sorting
  const handleSort = (field) => {
    const order = sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
    setFilteredTransactions(sortTransactions(filteredTransactions, field, order));
  };

  // Export transactions as PDF
  const handleExportPDF = async () => {
    try {
      const response = await ApiService.exportTransPDF();
      const url = window.URL.createObjectURL(new Blob([response], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = "transactions.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting transactions PDF:", error);
    }
  };

  // Paginate filtered transactions
  const paginatedTransactions = paginate(filteredTransactions, currentPage, pageSize);
  const { startPage, endPage, totalPages } = getPageNumbers(filteredTransactions.length, currentPage, pageSize);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) return <div className="text-gray-300">Loading data...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <motion.div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      
      {/* Header Row: Title & Export Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-100">All Transactions</h2>
        <button onClick={handleExportPDF} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center">
          <Download className="mr-2" size={18} /> Export PDF
        </button>
      </div>

      {/* Search Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[
          { placeholder: "Search Transaction ID...", value: searchTerm, onChange: setSearchTerm },
          { placeholder: "Search Receiver ID...", value: receiverSearch, onChange: setReceiverSearch },
          { placeholder: "Search Date...", value: dateSearch, onChange: setDateSearch },
        ].map(({ placeholder, value, onChange }, idx) => (
          <div key={idx} className="relative">
            <input type="text" placeholder={placeholder} className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" value={value} onChange={(e) => onChange(e.target.value)} />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        ))}
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
              ].map(({ label, field }) => (
                <th key={field} className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort(field)}>
                  {label}
                  <ChevronDown className={`inline ml-1 transition-transform duration-200 ${sortField === field ? (sortOrder === "desc" ? "rotate-180" : "rotate-0") : ""}`} size={16} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {paginatedTransactions.map((transaction) => (
              <motion.tr key={transaction.transactionId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <td className="px-6 py-4 text-sm text-gray-300">{transaction.transactionId}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{transaction.sender}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{transaction.receiver}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{transaction.royaltyId}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{new Date(transaction.transactionDate).toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-300">${transaction.transactionAmount.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{transaction.managerId}</td>
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
        {[...Array(totalPages)].map((_, index) => (
          <button key={index} className={`mx-1 px-3 py-1 rounded-lg ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"}`} onClick={() => handlePageChange(index + 1)}>
            {index + 1}
          </button>
        ))}
        <button className="mx-1 px-3 py-1 rounded-lg bg-gray-700 text-gray-300" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          <ChevronRight />
        </button>
      </div>
    </motion.div>
  );
};

export default AllTransactions;
