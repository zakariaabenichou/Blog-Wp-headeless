// src/app/recipes/page.tsx
import { getAllRecipesForHome } from '@/lib/api';
import RecipeList from '@/components/RecipeList'; // Import our interactive list component
import { Metadata } from 'next';

// Add metadata for better SEO on this page
export const metadata: Metadata = {
  title: 'All Recipes | Foodie Fusion',
  description: 'Browse all the delicious recipes available on Foodie Fusion.',
};

export default async function RecipesPage() {
  // 1. Fetch the initial page of recipes, just like the homepage.
  // The `getAllRecipesForHome` function is perfectly reusable here.
  const initialRecipes = await getAllRecipesForHome();

  return (
    <main className="bg-light-gray">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:p-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-8 text-center text-text-main">
          All Recipes
        </h1>
        
        {/* 2. Pass the initial data to our existing RecipeList component. */}
        {/* This component already knows how to display the grid and handle "Load More". */}
        <RecipeList initialRecipes={initialRecipes} />
      </div>
    </main>
  );
}