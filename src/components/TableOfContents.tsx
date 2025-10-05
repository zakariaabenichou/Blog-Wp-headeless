// src/components/TableOfContents.tsx
'use client';

// 1. Import the Link component from react-scroll
import { Link } from 'react-scroll';

type Heading = {
  id: string;
  text: string;
};

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="border-2 border-dashed border-gray-300 bg-light-gray rounded-lg p-6 my-8">
      <h2 className="text-xl font-serif font-bold text-text-main mb-4">Jump to a Section:</h2>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li key={heading.id}>
            {/* 2. Use the react-scroll Link component */}
            <Link
              to={heading.id} // The ID of the <h2> we want to scroll to
              spy={true}
              smooth={true}
              offset={-100} // Offset to account for the sticky header
              duration={500}
              className="text-accent hover:underline cursor-pointer"
              activeClass="font-bold" // Style for the active link
            >
              {heading.text}
            </Link>
          </li>
        ))}
        {/* You can also add static links */}
        <li>
            <Link to="recipe-block" smooth={true} offset={-100} duration={500} className="text-accent hover:underline cursor-pointer">
                Jump to Recipe
            </Link>
        </li>
      </ul>
    </div>
  );
}