'use client';

import React from 'react';

interface DeleteButtonProps {
  confirmMessage: string;
  className: string;
  children: React.ReactNode;
}

export default function DeleteButton({ confirmMessage, className, children }: DeleteButtonProps) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
      className={className}
    >
      {children}
    </button>
  );
}
