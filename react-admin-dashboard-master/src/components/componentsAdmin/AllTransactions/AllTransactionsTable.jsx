import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, ChevronDown, Download } from "lucide-react";
import ApiService from "../../../service/ApiService";
import { sortTransactions, filterTransactions } from "../../../utils/SortFilter";
import { paginate, getPageNumbers } from "../../../utils/Paginate";
import jsPDF from "jspdf";
import "jspdf-autotable";

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

  const handleAdminDownloadPDF = (transaction) => {
    const doc = new jsPDF();

    // ✅ Set navy blue background (HEX: #001f3f)
    doc.setFillColor(0, 31, 63);
    doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, "F");

    // ✅ Set text color to white
    doc.setTextColor(255, 255, 255);

    // ✅ Logo
    const logoURL = `${window.location.origin}/RM_Latest1.png`;
    doc.addImage(logoURL, "PNG", 14, 10, 30, 12);

    // ✅ Title
    doc.setFontSize(18);
    doc.text("Transaction Invoice", 105, 30, null, null, "center");

    // ✅ Company Details
    doc.setFontSize(12);
    doc.text("Royal Mint", 14, 50);
    doc.text("Dr. M.H Marigowda Road", 14, 57);
    doc.text("Bangalore, Karnataka 560029", 14, 64);
    doc.text("Phone: 9740659298", 14, 71);
    doc.text("Email: RoyalMint@gmail.com", 14, 78);

    // ✅ Invoice Details
    const invoiceData = [
        ["Invoice No:", `INV-${transaction.transactionId}`],
        ["Invoice Date:", new Date().toLocaleDateString()],
        ["Transaction Date:", new Date(transaction.transactionDate).toLocaleString()],
        ["Sender:", transaction.sender],
        ["Receiver:", transaction.receiver],
        ["Transaction Type:", transaction.transactionType]
    ];

    let yPosition = 90;
    invoiceData.forEach(([label, value]) => {
        doc.setFontSize(12);
        doc.text(`${label} ${value}`, 14, yPosition);
        yPosition += 10;
    });

    // ✅ Table for Transaction Summary
    doc.autoTable({
        startY: yPosition + 10,
        head: [["Description", "Amount (INR)"]],
        body: [["Royalty Payment", `$${transaction.transactionAmount.toFixed(2)}`]],
        theme: "grid",
        styles: { fontSize: 12, cellPadding: 5 },
    });

    // ✅ Footer
    doc.setFontSize(10);
    doc.text("Thank you for your business!", 14, doc.internal.pageSize.height - 20);
    doc.text("This is a system-generated invoice and does not require a signature.", 14, doc.internal.pageSize.height - 15);

    // ✅ Save PDF
    doc.save(`transaction_${transaction.transactionId}.pdf`);
};

const handleAdminExportAllPDF = (transactions2) => {
  if (!Array.isArray(transactions2) || transactions2.length === 0) {
      alert("No transactions to export.");
      return;
  }

  const doc = new jsPDF();

   // ✅ Set navy blue background (HEX: #001f3f)
   doc.setFillColor(0, 31, 63);
   doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, "F");

   // ✅ Set text color to white
   doc.setTextColor(255, 255, 255);
   
  // ✅ Add Logo
  const logo = `${window.location.origin}/RM_Latest1.png`;
  doc.addImage(logo, "PNG", 14, 10, 50, 20);

  // ✅ Title
  doc.setFontSize(18);
  doc.text("Transactions Report", 105, 30, null, null, "center");

  // ✅ Company Info
  doc.setFontSize(12);
  doc.text("Royal Mint", 14, 50);
  doc.text("Dr. M.H Marigowda Road", 14, 57);
  doc.text("Bangalore, Karnataka 560029", 14, 64);
  doc.text("Phone: 9740659298", 14, 71);
  doc.text("Email: RoyalMint@gmail.com", 14, 78);

  // ✅ Ensure transactions2 is an array before using map
  const columns = ["Transaction ID", "Sender", "Receiver", "Amount (USD)", "Date", "Type"];
  const rows = transactions2.map(tx => [
      tx.transactionId,
      tx.sender,
      tx.receiver,
      `$${tx.transactionAmount.toFixed(2)}`,
      new Date(tx.transactionDate).toLocaleString(),
      tx.transactionType
  ]);

  // ✅ Generate Table
  doc.autoTable({
      startY: 90,
      head: [columns],
      body: rows,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 5 },
  });

  // ✅ Footer
  doc.setFontSize(10);
  doc.text("This report contains all recorded transactions.", 14, doc.internal.pageSize.height - 20);
  doc.text("Generated automatically by the system.", 14, doc.internal.pageSize.height - 15);

  // ✅ Save PDF
  doc.save("all_transactions.pdf");
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
        <button onClick={() => handleAdminExportAllPDF(filteredTransactions)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center">
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
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                      onClick={() => handleAdminDownloadPDF(transaction)}
                  >
                      <Download size={16} /> Download
                  </button>
              </td>
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
