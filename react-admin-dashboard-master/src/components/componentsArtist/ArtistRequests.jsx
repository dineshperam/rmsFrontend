import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ApiService from "../../service/ApiService";

const ArtistRequests = () => {
  const [managers, setManagers] = useState([]);
  const [partnershipDetails, setPartnershipDetails] = useState(null);
  const [selectedManager, setSelectedManager] = useState(null);
  const [requestSent, setRequestSent] = useState(false);
  const [loading, setLoading] = useState(true);

  // Partnership Request Form Data
  const [formData, setFormData] = useState({
    percentage: 10,
    duration: 3,
    comments: "",
  });

  const artistId = ApiService.getUserId();
  // const adminId = 6;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // First, check if artist has an existing partnership
        const partnership = await ApiService.getArtistPartnership(artistId);
        if (partnership) {
          setPartnershipDetails(partnership);
        } else {
          // If no partnership exists, check for pending requests
          const pendingRequest = await ApiService.getPendingPartnershipRequest(artistId);
          if (pendingRequest) {
            setRequestSent(true);
          } else {
            // If no partnership and no pending request, fetch available managers
            const managersResponse = await ApiService.getManagers();
            setManagers(managersResponse);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [artistId]);

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

  const exportPDF = async () => {
    try {
      const pdfBlob = await ApiService.exportPartnershipPDF(artistId);
      const url = window.URL.createObjectURL(new Blob([pdfBlob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Partnership_${artistId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Failed to export PDF. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-100">
            {partnershipDetails ? "Partnership Details" : "Managers List"}
          </h2>
          {partnershipDetails && (
            <button
              onClick={exportPDF}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition"
            >
              Export as PDF
            </button>
          )}
        </div>

        {partnershipDetails ? (
          <div className="bg-gray-700 p-4 rounded-lg shadow-md">
            <h3 className="text-white text-lg font-semibold mb-4">Current Partnership Details</h3>
            <table className="w-full text-white border border-gray-600">
              <tbody>
                <tr>
                  <td className="border border-gray-600 px-4 py-2">Partnership ID</td>
                  <td className="border border-gray-600 px-4 py-2">{partnershipDetails.partnershipId}</td>
                </tr>
                <tr>
                  <td className="border border-gray-600 px-4 py-2">Manager ID</td>
                  <td className="border border-gray-600 px-4 py-2">{partnershipDetails.managerId}</td>
                </tr>
                <tr>
                  <td className="border border-gray-600 px-4 py-2">Status</td>
                  <td className="border border-gray-600 px-4 py-2">{partnershipDetails.status}</td>
                </tr>
                <tr>
                  <td className="border border-gray-600 px-4 py-2">Percentage</td>
                  <td className="border border-gray-600 px-4 py-2">{partnershipDetails.percentage}</td>
                </tr>
                <tr>
                  <td className="border border-gray-600 px-4 py-2">Comments</td>
                  <td className="border border-gray-600 px-4 py-2">{partnershipDetails.comments}</td>
                </tr>
                <tr>
                  <td className="border border-gray-600 px-4 py-2">Start Date</td>
                  <td className="border border-gray-600 px-4 py-2">{partnershipDetails.startDate}</td>
                </tr>
                <tr>
                  <td className="border border-gray-600 px-4 py-2">End Date</td>
                  <td className="border border-gray-600 px-4 py-2">{partnershipDetails.endDate}</td>
                </tr>
                <tr>
                  <td className="border border-gray-600 px-4 py-2">Duration</td>
                  <td className="border border-gray-600 px-4 py-2">{partnershipDetails.durationMonths}</td>
                </tr>
              </tbody>
            </table>
          </div>
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
            <button
              onClick={submitRequest}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
            >
              Submit Request
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {managers.map((manager, index) => (
              <motion.div
                key={index}
                className="bg-gray-700 p-4 rounded-lg shadow-md text-center"
              >
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