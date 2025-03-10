import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import ApiService from "../../../service/ApiService";
import { getPageNumbers, paginate } from "../../../utils/Paginate";

const AllSongsArtists = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const getSongs = async () => {
      try {
        const data = await ApiService.fetchSongsArtists();
        setSongs(data);
        setFilteredSongs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getSongs();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredSongs(
      songs.filter((song) => song.title.toLowerCase().includes(term))
    );
    setCurrentPage(1);
  };

  const handleSort = () => {
    let sortedSongs;
    if (sortOrder === "asc") {
      sortedSongs = [...filteredSongs].sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
      setSortOrder("desc");
    } else {
      sortedSongs = [...filteredSongs].sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
      setSortOrder("asc");
    }
    setFilteredSongs(sortedSongs);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(filteredSongs.length / itemsPerPage);
  const currentItems = paginate(filteredSongs, currentPage, itemsPerPage);
  const { startPage, endPage } = getPageNumbers(filteredSongs.length, currentPage, itemsPerPage);

  if (loading) return <div className="text-gray-300">Loading data...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <motion.div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">All Songs</h2>
        <div className="relative">
          <input type="text" placeholder="Search Title..." className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={handleSearch} />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Song ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Artist ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer flex items-center" onClick={handleSort}>
                Release Date {sortOrder === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Collaborators</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {currentItems.map((song) => (
              <motion.tr key={song.songId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{song.songId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{song.artistId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{song.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(song.releaseDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{song.collaborators || "N/A"}</td>
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
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((pageNum) => (
          <button 
            key={pageNum} 
            className={`mx-1 px-3 py-1 rounded-lg ${currentPage === pageNum ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"}`} 
            onClick={() => handlePageChange(pageNum)}
          >
            {pageNum}
          </button>
        ))}
        <button className="mx-1 px-3 py-1 rounded-lg bg-gray-700 text-gray-300" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          <ChevronRight />
        </button>
      </div>
    </motion.div>
  );
};

export default AllSongsArtists;