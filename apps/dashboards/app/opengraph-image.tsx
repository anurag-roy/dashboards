import { ImageResponse } from 'next/og';

import { siteConfig } from '@/app/siteConfig';

export const alt = 'Dashboards product demos';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: '#f7f7f5',
        color: '#161616',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
        padding: '72px',
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', fontSize: 32, fontWeight: 600 }}>{siteConfig.name}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 960 }}>
        <div style={{ color: '#4f46e5', display: 'flex', fontSize: 72, fontWeight: 700, letterSpacing: -2 }}>
          Four focused dashboard products.
        </div>
        <div style={{ color: '#666666', display: 'flex', fontSize: 28 }}>{siteConfig.description}</div>
      </div>
      <div style={{ color: '#888888', display: 'flex', fontSize: 22 }}>{siteConfig.url}</div>
    </div>
  );
}
