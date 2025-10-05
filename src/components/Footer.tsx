// src/components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-light-gray border-t mt-auto text-text-light">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Column 1: Logo & Copyright */}
          <div>
            <Link 
              href="/" 
              className="text-2xl font-serif font-bold text-text-main hover:text-accent transition-colors"
            >
              Elena Bakes
            </Link>
            <p className="mt-2 text-sm">
              Delicious recipes for every occasion.
            </p>
            <p className="mt-4 text-xs">
              &copy; {currentYear} Elena Bakes. All Rights Reserved.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-bold text-text-main uppercase tracking-wider">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="/privacy-policy" className="hover:text-accent transition-colors">Privacy Policy</a></li>
              <li><a href="/about" className="hover:text-accent transition-colors">About Us</a></li>
              <li><a href="/terms-of-use" className="hover:text-accent transition-colors">Term of use</a></li>
              <li><a href="/contact-us" className="hover:text-accent transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Column 3: Social Media */}
          <div>
            <h3 className="font-bold text-text-main uppercase tracking-wider">Follow Us</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="https://de.pinterest.com/NurLeckereRezepte/" className="hover:text-accent transition-colors">Pinterest</a></li>
              <li><a href="https://www.facebook.com/profile.php?id=61564579361540" className="hover:text-accent transition-colors">Facebook</a></li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
}