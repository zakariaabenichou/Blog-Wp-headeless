'use client';

    import { useState, useEffect } from 'react'; // Import useEffect
    import { getAllRecipesForHome } from '@/lib/api';
    import RecipeCard from './RecipeCard';

    export default function RecipeList({ initialRecipes }: { initialRecipes: any }) {
      // --- THE FIX IS HERE ---
      // We now safely initialize state, providing fallback values if initialRecipes is null or undefined.
      const [recipes, setRecipes] = useState(initialRecipes?.nodes || []);
      const [cursor, setCursor] = useState(initialRecipes?.pageInfo?.endCursor || '');
      const [hasNextPage, setHasNextPage] = useState(initialRecipes?.pageInfo?.hasNextPage || false);
      const [isLoading, setIsLoading] = useState(false);

      // This useEffect will handle cases where the initial prop might change.
      useEffect(() => {
        setRecipes(initialRecipes?.nodes || []);
        setCursor(initialRecipes?.pageInfo?.endCursor || '');
        setHasNextPage(initialRecipes?.pageInfo?.hasNextPage || false);
      }, [initialRecipes]);


      async function loadMoreRecipes() {
        setIsLoading(true);
        const moreRecipesData = await getAllRecipesForHome(cursor);
        
        setRecipes([...recipes, ...(moreRecipesData?.nodes || [])]);
        setCursor(moreRecipesData?.pageInfo?.endCursor || '');
        setHasNextPage(moreRecipesData?.pageInfo?.hasNextPage || false);
        setIsLoading(false);
      }

      // If there are no recipes at all, show a message.
      if (recipes.length === 0) {
        return <p className="text-center text-text-light">No recipes posted yet.</p>;
      }

      return (
        <>
          <div className="grid grid-cols-3 gap-8">
            {recipes.map((recipe: any) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

          {hasNextPage && (
            <div className="text-center mt-12">
              <button
                onClick={loadMoreRecipes}
                disabled={isLoading}
                className="bg-accent text-white font-bold py-3 px-8 rounded-lg hover:bg-accent-hover transition-colors disabled:bg-gray-400"
              >
                {isLoading ? 'Loading...' : 'Load More Recipes'}
              </button>
            </div>
          )}
        </>
      );
    }