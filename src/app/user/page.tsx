"use client";
import axios from "axios";
import Link from "next/link";
import React, { ChangeEvent, useEffect, useState } from "react";

interface Question {
  id: string;
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
  questionData?: Question[];
  subjectId?: string;
}

const QuizPage = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    null
  );
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: number]: string;
  }>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [totalMarks, setTotalMarks] = useState<number>(0);

  const passingMarks = 15;
  const optionLabels = ["A", "B", "C", "D"]; // Option labels

  // Fetch subjects
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

  // Fetch questions based on selected subject
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get<Subject[]>(
          "http://localhost:5000/quizes"
        );
        console.log("Fetched quizzes:", response.data);

        // Filter and extract questions on the selected subject
        const filteredQuestions = response.data
          .filter(
            (item) => item.subjectId === selectedSubjectId && item.questionData
          )
          .flatMap((item) => item.questionData);

        console.log(
          `Filtered questions for subject: ${selectedSubjectId}`,
          filteredQuestions
        );
        setQuestions(filteredQuestions as Question[]);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    if (selectedSubjectId) {
      fetchQuestions();
    }
  }, [selectedSubjectId]);

  // Handle option change
  const handleOptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedOption = e.target.value;
    setSelectedOptions({
      ...selectedOptions,
      [currentQuestion]: selectedOption,
    });
  };

  // Handle next question
  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // Handle previous question
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Handle restart quiz
  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOptions({});
    setIsSubmitted(false);
    setTotalMarks(0);
  };

  // Handle submit quiz
  const handleSubmitQuiz = () => {
    let calculatedMarks = 0;

    questions.forEach((question, index) => {
      const selectedOption = selectedOptions[index]?.toLowerCase();
      console.log(`Question: ${question.question}`);
      console.log(`Selected Option: ${selectedOption}`);
      console.log(`Correct Answer: ${question.answer}`);
      const questionMarks = typeof question.marks === 'string' ? parseFloat(question.marks) : question.marks;
      if (selectedOption === question.answer.toLowerCase()) {
        console.log(`Correct answer for question ${index + 1}`);
        calculatedMarks += questionMarks;
      }
    });

    console.log(`Total Marks: ${calculatedMarks}`);
    setTotalMarks(calculatedMarks);
    setIsSubmitted(true);
  };

  // Handle subject change
  const handleSubjectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubjectId(e.target.value || null);
  };

  return (
    <>
      <div className="bg-green-100 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between p-4 bg-gray-100 dark:bg-gray-800">
          <div className="mb-4 md:mb-0">
            <h1 className="text-xl font-bold text-white">Welcome user</h1>
          </div>
          <Link className="text-white hover:text-blue-500" href="/">
            Go To Home Page
          </Link>
          <div>
            <Link
              href="/userlogin"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Logout
            </Link>
          </div>
        </div>

        {/* Select Subject Section */}
        <div className="shadow-md mb-4">
          <h1 className="mb-2 font-semibold text-lg">Select Subject:</h1>
          <select
            value={selectedSubjectId || ""}
            onChange={handleSubjectChange}
            className="block w-1/2 p-2 border rounded"
          >
            <option value="">Select a subject</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        {questions.length > 0 && (
          <div className="p-4">
            <div className="mb-4 shadow-md">
              <div className="m-2">
                <h2 className="text-xl ">
                  {currentQuestion + 1}. {questions[currentQuestion].question}
                </h2>
              </div>
            </div>
            <div className="mb-4 shadow-md">
              <div className="m-2">
                {Object.entries(questions[currentQuestion].options).map(
                  ([key, option], index) => (
                    <label key={key} className="block mb-2">
                      <input
                        type="radio"
                        name={`question_${currentQuestion}`}
                        value={key}
                        checked={selectedOptions[currentQuestion] === key}
                        onChange={handleOptionChange}
                        className="mr-2"
                      />
                      {optionLabels[index]}. {option}
                    </label>
                  )
                )}
              </div>
            </div>

            <div className="shadow-md mt-4">
              <div className="m-2">
                <div className="flex justify-between">
                  <button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestion === 0}
                    className="p-1 bg-blue-500 text-white rounded disabled:bg-gray-400"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    disabled={currentQuestion === questions.length - 1}
                    className="p-1 bg-blue-500 text-white rounded disabled:bg-gray-400"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            {isSubmitted && (
              <div className="mb-4">
                <h3
                  className={`text-xl ${
                    totalMarks >= passingMarks
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  Total Marks: {totalMarks} / {questions.length * 5}
                </h3>
              </div>
            )}

            <div className="shadow-md mt-4">
              <div className="flex justify-between m-2">
                <button
                  onClick={handleSubmitQuiz}
                  className="p-1 bg-green-600 text-white rounded"
                  disabled={
                    Object.keys(selectedOptions).length !== questions.length
                  }
                >
                  Submit
                </button>
                <button
                  onClick={handleRestartQuiz}
                  className="p-1 bg-red-600 text-white rounded"
                >
                  Restart Quiz
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default QuizPage;
