// src/app/category/[slug]/page.tsx
import { getRecipesByCategory } from '@/lib/api';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import RecipeCard from '@/components/RecipeCard'; 

type PageProps = {
  params: {
    slug: string;
  };
};

// --- Add dynamic metadata to the category page ---
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { categoryName } = await getRecipesByCategory(params.slug);
    if (!categoryName) {
        return { title: 'Category not found' };
    }
    return {
        title: `Category: ${categoryName} | Foodie Fusion`,
        description: `Browse all recipes in the ${categoryName} category.`
    };
}


export default async function CategoryPage({ params }: PageProps) {
  const { recipes, categoryName } = await getRecipesByCategory(params.slug);

  if (!categoryName) {
    notFound();
  }

  return (
    <main className="bg-light-gray">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:p-8 ">
        <h1 className="text-4xl font-serif font-bold mb-8 text-center text-text-main">
          Category: <span className="text-accent">{categoryName}</span>
        </h1>

        {recipes && recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe: any) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <p className="text-center text-text-light">
            No recipes found in this category yet.
          </p>
        )}
      </div>
    </main>
  );
}