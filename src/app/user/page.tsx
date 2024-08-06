"use client"
import axios from 'axios';
import Link from 'next/link'
import React, { ChangeEvent, useEffect, useState } from 'react'

interface Question {
  id: number;
  question: string;
  options: {
    [key: string]: string;
  };
  answer: string;
  marks: number;
}

const QuizPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("HTML");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [totalMarks, setTotalMarks] = useState<number>(0);

  // API call for questions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Question[]>(`http://localhost:5000/${selectedCategory.toLowerCase()}`);
        setQuestions(response.data);
        setCurrentQuestion(0);  // Reset to the first question
        setSelectedOptions({});  // Reset selected options
        setIsSubmitted(false);  // Reset submission state
        setTotalMarks(0);  // Reset total marks
        console.log("Admin Questions fetch:", response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedCategory]);

  // category
  const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedCategory(e.target.value);
  };
// handle options
  const handleOptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedOptions({
      ...selectedOptions,
      [currentQuestion]: e.target.value,
    });
  };
// next question
  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
// previous question
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
// restart the quiz
  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOptions({});
    setIsSubmitted(false);
    setTotalMarks(0);
  };
// handle submit
  const handleSubmitQuiz = () => {
    let marks = 0;
    questions.forEach((question, index) => {
      if (selectedOptions[index] === question.answer) {
        marks += question.marks;
      }
    });
    setTotalMarks(marks);
    setIsSubmitted(true);
  };

  return (
    <>
      <div className='bg-green-200 min-h-screen'>
        <div className="flex flex-col md:flex-row justify-between p-4 bg-gray-100 dark:bg-gray-800">
          <div className="mb-4 md:mb-0">
            <h1 className="text-xl font-bold text-white">Welcome user</h1>
          </div>
          <Link className="text-white hover:text-blue-500" href="/"> Go To Home Page</Link>
          <div>
            <Link href="/userlogin" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" > Logout</Link>
          </div>
        </div>

        <div className='flex justify-center mt-4'>
          <h1 className='font-bold text-lg text-red-500'>Quiz</h1>
        </div>

        <div className='flex justify-center mt-5'>
          <h1 className="mb-2 font-semibold text-lg text-blue-600">Select Category:</h1>
        </div>

        <div className="flex justify-center gap-4 mb-4">
          {["HTML", "CSS", "React"].map((category) => (
            <label key={category} className="flex items-center">
              <input
                type="radio"
                value={category}
                checked={selectedCategory === category}
                onChange={handleCategoryChange}
                className="mr-2"
              />
              {category}
            </label>
          ))}
        </div>

        {questions.length > 0 && (
          <div className="p-4">
            <h2 className="text-xl mb-4">{currentQuestion + 1}. {questions[currentQuestion].question}</h2>
            <div className="mb-4">
              {Object.entries(questions[currentQuestion].options).map(([key, option]) => (
                <label key={key} className="block mb-2">
                  <input type="radio" value={option} checked={selectedOptions[currentQuestion] === option} onChange={handleOptionChange} className="mr-2" />{option}
                </label>
              ))}
            </div>

            <div className="flex justify-between mb-4">
              <button onClick={handlePreviousQuestion} disabled={currentQuestion === 0} className="p-1 bg-blue-500 text-white rounded disabled:bg-gray-400">
                Previous
              </button>
              <button onClick={handleNextQuestion} disabled={currentQuestion === questions.length - 1} className="p-1 bg-blue-500 text-white rounded disabled:bg-gray-400">
                Next
              </button>
            </div>

            {isSubmitted && (
              <div className="mb-4">
                <h3 className="text-xl text-black">You scored {totalMarks} out of {questions.reduce((total, question) => total + question.marks, 0)}!</h3>
              </div>
            )}

            <div className="flex justify-between">
              <button onClick={handleSubmitQuiz} className="p-1 bg-green-600 text-white rounded" disabled={Object.keys(selectedOptions).length !== questions.length}>Submit </button>
              <button onClick={handleRestartQuiz} className="p-1 bg-red-600 text-white rounded">Restart Quiz</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default QuizPage;
