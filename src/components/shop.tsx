import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Search } from "lucide-react";
import { useState, type ReactNode } from "react";
import { categories, egp, FREE_SHIP_OVER, SALE_CAT, useStore } from "@/lib/store";
import type { Product } from "@/lib/floukaa.functions";

type Mini = Pick<Product, "id" | "name" | "price" | "img"> & { old?: number | undefined };

export function ProductCard({ p }: { p: Mini }) {
  const { fav, toggleFav, add } = useStore();
  const on = fav.some((x) => x.id === p.id);
  const off = p.old ? Math.round((1 - p.price / p.old) * 100) : 0;
  return (
    <div className="group">
      <div className="relative overflow-hidden rounded-2xl bg-muted">
        <Link to="/product/$id" params={{ id: String(p.id) }}>
          <img src={p.img} alt={p.name} loading="lazy" className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </Link>
        {off > 0 && <span className="absolute top-3 right-3 rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">-{off}%</span>}
        <button aria-label="مفضلة" onClick={() => toggleFav(p)} className="absolute top-3 left-3 grid h-9 w-9 place-items-center rounded-full bg-background/90">
          <Heart className={`h-4 w-4 ${on ? "fill-primary text-primary" : "text-foreground"}`} />
        </button>
        <button onClick={() => add(p)} className="absolute inset-x-3 bottom-3 translate-y-14 rounded-full bg-foreground py-2 text-sm font-bold text-background opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
          أضف للسلة
        </button>
      </div>
      <Link to="/product/$id" params={{ id: String(p.id) }} className="mt-3 block">
        <p className="truncate text-sm">{p.name}</p>
        <p className="mt-1 font-bold">
          {egp(p.price)} {p.old && <span className="text-xs font-normal text-muted-foreground line-through">{egp(p.old)}</span>}
        </p>
      </Link>
    </div>
  );
}

function Header() {
  const { cart, fav } = useStore();
  const count = cart.reduce((a, b) => a + b.qty, 0);
  const [q, setQ] = useState("");
  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
      <div className="bg-foreground py-2 text-center text-xs text-background">شحن مجاني للطلبات فوق {egp(FREE_SHIP_OVER)} • الدفع عند الاستلام لكل محافظات مصر</div>
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-4">
        <Link to="/" className="font-display text-3xl text-primary">فلوكه</Link>
        <form
          className="relative mx-auto hidden max-w-lg flex-1 md:block"
          onSubmit={(e) => { e.preventDefault(); window.location.href = `/shop?q=${encodeURIComponent(q)}`; }}
        >
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث عن سلاسل، خواتم، أساور..." className="w-full rounded-full bg-muted px-5 py-2.5 pl-10 text-sm outline-none focus:ring-2 focus:ring-ring" />
          <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </form>
        <div className="mr-auto flex items-center gap-5 md:mr-0">
          <Link to="/favorites" aria-label="المفضلة" className="relative"><Heart className="h-5 w-5" />{fav.length > 0 && <Badge n={fav.length} />}</Link>
          <Link to="/cart" aria-label="السلة" className="relative"><ShoppingBag className="h-5 w-5" />{count > 0 && <Badge n={count} />}</Link>
        </div>
      </div>
      <nav className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-6 pb-3 text-sm">
        <Link to="/shop" search={{ cat: SALE_CAT }} className="shrink-0 font-bold text-primary">خصومات حتى 50%</Link>
        {categories.map((c) => (
          <Link key={c.id} to="/shop" search={{ cat: c.id }} className="shrink-0 hover:text-primary" activeProps={{ className: "text-primary" }}>{c.name}</Link>
        ))}
      </nav>
    </header>
  );
}

const Badge = ({ n }: { n: number }) => (
  <span className="absolute -top-2 -left-2 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground">{n}</span>
);

function Footer() {
  return (
    <footer className="mt-20 border-t bg-secondary">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-4">
        <div>
          <p className="font-display text-2xl text-primary">فلوكه</p>
          <p className="mt-2 text-sm text-muted-foreground">فلوكه للإكسسوارات والهدايا — إكسسوارات ستانلس ومجوهرات فاشون بأسعار في متناول الجميع.</p>
        </div>
        <div>
          <p className="mb-3 font-bold">تسوق</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {categories.slice(0, 5).map((c) => <li key={c.id}><Link to="/shop" search={{ cat: c.id }}>{c.name}</Link></li>)}
          </ul>
        </div>
        <div>
          <p className="mb-3 font-bold">المساعدة</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>الشحن والتوصيل</li><li>الاستبدال والاسترجاع</li><li>تواصل معنا</li>
          </ul>
        </div>
        <div>
          <p className="mb-3 font-bold">تابعنا</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="https://floukaa.com" target="_blank" rel="noreferrer">floukaa.com</a></li>
          </ul>
        </div>
      </div>
      <p className="border-t py-4 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} Flouka</p>
    </footer>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div dir="rtl" className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-6">{children}</main>
      <Footer />
    </div>
  );
}
