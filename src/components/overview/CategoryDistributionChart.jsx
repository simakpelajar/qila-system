import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Api from "../../api";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE", "#00C49F"];

const CategoryDistributionChart = () => {
	const [categoryData, setCategoryData] = useState([]);

	useEffect(() => {
		const fetchCategoryData = async () => {
			try {
				const response = await Api.get("/category-distribution");
				setCategoryData(response.data);
			} catch (error) {
				console.error("Error fetching category data:", error);
			}
		};

		fetchCategoryData();
	}, []);

	return (
		<motion.div
			className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
		>
			<h2 className="text-xl font-semibold text-gray-100 mb-4">Category Exam</h2>
			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<PieChart>
						<Pie
							data={categoryData}
							cx="50%"
							cy="50%"
							outerRadius={80}
							fill="#8884d8"
							dataKey="value"
							label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
						>
							{categoryData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default CategoryDistributionChart;
