// src/components/RecipeCard.tsx
import Image from 'next/image';
import Link from 'next/link';

type RecipeCardProps = {
  recipe: {
    slug: string;
    title: string;
    featuredImage: {
      node: {
        sourceUrl: string;
      };
    };
    categories: {
      nodes: {
        name: string;
        slug: string;
      }[];
    };
    recipeFields: {
      summary: string;
    };
  };
};

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const firstCategory = recipe.categories.nodes[0];

  return (
    // The article tag is now the main container, not a Link
    <article className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group flex flex-col">
      
      {/* --- LINK 1: Image and Title --- */}
      {/* This link wraps the main clickable area and grows to fill space */}
      <Link href={`/recipes/${recipe.slug}`} className="flex-grow">
        <div className="relative h-64 w-full">
          <Image
            src={recipe.featuredImage?.node.sourceUrl}
            alt={`Image for ${recipe.title}`}
            fill
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-6 text-center">
          <h2 className="text-2xl font-serif font-bold text-text-main mt-2 mb-3 line-clamp-5">
            {recipe.title}
          </h2>
          
        </div>
      </Link>

      {/* --- LINK 2: Category (Now a sibling, not a child) --- */}
      {/* This div is outside the main link, containing the category link */}
      {firstCategory && (
        <div className="p-6 pt-0 border-t border-gray-100 text-center">
          <Link
            href={`/category/${firstCategory.slug}`}
            className="text-sm font-medium text-accent hover:text-accent-hover uppercase tracking-wider transition-colors"
          >
            {firstCategory.name}
          </Link>
        </div>
      )}
    </article>
  );
}