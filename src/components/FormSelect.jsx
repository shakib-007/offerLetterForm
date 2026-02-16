import React from 'react';
import { cn } from '../lib/utils';
import { AlertCircle, ChevronDown } from 'lucide-react';

const FormSelect = ({
    label,
    id,
    options = [],
    value,
    onChange,
    error,
    required = false,
    placeholder = "Select an option",
    className,
    ...props
}) => {
    return (
        <div className={cn("flex flex-col gap-1.5", className)}>
            <label
                htmlFor={id}
                className="text-sm font-medium text-slate-700 flex items-center justify-between"
            >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
                <select
                    id={id}
                    value={value}
                    onChange={onChange}
                    className={cn(
                        "flex h-10 w-full appearance-none rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
                        !value && "text-slate-400",
                        error && "border-red-500 focus:ring-red-500",
                        className
                    )}
                    {...props}
                >
                    <option value="" disabled>{placeholder}</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value} className="text-slate-900">
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-slate-500 pointer-events-none" />
            </div>
            {error && (
                <div className="flex items-center gap-1 text-red-500 text-xs mt-1 animate-in slide-in-from-top-1 fade-in duration-200">
                    <AlertCircle size={12} />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
};

export default FormSelect;
