export async function fetchAPI(query: string, { variables }: { variables?: any } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (!process.env.WORDPRESS_GRAPHQL_ENDPOINT) {
    throw new Error('WORDPRESS_GRAPHQL_ENDPOINT is not configured in .env.local');
  }

  const res = await fetch(process.env.WORDPRESS_GRAPHQL_ENDPOINT as string,  {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  
    next: {
      revalidate: 60, // Optional: cache for 60 seconds before refetching in the background
    } 
     });

  // If the response isn’t JSON, log it
  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await res.text(); // log the HTML response
    console.error("❌ Expected JSON, got:", text);
    throw new Error(`Invalid response from API. Status: ${res.status}`);
  }

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error('Failed to fetch API');
  }
  return json.data;
}

// src/lib/api.ts (add this to the end of the file)

export async function getAllRecipesForHome(after = "") {
  const data = await fetchAPI(`
      
   query AllRecipes($after: String) {
      recipes(first: 9, after: $after, where: { orderby: { field: DATE, order: DESC } }) {

        pageInfo {
          hasNextPage
          endCursor
        }  
      nodes {
          id
          title
          slug
          featuredImage {
            node {
              sourceUrl
            }
          }
            categories {
            nodes {
              name
              slug
            }
          }
          # ADD THIS recipeFields BLOCK
          recipeFields {
            summary
          }
        }
      }
    }
  `);
  return data?.recipes;
}

// src/lib/api.ts (add this to the end of the file)


export async function getRecipeBySlug(slug: string) {
  const data = await fetchAPI(
    `
    query GetRecipeBySlug($id: ID!) {
      recipe(id: $id, idType: SLUG) {
        title
        content
        databaseId # IMPORTANT: We need this ID to submit comments
        comments {
          nodes {
            id
            content
            date
            author {
              node {
                name
                avatar {
                  url
                }
              }
            }
          }
        }
        featuredImage {
          node {
            sourceUrl
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
        recipeFields {
          summary
          cookingTime
          prepTime
          servings
          difficulty
          ingredients
          instructions
          notes
          rating
          ratingCount
          section1
          section2
          totaltime
          course
          cuisine
          authorname
          equipment
          faq
        
        }
      }
    }
    `,
    { variables: { id: slug } }
  );
  return data?.recipe;
}  


export async function getFeaturedRecipes() {
  const data = await fetchAPI(`
    query GetFeaturedRecipes {
      recipes(where: {tag: "featured"}) {
        nodes {
          id
          title
          slug
          featuredImage {
            node {
              sourceUrl
            }
          }
          recipeFields {
            summary
          }
        }
      }
    }
  `);
  return data?.recipes.nodes;
}


export async function getAllCategories() {
  const data = await fetchAPI(`
    query GetAllCategories {
      categories(where: { hideEmpty: true }) {
        nodes {
          name
          slug
          count
          categoryFields {
            categoryImage {
              node {
                sourceUrl
              }
            }
          }
        }
      }
    }
  `); // <-- The error was likely a missing brace before this line
  return data?.categories.nodes;
}

// src/lib/api.ts

export async function getRecipesByCategory(categorySlug: string) {
  const data = await fetchAPI(`
    query GetRecipesByCategory($categoryName: String!, $slug: ID!) {
      recipes(where: { categoryName: $categoryName }) {
        nodes {
          id
          title
          slug
          featuredImage {
            node {
              sourceUrl
            }
          }
          categories {
            nodes {
              name
              slug
            }
          }
          recipeFields {
            summary
          }
        }
      }
      category(id: $slug, idType: SLUG) {
        name
      }
    }
  `, {
    variables: {
      categoryName: categorySlug,
      slug: categorySlug,
    },
  });
  return {
    recipes: data?.recipes.nodes,
    categoryName: data?.category.name,
  };
}
// src/lib/api.ts (add this new function)

export async function searchRecipes(searchTerm: string) {
  const data = await fetchAPI(`
    query SearchRecipes($search: String!) {
      recipes(where: { search: $search }) {
        nodes {
          id
          title
          slug
          featuredImage {
            node {
              sourceUrl
            }
          }
          categories {
            nodes {
              name
              slug
            }
          }
          recipeFields {
            summary
          }
        }
      }
    }
  `, {
    variables: {
      search: searchTerm,
    },
  });
  return data?.recipes.nodes;
}

// src/lib/api.ts (add this new function)

export async function getPageBySlug(slug: string) {
  const data = await fetchAPI(`
    query GetPageBySlug($id: ID!) {
      page(id: $id, idType: URI) {
        title
        pageContent {
          section1Content
          section1Image {
            node {
              sourceUrl
              altText
            }
          }
          section2Content
          section2ImagePosition
          section2Image {
            node {
              sourceUrl
              altText
            }
          }
          section3Content
        }
      }
    }
  `, { variables: { id: slug } });
  return data?.page;
}