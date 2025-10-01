'use client';

import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Center, Float, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface GLBModelProps {
  url: string;
  position: [number, number, number];
  scale?: number;
  rotationSpeed?: number;
  floatIntensity?: number;
  color?: string | null;
  hoverScale?: number;
}

export default function GLBModel({
  url,
  position,
  scale = 1,
  rotationSpeed = 0.5,
  floatIntensity = 0.5,
  color = null,
  hoverScale = 1.1
}: GLBModelProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Load GLB model
  const { scene } = useGLTF(url);

  // Clone the scene to avoid sharing materials between instances
  const clonedScene = useMemo(() => {
    const cloned = scene.clone();

    // Apply materials and ensure proper rendering
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Always override material with custom color if provided
        if (color) {
          // Handle both single materials and material arrays
          if (Array.isArray(child.material)) {
            child.material = child.material.map(() => new THREE.MeshStandardMaterial({
              color: color,
              metalness: 0.1,
              roughness: 0.2,
              envMapIntensity: 1,
            }));
          } else {
            child.material = new THREE.MeshStandardMaterial({
              color: color,
              metalness: 0.1,
              roughness: 0.2,
              envMapIntensity: 1,
            });
          }
        } else if (!child.material) {
          child.material = new THREE.MeshStandardMaterial({
            color: '#ffffff',
            metalness: 0.1,
            roughness: 0.2,
            envMapIntensity: 1,
          });
        }

        // Ensure materials are properly configured for lighting
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => {
            if (mat instanceof THREE.MeshStandardMaterial) {
              mat.needsUpdate = true;
            }
          });
        } else if (child.material instanceof THREE.MeshStandardMaterial) {
          child.material.needsUpdate = true;
        }

        // Enable shadows
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    return cloned;
  }, [scene, color]);

  // Animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed * 0.01;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * floatIntensity;

      // Smooth hover scaling
      const targetScale = hovered ? scale * hoverScale : scale;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.2}
      floatIntensity={floatIntensity}
    >
      <group
        ref={meshRef}
        position={position}
        scale={scale}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <Center>
          <primitive object={clonedScene} />
        </Center>
      </group>
    </Float>
  );
}

// Preload function for better performance
export function preloadGLBModel(url: string) {
  useGLTF.preload(url);
}