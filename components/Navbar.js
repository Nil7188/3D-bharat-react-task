"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    {
      name: "Dashboard",
      href: "/dashboard",
    },
    {
      name: "Deals",
      href: "/deals",
    },
    {
      name: "Investors",
      href: "/investors",
    },
    {
      name: "Recommendations",
      href: "/recommendations",
    },
    {
      name: "Corporate",
      href: "/corporate",
    },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>

        <Link
          href="/"
          style={styles.logo}
        >
          3D Bharat
        </Link>

        <div style={styles.links}>
          {links.map((link) => {
            const active =
              pathname === link.href ||
              pathname.startsWith(
                `${link.href}/`
              );

            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  ...styles.link,
                  ...(active
                    ? styles.activeLink
                    : {}),
                }}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: "#0f172a",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },

  inner: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "14px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
  },

  logo: {
    color: "white",
    textDecoration: "none",
    fontSize: "20px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  links: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },

  link: {
    color: "#cbd5e1",
    textDecoration: "none",
    padding: "8px 12px",
    borderRadius: "7px",
    fontSize: "14px",
  },

  activeLink: {
    background: "#2563eb",
    color: "white",
  },
};