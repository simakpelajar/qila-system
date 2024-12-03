import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { motion } from "framer-motion";
import Api from "../../api";

const ScoreOverviewChart = () => {
	const [averageTestScore, setAverageTestScore] = useState([]);
	const [selectedTimeRange, setSelectedTimeRange] = useState("This Month");

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await Api.get("/score-average-month");
				const data = response.data.map(item => ({
					name: item.month,
					"Average Score": item.average_score,
				}));
				setAverageTestScore(data);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, []);

	return (
		<motion.div
			className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-xl font-semibold text-gray-100">Average Test Score per Month</h2>
				<select
					className="bg-gray-700 text-white rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
					value={selectedTimeRange}
					onChange={(e) => setSelectedTimeRange(e.target.value)}
				>
					<option>This Week</option>
					<option>This Month</option>
					<option>This Quarter</option>
					<option>This Year</option>
				</select>
			</div>

			<div style={{ width: "100%", height: 400 }}>
				<ResponsiveContainer>
					<AreaChart data={averageTestScore}>
						<CartesianGrid strokeDasharray="3 3" stroke="#374151" />
						<XAxis dataKey="name" stroke="#9CA3AF" />
						<YAxis stroke="#9CA3AF" />
						<Tooltip
							contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)", borderColor: "#4B5563" }}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Legend />
						<Area
							type="monotone"
							dataKey="Average Score"
							stroke="#6366F1"
							fill="#6366F1"
							fillOpacity={0.3}
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default ScoreOverviewChart;
