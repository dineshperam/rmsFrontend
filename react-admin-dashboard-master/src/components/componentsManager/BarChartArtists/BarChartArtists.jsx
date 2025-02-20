import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import ApiService from "../../../service/ApiService";

const BarChartArtists = () => {
    const [chartData, setChartData] = useState([]);
    const manId = ApiService.getManagerId(); // Get manager ID

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await ApiService.fetchArtistsWithStreams(manId);
                setChartData(data);
            } catch (error) {
                console.error("Error fetching chart data:", error);
            }
        };
    
        fetchData();
    }, [manId]);
    

    return (
        <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Total Streams Per Artist</h2>
            <div style={{ width: "100%", height: 400 }}>
                <ResponsiveContainer>
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                            dataKey="artist" 
                            stroke="#9CA3AF" 
                            angle={-30} 
                            textAnchor="end" 
                            interval={0} 
                            tick={{ fontSize: 12 }} // Set default tick font size
                        />
                       <YAxis
                            stroke='#9CA3AF'
                            tickFormatter={(value) => {
                                if (value >= 1_000_000) {
                                return `${(value / 1_000_000).toFixed(1)}M`;
                                } else if (value >= 1_000) {
                                return `${(value / 1_000).toFixed(1)}K`;
                                }
                                return value;
                            }}
                            />
                        <Tooltip contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)", borderColor: "#4B5563" }} itemStyle={{ color: "#E5E7EB" }} />
                        <Legend />
                        <Bar dataKey="streams" fill="#82ca9d" barSize={50} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default BarChartArtists;
