import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ApiService from "../../service/ApiService";

const ArtistRequests = () => {
  const [managers, setManagers] = useState([]);
  const [existingManager, setExistingManager] = useState(null);
  const [selectedManager, setSelectedManager] = useState(null);
  const [requestSent, setRequestSent] = useState(false);
  
  // ✅ Ensure default values
  const [formData, setFormData] = useState({
    percentage: 10,  // Default percentage value
    duration: 3,     // Default duration in months
    comments: "",
  });

  const artistId = ApiService.getUserId();
  const adminId = 6;

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await ApiService.getManagers();
        setManagers(response);
      } catch (error) {
        console.error("Error fetching managers:", error);
      }
    };

    const fetchArtistManager = async () => {
      try {
        const managerId = ApiService.getManagerId();
        if (managerId && managerId !== adminId) {
          setExistingManager(managerId);
        }
      } catch (error) {
        console.error("Error fetching artist's manager:", error);
      }
    };

    fetchManagers();
    fetchArtistManager();
  }, []);

  const handlePartnerClick = (managerId) => {
    setSelectedManager(managerId);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitRequest = async () => {
    if (!selectedManager) {
        alert("Please select a manager before submitting a request.");
        return;
    }

    const requestPayload = {
        artistId: artistId ? Number(artistId) : null,
        managerId: selectedManager ? Number(selectedManager) : null,
        percentage: formData.percentage ? Number(formData.percentage) : null,
        durationMonths: formData.duration ? Number(formData.duration) : null,
        comments: formData.comments ? formData.comments.trim() : "",
    };

    console.log("Submitting Request Payload:", requestPayload); // Debugging log

    try {
        await ApiService.sendPartnershipRequest(
            requestPayload.artistId,
            requestPayload.managerId,
            requestPayload.percentage,
            requestPayload.durationMonths,
            requestPayload.comments
        );
        setRequestSent(true);
    } catch (error) {
        alert(error.response?.data || "Failed to send request. Please try again.");
    }
};

  

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-100 mb-6 text-center">Managers List</h2>

        {existingManager ? (
          <p className="text-red-400 text-center">
            You already have a contract with a manager and cannot send a new request.
          </p>
        ) : requestSent ? (
          <p className="text-green-400 text-center">
            Your request is under processing. We will get back to you.
          </p>
        ) : selectedManager ? (
          <div className="bg-gray-700 p-4 rounded-lg shadow-md">
            <h3 className="text-white text-lg font-semibold mb-4">Submit Partnership Request</h3>
            <label className="text-gray-300 block mb-2">Quote Share Percentage</label>
            <input
              type="number"
              name="percentage"
              value={formData.percentage}
              onChange={handleInputChange}
              className="w-full p-2 mb-3 rounded bg-gray-600 text-white"
              min="1"
              max="100"
            />
            <label className="text-gray-300 block mb-2">Duration (Months)</label>
            <select
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              className="w-full p-2 mb-3 rounded bg-gray-600 text-white"
            >
              <option value="3">3</option>
              <option value="6">6</option>
            </select>
            <label className="text-gray-300 block mb-2">Comments</label>
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleInputChange}
              className="w-full p-2 mb-3 rounded bg-gray-600 text-white"
            />
            <button onClick={submitRequest} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded">
              Submit Request
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {managers.map((manager, index) => (
              <motion.div key={index} className="bg-gray-700 p-4 rounded-lg shadow-md text-center">
                <p className="text-lg font-semibold text-white">{manager.username}</p>
                <button
                  onClick={() => handlePartnerClick(manager.userid)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 mt-3 rounded-lg"
                >
                  Partner
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ArtistRequests;
