'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import {HiX, HiMenu} from 'react-icons/hi'
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='md:px-10 pt-4 flex justify-between items-center'>
        <div className='text-xl md:text-2xl font-bold'>TaskNest</div>
        
            <ul className='hidden md:flex space-x-4'>
                <Link className='hover:text-blue-500 cursor-pointer' href='/'>Home</Link>
                <Link className='hover:text-blue-500 cursor-pointer' href='/completed'>Completed</Link>
                <Link className='hover:text-blue-500 cursor-pointer' href='/pending'>Pending</Link>   
            </ul>

        <div className='md:hidden cursor-pointer' onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <HiX className='text-xl'/> : <HiMenu className='text-xl'/>}
        </div>

        {isOpen && (
          <ul className='absolute top-16 left-0 w-full h-full bg-gray-100 shadow-lg flex flex-col items-center space-y-4 py-4 md:hidden'>
            <Link className='hover:text-blue-500 cursor-pointer' href='/' onClick={() => setIsOpen(false)}>Home</Link>
            <Link className='hover:text-blue-500 cursor-pointer' href='/completed' onClick={() => setIsOpen(false)}>Completed</Link>
            <Link className='hover:text-blue-500 cursor-pointer' href='/pending' onClick={() => setIsOpen(false)}>Pending</Link>
          </ul>
        )}

    </div>
  )
}

export default Navbar