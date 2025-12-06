"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  href: string;
}

const pathLabels: Record<string, string> = {
  rynki: "Rynki Finansowe",
  gielda: "Giełda",
  crypto: "Kryptowaluty",
  waluty: "Waluty",
  analizy: "Analizy",
  "kursy-walut": "Kursy Walut NBP",
  szukaj: "Wyszukiwarka",
  ulubione: "Ulubione",
  historia: "Historia",
  artykul: "Artykuł",
  "polityka-prywatnosci": "Polityka Prywatności",
  regulamin: "Regulamin",
  cookies: "Cookies",
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  
  // Don't show breadcrumbs on home page
  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);
  
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Strona główna", href: "/" },
  ];

  let currentPath = "";
  segments.forEach((segment) => {
    currentPath += `/${segment}`;
    const label = pathLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    breadcrumbs.push({ label, href: currentPath });
  });

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center flex-wrap gap-1 text-[13px]" itemScope itemType="https://schema.org/BreadcrumbList">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <li 
              key={item.href} 
              className="flex items-center"
              itemProp="itemListElement" 
              itemScope 
              itemType="https://schema.org/ListItem"
            >
              {index > 0 && (
                <svg className="w-3.5 h-3.5 text-[#52525b] mx-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
              
              {isLast ? (
                <span className="text-[#a1a1aa]" itemProp="name">{item.label}</span>
              ) : (
                <Link 
                  href={item.href}
                  className="text-[#71717a] hover:text-[#c9a962] transition-colors duration-200"
                  itemProp="item"
                >
                  <span itemProp="name">{item.label}</span>
                </Link>
              )}
              <meta itemProp="position" content={String(index + 1)} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

