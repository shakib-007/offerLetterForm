import React from 'react';
import { cn } from '../lib/utils';
import { AlertCircle } from 'lucide-react';

const FormInput = ({
    label,
    id,
    type = 'text',
    placeholder,
    value,
    onChange,
    error,
    required = false,
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
                <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={cn(
                        "flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
                        error && "border-red-500 focus:ring-red-500",
                        className
                    )}
                    {...props}
                />
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

export default FormInput;
