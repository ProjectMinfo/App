export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Next.js + NextUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Commander",
      href: "/",
    },
    {
      label: "gestionStock",
      href: "/gestionStock",
    },
    {
      label: "Docs",
      href: "/docs",

    },
    {
      label: "Prise commande",
      href: "/",
    },
    {
      label: "Affichage cuisine",
      href: "/",
    },
    {
      label: "Planing serveur",
      href: "/",
    },
    {

      label: "Modifications carte",
      href: "/",
    },
    {
      label: "Chat",
      href: "/chat",
    }
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Trésorerie",
      href: "/",
    },
    {
      label: "Compte",
      href: "/",
    },
    {
      label: "Paramètres",
      href: "/",
    }
  ],
  navGestionItems: [
    {
      label: "Gestion des stocks",
      href: "/",
    },
    {
      label: "Gestion des achats",
      href: "/",
    },
    {
      label: "Gestion des compte",
      href: "/",
    },
    {
      label: "Gestion des températures",
      href: "/",
    },
  ],
  links: {
    github: "https://github.com/nextui-org/nextui",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui.org",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
