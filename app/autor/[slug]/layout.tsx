import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const authorNames: Record<string, string> = {
    "tomasz-chromy": "Tomasz Chromy",
  };
  const name = authorNames[slug] || "Autor";
  
  return {
    title: `${name} - Autor | FusionFinance.pl`,
    description: `Profil autora ${name} na FusionFinance.pl. Poznaj eksperta i jego artykuły o finansach i rynkach.`,
    openGraph: {
      title: `${name} | FusionFinance.pl`,
      description: `Profil autora ${name}`,
      type: "profile",
    },
  };
}

export async function generateStaticParams() {
  return [{ slug: "tomasz-chromy" }];
}

export default function AuthorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

