import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site-origin";

export function pageMeta({
  title,
  description,
  path,
  index = true
}: {
  title: string;
  description: string;
  path: string;
  index?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: index ? undefined : { index: false, follow: false },
    openGraph: {
      title,
      description,
      url,
      type: "website"
    }
  };
}
