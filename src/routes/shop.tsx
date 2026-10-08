import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { categories, products } from "@/lib/store";
import { AppShell, ProductCard } from "@/components/shop";

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): { cat?: string | undefined } => ({ cat: typeof s["cat"] === "string" ? s["cat"] : undefined }),
  head: () => ({
    meta: [
      { title: "تسوق — Floukaa" },
      { name: "description", content: "ابحثي وفلتري كل إكسسوارات فلوكا حسب القسم والسعر." },
      { property: "og:title", content: "تسوق — Floukaa" },
      { property: "og:description", content: "كل منتجات فلوكا في مكان واحد." },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { cat } = Route.useSearch();
  const nav = Route.useNavigate();
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("new");
  let list = products.filter((p) => (!cat || p.cat === cat) && p.name.includes(q));
  if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
  const chip = (on: boolean) => `shrink-0 rounded-full border px-4 py-1.5 text-xs ${on ? "border-foreground bg-foreground text-background" : "bg-background"}`;
  return (
    <AppShell>
      <div className="sticky top-0 z-20 space-y-3 bg-background px-4 pt-4 pb-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحثي عن سلسلة، خاتم..." className="w-full rounded-full bg-muted px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
        <div className="flex gap-2 overflow-x-auto">
          <button className={chip(!cat)} onClick={() => nav({ to: ".", search: { cat: undefined } })}>الكل</button>
          {categories.map((c) => (
            <button key={c.id} className={chip(cat === c.id)} onClick={() => nav({ to: ".", search: { cat: c.id } })}>{c.name}</button>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{list.length} منتج</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-transparent">
            <option value="new">الأحدث</option>
            <option value="low">السعر: الأقل</option>
            <option value="high">السعر: الأعلى</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 px-4">
        {list.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
      {!list.length && <p className="py-16 text-center text-sm text-muted-foreground">مفيش نتائج</p>}
    </AppShell>
  );
}
