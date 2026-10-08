import { createFileRoute } from "@tanstack/react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { categories, SALE_CAT } from "@/lib/store";
import { getProducts } from "@/lib/floukaa.functions";
import { ProductCard, SiteShell } from "@/components/shop";

type S = { cat?: number | undefined; q?: string | undefined; page?: number | undefined; sort?: string | undefined };

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): S => ({
    cat: s["cat"] ? Number(s["cat"]) : undefined,
    q: typeof s["q"] === "string" ? s["q"] : undefined,
    page: s["page"] ? Number(s["page"]) : undefined,
    sort: typeof s["sort"] === "string" ? s["sort"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "المتجر — فلوكه" },
      { name: "description", content: "تصفح كل إكسسوارات فلوكه: سلاسل، أساور، خواتم، حلقان، خلخال وأكتر." },
      { property: "og:title", content: "المتجر — فلوكه" },
      { property: "og:description", content: "كل منتجات فلوكه في مكان واحد." },
    ],
  }),
  component: Shop,
});

function Shop() {
  const s = Route.useSearch();
  const nav = Route.useNavigate();
  const page = s.page ?? 1;
  const { data, isFetching } = useQuery({
    queryKey: ["products", s],
    queryFn: () => getProducts({ data: { category: s.cat, search: s.q, page, sort: s.sort } }),
    placeholderData: keepPreviousData,
  });
  const title = s.cat === SALE_CAT ? "خصومات حتى 50%" : categories.find((c) => c.id === s.cat)?.name ?? (s.q ? `نتائج "${s.q}"` : "كل المنتجات");
  const set = (p: Partial<S>) => nav({ to: ".", search: (prev) => ({ ...prev, page: undefined, ...p }) });
  const chip = (on: boolean) => `block w-full rounded-lg px-3 py-2 text-right text-sm ${on ? "bg-foreground text-background" : "hover:bg-muted"}`;
  return (
    <SiteShell>
      <div className="mt-8 grid gap-10 lg:grid-cols-[220px_1fr]">
        <aside className="space-y-1">
          <p className="mb-3 font-bold">الأقسام</p>
          <button className={chip(!s.cat)} onClick={() => set({ cat: undefined })}>الكل</button>
          <button className={chip(s.cat === SALE_CAT)} onClick={() => set({ cat: SALE_CAT })}>خصومات</button>
          {categories.map((c) => (
            <button key={c.id} className={chip(s.cat === c.id)} onClick={() => set({ cat: c.id })}>{c.name}</button>
          ))}
        </aside>
        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold">{title}</h1>
              <p className="text-sm text-muted-foreground">{data ? `${data.total.toLocaleString()} منتج` : "..."}</p>
            </div>
            <select value={s.sort ?? ""} onChange={(e) => set({ sort: e.target.value || undefined })} className="rounded-full border bg-background px-4 py-2 text-sm">
              <option value="">الأحدث</option>
              <option value="popular">الأكثر مبيعاً</option>
              <option value="low">السعر: من الأقل</option>
              <option value="high">السعر: من الأعلى</option>
            </select>
          </div>
          <div className={`grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4 ${isFetching ? "opacity-60" : ""}`}>
            {data?.items.map((p) => <ProductCard key={p.id} p={p} />) ??
              Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-square animate-pulse rounded-2xl bg-muted" />)}
          </div>
          {data && !data.items.length && <p className="py-20 text-center text-muted-foreground">مفيش نتائج</p>}
          {data && data.totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-4">
              <button disabled={page <= 1} onClick={() => nav({ to: ".", search: (p) => ({ ...p, page: page - 1 }) })} className="rounded-full border px-5 py-2 disabled:opacity-40">السابق</button>
              <span className="text-sm">{page} / {data.totalPages}</span>
              <button disabled={page >= data.totalPages} onClick={() => nav({ to: ".", search: (p) => ({ ...p, page: page + 1 }) })} className="rounded-full border px-5 py-2 disabled:opacity-40">التالي</button>
            </div>
          )}
        </div>
      </div>
    </SiteShell>
  );
}
