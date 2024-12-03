import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import Header from "../components/common/Header";
import Api from "../api";

const EditCoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourse();
    fetchCategories();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await Api.get(`/courses/${id}`);
      const courseData = response.data.data;
      setCourse(courseData);
      setFormData({
        name: courseData.name,
        slug: courseData.slug,
        category: courseData.category_id,
      });
    } catch (error) {
      toast.error("Gagal mengambil data kursus");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await Api.get("/category");
      setCategories(response.data.data.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setFormData({
        ...formData,
        [name]: value,
        slug: value.toLowerCase().replace(/ /g, "-"),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Api.put(`/courses/${id}`, {
        name: formData.name,
        slug: formData.slug,
        category_id: formData.category,
      });
      toast.success("Kursus berhasil diperbarui");
      navigate("/admin/course");
    } catch (error) {
      toast.error("Gagal memperbarui kursus");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-auto relative z-10">
        <Header title="Loading..." />
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="mt-2 text-gray-400">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Edit Course" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Navigation */}
        <div className="mb-6 flex items-center text-sm text-gray-400">
          <Link to="/admin/course" className="hover:text-blue-500">
            Courses
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-200">{course?.name}</span>
          <span className="mx-2">/</span>
          <span className="text-gray-200">Edit Kursus</span>
        </div>

        {/* Form */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Nama Kursus
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Kategori
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm"
              >
                <option value="">Pilih kategori</option>
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate("/admin/course")}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditCoursePage;
