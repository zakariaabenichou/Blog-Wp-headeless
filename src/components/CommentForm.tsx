// src/components/CommentForm.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

// Update the API function to reflect the new parent/child communication
async function submitComment(postId: number, author: string, authorEmail: string, content: string) {
    const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, author, authorEmail, content }),
    });
    return response.json();
}

type CommentFormProps = {
    postId: number;
    // This function allows the form to send the new comment data back up to the Comments component
    onCommentSubmitted: (newComment: any) => void;
};

export default function CommentForm({ postId, onCommentSubmitted }: CommentFormProps) {
    const [author, setAuthor] = useState('');
    const [authorEmail, setAuthorEmail] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const result = await submitComment(postId, author, authorEmail, content);
            if (result.success) {
                setStatus('success');
                setMessage('Thanks! Your comment is awaiting moderation.');
                
                // --- OPTIMISTIC UI LOGIC ---
                // Create a temporary comment object to display instantly
                const newComment = {
                  id: `temp-${Date.now()}`, // Temporary ID
                  content: `<p>${content}</p>`, // Wrap in <p> tag to match WP format
                  date: new Date().toISOString(),
                  author: {
                    node: {
                      name: author,
                      avatar: { url: '/default-avatar.png' } // A placeholder avatar
                    }
                  },
                  isPending: true, // A flag to style it differently
                };
                onCommentSubmitted(newComment); // Send the new comment to the parent
                
                // Clear the form
                setAuthor('');
                setAuthorEmail('');
                setContent('');
            } else {
                setStatus('error');
                setMessage(result.data?.message || 'There was an error.');
            }
        } catch (error) {
            setStatus('error');
            setMessage('An unexpected error occurred.');
        }
    };

    if (status === 'success') {
        return (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-green-100 text-green-800 rounded-md text-center">
                <p className="font-bold">{message}</p>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-light-gray p-6 rounded-lg">
            <p className="font-serif font-bold text-xl text-text-main">Leave a Reply</p>
            <p className="text-sm text-text-light">Your email address will not be published.</p>
            <div>
                <label htmlFor="comment" className="sr-only">Comment</label>
                <textarea id="comment" value={content} onChange={(e) => setContent(e.target.value)} required rows={5} placeholder="Your comment..." className="w-full rounded-md border-gray-300 focus:ring-accent focus:border-accent shadow-sm" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="author" className="sr-only">Name</label>
                    <input type="text" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} required placeholder="Your Name" className="w-full rounded-md border-gray-300 focus:ring-accent focus:border-accent shadow-sm" />
                </div>
                <div>
                    <label htmlFor="email" className="sr-only">Email</label>
                    <input type="email" id="email" value={authorEmail} onChange={(e) => setAuthorEmail(e.target.value)} required placeholder="Your Email" className="w-full rounded-md border-gray-300 focus:ring-accent focus:border-accent shadow-sm" />
                </div>
            </div>
            {status === 'error' && <p className="text-red-600 text-sm">{message}</p>}
            <button type="submit" disabled={status === 'loading'} className="bg-accent text-white font-bold py-3 px-6 rounded-lg hover:bg-accent-hover transition-colors disabled:bg-gray-400 w-full sm:w-auto">
                {status === 'loading' ? 'Submitting...' : 'Post Comment'}
            </button>
        </form>
    );
}