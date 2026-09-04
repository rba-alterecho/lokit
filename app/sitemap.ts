import type { MetadataRoute } from 'next';
import { ROTAS, url } from '@/lib/site';

// Gerado a partir da lista de rotas reais. Escrever um sitemap a mao e
// garantir que um dia ele mente.
export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date();
  return ROTAS.map((r) => ({
    url: url(r.href),
    lastModified: agora,
    changeFrequency: r.href === '/' ? 'weekly' : 'monthly',
    priority: r.href === '/' ? 1 : r.href === '/parcerias' ? 0.9 : 0.6,
  }));
}
