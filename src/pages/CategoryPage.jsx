import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Loader2 } from "lucide-react";
import Header from "../components/common/Header";
import Api from "../api";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddMode, setIsAddMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: "", slug: "" });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            const response = await Api.get("/category");
            setCategories(response.data.data.data);
        } catch (err) {
            setError("Failed to fetch categories");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name) {
            setError("Please enter a category name");
            return;
        }

        const slug = formData.name.toLowerCase().replace(/\s+/g, "-");

		try {
			if (editingId) {
				await Api.put(`/category/${editingId}`, { ...formData, slug });
				toast.success("Category updated successfully", {
					position: "top-right",
					autoClose: 1500,
				});
			} else {
				await Api.post("/category", { ...formData, slug });
				toast.success("Category added successfully", {
					position: "top-right",
					autoClose: 1500,
				});
			}
			fetchCategories();
			resetForm();
		} catch (err) {
			setError(editingId ? "Failed to update category" : "Failed to add category");
		}
		
    };

    const handleDelete = async (id, name) => {
        Swal.fire({
            title: `Delete category "${name}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await Api.delete(`/category/${id}`);
                    fetchCategories();
                    toast.success(`Category "${name}" deleted`, {
                        position: "top-right",
                        autoClose: 1500,
                    });
                } catch (err) {
                    setError("Failed to delete category");
                }
            }
        });
    };

    const resetForm = () => {
        setFormData({ name: "", slug: "" });
        setIsAddMode(false);
        setEditingId(null);
        setError(null);
    };

    const startEdit = (category) => {
        setEditingId(category.category_id);
        setFormData({ name: category.name, slug: category.slug });
        setIsAddMode(true);
    };
	
    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="Category Dashboard" />
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <div className="mb-8">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-medium text-gray-100">
                                {editingId ? "Edit Category" : "Add New Category"}
                            </h2>
                            {!isAddMode ? (
                                <button
                                    onClick={() => setIsAddMode(true)}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                                >
                                    <Plus size={20} /> Add Category
                                </button>
                            ) : (
                                <button onClick={resetForm} className="text-gray-400 hover:text-gray-300">
                                    <X size={20} />
                                </button>
                            )}
                        </div>

                        {isAddMode && (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        autoFocus
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-4">
                                    <button type="button" onClick={resetForm} className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700">
                                        Cancel
                                    </button>
                                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                                        {editingId ? "Update" : "Save"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Slug</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created At</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center text-gray-400">
                                            <Loader2 className="animate-spin h-6 w-6 mx-auto" />
                                        </td>
                                    </tr>
                                ) : categories.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center text-gray-400">
                                            No categories found
                                        </td>
                                    </tr>
                                ) : (
                                    categories.map((category) => (
                                        <tr key={category.category_id}>
                                            <td className="px-6 py-4 text-sm text-gray-200">{category.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-200">{category.slug}</td>
                                            <td className="px-6 py-4 text-sm text-gray-200">
                                                {new Date(category.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-medium">
                                                <button onClick={() => startEdit(category)} className="text-indigo-400 hover:text-indigo-300 mx-2">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(category.category_id, category.name)} className="text-red-400 hover:text-red-300 mx-2">
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {error && (
                    <div className="mt-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg">
                        {error}
                    </div>
                )}
            </main>

            <ToastContainer />
        </div>
    );
};

export default CategoryPage;
