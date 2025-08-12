import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <div className='px-20 pt-4 flex justify-between items-center'>
        <div className='text-2xl font-bold'>TaskNest</div>
        <div className='flex space-x-4'>
            <ul className='flex space-x-4'>
                <Link className='hover:text-blue-500 cursor-pointer' href='/'>Home</Link>
                <Link className='hover:text-blue-500 cursor-pointer' href='/completed'>Completed</Link>
                <Link className='hover:text-blue-500 cursor-pointer' href='/pending'>Pending</Link>
                
            </ul>
        </div> 
    </div>
  )
}

export default Navbar