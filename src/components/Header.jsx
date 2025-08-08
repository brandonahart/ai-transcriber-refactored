import React from "react";

export default function Header() {
    return (
        <header className='flex items-center justify-between mb-4 p-4'>
          <a href='/'>
          <h1 className='font-medium text-white'>Grand<span className='text-green-400 bold'>Scribe</span></h1></a>
          <a href='/' className='flex items-center gap-2 specialBtn px-3 py-1 rounded-lg text-green-400'>
            <p>New</p>
            <i className='fa-solid fa-plus'></i>
          </a>
        </header>
    )
}