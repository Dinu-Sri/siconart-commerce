import Image from "next/image";

export function Logo({ variant = "header" }: { variant?: "header" | "footer" }) {
  const isFooter = variant === "footer";

  return (
    <Image
      src={isFooter ? "/brand/siconart-logo-footer.webp" : "/brand/siconart-logo-header.webp"}
      alt="Sicon Art"
      width={isFooter ? 493 : 493}
      height={isFooter ? 147 : 147}
      priority
      className={isFooter ? "h-14 w-auto" : "h-12 w-auto dark:invert"}
    />
  );
}
