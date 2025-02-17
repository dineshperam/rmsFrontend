import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Download } from "lucide-react";
import axios from "axios";
import ApiService from "../../service/ApiService";

const ManagerArtists = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [artists, setArtists] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const managerId = ApiService.getManagerId();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/user/getArtistUnderManager/${managerId}`,
          {
            headers: ApiService.getHeader(),
          }
        );
        setArtists(response.data);
        setFilteredArtists(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch artists");
        setLoading(false);
      }
    };
    fetchData();
  }, [managerId]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredArtists(
      artists.filter(
        (artist) =>
          artist.firstName.toLowerCase().includes(term) ||
          artist.lastName.toLowerCase().includes(term) ||
          artist.email.toLowerCase().includes(term)
      )
    );
  };

  const exportPartnershipPDF = async (artistId) => {
    try {
      const response = await axios.get(
        `${ApiService.BASE_URL}/partnerships/export-pdf-partner/${artistId}`,
        {
          headers: ApiService.getHeader(),
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `partnership_contract_${artistId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting contract PDF:", error);
    }
  };

  if (loading) return <div className="text-gray-300">Loading artists...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <>
      <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-100">Artists Under Me</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search artists..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">First Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Last Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Mobile No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Contract</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredArtists.map((artist) => (
                <motion.tr key={artist.userid} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                  <td className="px-6 py-4 text-sm text-gray-300">{artist.userid}</td>
                  <td className="px-6 py-4 text-sm text-gray-100">{artist.firstName}</td>
                  <td className="px-6 py-4 text-sm text-gray-100">{artist.lastName}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{artist.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{artist.address}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{artist.mobileNo}</td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => exportPartnershipPDF(artist.userid)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                    >
                      <Download size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </>
  );
};

export default ManagerArtists;
