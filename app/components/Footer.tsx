export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 py-6 dark:border-neutral-800">
      <div className="mx-auto max-w-5xl px-4 text-center text-sm sm:px-6">
        <p className="mb-2 text-muted-foreground">
          © {new Date().getFullYear()} Hafizh Pratama. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
