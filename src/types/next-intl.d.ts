declare module "next-intl" {
  import type { ComponentType, ReactNode } from "react";

  export function useLocale(): string;
  export function useTranslations(namespace?: string): (key: string, values?: Record<string, unknown>) => string;
  export const NextIntlClientProvider: ComponentType<{
    locale?: string;
    messages?: Record<string, unknown>;
    children?: ReactNode;
  }>;
}

declare module "next-intl/server" {
  export function getLocale(): Promise<string>;
  export function getMessages(): Promise<Record<string, unknown>>;
  export function getTranslations(
    namespace?: string | { locale?: string; namespace?: string }
  ): Promise<(key: string, values?: Record<string, unknown>) => string>;
  export function setRequestLocale(locale: string): void;
  export function getRequestConfig(handler: (params: any) => unknown): unknown;
}

declare module "next-intl/plugin" {
  import type { NextConfig } from "next";

  export default function createNextIntlPlugin(requestConfig?: string): (config: NextConfig) => NextConfig;
}

declare module "next-intl/routing" {
  export function defineRouting<T>(routing: T): T;
}

declare module "next-intl/middleware" {
  import type { NextRequest } from "next/server";

  export default function createMiddleware(config: unknown): (request: NextRequest) => Response | Promise<Response>;
}
