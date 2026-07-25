import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { menuCategories } from "../../../data/menuData";

export default defineTool({
  name: "list_menu",
  title: "List menu items",
  description:
    "List menu items with prices in INR. Optionally filter by a category label (case-insensitive, e.g. 'Veg Starters').",
  inputSchema: {
    category: z
      .string()
      .trim()
      .optional()
      .describe("Optional category label to filter by."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ category }) => {
    const filter = category?.toLowerCase();
    const cats = filter
      ? menuCategories.filter((c) => c.label.toLowerCase() === filter)
      : menuCategories;
    if (filter && cats.length === 0) {
      return {
        content: [{ type: "text", text: `No category matching "${category}".` }],
        isError: true,
      };
    }
    const lines: string[] = [];
    const structured = cats.map((c) => {
      lines.push(`\n## ${c.label}`);
      for (const it of c.items) lines.push(`- ${it.name} — ₹${it.price}`);
      return { category: c.label, items: c.items };
    });
    return {
      content: [{ type: "text", text: lines.join("\n").trim() }],
      structuredContent: { categories: structured },
    };
  },
});
