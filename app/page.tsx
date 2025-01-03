import { Suspense, memo } from "react";
import dynamic from "next/dynamic";
import { Mail, Twitter, Linkedin, Github, type LucideIcon } from "lucide-react";
import { EXPERIENCES, SKILLS, SOCIAL_LINKS } from "./constants";

const SkeletonLoader = memo(({ className = "" }: { className?: string }) => (
  <div className={`bg-muted/50 rounded ${className}`} />
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
      className="p-2 rounded-full hover:bg-accent"
    >
      <Icon className="w-5 h-5" aria-hidden="true" />
    </a>
  )
);
SocialLink.displayName = "SocialLink";

const SkillBadge = memo(({ name }: { name: string }) => (
  <span className="px-3 py-1 rounded-full text-sm bg-accent text-accent-foreground">
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
    <div role="img" aria-label="developer emoji" className="text-6xl mb-6">
      🧑🏻‍💻
    </div>
    <h1 className="text-3xl sm:text-4xl font-serif italic mb-6">
      Hello, I&apos;m Hafizh Pratama
    </h1>
    <p className="text-base sm:text-lg mb-6 max-w-xl mx-auto text-muted-foreground">
      A software engineer who enjoys solving problems, building efficient
      systems, and continuously learning. Focused on delivering practical
      solutions while staying humble and grounded.
    </p>

    <div className="flex justify-center space-x-4 mb-6">
      {socialLinks.map(({ Icon, href, name }) => (
        <SocialLink key={name} Icon={Icon} href={href} name={name} />
      ))}
    </div>
  </div>
));
HeroSection.displayName = "HeroSection";

const SkillsSection = memo(() => (
  <div className="mb-12">
    <h2 className="text-2xl sm:text-3xl font-serif italic mb-6">
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
    <main className="pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
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
