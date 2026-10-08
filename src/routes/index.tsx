import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import { categories, products, FREE_SHIP_OVER, egp } from "@/lib/store";
import { AppShell, ProductCard, TopBar } from "@/components/shop";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Floukaa — إكسسوارات ومجوهرات" },
      { name: "description", content: "تسوقي أحدث السلاسل والخواتم والحلقان من فلوكا بتوصيل لكل مصر." },
      { property: "og:title", content: "Floukaa — إكسسوارات ومجوهرات" },
      { property: "og:description", content: "تسوقي أحدث السلاسل والخواتم والحلقان من فلوكا." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <AppShell>
      <TopBar />
      <div className="bg-secondary py-1.5 text-center text-xs">شحن مجاني للطلبات فوق {egp(FREE_SHIP_OVER)}</div>
      <section className="relative mx-4 mt-4 overflow-hidden rounded-3xl">
        <img src={hero} alt="مجموعة فلوكا الجديدة" width={1024} height={1280} className="aspect-[4/5] w-full object-cover" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/70 to-transparent p-5 text-background">
          <p className="text-xs tracking-widest">كوليكشن الخريف</p>
          <h2 className="font-display text-3xl leading-tight">لمعة كل يوم</h2>
          <Link to="/shop" className="mt-3 inline-block rounded-full bg-background px-5 py-2 text-sm font-bold text-foreground">تسوقي الآن</Link>
        </div>
      </section>
      <section className="mt-6 px-4">
        <h3 className="mb-3 font-bold">الأقسام</h3>
        <div className="grid grid-cols-4 gap-3">
          {categories.map((c) => (
            <Link key={c.id} to="/shop" search={{ cat: c.id }} className="text-center">
              <img src={products.find((p) => p.cat === c.id)!.img} alt={c.name} loading="lazy" className="aspect-square w-full rounded-full bg-muted object-cover" />
              <span className="mt-1 block text-xs">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="mt-8 px-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-bold">وصل حديثاً</h3>
          <Link to="/shop" className="text-xs text-primary">عرض الكل</Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {products.filter((p) => p.tag).slice(0, 6).map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>
    </AppShell>
  );
}
