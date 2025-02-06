import { useState } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const revenueData = [
	{ month: "Jan", artist1: 4000, artist2: 3500, artist3: 3000, artist4: 4500, artist5: 3800 },
	{ month: "Feb", artist1: 3200, artist2: 3700, artist3: 2800, artist4: 4200, artist5: 3100 },
	{ month: "Mar", artist1: 5100, artist2: 4600, artist3: 3500, artist4: 4800, artist5: 4300 },
	{ month: "Apr", artist1: 4600, artist2: 4000, artist3: 3300, artist4: 4700, artist5: 3900 },
	{ month: "May", artist1: 6200, artist2: 5600, artist3: 4100, artist4: 5200, artist5: 5000 },
	{ month: "Jun", artist1: 5700, artist2: 6000, artist3: 4500, artist4: 5900, artist5: 5300 },
	{ month: "Jul", artist1: 7200, artist2: 6700, artist3: 4900, artist4: 6500, artist5: 5800 },
];

const RevenueChart = () => {
	const [selectedTimeRange, setSelectedTimeRange] = useState("This Month");

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-gray-100'>Top 5 Artists Based on Streams</h2>
				<select
					className='bg-gray-700 text-white rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500'
					value={selectedTimeRange}
					onChange={(e) => setSelectedTimeRange(e.target.value)}
				>
					<option>2024</option>
					<option>2023</option>
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
						<Area type='monotone' dataKey='artist1' stroke='#FF5733' fill='#FF5733' fillOpacity={0.3} />
						<Area type='monotone' dataKey='artist2' stroke='#33FF57' fill='#33FF57' fillOpacity={0.3} />
						<Area type='monotone' dataKey='artist3' stroke='#3357FF' fill='#3357FF' fillOpacity={0.3} />
						<Area type='monotone' dataKey='artist4' stroke='#F1C40F' fill='#F1C40F' fillOpacity={0.3} />
						<Area type='monotone' dataKey='artist5' stroke='#9B59B6' fill='#9B59B6' fillOpacity={0.3} />
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
export default RevenueChart;
