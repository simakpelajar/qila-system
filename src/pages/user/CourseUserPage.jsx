import React, { useState, useEffect } from 'react';
import Header from "../../components/common/Header";
import Api from '../../api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Search, Filter, Book, Award, BarChart3 } from 'lucide-react';

const CourseUserPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/signin');
          return;
        }

        Api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const [coursesResponse, categoriesResponse] = await Promise.all([
          Api.get('/course-students'),
          Api.get('/category')
        ]);

        if (coursesResponse.data && coursesResponse.data.data) {
          console.log('Raw course data:', coursesResponse.data.data);
          setCourses(coursesResponse.data.data);
        }

        if (categoriesResponse.data && categoriesResponse.data.data) {
          setCategories(categoriesResponse.data.data.data);
        }
        
      } catch (error) {
        console.error('Error details:', error);
        setError(error.message);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/signin');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [navigate]);

  const handleCourseClick = (course) => {
    if (course && course.slug) {
      navigate(`/user/quiz/${course.slug}`);
    } else {
      toast.error('Course slug not found');
    }
  };

  const filteredCourses = courses.filter(course => {
    return (
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "" || 
       (course.category_id && String(course.category_id) === String(selectedCategory)))
    );
  });

  if (isLoading) {
    return (
      <div className='flex-1 relative z-10 overflow-auto bg-gray-900'>
        <Header title="My Courses" />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div role="status">
            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className='flex-1 relative z-10 overflow-auto bg-gray-900'>
        <Header title="My Courses" />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-white bg-red-500 p-4 rounded-lg">
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className='flex-1 relative z-10 overflow-auto bg-gray-900'>
        <Header title="My Courses" />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-white">
            No courses found
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex-1 relative z-10 overflow-auto bg-gray-900'>
      <Header title="My Course" />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full sm:w-64 bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <div className="relative w-full sm:w-auto">
            <select
              className="w-full sm:w-48 bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.name}
                </option>
              ))}
            </select>
            <Filter className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={18} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div 
              key={course.id} 
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden shadow-lg p-6 cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => handleCourseClick(course)}
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white mb-2">{course.name}</h3>
                <span className="px-3 py-1 bg-blue-600 rounded-full text-xs font-semibold text-white">
                  {course.category_id ? 
                    categories.find(cat => String(cat.category_id) === String(course.category_id))?.name || 'Uncategorized'
                    : 'Uncategorized'
                  }
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Persentase Keberhasilan:</span>
                    <span className="text-white font-medium">{course.succes_rate}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${course.succes_rate}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-gray-700 rounded-lg p-2">
                    <Book className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                    <div className="text-lg font-bold text-white">{course.questions}</div>
                    <div className="text-xs text-gray-400">Total Soal</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-2">
                    <Award className="h-5 w-5 text-yellow-400 mx-auto mb-1" />
                    <div className="text-lg font-bold text-white">{course.score}</div>
                    <div className="text-xs text-gray-400">Total Score</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-2">
                    <BarChart3 className="h-5 w-5 text-green-400 mx-auto mb-1" />
                    <div className="text-lg font-bold text-white">{course.attempts}x</div>
                    <div className="text-xs text-gray-400">Percobaan</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CourseUserPage;