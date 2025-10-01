'use client';

import { Html } from '@react-three/drei';

export function LoadingFallback() {
  return (
    <Html center>
      <div className="flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    </Html>
  );
}