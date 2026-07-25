import { defineMcp } from "@lovable.dev/mcp-js";
import listCategories from "./tools/list-categories";
import listMenu from "./tools/list-menu";
import searchMenu from "./tools/search-menu";
import restaurantInfo from "./tools/restaurant-info";
import buildOrderLink from "./tools/order-link";

export default defineMcp({
  name: "brundavanam-mcp",
  title: "Brundavanam Restaurant",
  version: "0.1.0",
  instructions:
    "Tools for Brundavanam Family Restaurant (Badvel, Kadapa). Browse the menu, search dishes by name, get contact/address info, and build a prefilled WhatsApp order link the customer can tap to place their order.",
  tools: [listCategories, listMenu, searchMenu, restaurantInfo, buildOrderLink],
});
