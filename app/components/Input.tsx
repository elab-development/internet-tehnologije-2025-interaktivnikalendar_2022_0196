import React from "react";

type InputProps = {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  className?: string;
  
};

export default function Input({
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
  required,
  className,
}: InputProps) {
  return (
    <div>
      <label className="block text-lg font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className={`p-2 w-full border border-gray-300 focus:border-black focus:border-2 outline-none rounded-md shadow-xs ${className || ""}`}
      />
    </div>
  );
}
