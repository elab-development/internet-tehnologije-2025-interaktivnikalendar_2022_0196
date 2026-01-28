"use client"
import Link from 'next/link'
import React from 'react'
import { FiCalendar } from 'react-icons/fi'
import { usePathname } from 'next/navigation'

const Navbar = () => {

    const pathname = usePathname()

    const linkClass = (path: string) =>
    pathname === path
      ? 'bg-pink-500 text-white px-4 py-2 rounded-full'
      : 'hover:bg-pink-100 hover:text-pink-600 px-4 py-2 rounded-full transition'


  return (
    <nav className='w-full flex justify-center mt-10'>
       
        {/*navbar kapsula */}
        <div className='bg-white rounded-full shadow-lg px-8 py-3 flex items-center gap-8'>
        <Link href="/" className="flex items-center gap-2 text-gray-700 font-semibold">
          <FiCalendar className="text-xl" />
          Interaktivni kalendar
        </Link>
        <ul className="flex items-center gap-2 text-sm font-medium text-gray-500">
          <li>
            <Link href="/" className={linkClass('/')}>
              Početna
            </Link>
          </li>

          <li>
            <Link href="/kalendar" className={linkClass('/kalendar')}>
              Kalendar
            </Link>
          </li>

          <li>
            <Link href="/o-nama" className={linkClass('/o-nama')}>
              O nama
            </Link>
          </li>
        </ul>

        </div>
    </nav>

  )
}

export default Navbar