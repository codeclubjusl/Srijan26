import React from 'react'

function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center gap-12 h-[60vh] w-full'>
      <h1 className='text-7xl font-bold'>404</h1>
      <h2 className='text-2xl'>The resource you were looking for could not be found.</h2>
    </div>
  )
}

export default NotFound