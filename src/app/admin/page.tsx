"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Admin = () => {
  const [question, setQuestion] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [answer, setAnswer] = useState('');
  const [marks, setMarks] = useState('');
  const [subject, setSubject] = useState('');
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch('http://localhost:5000/quizes');
        const data = await response.json();
        const filteredSubjects = data.filter((item: any) => item.name);
        setSubjects(filteredSubjects);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };
  
    fetchSubjects();
  }, []);
  

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/adminlogin');
  };

  const handleSubjectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedSubjectId = e.target.value;
    setSubjectId(selectedSubjectId);
  };

  const handleAddSubject = async () => {
    const newSubject = { name: subject };

    try {
      const response = await fetch('http://localhost:5000/quizes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSubject)
      });

      if (response.ok) {
        alert('Subject added successfully!');
        setSubject('');
        router.refresh();
      } else {
        alert('Failed to add subject.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding the subject.');
    }
  };

  const handleSubmit = async () => {
    if (!question || !optionA || !optionB || !optionC || !optionD || !answer || !marks || !subjectId) {
      alert('Please fill out all fields');
      return;
    }

    const questionData = {
      number: Date.now(),
      question,
      options: { a: optionA, b: optionB, c: optionC, d: optionD },
      answer,
      marks
    };

    const data = {
      questionData,
      subjectId
    };

    try {
      const response = await fetch('http://localhost:5000/quizes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
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
        alert('Failed to save the question: ' + errorText);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while saving the question.');
    }
  };

  return (
    <>
      <div className="bg-sky-200">
        <div className="flex flex-col md:flex-row justify-between p-4 bg-gray-100 dark:bg-gray-800">
          <div className="mb-4 md:mb-0">
            <h1 className="text-xl font-bold text-white">Welcome Admin</h1>
          </div>
          <Link className="text-white hover:text-blue-500" href="/adminquestions">Go To Questions</Link>
          <div>
            <button
              onClick={handleLogout}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Add Subject Section */}
        <div className="shadow-md mb-4">
          <div className="m-2">
            <div className="flex gap-4 mb-1">
              <h1 className="mb-2 font-semibold text-lg">Add Subject :</h1>
              <input 
                type="text" 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)} 
                className="block w-1/2 p-2 border rounded m-2" 
              />
              <button
                onClick={handleAddSubject}
                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
              >
                Add Subject
              </button>
            </div>
          </div>
        </div>

        {/* Select Subject Section */}
        <div className="shadow-md mb-4">
          <h1 className="mb-2 font-semibold text-lg">Select Subject:</h1>
          <select
            value={subjectId || ''}
            onChange={handleSubjectChange}
            className="block w-1/2 p-2 border rounded"
          >
            <option value="">Select a subject</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
        </div>

        {/* Add Questions Section */}
        <div className="shadow-md mb-4">
          <div className="m-2">
            <h1 className="text-lg font-semibold mb-4">Add Questions</h1>
            <label className="block mb-2 font-semibold">Question</label>
            <input
              type="text"
              placeholder="Enter your question"
              className="block w-full p-2 mb-4 border rounded"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <label className="block mb-2 font-semibold">Options</label>
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
            <label className="block mt-4 mb-2 font-semibold">Answer</label>
            <input
              type="text"
              placeholder="Enter the correct answer"
              className="block w-full p-2 mb-4 border rounded"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <label className="block mb-2 font-semibold">Marks</label>
            <input
              type="text"
              placeholder="Enter marks for the question"
              className="block w-full p-2 mb-4 border rounded"
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
            />
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
              Save Question
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
