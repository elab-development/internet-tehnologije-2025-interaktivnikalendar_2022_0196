"use client"
import Link from 'next/link'
import React from 'react'
import { FiCalendar, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className='w-full bg-white border-t border-pink-200'>
      <div className='max-w-6xl mx-auto px-8 py-6'>
        
        {/*Glavni deo - 2 kolone*/}
        <div className='flex flex-col md:flex-row justify-between items-start gap-8 mb-4'>
          
          {/* Kolona 1: Logo i opis */}
          <div className='max-w-md'>
            <Link href="/" className='flex items-center gap-2 text-gray-700 font-semibold mb-2'>
              <FiCalendar className="text-lg text-pink-500" />
              <span className='text-base'>Interaktivni kalendar</span>
            </Link>
            <p className='text-gray-600 text-xs leading-relaxed'>
              Organizujte svoje događaje, proslave i važne datume na jednom mestu.
            </p>
          </div>

          {/* Kolona 2: Kontakt */}
          <div className='flex flex-col items-center md:items-start'>
            <h3 className='font-semibold text-gray-800 mb-2 text-sm'>Kontaktirajte nas</h3>
            <ul className='space-y-1.5'>
              <li className='flex items-center gap-2 text-xs text-gray-600'>
                <FiMail className='text-pink-500 flex-shrink-0' size={14} />
                <a href="mailto:info@interaktivnikalendar.rs" className='hover:text-pink-500 transition'>
                  info@interaktivnikalendar.rs
                </a>
              </li>
              <li className='flex items-center gap-2 text-xs text-gray-600'>
                <FiPhone className='text-pink-500 flex-shrink-0' size={14} />
                <a href="tel:+381601234567" className='hover:text-pink-500 transition'>
                  +381 60 123 4567
                </a>
              </li>
              <li className='flex items-center gap-2 text-xs text-gray-600'>
                <FiMapPin className='text-pink-500 flex-shrink-0' size={14} />
                <span>Beograd, Srbija</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className='border-t border-gray-200 pt-3'>
          <p className='text-center text-gray-500 text-xs'>
            © {new Date().getFullYear()} Interaktivni kalendar
          </p>
        </div>

      </div>
    </footer>
  )
}

export default Footer