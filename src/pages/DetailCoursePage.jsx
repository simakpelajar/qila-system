import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2, PenSquare, PlusCircle, Trash2 } from "lucide-react";
import Header from "../components/common/Header";
import Api from "../api";
import Swal from "sweetalert2";

const DetailCoursePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        category: "",
    });
    const [questions, setQuestions] = useState([]);
    const [showAddQuestion, setShowAddQuestion] = useState(false);
    const [newQuestion, setNewQuestion] = useState({
        question: "",
        correctAnswerIndex: null, // Ubah dari 0 ke null
        score: 0,
        options: ["", "", "", ""],
        questionId: null // Tambahkan ini
    });

    useEffect(() => {
        fetchCourseData();
        fetchCategories();
        fetchQuestions();
    }, [id]);

    // Implementasi fetchCourseData
    const fetchCourseData = async () => {
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

    // Perbaiki fetchQuestions untuk mendapatkan answers beserta score
    const fetchQuestions = async () => {
        try {
            const questionsResponse = await Api.get(`/course-questions/course/${id}`);
            console.log('Questions response:', questionsResponse.data);

            if (questionsResponse.data.status && Array.isArray(questionsResponse.data.data)) {
                const questions = questionsResponse.data.data;
                
                // Fetch answers for each question dengan Promise.all
                const questionsWithAnswers = await Promise.all(
                    questions.map(async (question) => {
                        try {
                            const answersResponse = await Api.get(`/course-answers/question/${question.question_id}`);
                            console.log(`Answers for question ${question.question_id}:`, answersResponse.data);
                            
                            return {
                                ...question,
                                answers: answersResponse.data.data || []
                            };
                        } catch (error) {
                            console.error(`Error fetching answers for question ${question.question_id}:`, error);
                            return {
                                ...question,
                                answers: []
                            };
                        }
                    })
                );

                console.log('Final questions with answers:', questionsWithAnswers);
                setQuestions(questionsWithAnswers);
            } else {
                setQuestions([]);
            }
        } catch (error) {
            console.error('Error fetching questions:', error);
            toast.error("Gagal mengambil data pertanyaan");
            setQuestions([]);
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
            // Tambahkan validasi score
            if (newQuestion.score < 0) {
                toast.error("Score tidak boleh negatif!");
                return;
            }

            if (newQuestion.questionId) {
                await handleUpdateQuestion(e);
            } else {
                await handleAddQuestion(e);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("Terjadi kesalahan saat menyimpan pertanyaan");
        }
    };

    const handleAddQuestion = async (e) => {
        e.preventDefault();
        try {

            if (!newQuestion.question || newQuestion.correctAnswerIndex === null) {
                toast.error("Pertanyaan dan jawaban benar harus diisi!");
                return;
            }
            if (newQuestion.options.some(option => !option.trim())) {
                toast.error("Semua opsi jawaban harus diisi!");
                return;
            }


            const questionResponse = await Api.post('/course-questions', {
                course_id: parseInt(id),
                question: newQuestion.question
            });

            if (questionResponse.data && questionResponse.data.status) {
                const questionId = questionResponse.data.data.question_id;


                const answerPromises = newQuestion.options.map((option, index) => {
                    return Api.post('/course-answers', {
                        question_id: questionId,
                        answer: option,
                        is_correct: index === parseInt(newQuestion.correctAnswerIndex),  // Kirim sebagai boolean
                        user_id: 1,
                        score: newQuestion.score
                    });
                });

                await Promise.all(answerPromises);
                
                toast.success("Pertanyaan dan jawaban berhasil ditambahkan");
                setShowAddQuestion(false);
                resetNewQuestion();
                await fetchQuestions();
            }
        } catch (error) {
            console.error('Error adding question:', error);
            toast.error(error.response?.data?.message || "Gagal menambahkan pertanyaan");
        }
    };

    // Tambahkan fungsi resetNewQuestion
    const resetNewQuestion = () => {
        setNewQuestion({
            question: "",
            correctAnswerIndex: null,
            score: 0,
            options: ["", "", "", ""],
            questionId: null
        });
    };

    // Tambahkan fungsi handleDeleteQuestion
    const handleDeleteQuestion = async (questionId) => {
        try {
            const confirmDelete = await Swal.fire({
                title: 'Hapus Pertanyaan?',
                text: "Pertanyaan dan jawaban akan dihapus permanen",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Ya, Hapus!',
                cancelButtonText: 'Batal'
            });

            if (confirmDelete.isConfirmed) {
                await Api.delete(`/course-questions/${questionId}`);
                toast.success("Pertanyaan berhasil dihapus");
                fetchQuestions();
            }
        } catch (error) {
            console.error('Error deleting question:', error);
            toast.error("Gagal menghapus pertanyaan");
        }
    };

    // Perbaiki handleEditQuestion
    const handleEditQuestion = async (questionId) => {
        try {
            // Ambil data pertanyaan
            const questionResponse = await Api.get(`/course-questions/${questionId}`);
            console.log('Question Response:', questionResponse.data);

            if (!questionResponse.data.status) {
                throw new Error('Failed to fetch question');
            }

            const questionData = questionResponse.data.data;

            // Ambil data jawaban
            const answersResponse = await Api.get(`/course-answers/question/${questionId}`);
            console.log('Answers Response:', answersResponse.data);

            const answers = answersResponse.data.data || [];

            // Siapkan data untuk form edit
            const formData = {
                questionId: questionData.question_id,
                question: questionData.question,
                score: answers.find(a => a.is_correct === true || a.is_correct === 1)?.score || 0,
                options: answers.map(a => a.answer),
                correctAnswerIndex: answers.findIndex(a => a.is_correct === true || a.is_correct === 1)
            };

            console.log('Form data for editing:', formData);

            // Set data ke state
            setNewQuestion(formData);
            setShowAddQuestion(true);

        } catch (error) {
            console.error('Error detail:', error);
            toast.error("Gagal mengambil data pertanyaan. Silakan coba lagi.");
        }
    };

    const handleUpdateQuestion = async (e) => {
        e.preventDefault();
        try {
            console.log('Updating question with data:', newQuestion);

            // Validasi data
            if (!newQuestion.question || newQuestion.correctAnswerIndex === null) {
                toast.error("Pertanyaan dan jawaban benar harus diisi!");
                return;
            }

            // Update pertanyaan
            const updateQuestionResponse = await Api.put(`/course-questions/${newQuestion.questionId}`, {
                question: newQuestion.question,
                course_id: parseInt(id)
            });

            console.log('Question update response:', updateQuestionResponse.data);

            if (!updateQuestionResponse.data.status) {
                throw new Error('Failed to update question');
            }

            // Hapus jawaban lama
            await Api.delete(`/course-answers/question/${newQuestion.questionId}`);

            // Buat jawaban baru
            const answerPromises = newQuestion.options.map((option, index) => {
                return Api.post('/course-answers', {
                    question_id: newQuestion.questionId,
                    answer: option,
                    is_correct: index === parseInt(newQuestion.correctAnswerIndex),
                    user_id: 1,
                    score: newQuestion.score
                });
            });

            await Promise.all(answerPromises);

            toast.success("Pertanyaan berhasil diperbarui");
            setShowAddQuestion(false);
            resetNewQuestion();
            await fetchQuestions(); // Refresh data pertanyaan

        } catch (error) {
            console.error('Error updating question:', error);
            console.error('Error response:', error.response?.data);
            toast.error(error.response?.data?.message || "Gagal memperbarui pertanyaan");
        }
    };

    const handleUpdateCourse = async (e) => {
        e.preventDefault();
        try {
            const response = await Api.put(`/courses/${id}`, {
                name: formData.name,
                slug: formData.slug,
                category_id: formData.category
            });

            if (response.data.status) {
                toast.success("Kursus berhasil diperbarui");
                setIsEditing(false);
                fetchCourseData(); // Refresh the course data
            }
        } catch (error) {
            console.error('Error updating course:', error);
            toast.error("Gagal memperbarui kursus");
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
            <Header title="Detail Course" />
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <div> {/* Ganti fragment <> dengan div */}
                    {/* Navigation */}
                    <div className="mb-6 flex items-center text-sm text-gray-400">
                        <Link to="/admin/course" className="hover:text-blue-500">
                            Courses
                        </Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-200">{course?.name}</span>
                        <span className="mx-2">/</span>
                        <span className="text-gray-200">Detail Kursus</span>
                    </div>

                    {/* Content */}
                    <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-100">Informasi Kursus</h2>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="flex items-center gap-2 text-blue-500 hover:text-blue-400"
                            >
                                <PenSquare size={20} />
                                {isEditing ? 'Batal Edit' : 'Edit'}
                            </button>
                        </div>

                        {isEditing ? (
                            // Form Edit
                            <form onSubmit={handleUpdateCourse} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">
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
                                    <label className="block text-sm font-medium text-gray-400">
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
                                        onClick={() => setIsEditing(false)}
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
                        ) : (
                            // Detail View
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">
                                        Nama Kursus
                                    </label>
                                    <p className="mt-1 text-lg text-gray-100">{course?.name}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400">
                                        Kategori
                                    </label>
                                    <p className="mt-1 text-lg text-gray-100">{course?.category?.name}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400">
                                        Tanggal Dibuat
                                    </label>
                                    <p className="mt-1 text-lg text-gray-100">
                                        {new Date(course?.created_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Questions Section */}
                    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-100">Pertanyaan Kursus</h2>
                            <button
                                onClick={() => setShowAddQuestion(true)}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                            >
                                <PlusCircle size={20} />
                                Tambah Pertanyaan
                            </button>
                        </div>

                        {/* Add Question Form */}
                        {showAddQuestion && (
                            <form onSubmit={handleSubmit} className="mb-6 bg-gray-700 p-4 rounded-lg">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Pertanyaan
                                        </label>
                                        <input
                                            type="text"
                                            value={newQuestion.question}
                                            onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                                            className="w-full bg-gray-600 text-white rounded-md p-2"
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Score
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                min="0"
                                                value={newQuestion.score || ''} // Change this line to allow empty value
                                                onChange={(e) => {
                                                    const value = e.target.value === '' ? '' : parseInt(e.target.value);
                                                    if (value === '' || value >= 0) {
                                                        setNewQuestion({...newQuestion, score: value});
                                                    }
                                                }}
                                                className="w-full bg-gray-600 text-white rounded-md p-2"
                                                placeholder="Masukkan score (minimal 1)"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Score harus berupa angka positif
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Opsi Jawaban
                                        </label> {/* Add this closing tag */}
                                        {newQuestion.options.map((option, index) => (
                                            <div key={index} className="flex items-center gap-2 mb-2">
                                                <input
                                                    type="text"
                                                    value={option}
                                                    onChange={(e) => {
                                                        const newOptions = [...newQuestion.options];
                                                        newOptions[index] = e.target.value;
                                                        setNewQuestion({...newQuestion, options: newOptions});
                                                    }}
                                                    className="flex-1 bg-gray-600 text-white rounded-md p-2"
                                                    placeholder={`Opsi ${index + 1}`}
                                                    required
                                                />
                                                <input
                                                    type="radio"
                                                    name="correctAnswer"
                                                    checked={index === newQuestion.correctAnswerIndex}
                                                    onChange={() => setNewQuestion({...newQuestion, correctAnswerIndex: index})}
                                                    className="w-4 h-4"
                                                />
                                                <label className="text-sm text-gray-300">Jawaban Benar</label>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowAddQuestion(false);
                                                setNewQuestion({
                                                    question: "",
                                                    correctAnswerIndex: 0,
                                                    score: 0,
                                                    options: ["", "", "", ""]
                                                });
                                            }}
                                            className="px-4 py-2 bg-gray-600 text-white rounded-md"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md"
                                        >
                                            {newQuestion.questionId ? 'Update' : 'Simpan'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}

                        {/* Questions List */}
                        <div className="space-y-4">
                            {questions && questions.length > 0 ? (
                                questions.map((question, index) => (
                                    <div key={question.question_id} className="bg-gray-700 p-4 rounded-lg">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-100">
                                                    {index + 1}. {question.question}
                                                </h3>
                                                {/* Tampilkan score dari jawaban yang benar */}
                                                <p className="text-sm text-gray-400 mt-1">
                                                    Score: {question.answers?.find(a => Boolean(a.is_correct))?.score || 0}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEditQuestion(question.question_id)}
                                                    className="text-blue-400 hover:text-blue-300"
                                                >
                                                    <PenSquare size={20} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteQuestion(question.question_id)}
                                                    className="text-red-400 hover:text-red-300"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                        {/* Show answers if available */}
                                        {question.answers && (
                                            <div className="mt-2 pl-4 space-y-1">
                                                {question.answers.map((answer, idx) => (
                                                    <div key={idx} className={`text-sm ${Boolean(answer.is_correct) ? 'text-green-400' : 'text-gray-300'}`}>
                                                        {String.fromCharCode(65 + idx)}. {answer.answer}
                                                        {Boolean(answer.is_correct) && ' ✓'}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-400 py-4">
                                    Belum ada pertanyaan untuk kursus ini
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DetailCoursePage;
