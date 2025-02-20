import { useEffect, useState } from "react";
import { UserCheck, UsersIcon } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../../components/common/Header/Header";
import StatCard from "../../components/common/StatCard/StatCard";
import AdminAllUsersTable from "../../components/componentsAdmin/AdminAllUsersTable/AdminAllUsersTable";
import ApiService from "../../service/ApiService";

const UsersPage = () => {
  const [userStats, setUserStats] = useState({ totalUsers: 0, activeUsers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const stats = await ApiService.fetchUserStats();
            setUserStats(stats);
        } catch (error) {
            console.error("Error fetching user stats:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
}, []);

  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <Header title='Users' />
      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        {/* STATS */}
        <motion.div
          className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name='Total Users'
            icon={UsersIcon}
            value={loading ? "Loading..." : userStats.totalUsers.toLocaleString()}
            color='#6366F1'
          />
          <StatCard
            name='Active Users'
            icon={UserCheck}
            value={loading ? "Loading..." : userStats.activeUsers.toLocaleString()}
            color='#F59E0B'
          />
        </motion.div>

        <AdminAllUsersTable />
      </main>
    </div>
  );
};

export default UsersPage;
