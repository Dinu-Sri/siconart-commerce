import { Brush, Feather, Luggage, Paintbrush, Waves } from "lucide-react";

const items = [
  { icon: Paintbrush, label: "Detail", body: "Fine points for edges and finishing marks." },
  { icon: Waves, label: "Wash", body: "Soft capacity for gradients and smooth passages." },
  { icon: Luggage, label: "Travel", body: "Compact brushes for sketchbooks and painting outside." },
  { icon: Brush, label: "Flat", body: "Crisp edges, architecture, and broad strokes." },
  { icon: Feather, label: "Line & Wash", body: "A balanced brush for drawing and watercolor." }
];

export function FilterSummary() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {items.map((item) => (
        <div key={item.label} className="rounded-[0.5rem] border bg-surface p-5">
          <item.icon className="h-6 w-6 text-primary" />
          <h3 className="mt-4 font-semibold">{item.label}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
        </div>
      ))}
    </div>
  );
}
