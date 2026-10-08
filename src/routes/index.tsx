import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import hero from "@/assets/hero.jpg";
import { categories, SALE_CAT } from "@/lib/store";
import { getProducts } from "@/lib/floukaa.functions";
import { ProductCard, SiteShell } from "@/components/shop";

const latestQ = queryOptions({ queryKey: ["latest"], queryFn: () => getProducts({ data: { perPage: 8 } }) });
const saleQ = queryOptions({ queryKey: ["sale-home"], queryFn: () => getProducts({ data: { perPage: 4, category: SALE_CAT } }) });

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "فلوكه — Flouka للإكسسوارات والهدايا" },
      { name: "description", content: "تسوق سلاسل، أساور، خواتم، حلقان وهدايا من فلوكه بتوصيل لكل مصر والدفع عند الاستلام." },
      { property: "og:title", content: "فلوكه — Flouka للإكسسوارات والهدايا" },
      { property: "og:description", content: "إكسسوارات فاشون وهدايا بأسعار في متناول الجميع." },
    ],
  }),
  loader: async ({ context }) => {
    await Promise.all([context.queryClient.ensureQueryData(latestQ), context.queryClient.ensureQueryData(saleQ)]);
  },
  component: Home,
});

function Home() {
  const { data: latest } = useSuspenseQuery(latestQ);
  const { data: sale } = useSuspenseQuery(saleQ);
  return (
    <SiteShell>
      <section className="mt-6 grid overflow-hidden rounded-3xl bg-secondary md:grid-cols-2">
        <div className="flex flex-col justify-center p-10 md:p-16">
          <p className="text-sm tracking-widest text-primary">وصل حديثاً</p>
          <h1 className="mt-3 font-display text-5xl leading-tight md:text-6xl">لمعة كل يوم</h1>
          <p className="mt-4 max-w-md text-muted-foreground">أكتر من ٣٠٠٠ قطعة إكسسوارات وهدايا — سلاسل، أساور، خواتم وحلقان بتصميمات جديدة كل أسبوع.</p>
          <div className="mt-8 flex gap-3">
            <Link to="/shop" className="rounded-full bg-primary px-7 py-3 font-bold text-primary-foreground">تسوق الآن</Link>
            <Link to="/shop" search={{ cat: SALE_CAT }} className="rounded-full border border-foreground px-7 py-3 font-bold">الخصومات</Link>
          </div>
        </div>
        <img src={hero} alt="إكسسوارات فلوكه" width={1024} height={1280} className="h-[520px] w-full object-cover" />
      </section>

      <section className="mt-14">
        <h2 className="mb-6 text-2xl font-bold">تسوق حسب القسم</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {categories.map((c) => (
            <Link key={c.id} to="/shop" search={{ cat: c.id }} className="rounded-2xl border bg-card py-6 text-center font-medium transition-colors hover:border-primary hover:text-primary">
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <Section title="وصل حديثاً" items={latest.items} />
      {sale.items.length > 0 && <Section title="خصومات حتى 50%" items={sale.items} cat={SALE_CAT} />}
    </SiteShell>
  );
}

function Section({ title, items, cat }: { title: string; items: Parameters<typeof ProductCard>[0]["p"][]; cat?: number }) {
  return (
    <section className="mt-14">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Link to="/shop" search={{ cat }} className="text-sm text-primary">عرض الكل ←</Link>
      </div>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {items.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
    </section>
  );
}
