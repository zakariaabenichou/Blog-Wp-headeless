// src/app/[slug]/page.tsx
import { getPageBySlug } from "@/lib/api";
import { notFound } from "next/navigation";
import { Metadata } from 'next';
import Image from 'next/image';
import ContactForm from "@/components/ContactForm";


type PageProps = {
  params: {
    slug: string;
  };
};

// Generate dynamic metadata for the page title
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = await getPageBySlug(slug);
  if (!page) {
    return { title: 'Page Not Found' };
  }
  return {
    title: `${page.title} | Elena Bakes`,
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const page = await getPageBySlug(slug);

  // If WordPress returns no page for this slug, show a 404
  if (!page) {
    notFound();
  }

    const content = page.pageContent || {};

 
    return (
    <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <article>
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-12 text-text-h1 text-center">
          {page.title}
        </h1>

        {/* --- Section 1: Renders only if content exists --- */}
        {content.section1Content && (
          <section className="my-8">
            {/* Image for section 1 (if it exists) */}
            {content.section1Image?.node && (
              <div className="relative h-96 w-full max-w-4xl mx-auto mb-8">
                <Image
                  src={content.section1Image.node.sourceUrl}
                  alt={content.section1Image.node.altText || ''}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-lg"
                />
              </div>
            )}
            {/* Content for section 1 */}
            <div
              className="prose lg:prose-xl max-w-none"
              dangerouslySetInnerHTML={{ __html: content.section1Content }}
            />
             
          </section>
          
          
        )}
        {slug === 'contact-us' && (
          <section className="mt-12">
            <ContactForm />
          </section>
        )}

        {/* --- Section 2: Renders only if content exists --- */}
        {content.section2Content && (
          <section className="my-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Image for section 2 (if it exists) */}
              {content.section2Image?.node && (
                <div className={`relative w-full h-full ${content.section2ImagePosition === 'Right' ? 'md:order-2' : 'md:order-1'}`}>
                  <Image
                    src={content.section2Image.node.sourceUrl}
                    alt={content.section2Image.node.altText || ''}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-lg"
                  />
                </div>
                
              )}
              {/* Content for section 2 */}
              <div className={`prose lg:prose-xl ${content.section2ImagePosition === 'Right' ? 'md:order-1' : 'md:order-2'}`}>
                <div dangerouslySetInnerHTML={{ __html: content.section2Content }} />
              </div>
            </div>
          </section>
        )}

        {/* --- Section 3: Renders only if content exists --- */}
        {content.section3Content && (
          <section className="my-8">
            <div
              className="prose lg:prose-xl max-w-none"
              dangerouslySetInnerHTML={{ __html: content.section3Content }}
            />
           
          </section>
        )}

      </article>
    </main>
  );
  
}