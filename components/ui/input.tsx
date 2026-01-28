'use client';

import * as React from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={
          'w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm transition-colors focus:border-black focus:ring-2 focus:ring-black/10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ' +
          className
        }
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
