export interface HeroSlide {
  eyebrow?: string;
  heading: string;
  sub: string;
  cta: string;
  href: string;
}

// Copy matches the two hero slides on merqube.com.
export const HERO_SLIDES: HeroSlide[] = [
  {
    heading: "Advanced Indexing Technology",
    sub: "MerQube is empowering the future of passive investing.",
    cta: "Explore our Indices",
    href: "#",
  },
  {
    heading: "Introducing The Garage",
    sub: "Our Tools, Your Rules.",
    cta: "Enter The Garage",
    href: "#",
  },
];

export interface FeatureCard {
  title: string;
  body: string;
  cta: string;
  href: string;
}

export const FEATURE_CARDS: FeatureCard[] = [
  {
    title: "Technology optimized indexing",
    body: "MerQube brings unique state-of-the art cloud native technology to rules-based investing. We optimize the design and calculation of a wide range of indices covering equities, multi asset, futures and options.",
    cta: "Learn about our indices",
    href: "#",
  },
  {
    title: "Home of Transformational Index Technology",
    body: "Created by executives from leading financial and technology firms, MerQube is the place at the heart of the financial ecosystem where innovators connect with transformational index technologies.",
    cta: "Find out more",
    href: "#",
  },
  {
    title: "Powering the Evolution of Indexing",
    body: "Our indices power the cutting edge of index investing. MerQube technologies drive sophisticated, derivatives based strategies that democratize access to products [like autocallables] that were previously out of reach for retail investors.",
    cta: "Explore our advanced indices",
    href: "#",
  },
];
