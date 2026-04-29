import { MetadataRoute } from 'next';

type Radio = {
  id: number;
  name: string;
  channel: string;
  slug: string;
  seo_title: string;
  desc_title: string;
  image_url: string;
  url_stream: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://radio.streamku.net';

  // Fetch radios
  let radios: Radio[] = [];
  try {
    const res = await fetch('https://iptv.streamku.net/radio/stream.json');
    if (res.ok) {
      radios = await res.json();
    }
  } catch (err) {
    console.error('Failed to fetch radios for sitemap:', err);
  }

  const radioUrls: MetadataRoute.Sitemap = radios.map((radio) => ({
    url: `${baseUrl}/${radio.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...radioUrls,
  ];
}
