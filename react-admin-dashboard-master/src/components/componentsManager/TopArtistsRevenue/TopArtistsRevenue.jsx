import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import ApiService from "../../../service/ApiService";

const TopArtistsRevenue = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [topArtists, setTopArtists] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const managerId = ApiService.getManagerId(); // Fetch manager ID

  useEffect(() => {
    const fetchTopArtists = async () => {
      if (!managerId) {
        setError("Manager ID not found!");
        setLoading(false);
        return;
      }
      try {
        const data = await ApiService.getTopArtistsByRevenue(managerId);
        setTopArtists(data);
        setFilteredArtists(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch top artists");
        setLoading(false);
      }
    };
    fetchTopArtists();
  }, [managerId]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredArtists(
      topArtists.filter(
        (artist) =>
          artist[0]?.firstName.toLowerCase().includes(term) ||
          artist[0]?.lastName.toLowerCase().includes(term)
      )
    );
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Top Artists by Revenue</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search Artist..."
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Artist Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Revenue
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Email
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredArtists.length > 0 ? (
              filteredArtists.map((artist, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {artist[1]} {artist[4]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {typeof artist[15] === 'number' ? `₹${artist[15].toFixed(2)}` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {artist[2]}
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-400">
                  No top artists found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default TopArtistsRevenue;
