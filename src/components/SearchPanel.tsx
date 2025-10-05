// src/components/SearchPanel.tsx
'use client';

import { FiSearch, FiX } from 'react-icons/fi';
// 1. Import motion and AnimatePresence from framer-motion
import { motion, AnimatePresence } from 'framer-motion';

type SearchPanelProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SearchPanel({ isOpen, onClose }: SearchPanelProps) {
  // 2. AnimatePresence allows components to animate out when they are removed from the tree.
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose} // Close panel when clicking the backdrop
            className="fixed inset-0 z-40 bg-black/25 backdrop-blur flex item-justify justify-center" 
          />

          {/* The Search Panel itself */}
          <motion.div
            // 3. Define the animation variants
            variants={{
              open: { y: 0 }, // 'y' is the vertical position
              closed: { y: "-100%" },
            }}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 right-0 bg-white shadow-xl z-50 p-8"
          >
            <div className="container mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-serif font-bold text-text-main">
                  Search Recipes
                </h2>
                <button onClick={onClose} aria-label="Close search">
                  <FiX className="h-6 w-6 text-text-light" />
                </button>
              </div>
              
              <form action="/search" method="GET" className="relative">
                <input
                  type="text"
                  name="q"
                  placeholder="e.g., Fluffy Pancakes"
                  required
                  autoFocus
                  className="w-full text-2xl py-4 pl-6 pr-14 rounded-lg border-gray-300 focus:ring-accent focus:border-accent"
                />
                <button
                  type="submit"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-accent"
                  aria-label="Submit search"
                >
                  <FiSearch className="h-6 w-6" />
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}