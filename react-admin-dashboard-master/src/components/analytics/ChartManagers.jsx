import { useState } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const revenueData = [
	{ month: "Jan", manager1: 4000, manager2: 3500, manager3: 3000, manager4: 4500, manager5: 3800 },
	{ month: "Feb", manager1: 3200, manager2: 3700, manager3: 2800, manager4: 4200, manager5: 3100 },
	{ month: "Mar", manager1: 5100, manager2: 4600, manager3: 3500, manager4: 4800, manager5: 4300 },
	{ month: "Apr", manager1: 4600, manager2: 4000, manager3: 3300, manager4: 4700, manager5: 3900 },
	{ month: "May", manager1: 6200, manager2: 5600, manager3: 4100, manager4: 5200, manager5: 5000 },
	{ month: "Jun", manager1: 5700, manager2: 6000, manager3: 4500, manager4: 5900, manager5: 5300 },
	{ month: "Jul", manager1: 7200, manager2: 6700, manager3: 4900, manager4: 6500, manager5: 5800 },
	{ month: "Aug", manager1: 6900, manager2: 7100, manager3: 5000, manager4: 6700, manager5: 6000 },
	{ month: "Sep", manager1: 7300, manager2: 7500, manager3: 5300, manager4: 6900, manager5: 6200 },
	{ month: "Oct", manager1: 7800, manager2: 7700, manager3: 5500, manager4: 7100, manager5: 6400 },
	{ month: "Nov", manager1: 8200, manager2: 8000, manager3: 5800, manager4: 7400, manager5: 6700 },
	{ month: "Dec", manager1: 8500, manager2: 8300, manager3: 6000, manager4: 7700, manager5: 6900 },
];

const ChartManagers = () => {
	const [selectedTimeRange, setSelectedTimeRange] = useState("This Month");

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-gray-100'>Top 5 Managers Based on Royalties</h2>
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
						<Area type='monotone' dataKey='manager1' stroke='#FF5733' fill='#FF5733' fillOpacity={0.3} />
						<Area type='monotone' dataKey='manager2' stroke='#33FF57' fill='#33FF57' fillOpacity={0.3} />
						<Area type='monotone' dataKey='manager3' stroke='#3357FF' fill='#3357FF' fillOpacity={0.3} />
						<Area type='monotone' dataKey='manager4' stroke='#F1C40F' fill='#F1C40F' fillOpacity={0.3} />
						<Area type='monotone' dataKey='manager5' stroke='#9B59B6' fill='#9B59B6' fillOpacity={0.3} />
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
export default ChartManagers;
