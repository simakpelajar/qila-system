import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, Search } from "lucide-react";
import Header from "../components/common/Header";
import Api from "../api";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";

const ManageStudentsPage = () => {
    const { id: courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        fetchCourseAndStudents();
    }, [courseId, refreshTrigger]);

    const fetchCourseAndStudents = async () => {
        try {
            const [courseResponse, studentsResponse] = await Promise.all([
                Api.get(`/courses/${courseId}`),
                Api.get(`/course-students/${courseId}/students`)
            ]);
            if (!courseResponse.data.data) {
                throw new Error('Course data is empty');
            }
            setCourse(courseResponse.data.data);
            setStudents(studentsResponse.data.data);
        } catch (error) {
            console.error('Error detail:', error);
            toast.error(`Gagal mengambil data: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptStudent = async (userId) => {
        try {
            console.log('Sending enrollment request:', {
                user_id: userId,
                course_id: parseInt(courseId),
                status: "accepted"
            });

            const response = await Api.post('/course-students', {
                user_id: userId,
                course_id: parseInt(courseId),
                status: "accepted"
            });

            console.log('Enrollment response:', response.data);

            if (response.data.status) {
                await fetchCourseAndStudents();
                toast.success("Student berhasil diterima ke kursus");
            } else {
                throw new Error(response.data.message || "Gagal menerima student");
            }
        } catch (error) {
            console.error('Accept Student Error:', error.response || error);
            toast.error(error.response?.data?.message || "Gagal menerima student");
        }
    };

    const handleCancelEnrollment = async (userId) => {
        try {
            const response = await Api.delete(`/course-students/${userId}/${courseId}`);

            if (response.data.status) { 
                toast.success(response.data.message || "Pendaftaran berhasil dibatalkan");
                setRefreshTrigger(prev => prev + 1);
            } else {
                throw new Error(response.data.message || "Gagal membatalkan pendaftaran");
            }
        } catch (error) {
            console.error("Error cancelling enrollment:", error);

            const errorMessage = error.response?.data?.message || "Gagal membatalkan pendaftaran";
            toast.error(errorMessage);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Not Enrolled':
                return 'bg-gray-400/10 text-gray-400';
            case 'accepted':
                return 'bg-blue-400/10 text-green-400';
            default:
                return 'bg-gray-400/10 text-gray-400';
        }
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
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
                    <p className="mt-2 text-gray-400">Memuat data siswa...</p>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="flex-1 overflow-auto relative z-10">
                <Header title="Error" />
                <div className="flex flex-col items-center justify-center h-[70vh]">
                    <p className="text-red-400">Kursus tidak ditemukan</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title={`Kelola Siswa - ${course?.name}`} />
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <div className="mb-6 flex items-center text-sm text-gray-400">
                    <Link to="/admin/course" className="hover:text-blue-500">
                        Courses
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-200">{course?.name}</span>
                    <span className="mx-2">/</span>
                    <span className="text-gray-200">Kelola Siswa</span>
                </div>

                <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                    <div className="mb-6 flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-100">Daftar Siswa</h2>
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
                            <thead>
                                <tr>
                                    <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Nama Siswa
                                    </th>
                                    <th className="w-2/5 px-10 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="w-1/5 px-8 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {currentStudents.map((student) => (
                                    <tr key={student.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                                            {student.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                                            {student.email}
                                        </td>
                                        <td className="px-0 py-4 whitespace-nowrap text-sm">
                                            <span className={`inline-block min-w-[120px] text-center px-4 py-1 rounded-full ${getStatusColor(student.status)}`}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm pl-0 "> {/* Tambah pl-2 untuk geser ke kiri */}
                                            {student.status === 'Not Enrolled' ? (
                                                <button
                                                    onClick={() => handleAcceptStudent(student.id)}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm w-24 ml-0 " // Tambah ml-0
                                                >
                                                    Accept
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleCancelEnrollment(student.id)}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm w-24 ml-0" // Tambah ml-0
                                                >
                                                    Batalkan
                                                </button>
                                            )}
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

export default ManageStudentsPage;
