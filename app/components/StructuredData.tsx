export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Hafizh Pratama",
    jobTitle: "Software Engineer",
    url: "https://hafizh.cloudhej.com",
    sameAs: [
      "https://github.com/hafizhpratama",
      "https://linkedin.com/in/hafizhpratama",
    ],
    knowsAbout: [
      "Web Development",
      "JavaScript",
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
