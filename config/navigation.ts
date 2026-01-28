import type { NavItem } from '@/types';

export const mainNav: NavItem[] = [
  {
    title: 'Ana Sayfa',
    href: '/',
  },
  {
    title: 'Ürünler',
    href: '/products',
  },
  {
    title: 'Kategoriler',
    href: '/categories',
  },
];

export const dashboardNav: NavItem[] = [
  {
    title: 'Siparişlerim',
    href: '/orders',
  },
  {
    title: 'Profilim',
    href: '/profile',
  },
];

export const adminNav: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
  },
  {
    title: 'Ürünler',
    href: '/admin/products',
  },
  {
    title: 'Kategoriler',
    href: '/admin/categories',
  },
  {
    title: 'Siparişler',
    href: '/admin/orders',
  },
];
