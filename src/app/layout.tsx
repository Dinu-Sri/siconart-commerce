import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sicon Art",
  description: "Handcrafted Chinese brushes for watercolor and urban sketching."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
