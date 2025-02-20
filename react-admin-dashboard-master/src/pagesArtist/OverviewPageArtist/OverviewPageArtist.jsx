import { ChartNoAxesCombined, CircleDollarSign, GalleryVerticalEnd, } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../../components/common/Header/Header";
import StatCard from "../../components/common/StatCard/StatCard";
import { useEffect, useState } from "react";
import ApiService from "../../service/ApiService";
import TopSongsChart from "../../components/componentsArtist/TopSongsChart/TopSongsChart";
import GenreDistributionChart from "../../components/componentsArtist/GenreDistributionChart/GenreDistributionChart";
import TopSongsTable from "../../components/componentsArtist/TopArtistSongs/TopSongsTable"

const OverviewPageArtist = () => {

  const [stats, setStats] = useState({
    mySongss: 0,
    myRevenues: 0,
    myStreamss: 0,
  });
  const [error, setError] = useState(null);

  // You might want to store this in an environment variable
  const userId = ApiService.getUserId()
  useEffect(() => {
    const fetchArtistStats = async () => {
      try {
        const fetchedStats = await ApiService.fetchStats(userId);
        setStats(fetchedStats); // No need to manually map keys if they match
        setError(null);
      } catch (error) {
        setError("Failed to load statistics. Please try again later.");
      }
    };

    fetchArtistStats();
  }, [userId]);


  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Overview" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 rounded">
            {error}
          </div>
        )}
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="My Songs"
            icon={GalleryVerticalEnd}
            value={formatNumber(stats.mySongs)} // Correct key
            color="#6366F1"
          />
          <StatCard
            name="My Revenue"
            icon={CircleDollarSign}
            value={formatNumber(stats.myRevenue)} // Correct key
            color="#8B5CF6"
          />
          <StatCard
            name="Total Streams"
            icon={ChartNoAxesCombined}
            value={formatNumber(stats.myStreams)} // Correct key
            color="#EC4899"
          />


        </motion.div>

        {/* CHARTS */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
          <TopSongsChart />
          <GenreDistributionChart />
        </div>
        <div className="w-full">
          <TopSongsTable />
        </div>
      </main>
    </div>
  );
};

export default OverviewPageArtist;