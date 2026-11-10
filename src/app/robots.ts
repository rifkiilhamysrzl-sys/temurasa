import { MetadataRoute } from 'next';
import { getAppBaseUrl } from '@/lib/config';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getAppBaseUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin', '/assessment/', '/room/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
