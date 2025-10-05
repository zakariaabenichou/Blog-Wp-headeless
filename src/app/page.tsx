// src/app/page.tsx
// Import the new function
import { getAllRecipesForHome, getFeaturedRecipes, getAllCategories } from '@/lib/api'; 
import RecipeList from '@/components/RecipeList'; // Import our new client component
import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
  // Fetch all three data sets in parallel
  const [initialRecipesData, featuredRecipes, allCategories] = await Promise.all([
  getAllRecipesForHome(), 
  getFeaturedRecipes(),
  getAllCategories()
]);

  const heroRecipe = featuredRecipes?.[0];

  return (
    <main className="bg-light-gray">
       {/* --- NEW HERO SECTION --- */}
      {heroRecipe && (
        <section className="relative bg-[url('http://localhost:8000/wp-content/uploads/2025/09/cover-recipes-background-dishes-to-learn.jpg')] bg-cover bg-center mb-12">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-1 gap-0 items-center">
              {/* Hero Content */}
              <div className="px-60 p-8 item-center text-center md:text-center bg-black/50">
                <p className="text-accent font-semibold uppercase tracking-widest text-sm mb-2">Featured Recipe</p>
                <h1 className="text-4xl lg:text-5xl font-serif font-bold text-white mb-4">
                  {heroRecipe.title}
                </h1>
                  <div
                    className="text-white mb-6 line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: heroRecipe.recipeFields.summary }}
                    />  
                
                <Link 
                  href={`/recipes/${heroRecipe.slug}`}
                  className="inline-block bg-accent text-white font-bold py-3 px-6 rounded-lg hover:bg-accent-hover transition-colors"
                >
                  View Recipe
                </Link>
              </div>
          </div>
        </section>
      )}

      {/* --- NEW BROWSE BY CATEGORY SECTION --- */}
      {allCategories && allCategories.length > 0 && (
        <section className="container mx-auto py-12 px-4 sm:px-6 lg:p-8">
          <h2 className="text-4xl font-serif font-bold mb-8 text-center">
                  Sourdough Bread and Discard Baking Recipes          </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 h-64">
              {allCategories.map((category: any) => (
                <Link 
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className="relative rounded-lg overflow-hidden group"
                >
                  {/* Background Image - THE FIX IS HERE */}
                  <Image
                    src={category.categoryFields.categoryImage.node.sourceUrl} 
                    alt={`Category image for ${category.name}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="transition-transform duration-300 group-hover:scale-110 hover:blur-sm"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-white text-2xl font-bold drop-shadow-lg text-center">
                    {category.name}
                  </h3>
                </div>
                  {/* ...the rest of the component is the same... */}
                </Link>
              ))}
            </div>
        </section>
      )}

      {/* Latest Recipes Section (No changes here) */}
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:p-8">
        <h2 className="text-4xl font-serif font-bold mb-8 text-center">
          Latest Recipes
        </h2>
        <div className="gap-8">
            <RecipeList initialRecipes={initialRecipesData} />

        </div>
      </div>
    </main>
  );
}