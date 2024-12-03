import React, { useState, useEffect } from "react";
import { UserPlus, UsersIcon } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import UsersTable from "../components/users/UsersTable";
import Api from "../api"; // Import instance Axios

const UsersPage = () => {
	const [userStats, setUserStats] = useState({
		totalUsers: 0,
		newUsersToday: 0,
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				// Fetch total users
				const totalUsersRes = await Api.get("/users/count");
				const totalUsers = totalUsersRes.data.totalUsers;

				// Fetch new users today
				const newUsersRes = await Api.get("/users/new-today");
				const newUsersToday = newUsersRes.data.newUsersToday;

				// Update state
				setUserStats({
					totalUsers: totalUsers || 0,
					newUsersToday: newUsersToday || 0,
				});
			} catch (error) {
				console.error("Error fetching user stats:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchStats();
	}, []);

	return (
		<div className="flex-1 overflow-auto relative z-10">
			<Header title="Users Dashboard" />

			<main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
				{/* STATS */}
				<motion.div
					className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard
						name="Total Users"
						icon={UsersIcon}
						value={userStats.totalUsers.toLocaleString()}
						color="#6366F1"
					/>
					<StatCard
						name="New Users Today"
						icon={UserPlus}
						value={userStats.newUsersToday}
						color="#10B981"
					/>
				</motion.div>

				<UsersTable />
			</main>
		</div>
	);
};

export default UsersPage;
