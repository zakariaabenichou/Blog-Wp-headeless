// src/app/search/page.tsx
import { searchRecipes } from "@/lib/api";
import RecipeCard from "@/components/RecipeCard";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams; // must await
  const searchTerm = q ?? "";

  let recipes: any[] = [];
  try {
    recipes = searchTerm ? await searchRecipes(searchTerm) : [];
  } catch (err) {
    console.error("Search failed:", err);
  }

  return (
    <main className="bg-light-gray min-h-screen">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif font-bold mb-8 text-center text-text-main">
          Search Results{" "}
          {searchTerm && (
            <>
              for: <span className="text-accent">"{searchTerm}"</span>
            </>
          )}
        </h1>

        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe: any) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <p className="text-center text-text-light">
            {searchTerm
              ? "Sorry, no recipes found matching your search. Please try another keyword."
              : "Please enter a search term."}
          </p>
        )}
      </div>
    </main>
  );
}
