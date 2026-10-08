import { createFileRoute, Link } from "@tanstack/react-router";
import { egp, FREE_SHIP_OVER, shippingFor, useStore } from "@/lib/store";
import { SiteShell } from "@/components/shop";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "سلة التسوق — فلوكه" },
      { name: "description", content: "راجع طلبك قبل إتمام الشراء." },
      { property: "og:title", content: "سلة التسوق — فلوكه" },
      { property: "og:description", content: "سلة التسوق." },
    ],
  }),
  component: Cart,
});

function Cart() {
  const { cart, setQty } = useStore();
  const sub = cart.reduce((s, p) => s + p.price * p.qty, 0);
  const ship = shippingFor(sub);
  return (
    <SiteShell>
      <h1 className="mt-10 mb-8 text-3xl font-bold">سلة التسوق</h1>
      {!cart.length ? (
        <div className="py-24 text-center text-muted-foreground">السلة فاضية<Link to="/shop" className="mt-4 block text-primary">تسوق دلوقتي</Link></div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="divide-y">
            {cart.map((p) => (
              <div key={p.id} className="flex gap-5 py-5">
                <img src={p.img} alt={p.name} className="h-28 w-28 shrink-0 rounded-xl bg-muted object-cover" />
                <div className="min-w-0 flex-1">
                  <Link to="/product/$id" params={{ id: String(p.id) }} className="font-medium">{p.name}</Link>
                  <p className="mt-1 font-bold">{egp(p.price)}</p>
                  <div className="mt-3 inline-flex items-center gap-4 rounded-full border px-4 py-1">
                    <button onClick={() => setQty(p.id, p.qty + 1)}>+</button><span>{p.qty}</span><button onClick={() => setQty(p.id, p.qty - 1)}>−</button>
                  </div>
                </div>
                <button onClick={() => setQty(p.id, 0)} className="self-start text-sm text-muted-foreground">حذف</button>
              </div>
            ))}
          </div>
          <aside className="h-fit space-y-3 rounded-2xl bg-secondary p-6">
            {sub < FREE_SHIP_OVER && <p className="text-sm">فاضل {egp(FREE_SHIP_OVER - sub)} للشحن المجاني</p>}
            <Row a="المجموع" b={egp(sub)} />
            <Row a="الشحن" b={ship ? egp(ship) : "مجاني"} />
            <div className="border-t pt-3"><Row a="الإجمالي" b={egp(sub + ship)} bold /></div>
            <Link to="/checkout" className="block rounded-full bg-primary py-3 text-center font-bold text-primary-foreground">إتمام الطلب</Link>
          </aside>
        </div>
      )}
    </SiteShell>
  );
}

function Row({ a, b, bold }: { a: string; b: string; bold?: boolean }) {
  return <div className={`flex justify-between ${bold ? "text-lg font-bold" : ""}`}><span>{a}</span><span>{b}</span></div>;
}
