'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, Float, Environment, ContactShadows, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';

// ----------------- Loading Fallback -----------------
function LoadingFallback() {
  return (
    <Html center>
      <div className="flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    </Html>
  );
}

// ----------------- GLB Model Component -----------------
function GLBModel({ url, position, scale = 1, rotationSpeed = 0.5 }: { url: string; position: [number, number, number]; scale?: number; rotationSpeed?: number }) {
  const meshRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(url);

  useFrame((state) => {
    if (meshRef.current) {
      // Smooth rotation
      meshRef.current.rotation.y += rotationSpeed * 0.01;

      // Smooth up and down movement
      const time = state.clock.elapsedTime;
      const floatOffset = Math.sin(time * 0.8 + position[0] * 0.3) * 0.3;
      meshRef.current.position.y = position[1] + floatOffset;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.2}>
      <group ref={meshRef} position={position} scale={scale}>
        <Center>
          <primitive object={scene} />
        </Center>
      </group>
    </Float>
  );
}

// ----------------- Fallback Icon Component -----------------
function FallbackTechIcon({ position, symbol, color = '#ffffff', scale = 1 }: { position: [number, number, number]; symbol: string; color?: string; scale?: number }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Smooth rotation
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3;

      // Smooth up and down movement
      const time = state.clock.elapsedTime;
      const floatOffset = Math.sin(time * 0.8 + position[0] * 0.3) * 0.3;
      meshRef.current.position.y = position[1] + floatOffset;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.2}>
      <group ref={meshRef} position={position} scale={scale}>
        {/* Background box */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2, 2, 0.3]} />
          <meshStandardMaterial color={color} metalness={0.1} roughness={0.2} />
        </mesh>

        {/* Tech Symbol Geometry */}
        {symbol === 'Python' && (
          <group position={[0, 0, 0.2]}>
            <mesh position={[-0.2, 0.2, 0]}>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshStandardMaterial color="#3776AB" emissive="#3776AB" emissiveIntensity={0.1} metalness={0.1} roughness={0.2} />
            </mesh>
            <mesh position={[0.2, -0.2, 0]}>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshStandardMaterial color="#FFD43B" emissive="#FFD43B" emissiveIntensity={0.1} metalness={0.1} roughness={0.2} />
            </mesh>
          </group>
        )}

        {symbol === 'React' && (
          <group position={[0, 0, 0.2]}>
            {[0, Math.PI / 3, -Math.PI / 3].map((rot, i) => (
              <mesh key={i} rotation={[0, 0, rot]}>
                <torusGeometry args={[0.8, 0.05, 8, 32]} />
                <meshStandardMaterial color="#61DAFB" emissive="#61DAFB" emissiveIntensity={0.2} metalness={0.1} roughness={0.1} />
              </mesh>
            ))}
            <mesh>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color="#61DAFB" emissive="#61DAFB" emissiveIntensity={0.3} metalness={0.2} roughness={0.1} />
            </mesh>
          </group>
        )}

        {symbol === 'Node' && (
          <mesh position={[0, 0, 0.2]}>
            <cylinderGeometry args={[0.7, 0.7, 0.2, 6]} />
            <meshStandardMaterial color="#339933" emissive="#339933" emissiveIntensity={0.1} metalness={0.1} roughness={0.2} />
          </mesh>
        )}

        {symbol === 'Docker' && (
          <>
            {[[-0.4, 0, 0], [0, 0.2, 0], [0, 0, 0], [0.4, 0, 0]].map((pos, i) => (
              <mesh key={i} position={pos as [number, number, number]}>
                <boxGeometry args={[0.3, 0.3, 0.1]} />
                <meshStandardMaterial color="#2496ED" emissive="#2496ED" emissiveIntensity={0.1} metalness={0.1} roughness={0.2} />
              </mesh>
            ))}
          </>
        )}

        {symbol === 'GitHub' && (
          <group position={[0, 0, 0.2]}>
            <mesh>
              <sphereGeometry args={[0.6, 16, 16]} />
              <meshStandardMaterial color="#181717" metalness={0.1} roughness={0.3} />
            </mesh>
          </group>
        )}
      </group>
    </Float>
  );
}

// ----------------- Scene Component -----------------
function Scene() {
  const techIcons = [
    { position: [-6, 2, -5] as [number, number, number], symbol: 'React', scale: 0.3, glbUrl: '/models/react_logo.glb' },
    { position: [4, -2, -3] as [number, number, number], symbol: 'chatgpt', scale: 0.35, glbUrl: '/models/chatgpt.glb' },
    { position: [-3.6, -2, -4] as [number, number, number], symbol: 'Python', scale: 0.019, glbUrl: '/models/python.glb' },
    { position: [6, 1, -6] as [number, number, number], symbol: 'Docker', scale: 2.3, glbUrl: '/models/docker.glb' },
    { position: [-1, -3.5, -5] as [number, number, number], symbol: 'GitHub', scale: 0.14, glbUrl: '/models/github.glb' },
    { position: [0, 3.6, -7] as [number, number, number], symbol: 'VS Code', scale: 1.4, glbUrl: '/models/vscode.glb' },
  ];

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#10b981" />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#3b82f6" />
      <Environment preset="city" />
      <ContactShadows position={[0, -8, 0]} opacity={0.3} scale={20} blur={2} far={8} />

      {techIcons.map((icon, i) => (
        <Suspense key={i} fallback={<LoadingFallback />}>
          {icon.glbUrl ? (
            <GLBModel url={icon.glbUrl} position={icon.position} scale={icon.scale} />
          ) : (
            <FallbackTechIcon position={icon.position} symbol={icon.symbol} />
          )}
        </Suspense>
      ))}

      <fog attach="fog" args={['#000000', 12, 25]} />
    </>
  );
}

// ----------------- Canvas Wrapper -----------------
export default function FloatingGeometry() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      className="w-full h-full gradient-mask"
      shadows
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
    >
      <Suspense fallback={<LoadingFallback />}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}

// ----------------- Preload Models -----------------
useGLTF.preload('/models/react_logo.glb');
useGLTF.preload('/models/chatgpt.glb');
useGLTF.preload('/models/python.glb');
useGLTF.preload('/models/docker.glb');
useGLTF.preload('/models/github.glb');
useGLTF.preload('/models/vscode.glb');
