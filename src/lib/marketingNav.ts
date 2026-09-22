export interface NavColumn {
  label: string;
  href: string;
  items: { label: string; href: string }[];
}

// Mirrors the public navigation structure at merqube.com.
export const MAIN_NAV: NavColumn[] = [
  {
    label: "Indices",
    href: "#",
    items: [
      { label: "Index Finder", href: "#" },
      { label: "MerQube for Insurance", href: "#" },
      { label: "QueensField AI", href: "#" },
      { label: "Impact Cubed", href: "#" },
    ],
  },
  {
    label: "About",
    href: "#",
    items: [
      { label: "Our Story", href: "#" },
      { label: "Our Team", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
  {
    label: "Governance",
    href: "#",
    items: [
      { label: "Announcements", href: "#" },
      { label: "Consultations", href: "#" },
      { label: "Policies", href: "#" },
      { label: "Supplemental Data", href: "#" },
    ],
  },
  {
    label: "Qubits",
    href: "#",
    items: [
      { label: "Coverage", href: "#" },
      { label: "Press Releases", href: "#" },
      { label: "Insights", href: "#" },
      { label: "FAQs", href: "#" },
    ],
  },
];

export const UTILITY_NAV = [
  { label: "The Garage", href: "#" },
  { label: "Support", href: "#", items: [{ label: "Support Center", href: "#" }, { label: "Documentation and Guides", href: "#" }] },
  { label: "Contact", href: "#" },
  { label: "Login", href: "#" },
];
