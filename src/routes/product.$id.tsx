import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { toast } from "sonner";
import { egp, products, useStore } from "@/lib/store";
import { AppShell, ProductCard, TopBar } from "@/components/shop";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const p = products.find((x) => x.id === params.id);
    if (!p) throw notFound();
    return { p };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.p.name} — Floukaa` },
          { name: "description", content: `${loaderData.p.name} من فلوكا بسعر ${loaderData.p.price} ج.م` },
          { property: "og:title", content: `${loaderData.p.name} — Floukaa` },
          { property: "og:description", content: "إكسسوارات فلوكا" },
        ]
      : [{ title: "غير موجود" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => <p className="p-10 text-center">المنتج غير موجود</p>,
  component: ProductPage,
});

function ProductPage() {
  const { p } = Route.useLoaderData();
  const { add } = useStore();
  const related = products.filter((x) => x.cat === p.cat && x.id !== p.id);
  return (
    <AppShell>
      <TopBar back title="" />
      <img src={p.img} alt={p.name} width={768} height={960} className="aspect-[4/5] w-full bg-muted object-cover" />
      <div className="space-y-3 p-4">
        <h1 className="text-xl font-bold">{p.name}</h1>
        <p className="text-lg font-bold">
          {egp(p.price)} {p.old && <span className="text-sm font-normal text-muted-foreground line-through">{egp(p.old)}</span>}
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">ستانلس ستيل مطلي ذهب، مقاوم للمية والصدأ. مناسب للاستخدام اليومي ويجي في علبة هدية.</p>
        <ul className="grid grid-cols-3 gap-2 text-center text-[11px]">
          <li className="rounded-xl bg-secondary p-2">ضد الصدأ</li>
          <li className="rounded-xl bg-secondary p-2">استبدال ١٤ يوم</li>
          <li className="rounded-xl bg-secondary p-2">دفع عند الاستلام</li>
        </ul>
      </div>
      <section className="px-4 pb-28">
        <h3 className="mb-3 font-bold">ممكن يعجبك كمان</h3>
        <div className="grid grid-cols-2 gap-4">{related.map((x) => <ProductCard key={x.id} p={x} />)}</div>
      </section>
      <div className="fixed bottom-16 left-1/2 z-30 flex w-full max-w-md -translate-x-1/2 gap-2 border-t bg-background p-3">
        <button onClick={() => { add(p.id); toast.success("اتضاف للسلة"); }} className="flex-1 rounded-full bg-primary py-3 font-bold text-primary-foreground active:scale-[.98]">أضيفي للسلة</button>
        <Link to="/cart" className="rounded-full border px-5 py-3 text-sm">السلة</Link>
      </div>
    </AppShell>
  );
}
