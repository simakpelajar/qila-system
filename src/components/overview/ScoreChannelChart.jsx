import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
import { useEffect, useState } from "react";
import Api from "../../api";

const COLORS = ["#6366F1", "#EC4899", "#8B5CF6", "#10B981", "#F59E0B"];

const ScoreChannelChart = () => {
	const [scoreData, setScoreData] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await Api.get("/average-scores-per-category");
				console.log("Response data:", response.data);
				const data = response.data.map(item => ({
					name: item.category_name,
					"Avarage Score": item.average_score
				}));
				setScoreData(data);
			} catch (error) {
				console.error("Error fetching score data:", error);
			}
		};

		fetchData();
	}, []);

	return (
		<motion.div
			className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2 border border-gray-700"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}
		>
			<h2 className="text-lg font-medium mb-4 text-gray-100">Average Score Per Category</h2>

			<div className="h-80">
				<ResponsiveContainer width="100%" height="100%">
					<BarChart data={scoreData}>
						<CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
						<XAxis dataKey="name" stroke="#9CA3AF" />
						<YAxis stroke="#9CA3AF" />
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Legend />
						<Bar dataKey="Avarage Score" fill="#8884d8">
							{scoreData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default ScoreChannelChart;
