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
}

const Page: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("HTML");
  const [questions, setQuestions] = useState<Question[]>([]);
  const router = useRouter();

  // logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/adminlogin");
  };

  // API call to fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Question[]>(
          `http://localhost:5000/${selectedCategory.toLowerCase()}`
        );
        setQuestions(response.data);
        console.log("Admin Questions fetch :", response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedCategory]);

  // to handle the category
  const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between p-4 bg-gray-100 dark:bg-gray-800">
        <div className="mb-4 md:mb-0">
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
        <h1 className="mb-2 font-semibold text-lg">Select Category:</h1>
        <div className="flex gap-4">
          {["HTML", "CSS", "React"].map((category) => (
            <label key={category}>
              <input
                type="radio"
                value={category}
                checked={selectedCategory === category}
                onChange={handleCategoryChange}
              />
              {category}
            </label>
          ))}
        </div>
        <div className="mt-5">
          <h1 className="text-lg font-semibold">Questions</h1>
          <div className="space-y-4">
            {questions.map((item) => (
              <div key={item.id} className="p-4 bg-white shadow-md rounded-md">
                <h2 className="font-semibold">{item.question}</h2>
                <ul className="list-disc pl-5">
                  {Object.entries(item.options).map(([key, value]) => (
                    <li key={key}>
                      <span className="font-bold">{key}:</span> {value}
                    </li>
                  ))}
                  {/* <ul>
  <li key="optionA">
    <span className="font-bold">optionA:</span> Value A
  </li>
  <li key="optionB">
    <span className="font-bold">optionB:</span> Value B
  </li>
</ul> */}
                </ul>
                <p className="mt-2">
                  Answer: <span className="font-bold">{item.answer}</span>
                </p>
                <p className="mt-1">Marks: {item.marks}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
