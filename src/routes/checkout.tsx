import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { egp, products, shippingFor, useStore } from "@/lib/store";
import { AppShell, TopBar } from "@/components/shop";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "إتمام الطلب — Floukaa" },
      { name: "description", content: "أدخلي بيانات التوصيل وأكدي طلبك." },
      { property: "og:title", content: "إتمام الطلب — Floukaa" },
      { property: "og:description", content: "الدفع عند الاستلام لكل مصر." },
    ],
  }),
  component: Checkout,
});

const govs = ["القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "الشرقية", "أخرى"];

function Checkout() {
  const { cart, clear } = useStore();
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const sub = products.reduce((s, p) => s + p.price * (cart[p.id] || 0), 0);
  const total = sub + shippingFor(sub);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (!/^01[0125]\d{8}$/.test(String(f.get("phone")))) return setErr("رقم الموبايل لازم يكون ١١ رقم ويبدأ بـ 01");
    clear();
    setDone(true);
  };
  const input = "w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring";
  if (done)
    return (
      <AppShell>
        <div className="px-6 py-32 text-center">
          <p className="font-display text-3xl">شكراً!</p>
          <p className="mt-2 text-sm text-muted-foreground">طلبك اتسجل وهنكلمك للتأكيد.</p>
          <Link to="/" className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-primary-foreground">الرئيسية</Link>
        </div>
      </AppShell>
    );
  return (
    <AppShell>
      <TopBar back title="إتمام الطلب" />
      <form onSubmit={submit} className="space-y-3 p-4">
        <input name="name" required placeholder="الاسم بالكامل" className={input} />
        <input name="phone" required inputMode="tel" placeholder="رقم الموبايل" className={input} />
        <select name="gov" required className={input}>{govs.map((g) => <option key={g}>{g}</option>)}</select>
        <textarea name="addr" required placeholder="العنوان بالتفصيل" rows={3} className={input} />
        <div className="rounded-xl bg-secondary p-3 text-sm">الدفع: كاش عند الاستلام</div>
        {err && <p className="text-sm text-destructive">{err}</p>}
        <button disabled={!sub} className="w-full rounded-full bg-primary py-3 font-bold text-primary-foreground disabled:opacity-50">تأكيد الطلب • {egp(total)}</button>
      </form>
    </AppShell>
  );
}
