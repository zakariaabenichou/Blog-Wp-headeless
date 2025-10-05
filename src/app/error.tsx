// src/app/error.tsx
'use client'; // Error components must be Client Components.

import { useEffect } from 'react';

type ErrorProps = {
  error: Error;
  reset: () => void; // A function provided by Next.js to try and re-render the page.
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // In a real application, you would log the error to a service like Sentry or LogRocket.
    console.error(error);
  }, [error]);

  return (
    <main className="container mx-auto py-12 px-4 sm:px-6 lg:p-8 text-center">
      <h1 className="text-4xl font-serif font-bold mb-4 text-text-main">
        Something Went Wrong!
      </h1>
      <p className="text-text-light mb-8">
        We couldn't load the page you were looking for. Please try again.
      </p>
      <button
        onClick={() => reset()}
        className="bg-accent text-white font-bold py-3 px-6 rounded-lg hover:bg-accent-hover transition-colors"
      >
        Try Again
      </button>
    </main>
  );
}