// src/components/ContactForm.tsx
'use client';

import { useForm, ValidationError } from '@formspree/react';

export default function ContactForm() {
  // The useForm hook from Formspree handles form state and submission
  const [state, handleSubmit] = useForm("mqkvpzpa");

  if (state.succeeded) {
    return (
      <div className="p-8 text-center bg-green-100 text-green-800 rounded-lg">
        <h3 className="font-bold text-2xl">Thanks for your message!</h3>
        <p>I'll get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-text-light">
          Your Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-light">
          Your Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent"
        />
        <ValidationError 
          prefix="Email" 
          field="email"
          errors={state.errors}
          className="text-red-600 text-sm mt-1"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-text-light">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent"
        />
        <ValidationError 
          prefix="Message" 
          field="message"
          errors={state.errors}
          className="text-red-600 text-sm mt-1"
        />
      </div>
      <div>
        <button 
          type="submit" 
          disabled={state.submitting}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:bg-gray-400"
        >
          {state.submitting ? 'Sending...' : 'Send Message'}
        </button>
      </div>
    </form>
  );
}