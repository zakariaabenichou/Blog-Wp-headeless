// src/app/recipes/[slug]/page.tsx
import { cache } from 'react';
import { getRecipeBySlug as fetchRecipe } from '@/lib/api';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import Comments from '@/components/Comments'; 
import FaqAccordion from '@/components/FaqAccordion';
import RecipeBlock from '@/components/RecipeBlock';
import Sidebar from '@/components/Sidebar';
import * as cheerio from 'cheerio';
import TableOfContents from '@/components/TableOfContents';

// Cache wrapper
const getRecipeBySlug = cache(fetchRecipe);

type PageProps = {
  params: { slug: string };
};

// --- Metadata ---
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const recipe = await getRecipeBySlug(slug);

  if (!recipe) {
    return { title: 'Recipe Not Found' };
  }

  return {
    title: `${recipe.title} | Foodie Fusion`,
    description: recipe.recipeFields?.summary || 'A delicious recipe from Foodie Fusion.',
  };
}

// --- Page component ---
export default async function RecipePage({ params }: PageProps) {
  const { slug } = await params
  const recipe = await getRecipeBySlug(slug);

  if (!recipe) {
    notFound();
  }

const headings: { id: string, text: string }[] = [];

// A helper function to extract headings and add IDs to a piece of HTML
const processContentForToC = (htmlContent: string | null | undefined): string => {
    if (!htmlContent) return '';

    const $ = cheerio.load(htmlContent);
    $('h2').each((index, element) => {
        const text = $(element).text();
        if (!text) return; // Skip empty headings

        // Create a unique ID
        const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        
        // Add the heading to our list for the ToC component
        headings.push({ id, text });
        
        // Inject the ID directly into the HTML element
        $(element).attr('id', id);
    });

    // Return the modified HTML with IDs injected
    return $.html();
};

// 2. Process each of your content fields
// This will populate the 'headings' array and update the content strings with IDs
if (recipe.recipeFields?.section1) {
    recipe.recipeFields.section1 = processContentForToC(recipe.recipeFields.section1);
}
if (recipe.content) { // The default WordPress editor content
    recipe.content = processContentForToC(recipe.content);
}
if (recipe.recipeFields?.section2) {
    recipe.recipeFields.section2 = processContentForToC(recipe.recipeFields.section2);
}

  
const faqList = recipe.recipeFields?.faq
  ?.split('\n') // Takes the text from WordPress for THIS recipe
  .filter((line: string) => line.includes('|'))
  .map((line: string) => { // Loops through each Q&A line for THIS recipe
    
    const [question, answer] = line.split('|');
    
    return {
      '@type': 'Question',
      // DYNAMIC: Uses the 'question' variable from the current line
      name: question.replace(/^Q:\s*/, '').trim(), 
      acceptedAnswer: {
        '@type': 'Answer',
        // DYNAMIC: Uses the 'answer' variable from the current line
        text: answer.replace(/^A:\s*/, '').trim(),
      },
    };
  }) || [];

  const ingredientsList =
    recipe.recipeFields?.ingredients?.split('\n').filter((item: string) => item.trim() !== '') || [];
  const instructionsList =
    recipe.recipeFields?.instructions?.split('\n').filter((step: string) => step.trim() !== '') || [];

  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Recipe',
    name: recipe.title,
    description: recipe.recipeFields?.summary,
    image: [recipe.featuredImage?.node?.sourceUrl],
    author: { '@type': 'Person', name: 'Foodie Fusion' },
    datePublished: recipe.date,
    prepTime: `PT${recipe.recipeFields?.prepTime?.replace(' minutes', 'M')}`,
    cookTime: `PT${recipe.recipeFields?.cookingTime?.replace(' minutes', 'M')}`,
    recipeIngredient: ingredientsList,
    recipeInstructions: instructionsList.map((step: string, index: number) => ({
      '@type': 'HowToStep',
      text: step,
      position: index + 1,
    })),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: recipe.recipeFields?.rating,
      ratingCount: recipe.recipeFields?.ratingCount,
    },
    mainEntity: faqList.length > 0 ? faqList : undefined,
  };

  const categories = recipe.categories?.nodes || [];

  return (
    <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
        {/* Main Recipe */}
        <article className="lg:col-span-2">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-text-main">
            {recipe.title}
          </h1>

          {categories.length > 0 && (
            <div className="mb-8 flex flex-wrap items-center gap-2">
              {categories.map((category: any) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className="bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full hover:bg-accent-hover transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}

          {headings.length > 0 && <TableOfContents headings={headings} />}

          {recipe.recipeFields?.summary && (
<div
              className="prose lg:prose-xl max-w-none text-text-main mb-8"
              dangerouslySetInnerHTML={{ __html: recipe.recipeFields.summary }}
            />          )}

          {recipe.recipeFields?.section1 && (
            <div
              className="prose lg:prose-xl max-w-none text-text-main mb-8"
              dangerouslySetInnerHTML={{ __html: recipe.recipeFields.section1 }}
            />
          )}

          {recipe.featuredImage?.node?.sourceUrl && (
            <div className="relative overflow-hidden rounded-lg mb-8">
              <Image
                src={recipe.featuredImage.node.sourceUrl}
                alt={`Image of ${recipe.title}`}
                height={640}
                width={640}
                style={{ objectFit: 'cover' }}
                priority
                className="relative h-full w-full"
              />
            </div>
          )}

          {recipe.content && (
            <div
              className=" prose lg:prose-xl max-w-none text-text-main my-8"
              dangerouslySetInnerHTML={{ __html: recipe.content }}
            />
          )}
          <RecipeBlock fields={recipe.recipeFields} recipeTitle={recipe.title} />

          {recipe.recipeFields?.section2 && (
            <div
              className="prose lg:prose-xl max-w-none text-text-main my-8"
              dangerouslySetInnerHTML={{ __html: recipe.recipeFields.section2 }}
            />
          )}

           {recipe.recipeFields?.faq && (
            <FaqAccordion faqString={recipe.recipeFields.faq} />
          )}


          <Comments comments={recipe.comments} postId={recipe.databaseId} />
        </article>

        <Sidebar />
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
