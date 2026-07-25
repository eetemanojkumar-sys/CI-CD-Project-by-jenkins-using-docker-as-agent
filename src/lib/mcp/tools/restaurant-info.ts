import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "restaurant_info",
  title: "Restaurant info",
  description: "Get Brundavanam Family Restaurant contact details, address, and ordering links.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const info = {
      name: "Brundavanam Family Restaurant",
      type: "Family Restaurant (A/C)",
      address: "Nellore Road, Near Honda Showroom, Badvel, Kadapa District",
      phone: "+91 7075959303",
      whatsapp: "https://wa.me/917075959303",
      website: "https://yum-list-weaver.lovable.app",
    };
    const text = [
      info.name,
      info.type,
      `Address: ${info.address}`,
      `Phone: ${info.phone}`,
      `WhatsApp: ${info.whatsapp}`,
      `Website: ${info.website}`,
    ].join("\n");
    return { content: [{ type: "text", text }], structuredContent: info };
  },
});
