import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ApiService from "../../../service/ApiService";
 
const ManagerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [artistDetails, setArtistDetails] = useState({}); // Store artist names separately
  const managerId = ApiService.getUserId();
 
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await ApiService.getManagerRequests(managerId);
        setRequests(response);
 
        // Fetch artist details for each request
        const artistData = {};
        await Promise.all(
          response.map(async (req) => {
            const artistInfo = await ApiService.getManagerInfo(req.artistId);
            if (artistInfo) {
              artistData[req.artistId] = `${artistInfo.firstName} ${artistInfo.lastName}`;
              artistData[req.email] = `${artistInfo.email}`;
            }
          })
        );
 
        setArtistDetails(artistData);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
 
    fetchRequests();
  }, [managerId]);
 
  const respondToRequest = async (id, status) => {
    try {
      await ApiService.respondToPartnershipRequest(id, status);
      setRequests(requests.filter((req) => req.partnershipId !== id));
    } catch (error) {
      console.error("Error responding to request:", error.response || error);
      alert(error.response?.data?.message || JSON.stringify(error.response?.data) || "Failed to respond.");
    }
  };
 
  return (
    <motion.div className="bg-gray-800 bg-opacity-50 p-6 border border-gray-700 min-h-screen">
      <h2 className="text-xl font-semibold text-gray-100 mb-6 text-center">Pending Requests</h2>
 
      {requests.length === 0 ? (
        <p className="text-gray-400 text-center">No pending requests.</p>
      ) : (
        requests.map((req, index) => (
          <div key={index} className="bg-gray-700 p-4 rounded-lg shadow-md text-center mb-4">
            <p className="text-lg text-white">Artist: {artistDetails[req.artistId] || "Loading..."}</p>
            <p className="text-lg text-white">Email: {artistDetails[req.email] || "Loading..."}</p>
            <p className="text-gray-300">Percentage: {req.percentage}%</p>
            <p className="text-gray-300">Duration: {req.durationMonths} months</p>
            <p className="text-gray-300">Comments: {req.comments}</p>
            <button onClick={() => respondToRequest(req.partnershipId, "Accepted")} className="bg-green-600 text-white px-4 py-2 rounded-lg mx-2">
              Accept
            </button>
            <button onClick={() => respondToRequest(req.partnershipId, "Rejected")} className="bg-red-600 text-white px-4 py-2 rounded-lg mx-2">
              Reject
            </button>
          </div>
        ))
      )}
    </motion.div>
  );
};
 
export default ManagerRequests;