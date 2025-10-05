// src/components/Comments.tsx
'use client'; // This now manages state, so it must be a client component.

import { useState } from 'react';
import Image from 'next/image';
import CommentForm from './CommentForm';
import { motion, AnimatePresence } from 'framer-motion'; // Import animation components

export default function Comments({ comments, postId }: { comments: any, postId: number }) {
  // --- STATE MANAGEMENT ---
  // Initialize the state with the comments passed from the server
  const [commentList, setCommentList] = useState(comments?.nodes || []);

  // This function will be called by the form when a new comment is submitted
  const handleCommentSubmitted = (newComment: any) => {
    setCommentList(prevComments => [newComment, ...prevComments]); // Add the new comment to the top of the list
  };

  return (
    <section className="mt-12 border-t pt-8">
      <h2 className="text-3xl font-serif font-bold text-text-main mb-6">
        {commentList.length} {commentList.length === 1 ? 'Comment' : 'Comments'}
      </h2>

      {/* Render the Comment Form, passing the handler function */}
      <div className="mb-8">
        <CommentForm postId={postId} onCommentSubmitted={handleCommentSubmitted} />
      </div>

      {/* The animated list of comments */}
      <div className="space-y-6">
        <AnimatePresence>
          {commentList.map((comment: any) => (
            <motion.div 
              key={comment.id}
              layout // This animates the list when items are added/removed
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start space-x-4 p-4 rounded-md ${comment.isPending ? 'bg-yellow-50 opacity-70' : 'bg-white'}`}
            >
              <Image
                src={comment.author.node.avatar.url}
                alt={comment.author.node.name}
                width={48}
                height={48}
                className="rounded-full shadow-sm"
              />
              <div className="flex-grow">
                <p className="font-bold text-text-main">{comment.author.node.name}</p>
                <p className="text-xs text-gray-500 mb-2">
                  {new Date(comment.date).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                  {comment.isPending && <span className="ml-2 font-semibold text-yellow-600">(Pending moderation)</span>}
                </p>
                <div
                  className="prose max-w-none text-text-light"
                  dangerouslySetInnerHTML={{ __html: comment.content }}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}