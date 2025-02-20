import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import ApiService from "../../../service/ApiService";
import { paginate, getPageNumbers } from "../../../utils/Paginate";
import { sortTransactions } from "../../../utils/SortFilter";

const AllSongs = () => {
  const [searchTitle, setSearchTitle] = useState("");
  const [searchArtist, setSearchArtist] = useState("");
  const [releaseFilter, setReleaseFilter] = useState("");
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("releaseDate");
  const [sortOrder, setSortOrder] = useState("asc");

  const pageSize = 5;

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const data = await ApiService.fetchSongs();
        setSongs(data);
        setFilteredSongs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, []);

  useEffect(() => {
    let filtered = songs;

    if (searchTitle) {
      filtered = filtered.filter((song) =>
        song.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
    }

    if (searchArtist) {
      filtered = filtered.filter((song) =>
        song.artistId.toString().includes(searchArtist)
      );
    }

    if (releaseFilter) {
      filtered = filtered.filter(
        (song) => new Date(song.releaseDate).getFullYear().toString() === releaseFilter
      );
    }

    filtered = sortTransactions(filtered, sortField, sortOrder);
    setFilteredSongs(filtered);
    setCurrentPage(1);
  }, [searchTitle, searchArtist, releaseFilter, sortField, sortOrder, songs]);

  const handleSort = (field) => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setSortField(field);
  };

  const paginatedSongs = paginate(filteredSongs, currentPage, pageSize);
  const { startPage, endPage, totalPages } = getPageNumbers(
    filteredSongs.length,
    currentPage,
    pageSize
  );

  if (loading) return <div className="text-gray-300">Loading data...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">All Songs</h2>
      </div>

      {/* Search & Filter */}
      <div className="flex space-x-4 mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Title..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search Artist ID..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchArtist}
            onChange={(e) => setSearchArtist(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>

        <div>
          <select
            className="bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={releaseFilter}
            onChange={(e) => setReleaseFilter(e.target.value)}
          >
            <option value="">All Years</option>
            {[...new Set(songs.map((s) => new Date(s.releaseDate).getFullYear()))]
              .sort((a, b) => b - a)
              .map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("songId")}
              >
                Song ID {sortField === "songId" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("artistId")}
              >
                Artist ID {sortField === "artistId" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("title")}
              >
                Title {sortField === "title" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("releaseDate")}
              >
                Release Date {sortField === "releaseDate" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Collaborators
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {paginatedSongs.map((song) => (
              <motion.tr key={song.songId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <td className="px-6 py-4 text-sm text-gray-300">{song.songId}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{song.artistId}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{song.title}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{new Date(song.releaseDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{song.collaborators || "N/A"}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center space-x-2 mt-4">
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded-md ${
              currentPage === page ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default AllSongs;
