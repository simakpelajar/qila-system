import React, { useState, useEffect } from 'react';
import Api from '../../api';
import Header from "../../components/common/Header";

const OverviewUserPage = () => {
  const [userData, setUserData] = useState(null);
  const [courseStats, setCourseStats] = useState({
    enrolled: 0,
    completed: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const userResponse = await Api.get('/user/me');
        console.log('Raw API Response:', userResponse);

        if (userResponse.data.success && userResponse.data.data) {
          console.log('Setting user data:', userResponse.data.data);
          setUserData(userResponse.data.data);
        } else {
          console.error('User data not found in response');
        }

        const statsResponse = await Api.get('/course-students/overview-stats');
        if (statsResponse.data.success && statsResponse.data.data) {
          const { enrolled, completed, overall_progress } = statsResponse.data.data;
          setCourseStats({
            enrolled: enrolled,
            completed: completed,
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Check if it's an authentication error
        if (error.response?.status === 401) {
          console.error('Authentication error - token might be invalid or expired');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Debug userData
  useEffect(() => {
    console.log('Current userData:', userData);
  }, [userData]);

  if (isLoading) {
    return (
      <div className='flex-1 relative z-10 overflow-auto'>
        <Header title="Overview" />
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

  return (
    <div className='flex-1 relative z-10 overflow-auto'>
      <Header title="Overview" />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">
            Halo, {userData && userData.name ? userData.name : 'User'} 👋
          </h1>
          <p className="text-gray-400">Selamat Belajar!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Enrolled Courses</h2>
            <p className="text-3xl font-bold text-indigo-500">{courseStats.enrolled}</p>
          </div>
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Completed Courses</h2>
            <p className="text-3xl font-bold text-green-500">{courseStats.completed}</p>
          </div>
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Overall Progress</h2>
            <p className="text-3xl font-bold text-purple-500">
              {courseStats.enrolled ? Math.round((courseStats.completed / courseStats.enrolled) * 100) : 0}%
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OverviewUserPage;
