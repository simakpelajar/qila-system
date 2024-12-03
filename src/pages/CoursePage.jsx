import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import Api from "../api";
import { toast } from "react-toastify";

import Header from "../components/common/Header";
import CourseTable from "../components/products/CourseTable";

const CoursePage = () => {
	const [showAddCourseModal, setShowAddCourseModal] = useState(false);
	const [categories, setCategories] = useState([]);
	const [formData, setFormData] = useState({
		name: "",
		slug: "",
		category: "",
		cover: "course.png"
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [refreshTrigger, setRefreshTrigger] = useState(0);

	const refreshCourses = useCallback(() => {
		setRefreshTrigger(prev => prev + 1);
	}, []);

	useEffect(() => {
		fetchCategories();
	}, []);

	const fetchCategories = async () => {
		try {
			const response = await Api.get("/category");
			if (response.data && response.data.data) {
				setCategories(response.data.data.data || []);
			}
		} catch (error) {
			console.error("Failed to fetch categories:", error);
			toast.error("Gagal mengambil data kategori");
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;

		setFormData(prev => ({
			...prev,
			[name]: value,

			...(name === 'name' ? { slug: value.toLowerCase().replace(/ /g, "-") } : {})
		}));
	};

	const handleAddCourse = async (e) => {
		e.preventDefault();
		if (isSubmitting) return;
		setIsSubmitting(true);

		try {
			if (!formData.name || !formData.category) {
				toast.error("Nama dan kategori harus diisi!");
				setIsSubmitting(false);
				return;
			}

			const courseData = {
				name: formData.name,
				slug: `${formData.name.toLowerCase().replace(/ /g, "-")}-${Date.now()}`,
				category_id: formData.category,
				cover: formData.cover
			};

			const response = await Api.post("/courses", courseData);

			if (response.data) {
				toast.success("Course berhasil ditambahkan!");
				setFormData({
					name: "",
					slug: "",
					category: "",
					cover: "course.png"
				});
				setShowAddCourseModal(false);
				refreshCourses();
			}
		} catch (error) {
			const errorMessage = error.response?.data?.message || "Gagal menambahkan course";
			toast.error(errorMessage);
			console.error("Error adding course:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex-1 overflow-auto relative z-10">
			<Header title="Course" />

			<main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
				{/* STATS */}
				<motion.div
					className="mb-6"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<button
						className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
						onClick={() => setShowAddCourseModal(true)}
					>
						<Plus size={20} /> Add Course
					</button>
				</motion.div>

				<CourseTable refreshTrigger={refreshTrigger} />

				{/* Add Course Modal */}
				{showAddCourseModal && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
						<div className="bg-gray-800 rounded-lg shadow-lg w-96 p-6">
							<h2 className="text-xl font-semibold mb-4 text-gray-100">Tambah Course</h2>
							<form onSubmit={handleAddCourse} className="space-y-4">
								<div>
									<label htmlFor="name" className="block text-sm font-medium text-gray-300">
										Nama
									</label>
									<input
										type="text"
										id="name"
										name="name"
										value={formData.name}
										onChange={handleInputChange}
										className="mt-1 block w-full px-3 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
										placeholder="Masukkan nama course"
										required
									/>
								</div>

								<div>
									<label htmlFor="category" className="block text-sm font-medium text-gray-300">
										Kategori
									</label>
									<select
										id="category"
										name="category"
										value={formData.category}
										onChange={handleInputChange}
										className="mt-1 block w-full px-3 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
										required
									>
										<option value="">Pilih kategori</option>
										{categories.map((cat) => (
											<option key={cat.category_id} value={cat.category_id}>
												{cat.name}
											</option>
										))}
									</select>
								</div>

								{/* Actions */}
								<div className="flex justify-end space-x-4 mt-6">
									<button
										type="button"
										className="bg-gray-500 text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-600"
										onClick={() => setShowAddCourseModal(false)}
										disabled={isSubmitting}
									>
										Batal
									</button>
									<button
										type="submit"
										className={`bg-indigo-500 text-white px-4 py-2 rounded-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-600'
											}`}
										disabled={isSubmitting}
									>
										{isSubmitting ? 'Menambahkan...' : 'Tambah'}
									</button>
								</div>
							</form>
						</div>
					</div>
				)}
			</main>
		</div>
	);
};

export default CoursePage;
