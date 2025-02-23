import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Download } from "lucide-react";
import ApiService from "../../../service/ApiService";
import { paginate, getPageNumbers } from "../../../utils/Paginate";
import { sortTransactions, filterTransactions } from "../../../utils/SortFilter";
 
const ArtistsTrans = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [receiverSearch, setReceiverSearch] = useState("");
  const [sortField, setSortField] = useState("transactionDate");
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await ApiService.fetchTransactionsArtists();
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
 
  useEffect(() => {
    let updatedTransactions = filterTransactions(transactions, searchTerm, receiverSearch, "");
    updatedTransactions = sortTransactions(updatedTransactions, sortField, "asc");
    setFilteredTransactions(updatedTransactions);
  }, [searchTerm, receiverSearch, sortField, transactions]);
 
  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleReceiverSearch = (e) => setReceiverSearch(e.target.value);
  const handleSortChange = (e) => setSortField(e.target.value);
 
  const handleExportPDF = async () => {
    await ApiService.exportTransactionsPDF();
};
 
 
  if (loading) return <div className="text-gray-300">Loading data...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
 
  const paginatedTransactions = paginate(filteredTransactions, currentPage, pageSize);
  const { totalPages } = getPageNumbers(filteredTransactions.length, currentPage, pageSize);
 
  return (
    <motion.div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
     
      {/* Header Row: Title & Export Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-100">Artist's Transactions</h2>
        <button onClick={handleExportPDF} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center">
          <Download className="mr-2" size={18} /> Export PDF
        </button>
      </div>
 
      {/* Search & Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <input type="text" placeholder="Search Transaction ID..." className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={handleSearch} />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
 
        <div className="relative">
          <input type="text" placeholder="Search Receiver ID..." className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" value={receiverSearch} onChange={handleReceiverSearch} />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
 
        <select value={sortField} onChange={handleSortChange} className="bg-gray-700 text-white rounded-lg px-3 py-2 w-full focus:outline-none">
          <option value="transactionDate">Transaction Date</option>
          <option value="transactionAmount">Amount</option>
        </select>
      </div>
 
      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Transaction ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Sender</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Receiver</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Transaction Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {paginatedTransactions.map((transaction) => (
              <tr key={transaction.transactionId}>
                <td className="px-6 py-4 text-sm text-gray-300">{transaction.transactionId}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{transaction.sender}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{transaction.receiver}</td>
                <td className="px-6 py-4 text-sm text-gray-300">₹{transaction.transactionAmount.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{new Date(transaction.transactionDate).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
 
      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {[...Array(totalPages)].map((_, index) => (
          <button key={index} onClick={() => setCurrentPage(index + 1)} className={`px-3 py-1 mx-1 rounded-lg ${currentPage === index + 1 ? "bg-blue-500" : "bg-gray-700"} text-white`}>
            {index + 1}
          </button>
        ))}
      </div>
    </motion.div>
  );
};
 
export default ArtistsTrans;