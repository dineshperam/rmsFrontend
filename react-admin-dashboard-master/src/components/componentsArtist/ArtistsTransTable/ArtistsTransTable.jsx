import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronDown, Download } from "lucide-react";
import ApiService from "../../../service/ApiService";
import { sortTransactions, filterByField } from "../../../utils/SortFilter";
import { paginate, getPageNumbers } from "../../../utils/Paginate";
import jsPDF from "jspdf";
import "jspdf-autotable";

const pageSize = 10;

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
    setCurrentPage(1);
  }, [transactionSearch, receiverSearch, sortField, sortOrder, transactions]);

  // Ensure your logo is placed in the assets folder

  const handleDownloadPDF = (transaction) => {
    const doc = new jsPDF();


    // ✅ Set navy blue background (HEX: #001f3f)
    doc.setFillColor(0, 31, 63); // RGB for Navy Blue
    doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, "F"); // "F" = fill

    // ✅ Set text color to white for visibility
    doc.setTextColor(255, 255, 255);

    //logo
    const logoURL = "http://localhost:5173/RM_Latest1.png";

    doc.addImage(logoURL, "PNG", 14, 10, 30, 12);


    // ✅ Title
    doc.setFontSize(18);
    doc.text("Invoice Details", 105, 30, null, null, "center");

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
      ["Customer Name:", transaction.receiver],
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
      body: [
        ["Royalty Payment", `$${transaction.transactionAmount.toFixed(2)}`]
      ],
      theme: "grid",
      styles: { fontSize: 12, cellPadding: 5 },
    });

    // ✅ Footer
    doc.setFontSize(10);
    doc.text("Thank you for your business!", 14, doc.internal.pageSize.height - 20);
    doc.text("This is a computer-generated invoice and does not require a signature.", 14, doc.internal.pageSize.height - 15);

    // ✅ Save PDF
    doc.save(`invoice_${transaction.transactionId}.pdf`);
  };

  const handleExportPDF = () => {
    if (filteredTransactions.length === 0) {
      alert("No transactions to export.");
      return;
    }

    const doc = new jsPDF();


    // ✅ Set navy blue background (HEX: #001f3f)
    doc.setFillColor(0, 31, 63); // RGB for Navy Blue
    doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, "F"); // "F" = fill

    // ✅ Set text color to white for visibility
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
    doc.text(" Dr. M.H Marigowda Road", 14, 57);
    doc.text("Bangalore, Karnataka 560029", 14, 64);
    doc.text("Phone: 9740659298", 14, 71);
    doc.text("Email: RoyalMint@gmail.com", 14, 78);

    // ✅ Define Table Columns
    const columns = [
      "Transaction ID",
      "Sender",
      "Receiver",
      "Amount (USD)",
      "Date",
      "Type"
    ];

    // ✅ Map Transactions to Table Format
    const rows = filteredTransactions.map(tx => ([
      tx.transactionId,
      tx.sender,
      tx.receiver,
      `$${tx.transactionAmount.toFixed(2)}`,
      new Date(tx.transactionDate).toLocaleString(),
      tx.transactionType
    ]));

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




  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">My Transactions</h2>
        <div className="flex gap-4">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            onClick={handleExportPDF}
          >
            Export PDF
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              {["Transaction ID", "Sender ID", "Receiver ID", "Royalty ID", "Transaction Date", "Amount", "Manager ID", "Transaction Type", "Download"].map((label, index) => (
                <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {transactions.map((transaction) => (
              <motion.tr key={transaction.transactionId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{transaction.transactionId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{transaction.sender}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{transaction.receiver}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{transaction.royaltyId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(transaction.transactionDate).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">₹{transaction.transactionAmount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{transaction.managerId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{transaction.transactionType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                    onClick={() => handleDownloadPDF(transaction)}
                  >
                    <Download size={16} /> Download
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ArtistsTransTable;
