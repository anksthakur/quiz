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
  number:any;
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
        number: questionNumber
      }
    });
    
    console.log('Delete response:', response.data);
    setQuestions(questions.filter(question => question.number !== questionNumber));
  } catch (error:any) {
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
        await axios.put(`http://localhost:5000/questions/${currentQuestion.id}`, currentQuestion);
        setQuestions(questions.map(q => (q.id === currentQuestion.id ? currentQuestion : q)));
        setEditMode(false);
        setCurrentQuestion(null);
      }
    } catch (error) {
      console.error('Error saving question:', error);
    }
  };

  return (
    <>
      <div className="bg-orange-200">
        <div className="flex flex-col md:flex-row justify-between p-4 bg-gray-100 dark:bg-slate-800">
          <div className="mb-4 md:mb-0 items-center">
            <h1 className="text-xl font-bold text-white">Welcome Admin</h1>
          </div>
          <Link className="text-white hover:text-blue-500" href="/admin">
            Go To Admin Page
          </Link>
          <div>
            <button
              onClick={handleLogout}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Logout
            </button>
          </div>
        </div>
        <div className="mb-4">
          {/* Select Subject Section */}
          <div className="shadow-md mb-4">
            <h1 className="mb-2 font-semibold text-lg">Select Subject:</h1>
            <select
              value={selectedSubjectId || ''}
              onChange={handleSubjectChange}
              className="block w-1/2 p-2 border rounded"
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
))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Question Modal */}
      {editMode && currentQuestion && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
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
            
            <button
              onClick={handleSaveQuestion}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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