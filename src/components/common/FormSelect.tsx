import React from 'react'

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  required?: boolean
  options: { value: string; label: string }[]
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  error,
  required,
  options,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-600 mb-2">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      <select
        className={`input w-full ${error ? 'border-error focus:ring-error/10' : ''} ${className}`}
        {...props}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  )
}
