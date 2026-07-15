import { ImageResponse } from 'next/og';

import { siteConfig } from '@/app/siteConfig';

export const alt = 'Nova AI observability dashboard';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: '#f6f3ff',
        color: '#252039',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
        padding: '72px',
        width: '100%',
      }}
    >
      <div style={{ color: '#7c3aed', display: 'flex', fontSize: 34, fontWeight: 700 }}>{siteConfig.name}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 940 }}>
        <div style={{ display: 'flex', fontSize: 76, fontWeight: 700, letterSpacing: -2 }}>
          Understand every AI request.
        </div>
        <div style={{ color: '#655f7d', display: 'flex', fontSize: 28 }}>{siteConfig.description}</div>
      </div>
      <div style={{ color: '#817a9d', display: 'flex', fontSize: 22 }}>{siteConfig.url}</div>
    </div>
  );
}
