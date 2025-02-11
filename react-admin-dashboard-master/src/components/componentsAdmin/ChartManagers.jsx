import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import ApiService from "../../service/ApiService";

const ChartManagers = () => {
    const [selectedTimeRange, setSelectedTimeRange] = useState("2024");
    const [revenueData, setRevenueData] = useState([]);
    const [managerKeys, setManagerKeys] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/insights/top5-managers-monthly?year=${selectedTimeRange}`,{
                    headers: ApiService.getHeader(),
                });
                const rawData = await response.json();

                const transformedData = rawData.map(entry => {
                    const newEntry = { month: entry.month };
                    const managers = new Set();

                    for (let i = 1; i <= 5; i++) { // Assuming top 5 managers at max
                        const nameKey = `manager${i}_name`;
                        const revenueKey = `manager${i}`;
                        
                        if (entry[nameKey] && entry[revenueKey] !== undefined) {
                            newEntry[entry[nameKey]] = entry[revenueKey];
                            managers.add(entry[nameKey]);
                        }
                    }

                    return { data: newEntry, managers: Array.from(managers) };
                });

                setRevenueData(transformedData.map(item => item.data));
                
                const uniqueManagers = new Set(transformedData.flatMap(item => item.managers));
                setManagerKeys(Array.from(uniqueManagers));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [selectedTimeRange]);

    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-xl font-semibold text-gray-100'>Top 5 Managers Based on Revenue</h2>
                <select
                    className='bg-gray-700 text-white rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    value={selectedTimeRange}
                    onChange={(e) => setSelectedTimeRange(e.target.value)}
                >
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                </select>
            </div>

            <div style={{ width: "100%", height: 400 }}>
                <ResponsiveContainer>
                    <AreaChart data={revenueData}>
                        <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                        <XAxis dataKey='month' stroke='#9CA3AF' />
                        <YAxis stroke='#9CA3AF' />
                        <Tooltip
                            contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)", borderColor: "#4B5563" }}
                            itemStyle={{ color: "#E5E7EB" }}
                        />
                        <Legend />

                        {managerKeys.map((manager, index) => (
                            <Area
                                key={manager}
                                type='monotone'
                                dataKey={manager}
                                stroke={`hsl(${index * 60}, 70%, 50%)`}
                                fill={`hsl(${index * 60}, 70%, 50%)`}
                                fillOpacity={0.3}
                            />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default ChartManagers;
