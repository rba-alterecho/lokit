import type { MetadataRoute } from 'next';
import { SITE_URL, url } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // As rotas de QR e a API nao tem nada para indexar e uma delas
        // (/l/<codigo>) vai ter tantos URLs quantos cacifos houver.
        disallow: ['/api/', '/l/'],
      },
    ],
    sitemap: url('/sitemap.xml'),
    host: SITE_URL,
  };
}
