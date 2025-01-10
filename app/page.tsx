import { Suspense, memo } from "react";
import dynamic from "next/dynamic";
import { Mail, Twitter, Linkedin, Github, type LucideIcon } from "lucide-react";
import { EXPERIENCES, SKILLS, SOCIAL_LINKS } from "./constants";

const SkeletonLoader = memo(({ className = "" }: { className?: string }) => (
  <div className={`rounded bg-muted/50 ${className}`} />
));
SkeletonLoader.displayName = "SkeletonLoader";

const ExperienceSection = dynamic(
  () => import("./components/Experiences").then((mod) => mod.default),
  {
    loading: () => <SkeletonLoader className="h-64" />,
    ssr: false,
  }
);

const SocialLink = memo(
  ({ Icon, href, name }: { Icon: LucideIcon; href: string; name: string }) => (
    <a
      href={href}
      aria-label={name}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-full p-2 hover:bg-accent"
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
    </a>
  )
);
SocialLink.displayName = "SocialLink";

const SkillBadge = memo(({ name }: { name: string }) => (
  <span className="rounded-full bg-accent px-3 py-1 text-sm text-accent-foreground">
    {name}
  </span>
));
SkillBadge.displayName = "SkillBadge";

const socialLinks = [
  { Icon: Twitter, href: SOCIAL_LINKS.twitter, name: "twitter" },
  { Icon: Linkedin, href: SOCIAL_LINKS.linkedin, name: "linkedin" },
  { Icon: Mail, href: SOCIAL_LINKS.email, name: "email" },
  { Icon: Github, href: SOCIAL_LINKS.github, name: "github" },
];

const HeroSection = memo(() => (
  <div className="mb-24">
    <div role="img" aria-label="developer emoji" className="mb-6 text-6xl">
      🧑🏻‍💻
    </div>
    <h1 className="mb-4 font-serif text-3xl sm:text-4xl">
      Hello, I&apos;m Hafizh Pratama
    </h1>
    <p className="mx-auto mb-6 max-w-xl text-base text-muted-foreground sm:text-lg">
      A software engineer who enjoys solving problems, building efficient
      systems, and continuously learning. Focused on delivering practical
      solutions while staying humble and grounded.
    </p>

    <div className="mb-6 flex justify-center space-x-4">
      {socialLinks.map(({ Icon, href, name }) => (
        <SocialLink key={name} Icon={Icon} href={href} name={name} />
      ))}
    </div>
  </div>
));
HeroSection.displayName = "HeroSection";

const SkillsSection = memo(() => (
  <div className="mb-12">
    <h2 className="mb-6 font-serif text-2xl italic sm:text-3xl">
      Skills & Technologies
    </h2>
    <div className="flex flex-wrap justify-center gap-2">
      {SKILLS.map(({ name }, index) => (
        <SkillBadge key={`${name}-${index}`} name={name} />
      ))}
    </div>
  </div>
));
SkillsSection.displayName = "SkillsSection";

export default function HomePage() {
  return (
    <main className="px-4 pb-12 pt-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <HeroSection />
          <SkillsSection />
        </div>

        <section aria-label="Work Experience">
          <Suspense fallback={<SkeletonLoader className="h-64" />}>
            <ExperienceSection experiences={EXPERIENCES} />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
