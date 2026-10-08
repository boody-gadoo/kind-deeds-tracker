import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { egp, shippingFor, useStore } from "@/lib/store";
import { SiteShell } from "@/components/shop";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "إتمام الطلب — فلوكه" },
      { name: "description", content: "أدخل بيانات التوصيل وأكد طلبك." },
      { property: "og:title", content: "إتمام الطلب — فلوكه" },
      { property: "og:description", content: "الدفع عند الاستلام لكل مصر." },
    ],
  }),
  component: Checkout,
});

const govs = ["القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "الشرقية", "القليوبية", "الغربية", "المنوفية", "البحيرة", "أخرى"];

function Checkout() {
  const { cart, clear } = useStore();
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const sub = cart.reduce((s, p) => s + p.price * p.qty, 0);
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
      <SiteShell>
        <div className="py-32 text-center">
          <p className="font-display text-4xl">شكراً!</p>
          <p className="mt-3 text-muted-foreground">طلبك اتسجل وهنكلمك للتأكيد.</p>
          <Link to="/" className="mt-8 inline-block rounded-full bg-primary px-7 py-3 text-primary-foreground">الرئيسية</Link>
        </div>
      </SiteShell>
    );
  return (
    <SiteShell>
      <h1 className="mt-10 mb-8 text-3xl font-bold">إتمام الطلب</h1>
      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <input name="name" required placeholder="الاسم بالكامل" className={input} />
          <input name="phone" required inputMode="tel" placeholder="رقم الموبايل" className={input} />
          <select name="gov" required className={input}>{govs.map((g) => <option key={g}>{g}</option>)}</select>
          <input name="city" required placeholder="المدينة / المنطقة" className={input} />
          <textarea name="addr" required placeholder="العنوان بالتفصيل" rows={3} className={`${input} sm:col-span-2`} />
          <div className="rounded-xl bg-secondary p-4 text-sm sm:col-span-2">طريقة الدفع: كاش عند الاستلام</div>
          {err && <p className="text-sm text-destructive sm:col-span-2">{err}</p>}
          <button disabled={!sub} className="rounded-full bg-primary py-3.5 font-bold text-primary-foreground disabled:opacity-50 sm:col-span-2">تأكيد الطلب • {egp(total)}</button>
        </form>
        <aside className="h-fit space-y-3 rounded-2xl bg-secondary p-6">
          {cart.map((p) => (
            <div key={p.id} className="flex items-center gap-3 text-sm">
              <img src={p.img} alt="" className="h-12 w-12 rounded-lg object-cover" />
              <span className="min-w-0 flex-1 truncate">{p.name} × {p.qty}</span>
              <span>{egp(p.price * p.qty)}</span>
            </div>
          ))}
          <div className="flex justify-between border-t pt-3 font-bold"><span>الإجمالي</span><span>{egp(total)}</span></div>
        </aside>
      </div>
    </SiteShell>
  );
}
