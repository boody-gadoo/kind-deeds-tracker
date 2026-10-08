import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Product } from "./floukaa.functions";

export const categories = [
  { id: 207, name: "سلاسل" },
  { id: 209, name: "أساور" },
  { id: 262, name: "خواتم" },
  { id: 255, name: "حلقان" },
  { id: 208, name: "خلخال" },
  { id: 335, name: "بروش" },
  { id: 302, name: "بيرسينج" },
  { id: 293, name: "مداليا" },
  { id: 322, name: "توكة" },
  { id: 328, name: "شنط" },
  { id: 333, name: "ساعات" },
  { id: 309, name: "أطفال" },
];
export const SALE_CAT = 579;

export const egp = (n: number) => `${n.toLocaleString("en-EG")} ج.م`;
export const SHIPPING = 60;
export const FREE_SHIP_OVER = 1000;
export const shippingFor = (subtotal: number) => (subtotal >= FREE_SHIP_OVER || subtotal === 0 ? 0 : SHIPPING);

export type CartItem = { id: number; name: string; price: number; img: string; qty: number };
type Mini = Pick<Product, "id" | "name" | "price" | "img">;

type Ctx = {
  cart: CartItem[];
  fav: Mini[];
  add: (p: Mini) => void;
  setQty: (id: number, q: number) => void;
  toggleFav: (p: Mini) => void;
  clear: () => void;
};
const C = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [fav, setFav] = useState<Mini[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const c = JSON.parse(localStorage.getItem("fk-cart2") || "[]");
      const f = JSON.parse(localStorage.getItem("fk-fav2") || "[]");
      if (Array.isArray(c)) setCart(c);
      if (Array.isArray(f)) setFav(f);
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem("fk-cart2", JSON.stringify(cart)); }, [cart, ready]);
  useEffect(() => { if (ready) localStorage.setItem("fk-fav2", JSON.stringify(fav)); }, [fav, ready]);
  const value: Ctx = {
    cart,
    fav,
    add: (p) =>
      setCart((c) => {
        const e = c.find((x) => x.id === p.id);
        if (e) return c.map((x) => (x.id === p.id ? { ...x, qty: x.qty + 1 } : x));
        return [...c, { id: p.id, name: p.name, price: p.price, img: p.img, qty: 1 }];
      }),
    setQty: (id, q) => setCart((c) => (q <= 0 ? c.filter((x) => x.id !== id) : c.map((x) => (x.id === id ? { ...x, qty: q } : x)))),
    toggleFav: (p) =>
      setFav((f) => (f.some((x) => x.id === p.id) ? f.filter((x) => x.id !== p.id) : [...f, { id: p.id, name: p.name, price: p.price, img: p.img }])),
    clear: () => setCart([]),
  };
  return <C.Provider value={value}>{children}</C.Provider>;
}
export const useStore = () => useContext(C)!;
