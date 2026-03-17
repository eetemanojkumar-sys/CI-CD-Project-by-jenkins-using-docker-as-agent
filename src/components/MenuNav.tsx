import { menuCategories } from "@/data/menuData";

const MenuNav = () => {
  return (
    <nav className="px-6 md:px-16 py-8 border-t border-border overflow-x-auto">
      <div className="flex gap-6 min-w-max">
        {menuCategories.map((cat, i) => (
          <a
            key={i}
            href={`#section-${i}`}
            className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-500 whitespace-nowrap"
          >
            {cat.label}
          </a>
        ))}
      </div>
    </nav>
  );
};

export default MenuNav;
