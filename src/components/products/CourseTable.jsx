import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDown } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import axios from 'axios';
import Api from "../../api";

const categoryColors = [
  'bg-blue-400/10 text-blue-400 border border-blue-400/20',
  'bg-purple-400/10 text-purple-400 border border-purple-400/20', // index 1
  'bg-green-400/10 text-green-400 border border-green-400/20',   // index 2
  'bg-red-400/10 text-red-400 border border-red-400/20',         // index 3
  'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20', // index 4
  'bg-pink-400/10 text-pink-400 border border-pink-400/20'       // index 5
];

const getCategoryStyles = (category) => {
  if (!category || !category.category_id) return categoryColors[0];
  

  const colorIndex = (category.category_id - 1) % categoryColors.length;
  return categoryColors[colorIndex];
};

const CourseTable = ({ refreshTrigger }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, [refreshTrigger]);

  useEffect(() => {

    setPageCount(Math.ceil(filteredCourses.length / itemsPerPage));
  }, [filteredCourses, itemsPerPage]);

  const getCurrentItems = () => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCourses.slice(startIndex, endIndex);
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
    const newOffset = (event.selected * itemsPerPage) % filteredCourses.length;
    setItemOffset(newOffset);
  };

  const fetchCourses = async () => {
    try {
      const response = await Api.get("/courses");


      if (response && response.data) {
        const coursesData = Array.isArray(response.data.data) ? response.data.data : [];
    
        setCourses(coursesData);
        setFilteredCourses(coursesData);
      } else {
        throw new Error("Invalid response data");
      }
    } catch (error) {
      setError("Gagal mengambil data kursus");
    
      setCourses([]);
      setFilteredCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = courses.filter((course) => {
      const name = course?.name?.toLowerCase() || '';
      const category = course?.category?.name?.toLowerCase() || '';
      return name.includes(term) || category.includes(term);
    });

    setFilteredCourses(filtered);
  };

  const handleDeleteCourse = async (id, courseName) => {
    if (!id) return;

    try {
      const result = await Swal.fire({
        title: 'Hapus Kursus',
        text: `Apakah anda yakin ingin menghapus kursus "${courseName}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
      });

      if (result.isConfirmed) {
        const response = await Api.delete(`/courses/${id}`);

        if (response.data && response.status === 200) {
          toast.success("Kursus berhasil dihapus!");
          await fetchCourses();
        } else {
          throw new Error(response.data?.message || "Gagal menghapus kursus");
        }
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error(error?.response?.data?.message || "Gagal menghapus kursus");
    }
  };

  const handleDetailCourse = (courseId) => {
    navigate(`/admin/course/${courseId}/detail`); 
  };

  const handleDetailRaport = (courseId) => {
    navigate(`/admin/course/${courseId}/raport`); 
  };

  const handleManageStudents = (courseId) => {
    navigate(`/admin/course/${courseId}/students`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-400">Memuat data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 text-red-400 p-4 rounded-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Daftar Kursus</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Cari kursus..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
            style={{ cursor: 'text' }} // Ensure cursor is visible
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700 table-fixed">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-1/4">
                Nama
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-1/4">
                Tanggal Dibuat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-1/4">
                Kategori
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-1/4">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {getCurrentItems().map((course) => {
              if (!course) return null;
              return (
                <motion.tr
                  key={course.course_id || `course-${Math.random()}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                    {course.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Intl.DateTimeFormat("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    }).format(new Date(course.created_at || course.createDate || Date.now()))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-block min-w-[120px] text-center px-4 py-1 rounded-full ${getCategoryStyles(course.category)}`}
                    >
                      {course.category?.name || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <button className="w-200 flex justify-between text-white bg-gray-700 rounded-lg px-4 py-2 hover:bg-gray-800" style={{ cursor: 'pointer' }}>
                          Menu
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content className="bg-[#1a2237] text-white rounded-lg shadow-lg w-40">
                        <DropdownMenu.Item 
                          className="px-4 py-1 text-sm hover:bg-gray-800 cursor-pointer"
                          onClick={() => handleManageStudents(course.course_id)}
                        >
                          Kelola Siswa
                        </DropdownMenu.Item>
                        <DropdownMenu.Item 
                          className="px-4 py-1 text-sm hover:bg-gray-800 cursor-pointer"
                          onClick={() => handleDetailCourse(course.course_id)}
                        >
                          Detail Kursus
                        </DropdownMenu.Item>
                        <DropdownMenu.Item 
                          className="px-4 py-1 text-sm hover:bg-gray-800 cursor-pointer"
                          onClick={() => handleDetailRaport(course.course_id)}
                        >
                          Detail Raport
                        </DropdownMenu.Item>
                        <DropdownMenu.Item 
                          className="px-4 py-1 text-sm text-red-400 hover:bg-gray-800 cursor-pointer"
                          onClick={() => handleDeleteCourse(course.course_id, course.name)}
                        >
                          Hapus
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Updated Pagination */}
      <div className="mt-4 flex justify-center">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName={"flex items-center gap-2"}
          pageClassName={"page-item px-3 py-1 bg-gray-700 hover:bg-blue-500 rounded-lg text-white"}
          pageLinkClassName={"text-gray-300"}
          previousClassName={"px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600"}
          previousLinkClassName={"text-gray-300"}
          nextClassName={"px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600"}
          nextLinkClassName={"text-gray-300"}
          disabledClassName={"opacity-50"}
          activeClassName={"!bg-blue-500"}
        />
      </div>
    </motion.div>
  );
};

export default CourseTable;