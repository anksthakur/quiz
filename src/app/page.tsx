import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome to Quiz App</h1>
      </div>
    </>
  );
}
