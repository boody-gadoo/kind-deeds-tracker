import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { egp, useStore } from "@/lib/store";
import { getProduct } from "@/lib/floukaa.functions";
import { SiteShell } from "@/components/shop";

export const Route = createFileRoute("/product/$id")({
  loader: async ({ params }) => {
    const p = await getProduct({ data: { id: Number(params.id) } });
    if (!p) throw notFound();
    return { p };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "غير متاح — فلوكه" }, { name: "robots", content: "noindex" }] };
    const { p } = loaderData;
    return {
      meta: [
        { title: `${p.name} — فلوكه` },
        { name: "description", content: p.desc || `${p.name} من فلوكه بسعر ${p.price} ج.م` },
        { property: "og:title", content: `${p.name} — فلوكه` },
        { property: "og:description", content: p.desc || "إكسسوارات فلوكه" },
        ...(p.img ? [{ property: "og:image", content: p.img }, { name: "twitter:image", content: p.img }] : []),
      ],
    };
  },
  notFoundComponent: () => <SiteShell><p className="py-32 text-center">المنتج غير موجود</p></SiteShell>,
  component: ProductPage,
});

function ProductPage() {
  const { p } = Route.useLoaderData();
  const { add, toggleFav, fav } = useStore();
  const [img, setImg] = useState(p.img);
  const [qty, setQty] = useState(1);
  const on = fav.some((x) => x.id === p.id);
  return (
    <SiteShell>
      <nav className="mt-6 text-sm text-muted-foreground"><Link to="/">الرئيسية</Link> / <Link to="/shop">المتجر</Link> / {p.name}</nav>
      <div className="mt-6 grid gap-12 md:grid-cols-2">
        <div>
          <img src={img} alt={p.name} className="aspect-square w-full rounded-3xl bg-muted object-cover" />
          {p.images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {p.images.map((i) => (
                <button key={i} onClick={() => setImg(i)} className={`h-20 w-20 overflow-hidden rounded-xl border-2 ${i === img ? "border-primary" : "border-transparent"}`}>
                  <img src={i} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-5">
          <p className="text-sm text-primary">{p.cats.join(" • ")}</p>
          <h1 className="text-3xl font-bold">{p.name}</h1>
          <p className="text-2xl font-bold">
            {egp(p.price)} {p.old && <span className="text-base font-normal text-muted-foreground line-through">{egp(p.old)}</span>}
          </p>
          {p.desc && <p className="leading-relaxed text-muted-foreground">{p.desc}</p>}
          <p className={`text-sm ${p.inStock ? "text-primary" : "text-destructive"}`}>{p.inStock ? "متوفر" : "غير متوفر حالياً"}</p>
          <div className="flex gap-3">
            <div className="flex items-center gap-4 rounded-full border px-4">
              <button onClick={() => setQty(qty + 1)}>+</button><span>{qty}</span><button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
            </div>
            <button
              disabled={!p.inStock}
              onClick={() => { for (let i = 0; i < qty; i++) add(p); toast.success("اتضاف للسلة"); }}
              className="flex-1 rounded-full bg-primary py-3.5 font-bold text-primary-foreground disabled:opacity-50"
            >أضف للسلة</button>
            <button onClick={() => toggleFav(p)} className="rounded-full border px-5">{on ? "♥" : "♡"}</button>
          </div>
          <ul className="grid grid-cols-3 gap-3 pt-4 text-center text-sm">
            <li className="rounded-xl bg-secondary p-3">شحن لكل مصر</li>
            <li className="rounded-xl bg-secondary p-3">دفع عند الاستلام</li>
            <li className="rounded-xl bg-secondary p-3">إمكانية الاستبدال</li>
          </ul>
        </div>
      </div>
    </SiteShell>
  );
}
