export interface NavItem {
  href: string;
  label: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Painel",
    items: [
      { href: "/dashboard", label: "Visão geral" },
      { href: "/dashboard/audits", label: "Auditoria" },
      { href: "/dashboard/reviews", label: "Avaliações" },
      { href: "/dashboard/posts", label: "Publicações" },
      { href: "/dashboard/performance", label: "Desempenho" },
      { href: "/dashboard/locations", label: "Unidades" },
    ],
  },
  {
    label: "Recursos",
    items: [
      { href: "/dashboard/help", label: "Glossário e guia" },
      { href: "/audit", label: "Formulário público" },
    ],
  },
];
