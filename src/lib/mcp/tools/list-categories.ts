import { defineTool } from "@lovable.dev/mcp-js";
import { menuCategories } from "../../../data/menuData";

export default defineTool({
  name: "list_categories",
  title: "List menu categories",
  description: "List all menu category names at Brundavanam Family Restaurant.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const categories = menuCategories.map((c) => c.label);
    return {
      content: [{ type: "text", text: categories.join("\n") }],
      structuredContent: { categories },
    };
  },
});
