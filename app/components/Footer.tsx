export default function Footer() {
  return (
    <footer className="border-t py-6 border-neutral-200 dark:border-neutral-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center text-sm">
        <p className="mb-2 text-muted-foreground">
          © {new Date().getFullYear()} Hafizh Pratama. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
