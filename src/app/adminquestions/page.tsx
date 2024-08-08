"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import UserLogout from "../components/UserLogout";

// Define types
interface Question {
  id: number;
  questionData: {
    question: string;
    options: { [key: string]: string };
    answer: string;
    marks: any;
    number: any;
  };
}

interface Subject {
  id: string;
  name: string;
  questionData?: Question;
  subjectId?: any;
}

const Page: React.FC = () => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const router = useRouter();

  // API call to fetch subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get<Subject[]>(
          "http://localhost:5000/quizes"
        );
        console.log("Fetched subjects:", response.data);
        const filteredSubjects = response.data.filter((item) => item.name);
        setSubjects(filteredSubjects);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchSubjects();
  }, []);

  // API call to fetch questions based on the selected subject
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get<Subject[]>(
          "http://localhost:5000/quizes"
        );
        console.log("Fetched quizes:", response.data);
        const filteredQuestions = response.data
          .filter(
            (item) => item.subjectId === selectedSubjectId && item.questionData
          )
          .map((item) => item);
        console.log(
          `Filtered questions for subject: ${selectedSubjectId}`,
          filteredQuestions
        );
        setQuestions(filteredQuestions as any);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    if (selectedSubjectId) {
      fetchQuestions();
    }
  }, [selectedSubjectId]);

  // Handle subject change
  const handleSubjectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubjectId(e.target.value);
    console.log("Selected subject ID:", e.target.value);
  };

  // Handle delete question
  const handleDeleteQuestion = async (id: any) => {
    try {
      console.log('Deleting question with ID:', id);
      const url = `http://localhost:5000/quizes/${id}`;
      console.log('Delete URL:', url);
      const response = await axios.delete(url); 
      console.log('Delete response:', response.data);
      setQuestions(prevQuestions => 
        prevQuestions.filter(question => question.id.toString() !== id)
      );
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
        const response = await axios.put(
          `http://localhost:5000/quizes/${currentQuestion.id}`, // Assuming each question has a unique ID
          {
            questionData: currentQuestion.questionData,
            subjectId: selectedSubjectId,
          }
        );
        console.log('Save response:', response.data);

        setQuestions((prevQuestions) =>
          prevQuestions.map((q) =>
            q.id === currentQuestion.id ? { ...q, questionData: currentQuestion.questionData } : q
          )
        );
        
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
          <UserLogout/>
        </div>
        <div className="mb-4 p-4">
          {/* Select Subject Section */}
          <div className="shadow-md mb-4 p-4 bg-white rounded">
            <h1 className="mb-2 font-semibold text-lg">Select Subject:</h1>
            <select
              value={selectedSubjectId || ""}
              onChange={handleSubjectChange}
              className="block w-full md:w-1/2 p-2 border rounded"
            >
              <option value="">Select a subject</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-5">
            <h1 className="text-lg font-semibold">Questions</h1>
            <div className="space-y-4">
              {questions.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-slate-200 shadow-md rounded-md"
                >
                  <h2 className="font-semibold">{item.questionData.question}</h2>
                  <ul className="list-disc pl-5">
                    {Object.entries(item.questionData.options).map(([key, value]) => (
                      <li key={key}>
                        <span className="font-bold">{key}:</span> {value}
                      </li>
                    ))}
                  </ul>
                  <p>
                    <strong>Answer:</strong> {item.questionData.answer}
                  </p>
                  <p>
                    <strong>Marks:</strong> {item.questionData.marks}
                  </p>
                  <div className="flex gap-2 mt-2">
                    
                    <button
                      onClick={() => handleDeleteQuestion(item.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  
                    <button
                      onClick={() => handleEditQuestion(item)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {editMode && currentQuestion && (
            <div className="mt-5 p-4 bg-white shadow-md rounded-md">
              <h2 className="text-lg font-semibold">Edit Question</h2>
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700">Question:</label>
                <input
                  type="text"
                  value={currentQuestion.questionData.question}
                  onChange={(e) =>
                    setCurrentQuestion({
                      ...currentQuestion,
                      questionData: {
                        ...currentQuestion.questionData,
                        question: e.target.value,
                      },
                    })
                  }
                  className="mt-1 p-2 border rounded w-full"
                />
              </div>
              {/* Add more input fields for options, answer, and marks */}
              <button
                onClick={handleSaveQuestion}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
