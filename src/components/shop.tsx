import { Link, useRouterState } from "@tanstack/react-router";
import { Heart, Home, LayoutGrid, ShoppingBag, Search } from "lucide-react";
import type { ReactNode } from "react";
import { egp, useStore, type Product } from "@/lib/store";

export function ProductCard({ p }: { p: Product }) {
  const { fav, toggleFav } = useStore();
  const on = fav.includes(p.id);
  return (
    <div className="group">
      <div className="relative overflow-hidden rounded-2xl bg-muted">
        <Link to="/product/$id" params={{ id: p.id }}>
          <img src={p.img} alt={p.name} loading="lazy" width={768} height={960} className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-active:scale-95" />
        </Link>
        {p.tag && <span className="absolute top-2 right-2 rounded-full bg-background px-2 py-0.5 text-[10px] font-bold text-primary">{p.tag}</span>}
        <button aria-label="مفضلة" onClick={() => toggleFav(p.id)} className="absolute top-2 left-2 grid h-8 w-8 place-items-center rounded-full bg-background/90">
          <Heart className={`h-4 w-4 ${on ? "fill-primary text-primary" : "text-foreground"}`} />
        </button>
      </div>
      <Link to="/product/$id" params={{ id: p.id }} className="mt-2 block">
        <p className="truncate text-sm font-medium">{p.name}</p>
        <p className="text-sm font-bold">
          {egp(p.price)} {p.old && <span className="text-xs font-normal text-muted-foreground line-through">{egp(p.old)}</span>}
        </p>
      </Link>
    </div>
  );
}

export function TopBar({ title, back }: { title?: string; back?: boolean }) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between bg-background/95 px-4 py-3 backdrop-blur">
      {back ? <button onClick={() => history.back()} className="text-sm">→ رجوع</button> : <Link to="/shop" aria-label="بحث"><Search className="h-5 w-5" /></Link>}
      <h1 className="font-display text-xl">{title ?? "floukaa"}</h1>
      <Link to="/favorites" aria-label="المفضلة"><Heart className="h-5 w-5" /></Link>
    </header>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { cart } = useStore();
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const tabs = [
    { to: "/", label: "الرئيسية", icon: Home },
    { to: "/shop", label: "تسوق", icon: LayoutGrid },
    { to: "/favorites", label: "المفضلة", icon: Heart },
    { to: "/cart", label: "السلة", icon: ShoppingBag },
  ] as const;
  return (
    <div dir="rtl" className="mx-auto min-h-screen max-w-md bg-background pb-20 shadow-sm">
      {children}
      <nav className="fixed bottom-0 left-1/2 z-30 grid w-full max-w-md -translate-x-1/2 grid-cols-4 border-t bg-background py-2">
        {tabs.map((t) => {
          const active = t.to === "/" ? path === "/" : path.startsWith(t.to);
          return (
            <Link key={t.to} to={t.to} className={`relative flex flex-col items-center gap-0.5 text-[11px] ${active ? "text-primary" : "text-muted-foreground"}`}>
              <t.icon className="h-5 w-5" />
              {t.label}
              {t.to === "/cart" && count > 0 && <span className="absolute -top-1 right-[30%] grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[9px] text-primary-foreground">{count}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
