import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Api from "../../api";
import { toast } from "react-toastify";
import { Clock, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";

const QuizPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();


  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [progress, setProgress] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(true); 

  const [questionTimers, setQuestionTimers] = useState(() => {
    const saved = localStorage.getItem(`quiz_${slug}_timers`);
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem(`quiz_${slug}_timers`, JSON.stringify(questionTimers));
  }, [questionTimers, slug]);

  const handleTimeUp = useCallback(() => {
    toast.error("Waktu habis!", {
      icon: <AlertCircle className="text-red-500" />,
    });

    setTimerActive(false);


    if (currentQuestionIndex === questions.length - 1) {
      handleAnswerSubmit(true);
    } else {

      goToNextQuestion();
      setTimeLeft(30);
      setTimerActive(true);

      toast.warning("Pindah ke soal berikutnya karena waktu habis", {
        position: "top-center"
      });
    }
  }, [currentQuestionIndex, questions.length]);

  useEffect(() => {
    if (timeLeft > 0 && timerActive && !loading && questions[currentQuestionIndex]) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        setQuestionTimers(prev => ({
          ...prev,
          [questions[currentQuestionIndex].question_id]: timeLeft - 1
        }));
      }, 1000);

  
      if (timeLeft === 9) {
        const audio = new Audio('/assets/sound/clock-ticking-sound-effect-240503.mp3');
        audio.play();
      }

  
      if (timeLeft === 5) {
        const audio = new Audio('/assets/sound/severe-warning-alarm-98704.mp3');
        audio.play();
      }

      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }
  }, [timeLeft, handleTimeUp, timerActive, loading, questions, currentQuestionIndex]);

  
  const getTimerBarColor = (timeLeft) => {
    if (timeLeft > 15) return '#22c55e';
    if (timeLeft > 5) return '#f59e0b';
    return '#ef4444';
  };


  useEffect(() => {
    fetchQuestions();
    fetchProgress();
  }, [slug]);

  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signin');
        return;
      }

      Api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await Api.get(`/quiz/${slug}/questions`);
      
      if (response.data.success) {
        setQuestions(response.data.data.questions || []);
      } else {
        toast.error(response.data.message || "Failed to load questions");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error(error.response?.data?.message || "Failed to load questions");
      setLoading(false);
      if (error.response?.status === 404) {
        navigate('/user/course-user');
      }
    }
  };

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signin');
        return;
      }

      Api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await Api.get(`/progress/${slug}`);
      
      if (response.data.success) {
        setProgress(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  };

  const handleAnswerSubmit = async (isTimeout = false) => {
    if (submitting) return;
    setSubmitting(true);
    setTimerActive(false);

    try {
      // Map all questions, use 0 for unanswered
      const answers = questions.map(q => ({
        question_id: parseInt(q.question_id),
        answer_id: parseInt(userAnswers[q.question_id] || 0)
      }));

      const response = await Api.post(`/quiz/${slug}/submit-answers`, {
        answers: answers,
        is_timeout: isTimeout
      });
      
      if (response.data.success) {
        // Clear stored timers when quiz is completed
        localStorage.removeItem(`quiz_${slug}_timers`);
        setQuizResults(response.data.data);
        await fetchProgress();
        setShowResults(true);
        
        toast.success("Quiz berhasil diselesaikan!");
        
        setTimeout(() => {
          navigate('/user/course-user');
        }, 5000);
      }
    } catch (error) {
      console.error("Error submitting answers:", error);
      toast.error("Gagal mengirim jawaban");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const goToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      // Load saved time for next question or set to default
      const nextQuestion = questions[currentQuestionIndex + 1];
      const savedTime = questionTimers[nextQuestion?.question_id];
      setTimeLeft(savedTime || 30);
      setTimerActive(true);
    } else {
      handleAnswerSubmit(false);
    }
  }, [currentQuestionIndex, questions, questionTimers]);

  const goToPreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      const prevQuestion = questions[currentQuestionIndex - 1];
      const prevQuestionTime = questionTimers[prevQuestion?.question_id];
      
      if (prevQuestionTime && prevQuestionTime > 0) {
        setCurrentQuestionIndex(prev => prev - 1);
        setTimeLeft(prevQuestionTime);
        setTimerActive(true);
      }
    }
  }, [currentQuestionIndex, questions, questionTimers]);

  const getTimerColor = () => {
    if (timeLeft > 15) return 'text-green-400';
    if (timeLeft > 5) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 rounded-full border-t-transparent" />
      </div>
    );
  }
  const currentQuestion = questions[currentQuestionIndex];

  const renderAnswerChoices = (question) => {
    if (!question || !question.answers) return null;
    
    return (
      <div className="space-y-4">
        {question.answers.map((answer) => (
          <label
            key={answer.answer_id}
            className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200 ${
              userAnswers[question.question_id] === answer.answer_id
                ? 'bg-blue-500/20 border-blue-500/50'
                : 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50'
            } border`}
          >
            <div className="flex items-center justify-center">
              <input
                type="radio"
                name={`question-${question.question_id}`}
                value={answer.answer_id}
                checked={userAnswers[question.question_id] === answer.answer_id}
                onChange={() => handleAnswerChange(question.question_id, answer.answer_id)}
                className="hidden"
              />
              <div
                className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                  userAnswers[question.question_id] === answer.answer_id
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-400'
                }`}
              >
                {userAnswers[question.question_id] === answer.answer_id && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
            </div>
            <span className="text-lg">{answer.answer_text}</span>
          </label>
        ))}
      </div>
    );
  };

  const ResultsModal = () => {
    if (!quizResults) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Hasil Quiz</h2>
          <div className="space-y-4">
            <div className="border-t border-gray-600 pt-4">
              <p className="text-lg mb-2">
                Jawaban Benar: <span className="font-bold text-green-500">
                  {quizResults.total_questions - quizResults.wrong_answers}
                </span>
              </p>
              <p className="text-lg mb-2">
                Jawaban Salah: <span className="font-bold text-red-500">
                  {quizResults.wrong_answers}
                </span>
              </p>
              <p className="text-lg mb-2">
                Score: <span className="font-bold text-yellow-500">
                  {quizResults.score}
                </span>
              </p>
              <p className="text-lg">
                Persentase Keberhasilan: <span className="font-bold text-blue-500">
                  {quizResults.succes_rate}%
                </span>
              </p>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => navigate('/user/course-user')}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-white"
            >
              Kembali ke Kursus
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-700 z-50">
        <div 
          className="h-full transition-all duration-1000 relative"
          style={{ 
            width: `${(timeLeft / 30) * 100}%`,
            backgroundColor: getTimerBarColor(timeLeft)
          }}
        >
          {timeLeft <= 5 && (
            <div 
              className="absolute inset-0 bg-red-500 animate-pulse"
              style={{ opacity: 0.5 }}
            />
          )}
        </div>
      </div>

      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Quiz: {currentQuestion?.title || ''}
            </h1>
            <div className={`flex items-center gap-2 ${getTimerColor()} bg-gray-800/50 backdrop-blur-sm p-3 rounded-lg`}>
              <Clock className="h-5 w-5" />
              <span className="font-mono text-xl">{timeLeft}s</span>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Progress</span>
              <span>{currentQuestionIndex + 1} dari {questions.length}</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-6">
              {currentQuestionIndex + 1}. {currentQuestion?.question || ''}
            </h2>

            {currentQuestion && renderAnswerChoices(currentQuestion)}

            <div className="flex justify-between mt-8">
              <button
                onClick={goToPreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                  currentQuestionIndex === 0
                    ? "bg-gray-600 cursor-not-allowed opacity-50"
                    : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
                <span>Previous</span>
              </button>

              {currentQuestionIndex === questions.length - 1 ? (
                <button
                  onClick={() => handleAnswerSubmit(false)}
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 transition-colors"
                >
                  {submitting ? "Submitting..." : "Submit Quiz"}
                </button>
              ) : (
                <button
                  onClick={goToNextQuestion}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showResults && <ResultsModal />}
    </div>
  );
};

export default QuizPage;
