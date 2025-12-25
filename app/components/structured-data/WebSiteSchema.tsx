import { SCHEMA_CONTEXT } from "./types";

interface WebSiteSchemaProps {
  baseUrl: string;
  siteName: string;
  description: string;
}

export function WebSiteSchema({
  baseUrl,
  siteName,
  description,
}: WebSiteSchemaProps) {
  const schema = {
    "@context": SCHEMA_CONTEXT,
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    name: siteName,
    description: description,
    url: baseUrl,
    publisher: {
      "@id": `${baseUrl}/#person`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/articles?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: "en-US",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
