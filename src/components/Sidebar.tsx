// src/components/Sidebar.tsx
import Image from 'next/image';
import Link from 'next/link';
import { FiSearch } from 'react-icons/fi';
import { getAllRecipesForHome } from '../lib/api'; 

// A simple Search Form component
function SearchWidget() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-serif font-bold text-text-main mb-4">Search</h3>
      <form action="/search" method="GET" className="relative">
        <input 
          type="text" 
          name="q"
          placeholder="Search recipes..." 
          className="w-full border-gray-300 rounded-lg focus:ring-accent focus:border-accent"
        />
        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <FiSearch />
        </button>
      </form>
    </div>
  );
}

// "About Me" Widget
function AboutWidget() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center mb-8">
      <Image
        src="/Elena-bakes-image-in-the-kitchen.webp" // We will add this image to our public folder
        alt="Portrait of the author"
        width={200}
        height={200}
        className="rounded-full mx-auto mb-4"
      />
      <h3 className="text-xl font-serif font-bold text-text-main mb-2">About Me</h3>
      <p className="text-text-light text-sm mb-4">
        {'Hi! I\'m a passionate home cook sharing my favorite tried-and-true recipes. Welcome to my kitchen!'}
      </p>
      <Link href="/about" className="text-accent font-bold hover:underline">
        Read More
      </Link>
    </div>
  );
}

// A widget to show some other recipes
async function RecentRecipesWidget() { // Renamed for clarity
  // Fetch the latest recipes, which is more reliable
  const allRecipesData = await getAllRecipesForHome();
  // Safely slice the array to prevent errors if there are fewer than 3 recipes
  const allRecipes = allRecipesData?.nodes ?? []; // Grab the nodes array safely
  const recentRecipes = allRecipes.slice(0, 3); // now safe

   return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-serif font-bold text-text-main mb-4">Recent Recipes</h3>
      <ul className="space-y-4">
        {recentRecipes.map((recipe: any) => (
          <li key={recipe.id}>
            <Link href={`/recipes/${recipe.slug}`} className="group flex items-center space-x-4">
              <div className="flex-shrink-0 relative h-16 w-16 rounded-lg overflow-hidden">
                <Image 
                  src={recipe.featuredImage.node.sourceUrl}
                  alt={recipe.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <span className="font-semibold text-text-main group-hover:text-accent transition-colors">
                {recipe.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// The main Sidebar component that combines all widgets
export default function Sidebar() {
  return (
    <aside className="lg:col-span-1 mt-12 lg:mt-0">
      <div className="sticky top-28 space-y-8">
        <AboutWidget />
        <SearchWidget />
        {/* --- 3. UPDATE THE COMPONENT NAME HERE --- */}
        <RecentRecipesWidget /> 
      </div>
    </aside>
  );
}