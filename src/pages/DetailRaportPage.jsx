import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, Search } from "lucide-react";
import Header from "../components/common/Header";
import Api from "../api";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";

const DetailRaportPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!courseId) {
      setError("ID kursus tidak valid");
      setLoading(false);
      return;
    }
    fetchRaportData();
  }, [courseId]);

  const fetchRaportData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [courseResponse, studentsResponse] = await Promise.all([
        Api.get(`/courses/${courseId}`),
        Api.get(`/courses/${courseId}/raport`)
      ]);

      if (!courseResponse.data?.data) {
        throw new Error("Data kursus tidak ditemukan");
      }
      setCourse(courseResponse.data.data);

      if (!studentsResponse.data?.data) {
        throw new Error("Data raport tidak ditemukan");
      }

      setStudentData(studentsResponse.data.data);
    } catch (error) {
      console.error("Error fetching raport data:", error);
      toast.error("Gagal memuat data raport");
    } finally {
      setLoading(false);
    }
  };

  const calculateGrade = (score) => {
    if (score >= 85) return 'A';
    if (score >= 75) return 'B';
    if (score >= 65) return 'C';
    if (score >= 50) return 'D';
    return 'E';
  };

  const getGradeColor = (grade) => {
    const colors = {
      'A': 'bg-green-500/10 text-green-400',
      'B': 'bg-blue-500/10 text-blue-400',
      'C': 'bg-yellow-500/10 text-yellow-400',
      'D': 'bg-orange-500/10 text-orange-400',
      'E': 'bg-red-500/10 text-red-400'
    };
    return colors[grade] || 'bg-gray-500/10 text-gray-400';
  };

  const filteredStudents = studentData.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageCount = Math.ceil(filteredStudents.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentStudents = filteredStudents.slice(offset, offset + itemsPerPage);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-auto relative z-10">
        <Header title="Loading..." />
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="mt-2 text-gray-400">Memuat data raport...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title={`Raport Kursus - ${course?.name}`} />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <div className="mb-6 flex items-center text-sm text-gray-400">
          <Link to="/admin/course" className="hover:text-blue-500">
            Courses
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-200">{course?.name}</span>
          <span className="mx-2">/</span>
          <span className="text-gray-200">Raport</span>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-md rounded-xl shadow-lg p-6 border border-gray-700">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-100">Daftar Nilai Siswa</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Cari siswa..."
                className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-fixed min-w-[800px] divide-y divide-gray-700">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Nama Siswa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Percobaan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Total Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Success Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {currentStudents.map((student) => (
                  <tr key={student.student_id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {student.completed_quizzes}x
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400">
                        {student.total_score}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-500/10 text-purple-400">
                        {student.succes_rate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(student.grade)}`}>
                        {student.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        student.status === "Lulus" 
                          ? "bg-green-500/10 text-green-400"
                          : student.status === "Remidi"
                            ? "bg-red-500/10 text-red-400"
                            : "bg-gray-500/10 text-gray-400"
                      }`}>
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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
        </div>
      </main>
    </div>
  );
};

export default DetailRaportPage;
