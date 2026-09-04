import { NAV_GROUPS } from "../lib/nav";
import { SidebarLink } from "./SidebarLink";

export function Sidebar() {
  return (
    <nav className="sidebar" aria-label="Navegação principal">
      <div className="sidebar-brand">📍 Local Presence Ops</div>
      {NAV_GROUPS.map((group) => (
        <div key={group.label}>
          <div className="sidebar-group-label">{group.label}</div>
          {group.items.map((item) => (
            <SidebarLink key={item.href} href={item.href} label={item.label} />
          ))}
        </div>
      ))}
    </nav>
  );
}
