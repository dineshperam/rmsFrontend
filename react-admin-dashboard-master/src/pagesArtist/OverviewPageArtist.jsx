import { ChartNoAxesCombined, CircleDollarSign, GalleryVerticalEnd,} from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { useEffect, useState } from "react";
import ApiService from "../service/ApiService";

const OverviewPageArtist = () => {
  
   const [stats, setStats] = useState({
      mySongss: 0,
      myRevenues: 0,
      myStreamss: 0,
    });
    const [error, setError] = useState(null);
  
    // You might want to store this in an environment variable
    const BASE_URL = 'http://localhost:8080/insights'; // Adjust this to match your backend URL
    const userId = ApiService.getUserId()
    useEffect(() => {
        const fetchStats = async () => {
          try {
            const [mySongs, myRevenue, myStreams] = await Promise.all([
              fetch(`${BASE_URL}/mysongs/${userId}`,{headers: ApiService.getHeader(),}),
              fetch(`${BASE_URL}/totalRevenuebyId/${userId}`,{headers: ApiService.getHeader(),}),
              fetch(`${BASE_URL}/totalStreamsById/${userId}`,{headers: ApiService.getHeader(),}),{
                headers: ApiService.getHeader(),
              }
            ]);
    
            // Check if responses are ok
            if (!mySongs.ok || !myRevenue.ok || !myStreams.ok) {
              throw new Error('One or more requests failed');
            }
    
            const mySongss = await mySongs.json();
            const myRevenues = await myRevenue.json();
            const myStreamss = await myStreams.json();
    
            setStats({
              mySongss,
              myRevenues,
              myStreamss,
            });
            setError(null);
          } catch (error) {
            console.error('Error fetching stats:', error);
            setError('Failed to load statistics. Please try again later.');
          }
        };
    
        fetchStats();
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
            value={formatNumber(stats.mySongss)}
            color="#6366F1" 
          />
          <StatCard 
            name="My Revenue" 
            icon={CircleDollarSign} 
            value={formatNumber(stats.myRevenues)} 
            color="#8B5CF6" 
          />
          <StatCard 
            name="Total Streams" 
            icon={ChartNoAxesCombined} 
            value={formatNumber(stats.myStreamss)} 
            color="#EC4899" 
          />
         
        </motion.div>

        {/* CHARTS */}
        
      </main>
    </div>
  );
};

export default OverviewPageArtist;