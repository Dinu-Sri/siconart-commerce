import Image from "next/image";

export function Logo() {
  return (
    <Image
      src="/siconart-logo.svg"
      alt="Sicon Art"
      width={208}
      height={60}
      priority
      className="h-12 w-auto dark:invert"
    />
  );
}
