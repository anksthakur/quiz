import React from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const UserLogout = () => {
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem('user');
    Cookies.remove('username'); 
    Cookies.remove('authToken'); 
    router.push('/login');
  };
  return (
    <div>
      <button
        onClick={handleLogout}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Logout
      </button>
    </div>
  );
};

export default UserLogout;