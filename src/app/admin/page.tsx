"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Admin = () => {
  const [question, setQuestion] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [answer, setAnswer] = useState('');
  const [marks, setMarks] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('HTML'); // Default category

  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/adminlogin');
  };

  const handleSubmit = async () => {
    const questionData = {
      question,
      options: { A: optionA, B: optionB, C: optionC, D: optionD },
      answer,
      marks
    };

    const endpoint = `http://localhost:5000/${selectedCategory.toLowerCase()}`; // Dynamically create endpoint

    console.log("Submitting data to endpoint:", endpoint);
    console.log("Submitting data:", questionData);

    try {
      const response = await fetch(endpoint, {  
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(questionData)
      });

      console.log("Response status:", response.status);
      console.log("Response URL:", response.url);

      if (response.ok) {
        console.log("Response data:", await response.json());
        alert('Question saved successfully!');
        setQuestion('');
        setOptionA('');
        setOptionB('');
        setOptionC('');
        setOptionD('');
        setAnswer('');
        setMarks('');
      } else {
        const errorText = await response.text();
        console.log("Failed response text:", errorText);
        alert('Failed to save the question.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while saving the question.');
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between p-4 bg-gray-100 dark:bg-gray-800">
        <div className="mb-4 md:mb-0">
          <h1 className="text-xl font-bold text-white">Welcome Admin</h1>
        </div>
        <div>
          <button 
            onClick={handleLogout} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Logout</button>
        </div> 
      </div>
      <div className="p-4">
        <div className="mb-4">
          <h1 className="text-lg font-semibold mb-2">Select Category:</h1>
          <div className="flex gap-4">
            <label>
              <input
                type="radio"
                value="HTML"
                checked={selectedCategory === 'HTML'}
                onChange={(e) => setSelectedCategory(e.target.value)}
              />
              HTML
            </label>
            <label>
              <input
                type="radio"
                value="CSS"
                checked={selectedCategory === 'CSS'}
                onChange={(e) => setSelectedCategory(e.target.value)}
              />
              CSS
            </label>
            <label>
              <input
                type="radio"
                value="React"
                checked={selectedCategory === 'React'}
                onChange={(e) => setSelectedCategory(e.target.value)}
              />
              React
            </label>
          </div>
        </div>
        <h1 className="text-lg font-semibold mb-4">Add Questions</h1>
        
        <label className="block mb-2 font-semibold">Question</label>
        <input 
          type="text" 
          placeholder="Enter your question" 
          className="block w-full p-2 mb-4 border rounded" 
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <div className="flex flex-col gap-4">
          <label className="flex items-center">
            <span className="mr-2 font-semibold">A</span>
            <input 
              type="text" 
              placeholder="Option A" 
              className="block w-full p-2 border rounded"
              value={optionA}
              onChange={(e) => setOptionA(e.target.value)}
            />
          </label>
          <label className="flex items-center">
            <span className="mr-2 font-semibold">B</span>
            <input 
              type="text" 
              placeholder="Option B" 
              className="block w-full p-2 border rounded"
              value={optionB}
              onChange={(e) => setOptionB(e.target.value)}
            />
          </label>
          <label className="flex items-center">
            <span className="mr-2 font-semibold">C</span>
            <input 
              type="text" 
              placeholder="Option C" 
              className="block w-full p-2 border rounded"
              value={optionC}
              onChange={(e) => setOptionC(e.target.value)}
            />
          </label>
          <label className="flex items-center">
            <span className="mr-2 font-semibold">D</span>
            <input 
              type="text" 
              placeholder="Option D" 
              className="block w-full p-2 border rounded"
              value={optionD}
              onChange={(e) => setOptionD(e.target.value)}
            />
          </label>
        </div>
        <div className="mt-4">
          <label className="block mb-2 font-semibold">Correct Answer</label>
          <input 
            type="text" 
            placeholder="Enter the correct answer (A, B, C, or D)" 
            className="block w-full p-2 border rounded"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <label className="block mb-2 font-semibold">Marks</label>
          <input 
            type="text" 
            placeholder="Marks for this question" 
            className="block w-full p-2 border rounded"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
          />
        </div>
        <button 
          onClick={handleSubmit} 
          className="bg-blue-500 text-white p-2 rounded-md mt-4 hover:bg-blue-600"
        >
          Submit
        </button>
      </div>
    </>
  );
};

export default Admin;
