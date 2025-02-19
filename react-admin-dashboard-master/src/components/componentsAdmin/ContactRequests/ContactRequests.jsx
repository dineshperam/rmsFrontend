import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import axios from "axios";
import ApiService from "../../../service/ApiService";

const ContactRequests = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loadingAction, setLoadingAction] = useState({ id: null, type: null });
  
  useEffect(() => {
    const fetchContactRequests = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/contact/showContacts");
        const pendingRequests = response.data.filter(request => request.status === "Pending");
        setRequests(pendingRequests);
        setFilteredRequests(pendingRequests);
      } catch (error) {
        console.error("Error fetching contact requests:", error);
      }
    };
    fetchContactRequests();
  }, []);

  const handleAction = async (contactId, action) => {
    setLoadingAction({ id: contactId, type: action });
    try {
      const adminId = ApiService.getUserId();
      const url = action === "accept" 
        ? `http://localhost:8080/api/contact/accept/${contactId}/${adminId}`
        : `http://localhost:8080/api/contact/reject/${contactId}`;
      
      const response = await axios.put(url);
  
      if (response.status === 200) {
        if (response.data === "Email already exists. Cannot create a new user.") {
          alert(response.data); // Show error if email exists
        } else {
          alert(`Request ${action}ed.`);
          setRequests(requests.filter(request => request.id !== contactId));
          setFilteredRequests(filteredRequests.filter(request => request.id !== contactId));
        }
      }
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      alert(`Failed to ${action} request.`);
    }
    setLoadingAction({ id: null, type: null });
  };
  

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredRequests(
      requests.filter(request =>
        request.firstname.toLowerCase().includes(term) ||
        request.lastname.toLowerCase().includes(term) ||
        request.email.toLowerCase().includes(term)
      )
    );
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Contact Requests</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Mobile</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-300">No pending contact requests.</td>
              </tr>
            ) : (
              filteredRequests.map((request) => (
                <motion.tr key={request.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.firstname} {request.lastname}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.mobileno}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                    <button 
                      onClick={() => handleAction(request.id, "accept")} 
                      className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center"
                      disabled={loadingAction.id === request.id && loadingAction.type === "accept"}
                    >
                      {loadingAction.id === request.id && loadingAction.type === "accept" ? <Loader2 className="animate-spin" size={18} /> : "Accept"}
                    </button>
                    <button 
                      onClick={() => handleAction(request.id, "reject")} 
                      className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center"
                      disabled={loadingAction.id === request.id && loadingAction.type === "reject"}
                    >
                      {loadingAction.id === request.id && loadingAction.type === "reject" ? <Loader2 className="animate-spin" size={18} /> : "Reject"}
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ContactRequests;
