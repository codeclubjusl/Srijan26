'use client';

import { signOut } from 'next-auth/react'
import React from 'react'

function Dashboard() {
  const handleLogout = () => {
    signOut({
      redirectTo: "/signin"
    });
  }
  return (
    <div className='flex flex-col items-center p-12 gap-8 font-jetbrains-mono'>
      <h1 className='text-5xl font-semibold'>Dashboard </h1>
      <button className='rounded-xs bg-white px-2 py-1 text-black transition-colors duration-300 hover:bg-white/90 active:bg-white/60' onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Dashboard