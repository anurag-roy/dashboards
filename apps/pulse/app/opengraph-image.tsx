import { ImageResponse } from 'next/og';

import { siteConfig } from '@/app/siteConfig';

export const alt = 'Pulse customer support dashboard';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: '#f1fbf8',
        color: '#17312b',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
        padding: '72px',
        width: '100%',
      }}
    >
      <div style={{ color: '#0f766e', display: 'flex', fontSize: 34, fontWeight: 700 }}>{siteConfig.name}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 940 }}>
        <div style={{ display: 'flex', fontSize: 76, fontWeight: 700, letterSpacing: -2 }}>
          Keep support moving in real time.
        </div>
        <div style={{ color: '#54716b', display: 'flex', fontSize: 28 }}>{siteConfig.description}</div>
      </div>
      <div style={{ color: '#71918a', display: 'flex', fontSize: 22 }}>{siteConfig.url}</div>
    </div>
  );
}
