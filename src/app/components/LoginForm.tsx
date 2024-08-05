"use client"
import { signOut, useSession } from 'next-auth/react';
import React, { FormEvent } from 'react'
import { FcGoogle } from 'react-icons/fc';
import { doSocialLogin } from '../action';

const LoginForm = () => {

  const {data:session} = useSession();
  if(session && session.user){
    return (
      
      <div className='flex gap-4 ml-auto'>
        <p className='text-sky-600'> {session.user.name}</p>
        <button onClick={()=> signOut()} className='text-red-600'>
          SignOut
        </button>
        </div>
    )
  }
  const handleLogin = async (provider: string, event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('action', provider);
    await doSocialLogin(formData);
  };
  return (
    <div  
    onClick={(event) => handleLogin('google', event)}
  >
    <div className="button google-set hover:bg-green-600 flex items-center gap-7 border border-white justify-center p-2 rounded-md"><FcGoogle size={30} /> <span className='text-white'>SignIn with Google</span></div>
   
  </div>
  )
}

export default LoginForm
