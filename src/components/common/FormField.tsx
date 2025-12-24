import React from 'react'

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  required?: boolean
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  required,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-600 mb-2">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      <input
        className={`input w-full ${error ? 'border-error focus:ring-error/10' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  )
}
