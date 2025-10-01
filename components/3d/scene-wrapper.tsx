'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { LoadingFallback } from './loading-fallback';

interface SceneWrapperProps {
  children: React.ReactNode;
  className?: string;
  cameraPosition?: [number, number, number];
  fov?: number;
}

export default function SceneWrapper({ 
  children, 
  className = "w-full h-full",
  cameraPosition = [0, 0, 8],
  fov = 45
}: SceneWrapperProps) {
  return (
    <Canvas
      camera={{ position: cameraPosition, fov }}
      className={className}
      shadows
      gl={{ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance"
      }}
      dpr={[1, 2]} // Responsive pixel ratio for performance
    >
      <Suspense fallback={<LoadingFallback />}>
        {children}
      </Suspense>
    </Canvas>
  );
}