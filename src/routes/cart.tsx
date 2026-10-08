import { createFileRoute, Link } from "@tanstack/react-router";
import { egp, FREE_SHIP_OVER, products, shippingFor, useStore } from "@/lib/store";
import { AppShell, TopBar } from "@/components/shop";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "السلة — Floukaa" },
      { name: "description", content: "راجعي طلبك قبل الدفع." },
      { property: "og:title", content: "السلة — Floukaa" },
      { property: "og:description", content: "سلة التسوق." },
    ],
  }),
  component: Cart,
});

function Cart() {
  const { cart, setQty } = useStore();
  const items = products.filter((p) => cart[p.id]);
  const sub = items.reduce((s, p) => s + p.price * cart[p.id], 0);
  const ship = shippingFor(sub);
  return (
    <AppShell>
      <TopBar title="السلة" />
      {!items.length ? (
        <div className="py-24 text-center text-sm text-muted-foreground">السلة فاضية<Link to="/shop" className="mt-4 block text-primary">تسوقي دلوقتي</Link></div>
      ) : (
        <div className="space-y-4 p-4">
          {sub < FREE_SHIP_OVER && (
            <div className="rounded-xl bg-secondary p-3 text-xs">فاضل {egp(FREE_SHIP_OVER - sub)} وتاخدي شحن مجاني</div>
          )}
          {items.map((p) => (
            <div key={p.id} className="flex gap-3">
              <img src={p.img} alt={p.name} className="h-24 w-20 shrink-0 rounded-xl bg-muted object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{p.name}</p>
                <p className="text-sm font-bold">{egp(p.price)}</p>
                <div className="mt-2 inline-flex items-center gap-3 rounded-full border px-3 py-1 text-sm">
                  <button onClick={() => setQty(p.id, cart[p.id] + 1)}>+</button>
                  <span>{cart[p.id]}</span>
                  <button onClick={() => setQty(p.id, cart[p.id] - 1)}>−</button>
                </div>
              </div>
            </div>
          ))}
          <div className="space-y-1 border-t pt-4 text-sm">
            <Row a="المجموع" b={egp(sub)} />
            <Row a="الشحن" b={ship ? egp(ship) : "مجاني"} />
            <Row a="الإجمالي" b={egp(sub + ship)} bold />
          </div>
          <Link to="/checkout" className="block rounded-full bg-primary py-3 text-center font-bold text-primary-foreground">إتمام الطلب</Link>
        </div>
      )}
    </AppShell>
  );
}

export function Row({ a, b, bold }: { a: string; b: string; bold?: boolean }) {
  return <div className={`flex justify-between ${bold ? "text-base font-bold" : ""}`}><span>{a}</span><span>{b}</span></div>;
}
