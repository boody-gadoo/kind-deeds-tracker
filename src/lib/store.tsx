import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";

export type Product = { id: string; name: string; cat: string; price: number; old?: number; img: string; tag?: string };

export const categories = [
  { id: "necklaces", name: "سلاسل" },
  { id: "rings", name: "خواتم" },
  { id: "earrings", name: "حلقان" },
  { id: "bracelets", name: "أساور" },
];

const imgs: Record<string, string> = { necklaces: p1, rings: p2, earrings: p3, bracelets: p3 };
const names: Record<string, string[]> = {
  necklaces: ["سلسلة لؤلؤة ذهبي", "سلسلة حرف اسم", "سلسلة طبقات", "سلسلة فراشة"],
  rings: ["خاتم ستاكينج", "خاتم مطفي ذهبي", "خاتم زركون", "خاتم موجة"],
  earrings: ["حلق لؤلؤ نقطة", "حلق هوب صغير", "حلق نجمة", "حلق كريستال"],
  bracelets: ["أسورة لؤلؤ", "أسورة سلسلة", "أسورة حجر قمر", "أسورة قلوب"],
};
export const products: Product[] = categories.flatMap((c, ci) =>
  names[c.id].map((n, i) => {
    const price = 250 + ((ci * 4 + i) * 73) % 400;
    return { id: `${c.id}-${i}`, name: n, cat: c.id, price, old: i % 2 ? undefined : price + 120, img: imgs[c.id], tag: i === 0 ? "جديد" : i === 2 ? "الأكثر مبيعاً" : undefined };
  }),
);

export const egp = (n: number) => `${n.toLocaleString("ar-EG")} ج.م`;
export const SHIPPING = 60;
export const FREE_SHIP_OVER = 1000;
export const shippingFor = (subtotal: number) => (subtotal >= FREE_SHIP_OVER || subtotal === 0 ? 0 : SHIPPING);

type Ctx = {
  cart: Record<string, number>;
  fav: string[];
  add: (id: string) => void;
  setQty: (id: string, q: number) => void;
  toggleFav: (id: string) => void;
  clear: () => void;
};
const C = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [fav, setFav] = useState<string[]>([]);
  useEffect(() => {
    try {
      setCart(JSON.parse(localStorage.getItem("fk-cart") || "{}"));
      setFav(JSON.parse(localStorage.getItem("fk-fav") || "[]"));
    } catch {}
  }, []);
  useEffect(() => localStorage.setItem("fk-cart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("fk-fav", JSON.stringify(fav)), [fav]);
  const value: Ctx = {
    cart,
    fav,
    add: (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 })),
    setQty: (id, q) =>
      setCart((c) => {
        const n = { ...c };
        if (q <= 0) delete n[id];
        else n[id] = q;
        return n;
      }),
    toggleFav: (id) => setFav((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id])),
    clear: () => setCart({}),
  };
  return <C.Provider value={value}>{children}</C.Provider>;
}
export const useStore = () => useContext(C)!;
