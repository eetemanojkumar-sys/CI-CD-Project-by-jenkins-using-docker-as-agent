import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { menuCategories } from "../../../data/menuData";

export default defineTool({
  name: "build_whatsapp_order_link",
  title: "Build WhatsApp order link",
  description:
    "Build a prefilled WhatsApp link the customer can tap to place an order. Provide items by exact dish name and quantity.",
  inputSchema: {
    items: z
      .array(
        z.object({
          name: z.string().trim().min(1),
          qty: z.number().int().min(1).max(50),
        }),
      )
      .min(1)
      .describe("List of dishes with quantities."),
    customer_name: z.string().trim().max(60).optional(),
    order_type: z.enum(["dine-in", "takeaway"]).default("dine-in"),
    notes: z.string().trim().max(200).optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ items, customer_name, order_type, notes }) => {
    const lookup = new Map<string, number>();
    for (const c of menuCategories) for (const it of c.items) lookup.set(it.name.toLowerCase(), it.price);

    const resolved: { name: string; qty: number; price: number }[] = [];
    const missing: string[] = [];
    for (const i of items) {
      const price = lookup.get(i.name.toLowerCase());
      if (price === undefined) missing.push(i.name);
      else resolved.push({ name: i.name, qty: i.qty, price });
    }
    if (missing.length) {
      return {
        content: [
          {
            type: "text",
            text: `Unknown dishes: ${missing.join(", ")}. Use search_menu to find exact names.`,
          },
        ],
        isError: true,
      };
    }

    const total = resolved.reduce((s, r) => s + r.price * r.qty, 0);
    const lines = [
      `Hi Brundavanam! I'd like to order:`,
      "",
      ...resolved.map((r) => `• ${r.name} x${r.qty} — ₹${r.price * r.qty}`),
      "",
      `Total: ₹${total}`,
      `Type: ${order_type === "dine-in" ? "Dine-in" : "Takeaway"}`,
    ];
    if (customer_name) lines.push(`Name: ${customer_name}`);
    if (notes) lines.push(`Notes: ${notes}`);

    const message = lines.join("\n");
    const url = `https://wa.me/917075959303?text=${encodeURIComponent(message)}`;

    return {
      content: [{ type: "text", text: `${url}\n\n---\n${message}` }],
      structuredContent: { url, message, total, items: resolved, order_type },
    };
  },
});
