import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { menuCategories } from "@/data/menuData";

export default defineTool({
  name: "search_menu",
  title: "Search menu",
  description: "Search menu items by keyword in the dish name. Returns matches with price and category.",
  inputSchema: {
    query: z.string().trim().min(1).describe("Keyword to match against dish names."),
    limit: z.number().int().min(1).max(50).default(20),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, limit }) => {
    const q = query.toLowerCase();
    const matches: { name: string; price: number; category: string }[] = [];
    for (const c of menuCategories) {
      for (const it of c.items) {
        if (it.name.toLowerCase().includes(q)) {
          matches.push({ name: it.name, price: it.price, category: c.label });
          if (matches.length >= limit) break;
        }
      }
      if (matches.length >= limit) break;
    }
    const text = matches.length
      ? matches.map((m) => `- ${m.name} — ₹${m.price} (${m.category})`).join("\n")
      : `No dishes matching "${query}".`;
    return {
      content: [{ type: "text", text }],
      structuredContent: { matches },
    };
  },
});
