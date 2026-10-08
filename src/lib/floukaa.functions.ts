import { createServerFn } from "@tanstack/react-start";

const API = "https://floukaa.com/wp-json/wc/store/v1";

export type Product = {
  id: number;
  name: string;
  price: number;
  old?: number | undefined;
  img: string;
  images: string[];
  cats: string[];
  desc: string;
  inStock: boolean;
};

const decode = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&#8211;/g, "–").replace(/&#0?39;/g, "'").replace(/&quot;/g, '"');
const strip = (s: string) => decode(s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function map(p: any): Product {
  const price = Number(p.prices.price);
  const reg = Number(p.prices.regular_price);
  return {
    id: p.id,
    name: decode(p.name),
    price,
    old: reg > price ? reg : undefined,
    img: p.images?.[0]?.src ?? "",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    images: (p.images ?? []).map((i: any) => i.src),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cats: (p.categories ?? []).map((c: any) => decode(c.name)),
    desc: strip(p.short_description || p.description || ""),
    inStock: p.is_in_stock,
  };
}

export const getProducts = createServerFn({ method: "GET" })
  .inputValidator((d: { category?: number | undefined; search?: string | undefined; page?: number | undefined; sort?: string | undefined; perPage?: number | undefined }) => d)
  .handler(async ({ data }) => {
    const u = new URLSearchParams({ per_page: String(data.perPage ?? 24), page: String(data.page ?? 1) });
    if (data.category) u.set("category", String(data.category));
    if (data.search) u.set("search", data.search);
    if (data.sort === "low") { u.set("orderby", "price"); u.set("order", "asc"); }
    else if (data.sort === "high") { u.set("orderby", "price"); u.set("order", "desc"); }
    else if (data.sort === "popular") u.set("orderby", "popularity");
    const r = await fetch(`${API}/products?${u}`, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!r.ok) return { items: [] as Product[], totalPages: 0, total: 0 };
    const json = await r.json();
    return {
      items: (json as unknown[]).map(map),
      totalPages: Number(r.headers.get("x-wp-totalpages") ?? 1),
      total: Number(r.headers.get("x-wp-total") ?? 0),
    };
  });

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    const r = await fetch(`${API}/products/${data.id}`, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!r.ok) return null;
    return map(await r.json());
  });
