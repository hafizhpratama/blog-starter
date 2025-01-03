import { smMetadata } from "../../metadata";

export const metadata = smMetadata;

export default function SlotMachineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
