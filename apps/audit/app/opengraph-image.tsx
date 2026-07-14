import { ImageResponse } from 'next/og';

import { siteConfig } from '@/app/siteConfig';

export const alt = 'Audit expense review dashboard';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: '#fff8f1',
        color: '#29231d',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
        padding: '72px',
        width: '100%',
      }}
    >
      <div style={{ color: '#c2410c', display: 'flex', fontSize: 34, fontWeight: 700 }}>{siteConfig.name}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 940 }}>
        <div style={{ display: 'flex', fontSize: 76, fontWeight: 700, letterSpacing: -2 }}>
          Review every expense with context.
        </div>
        <div style={{ color: '#6e6258', display: 'flex', fontSize: 28 }}>{siteConfig.description}</div>
      </div>
      <div style={{ color: '#8c7c6c', display: 'flex', fontSize: 22 }}>{siteConfig.url}</div>
    </div>
  );
}
