export const siteConfig = {
  name: 'Perseva Store',
  description: 'Modern e-ticaret platformu',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ogImage: '/og-image.jpg',
  links: {
    twitter: 'https://twitter.com',
    github: 'https://github.com',
  },
};

export type SiteConfig = typeof siteConfig;
