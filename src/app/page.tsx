import HomePage from "./[locale]/page";
import { defaultLocale } from "@/i18n/routing";

export default async function RootPage() {
  return HomePage({ params: Promise.resolve({ locale: defaultLocale }) });
}
