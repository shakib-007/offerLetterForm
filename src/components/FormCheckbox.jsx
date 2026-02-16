import React from 'react';
import { cn } from '../lib/utils';

const FormCheckbox = ({
    label,
    id,
    checked,
    onChange,
    error,
    required = false,
    className,
    ...props
}) => {
    return (
        <div className={cn("flex flex-col gap-1", className)}>
            <div className="flex items-center gap-2">
                <input
                    id={id}
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    className={cn(
                        "h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition duration-150 ease-in-out cursor-pointer",
                        error && "border-red-500"
                    )}
                    {...props}
                />
                <label htmlFor={id} className="text-sm text-slate-700 cursor-pointer select-none">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            </div>
            {error && (
                <p className="text-red-500 text-xs mt-0.5 ml-6">{error}</p>
            )}
        </div>
    );
};

export default FormCheckbox;
