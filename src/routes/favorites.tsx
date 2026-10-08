import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { ProductCard, SiteShell } from "@/components/shop";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "المفضلة — فلوكه" },
      { name: "description", content: "القطع اللي حفظتها في فلوكه." },
      { property: "og:title", content: "المفضلة — فلوكه" },
      { property: "og:description", content: "قائمة المفضلة." },
    ],
  }),
  component: Fav,
});

function Fav() {
  const { fav } = useStore();
  return (
    <SiteShell>
      <h1 className="mt-10 mb-8 text-3xl font-bold">المفضلة</h1>
      {fav.length ? (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">{fav.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      ) : (
        <div className="py-24 text-center text-muted-foreground">لسه مفيش حاجة هنا<Link to="/shop" className="mt-4 block text-primary">ابدأ التسوق</Link></div>
      )}
    </SiteShell>
  );
}
