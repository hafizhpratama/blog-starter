import { rpsMetadata } from '@/app/metadata'

export const metadata = rpsMetadata

export default function RockPaperScissorsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}