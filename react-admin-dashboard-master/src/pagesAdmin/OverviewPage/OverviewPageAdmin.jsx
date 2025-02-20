import { useState, useEffect } from 'react';
import { BarChart2, ShoppingBag, Users } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../../components/common/Header/Header";
import StatCard from "../../components/common/StatCard/StatCard";
import ArtistsTable from '../../components/componentsAdmin/ArtistsTable/ArtistsTable';
import ManagersTable from '../../components/componentsAdmin/ManagersTable/ManagersTable';
import ChartArtists from '../../components/componentsAdmin/ChartArtists/ChartArtists';
import ChartManagers from '../../components/componentsAdmin/ChartManagers/ChartManagers';
import ApiService from '../../service/ApiService';

const OverviewPage = () => {
  const [stats, setStats] = useState({
    activeArtists: 0,
    activeManagers: 0,
    totalRoyalties: 0,
    totalStreams: 0
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [activeArtists, activeManagers, totalRoyalties, totalStreams] = await Promise.all([
          ApiService.getActiveArtistsCount(),
          ApiService.getActiveManagersCount(),
          ApiService.getTotalRoyaltiesPaid(),
          ApiService.getTotalStreamsCount(),
        ]);

        setStats({ activeArtists, activeManagers, totalRoyalties, totalStreams });
        setError(null);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setError("Failed to load statistics. Please try again later.");
      }
    };
    fetchStats();
  }, []);

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(num);
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
            name="Total Active Artists" 
            icon={Users} 
            value={formatNumber(stats.activeArtists)} 
            color="#6366F1" 
          />
          <StatCard 
            name="Total Active Managers" 
            icon={Users} 
            value={formatNumber(stats.activeManagers)} 
            color="#8B5CF6" 
          />
          <StatCard 
            name="Total Royalties" 
            icon={ShoppingBag} 
            value={formatCurrency(stats.totalRoyalties)} 
            color="#EC4899" 
          />
          <StatCard 
            name="Total Streams" 
            icon={BarChart2} 
            value={formatNumber(stats.totalStreams)} 
            color="#10B981" 
          />
        </motion.div>

        {/* CHARTS */}
        <ChartArtists />
        <ArtistsTable />
        <br/>
        <br/>
        <ChartManagers />
        <ManagersTable />
      </main>
    </div>
  );
};

export default OverviewPage;