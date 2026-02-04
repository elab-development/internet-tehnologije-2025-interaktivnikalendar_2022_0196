"use client";
import Link from 'next/link';
import React from 'react';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: 'login' | 'register' | 'add' | 'edit' | 'delete';
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
}

const Button = ({
    label, 
    onClick , 
    href,
    variant = 'login',
    type = 'button',
    className = '',
    disabled
}:ButtonProps)  => {   //Koristimo definiciju tipova odozgo iz interfejsa 

  const styles = {
    login: "bg-white text-gray-700 hover:bg-pink-50 hover:text-pink-600 shadow-md",
    register: "bg-pink-500 text-white hover:bg-pink-600 shadow-pink-200",
    add: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-200",
    edit: "bg-amber-500 text-white hover:bg-amber-600 shadow-amber-200",
    delete: "bg-red-500 text-white hover:bg-red-600 shadow-red-200"
  };

  const buttonClass = `${styles[variant]} px-6 py-2.5 rounded-full font-semibold shadow-lg transition-all active:scale-95 cursor-pointer ${className}`;

  // Ako je link
  if (href) {
    return (
      <Link href={href} className={buttonClass}>
        {label}
      </Link>
    );
  }

  // Ako je obično dugme
  return (
    <button 
      type={type}  //postavlja tip dugmeta (button, submit, reset)
      onClick={onClick}
      className={buttonClass}
    >
      {label}
    </button>
  );
};




export default Button
