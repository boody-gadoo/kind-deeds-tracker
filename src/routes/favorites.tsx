import { createFileRoute, Link } from "@tanstack/react-router";
import { products, useStore } from "@/lib/store";
import { AppShell, ProductCard, TopBar } from "@/components/shop";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "المفضلة — Floukaa" },
      { name: "description", content: "القطع اللي حفظتيها في فلوكا." },
      { property: "og:title", content: "المفضلة — Floukaa" },
      { property: "og:description", content: "قائمة المفضلة." },
    ],
  }),
  component: Fav,
});

function Fav() {
  const { fav } = useStore();
  const list = products.filter((p) => fav.includes(p.id));
  return (
    <AppShell>
      <TopBar title="المفضلة" />
      {list.length ? (
        <div className="grid grid-cols-2 gap-4 p-4">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      ) : (
        <div className="py-24 text-center text-sm text-muted-foreground">
          لسه مفيش حاجة هنا
          <Link to="/shop" className="mt-4 block text-primary">ابدئي التسوق</Link>
        </div>
      )}
    </AppShell>
  );
}
