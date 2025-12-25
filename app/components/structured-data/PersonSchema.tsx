import { SCHEMA_CONTEXT } from "./types";

interface PersonSchemaProps {
  baseUrl: string;
  name: string;
  jobTitle: string;
  description: string;
  image?: string;
  sameAs: string[];
  knowsAbout: string[];
  worksFor?: {
    name: string;
    url?: string;
  };
}

export function PersonSchema({
  baseUrl,
  name,
  jobTitle,
  description,
  image,
  sameAs,
  knowsAbout,
  worksFor,
}: PersonSchemaProps) {
  const schema = {
    "@context": SCHEMA_CONTEXT,
    "@type": "Person",
    "@id": `${baseUrl}/#person`,
    name,
    jobTitle,
    description,
    url: baseUrl,
    image: image || `${baseUrl}/profile.jpeg`,
    sameAs,
    knowsAbout,
    ...(worksFor && {
      worksFor: {
        "@type": "Organization",
        name: worksFor.name,
        ...(worksFor.url && { url: worksFor.url }),
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
