"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";

// Define types
interface Question {
  id: number;
  question: string;
  options: {
    [key: string]: string;
  };
  answer: string;
  marks: number;
  number: any;
}

interface Subject {
  id: string;
  name: string;
  questionData?: Question;
  subjectId?: any;
}

const Page: React.FC = () => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const router = useRouter();

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/adminlogin");
  };

  // API call to fetch subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get<Subject[]>('http://localhost:5000/quizes');
        console.log('Fetched subjects:', response.data);
        const filteredSubjects = response.data.filter((item) => item.name);
        setSubjects(filteredSubjects);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    fetchSubjects();
  }, []);

  // API call to fetch questions based on the selected subject
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get<Subject[]>('http://localhost:5000/quizes');
        console.log('Fetched quizes:', response.data);
        const filteredQuestions = response.data
          .filter((item) => item.subjectId === selectedSubjectId && item.questionData)
          .map((item) => item.questionData);
        console.log(`Filtered questions for subject: ${selectedSubjectId}`, filteredQuestions);
        setQuestions(filteredQuestions as any);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    if (selectedSubjectId) {
      fetchQuestions();
    }
  }, [selectedSubjectId]);

  // Handle subject change
  const handleSubjectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubjectId(e.target.value);
    console.log('Selected subject ID:', e.target.value);
  };

  // Handle delete question
  const handleDeleteQuestion = async (subjectId: string, questionNumber: number) => {
    try {
      console.log('Deleting question with:', { subjectId, questionNumber });
  
      const response = await axios.delete('http://localhost:5000/quizes', {
        params: {
          subjectId,
          number: questionNumber,
        },
      });
  
      console.log('Delete response:', response.data);
      setQuestions((prevQuestions) => prevQuestions.filter((question) => question.number !== questionNumber));
    } catch (error: any) {
      console.error('Error deleting question:', error.response ? error.response.data : error.message);
    }
  };
  
  

  // Handle edit question
  const handleEditQuestion = (question: Question) => {
    setEditMode(true);
    setCurrentQuestion(question);
  };

  // Handle save edited question
  const handleSaveQuestion = async () => {
    try {
      if (currentQuestion) {
        const response = await axios.put(`http://localhost:5000/quizes`, {
          id: currentQuestion.id,
          questionData: currentQuestion,
          subjectId: selectedSubjectId,
        });
        setQuestions((prevQuestions) => prevQuestions.map((q) => (q.number === currentQuestion.number ? currentQuestion : q)));
        setEditMode(false);
        setCurrentQuestion(null);
      }
    } catch (error) {
      console.error('Error saving question:', error);
    }
  };
  
  

  return (
    <>
      <div className="bg-orange-200 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-gray-100 dark:bg-slate-800">
          <div className="mb-4 md:mb-0">
            <h1 className="text-xl font-bold text-white">Welcome Admin</h1>
          </div>
          <Link className="text-white hover:text-blue-500" href="/admin">
            Go To Admin Page
          </Link>
          <button
            onClick={handleLogout}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4 md:mt-0"
          >
            Logout
          </button>
        </div>
        <div className="mb-4 p-4">
          {/* Select Subject Section */}
          <div className="shadow-md mb-4 p-4 bg-white rounded">
            <h1 className="mb-2 font-semibold text-lg">Select Subject:</h1>
            <select
              value={selectedSubjectId || ''}
              onChange={handleSubjectChange}
              className="block w-full md:w-1/2 p-2 border rounded"
            >
              <option value="">Select a subject</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </div>
          <div className="mt-5">
            <h1 className="text-lg font-semibold">Questions</h1>
            <div className="space-y-4">
              {questions.map((item) => (
                <div key={item.number} className="p-4 bg-slate-200 shadow-md rounded-md">
                  <h2 className="font-semibold">{item.question}</h2>
                  <ul className="list-disc pl-5">
                    {Object.entries(item.options).map(([key, value]) => (
                      <li key={key}>
                        <span className="font-bold">{key}:</span> {value}
                      </li>
                    ))}
                  </ul>
                  <p><strong>Answer:</strong> {item.answer}</p>
                  <p><strong>Marks:</strong> {item.marks}</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleDeleteQuestion(selectedSubjectId, item.number)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleEditQuestion(item)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Question Modal */}
      {editMode && currentQuestion && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Edit Question</h2>
            <label className="block mb-2">
              Question:
              <input
                type="text"
                value={currentQuestion.question}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                className="block w-full p-2 border rounded"
              />
            </label>
            {Object.entries(currentQuestion.options).map(([key, value]) => (
              <label key={key} className="block mb-2">
                Option {key}:
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setCurrentQuestion({ 
                    ...currentQuestion, 
                    options: { ...currentQuestion.options, [key]: e.target.value } 
                  })}
                  className="block w-full p-2 border rounded"
                />
              </label>
            ))}
            <label className="block mb-2">
              Answer:
              <input
                type="text"
                value={currentQuestion.answer}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, answer: e.target.value })}
                className="block w-full p-2 border rounded"
              />
            </label>
            <label className="block mb-2">
              Marks:
              <input
                type="number"
                value={currentQuestion.marks}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, marks: parseInt(e.target.value, 10) })}
                className="block w-full p-2 border rounded"
              />
            </label>
            <button
              onClick={handleSaveQuestion}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
