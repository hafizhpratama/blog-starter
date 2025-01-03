import { rpsMetadata } from "../../metadata";

export const metadata = rpsMetadata;

export default function RockPaperScissorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
