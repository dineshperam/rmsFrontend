import { ChartNoAxesCombined, CircleDollarSign, GalleryVerticalEnd,} from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";

const OverviewPageArtist = () => {
 
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Overview" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
       
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
            value="6789"
            color="#6366F1" 
          />
          <StatCard 
            name="My Revenue" 
            icon={CircleDollarSign} 
            value="456789"
            color="#8B5CF6" 
          />
          <StatCard 
            name="Total Streams" 
            icon={ChartNoAxesCombined} 
            value="678"
            color="#EC4899" 
          />
         
        </motion.div>

        {/* CHARTS */}
        Charts
      </main>
    </div>
  );
};

export default OverviewPageArtist;