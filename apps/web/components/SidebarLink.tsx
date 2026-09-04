"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SidebarLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <Link href={href} className={isActive ? "active" : undefined}>
      {label}
    </Link>
  );
}
