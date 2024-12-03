import React, { useState, useEffect } from 'react';
import Header from "../../components/common/Header";
import Api from '../../api';

const RaportUserPage = () => {
  const [grades, setGrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setIsLoading(true);
        const response = await Api.get('/user/grades');
        if (response.data.success) {
          setGrades(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching grades:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGrades();
  }, []);

  if (isLoading) {
    return (
      <div className='flex-1 relative z-10 overflow-auto'>
        <Header title="Raport Details" />
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
      <Header title="Raport Details" />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-lg overflow-hidden">
          <div className="p-6">
            {grades.length === 0 ? (
              <div className="text-center py-4 text-gray-400">
                No courses found
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-700">
                    <th className="pb-4 text-sm font-semibold">Course Name</th>
                    <th className="pb-4 text-sm font-semibold">Grade</th>
                    <th className="pb-4 text-sm font-semibold">Success Rate</th>
                    <th className="pb-4 text-sm font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((grade, index) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="py-4">{grade.course_name}</td>
                      <td className="py-4">{grade.grade}</td>
                      <td className="py-4">{grade.success_rate}%</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 ${
                          grade.status === 'Completed' 
                            ? 'bg-green-500/20 text-green-500' 
                            : 'bg-yellow-500/20 text-yellow-500'
                          } rounded text-sm`}>
                          {grade.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RaportUserPage;
