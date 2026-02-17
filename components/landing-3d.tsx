'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Group } from 'three';

type Floater = {
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
  emissive?: string;
};

const VAULT_COLORS = ['#0f172a', '#1f2937', '#a855f7', '#ec4899', '#38bdf8'];

function VaultScene() {
  const groupRef = useRef<Group>(null);
  const scrollRef = useRef(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setReducedMotion(media.matches);
    handleChange();
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      scrollRef.current = window.scrollY || 0;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const floaters = useMemo<Floater[]>(
    () => [
      { position: [-4.2, -1.2, -7], scale: [1.6, 2.2, 1.6], color: VAULT_COLORS[1], emissive: VAULT_COLORS[2] },
      { position: [-1.6, -1.1, -5.2], scale: [1.2, 1.8, 1.2], color: VAULT_COLORS[0], emissive: VAULT_COLORS[3] },
      { position: [1.9, -1.3, -5.9], scale: [1.7, 2.6, 1.7], color: VAULT_COLORS[1], emissive: VAULT_COLORS[4] },
      { position: [4.1, -1.15, -7.4], scale: [1.1, 1.6, 1.1], color: VAULT_COLORS[0], emissive: VAULT_COLORS[2] },
      { position: [-2.8, -1.2, -9], scale: [2.1, 2.9, 2.1], color: VAULT_COLORS[1], emissive: VAULT_COLORS[3] },
      { position: [2.9, -1.4, -8.6], scale: [2.3, 3.1, 2.3], color: VAULT_COLORS[1], emissive: VAULT_COLORS[4] },
    ],
    [],
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    if (reducedMotion) return;
    const scrollOffset = scrollRef.current * 0.0004;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.05 + scrollOffset;
    groupRef.current.position.y = -scrollOffset * 2;
  });

  return (
    <group ref={groupRef} position={[0, -1.4, 0]}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.35}>
        {floaters.map((floater, index) => (
          <mesh
            key={index}
            position={floater.position}
            scale={floater.scale}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              color={floater.color}
              emissive={floater.emissive || floater.color}
              emissiveIntensity={0.18}
              roughness={0.35}
              metalness={0.25}
            />
          </mesh>
        ))}
      </Float>

      <Float speed={0.9} rotationIntensity={0.35} floatIntensity={0.5}>
        <mesh position={[0, 1.3, -6.8]} rotation={[0.2, 0.6, 0]}>
          <torusGeometry args={[1.4, 0.28, 20, 48]} />
          <meshStandardMaterial color="#111827" emissive="#a855f7" emissiveIntensity={0.25} roughness={0.3} metalness={0.4} />
        </mesh>
      </Float>

      <Float speed={1.1} rotationIntensity={0.5} floatIntensity={0.45}>
        <mesh position={[0, 0.4, -5.2]}>
          <octahedronGeometry args={[0.9, 0]} />
          <meshStandardMaterial color="#e2e8f0" emissive="#38bdf8" emissiveIntensity={0.2} roughness={0.15} metalness={0.5} />
        </mesh>
      </Float>

      <mesh position={[-6.2, -1.8, -10]} rotation={[0.2, 0.4, 0]}>
        <sphereGeometry args={[1.3, 24, 24]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.22} roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[6.4, -1.2, -9.4]} rotation={[0.15, -0.3, 0]}>
        <sphereGeometry args={[1.1, 24, 24]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.2} roughness={0.4} metalness={0.2} />
      </mesh>
    </group>
  );
}

export function Landing3DBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-20">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 2.5, 10], fov: 45 }} shadows>
        <ambientLight intensity={0.55} />
        <directionalLight position={[6, 8, 6]} intensity={0.9} castShadow />
        <pointLight position={[-6, 4, -2]} intensity={0.55} />
        <VaultScene />
      </Canvas>
    </div>
  );
}
