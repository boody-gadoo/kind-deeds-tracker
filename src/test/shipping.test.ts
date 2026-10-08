import { describe, it, expect } from "vitest";
import { shippingFor } from "@/lib/store";

describe("shipping", () => {
  it("charges 60 below 1000", () => expect(shippingFor(500)).toBe(60));
  it("free at 1000+", () => expect(shippingFor(1000)).toBe(0));
});
