import { useEffect, useState } from "react";
import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import ScoreOverviewChart from "../components/overview/ScoreOverviewChart";
import ScoreChannelChart from "../components/overview/ScoreChannelChart";
import Api from "../api";

const OverviewPage = () => {

	const [stats, setStats] = useState({
		totalCourse: 0,
		totalUsers: 0,
		totalCategory: 0,
		averageScore: 0,
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await Api.get("/stats");

				if (response.data) {
					setStats({
						totalCourse: response.data.totalCourse,
						totalUsers: response.data.totalUsers,
						totalCategory: response.data.totalCategory,
						averageScore: response.data.averageScore,
					});
				}
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, []);

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
						name="Total Course"
						icon={Zap}
						value={stats.totalCourse}
						color="#6366F1"
					/>
					<StatCard
						name="Total Users"
						icon={Users}
						value={stats.totalUsers}
						color="#8B5CF6"
					/>
					<StatCard
						name="Total Category"
						icon={ShoppingBag}
						value={stats.totalCategory}
						color="#EC4899"
					/>
					<StatCard
						name="Average All test score"
						icon={BarChart2}
						value={stats.averageScore}
						color="#10B981"
					/>
				</motion.div>

				{/* CHARTS */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<ScoreOverviewChart /> {/* Avarage Test Score Per User */}
					<CategoryDistributionChart /> {/* Category Exam */}
					<ScoreChannelChart /> {/* Avarage Score Per Categegory */}
				</div>
			</main>
		</div>
	);
};
export default OverviewPage;
