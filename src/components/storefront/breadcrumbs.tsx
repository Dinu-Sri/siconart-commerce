import Link from "next/link";

export function Breadcrumbs({
  items
}: {
  items: Array<{ name: string; href: string }>;
}) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.href}-${item.name}`} className="flex items-center gap-2">
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {last ? (
                <span className="text-foreground">{item.name}</span>
              ) : (
                <Link href={item.href} className="hover:text-primary">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
