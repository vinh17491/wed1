import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// ----------------------------------------------------------------------
// 3D MODELS (Minecraft Style)
// ----------------------------------------------------------------------

const Pig = ({ position, speed = 0.5, direction = 1 }: { position: [number, number, number], speed?: number, direction?: number }) => {
  const ref = useRef<THREE.Group>(null);
  const leg1 = useRef<THREE.Mesh>(null);
  const leg2 = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      // Walk back and forth in X axis for better visibility in overlay
      ref.current.position.x = position[0] + Math.sin(t * speed) * 4 * direction;
      ref.current.rotation.y = Math.cos(t * speed) * direction > 0 ? Math.PI / 2 : -Math.PI / 2;
    }
    if (leg1.current && leg2.current) {
      leg1.current.rotation.x = Math.sin(t * speed * 8) * 0.5;
      leg2.current.rotation.x = -Math.sin(t * speed * 8) * 0.5;
    }
  });

  return (
    <group position={position} ref={ref} scale={0.8}>
      {/* Body */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[1, 0.8, 1.5]} />
        <meshStandardMaterial color="#f48fb1" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.2, 0.8]} castShadow>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color="#f06292" />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.3, 0.4, 0.5]} ref={leg1} castShadow><boxGeometry args={[0.3, 0.8, 0.3]} /><meshStandardMaterial color="#f48fb1" /></mesh>
      <mesh position={[0.3, 0.4, -0.5]} ref={leg2} castShadow><boxGeometry args={[0.3, 0.8, 0.3]} /><meshStandardMaterial color="#f48fb1" /></mesh>
    </group>
  );
};

const Cow = ({ position, speed = 0.3, direction = 1 }: { position: [number, number, number], speed?: number, direction?: number }) => {
  const ref = useRef<THREE.Group>(null);
  const leg1 = useRef<THREE.Mesh>(null);
  const leg2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.x = position[0] + Math.sin(t * speed) * 6 * direction;
      ref.current.rotation.y = Math.cos(t * speed) * direction > 0 ? Math.PI / 2 : -Math.PI / 2;
    }
    if (leg1.current && leg2.current) {
      leg1.current.rotation.x = Math.sin(t * speed * 6) * 0.4;
      leg2.current.rotation.x = -Math.sin(t * speed * 6) * 0.4;
    }
  });

  return (
    <group position={position} ref={ref} scale={1.0}>
      {/* Body */}
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[1.2, 1, 1.8]} />
        <meshStandardMaterial color="#424242" />
      </mesh>
      {/* Spots */}
      <mesh position={[0, 1.01, 0]}>
        <boxGeometry args={[1.21, 0.5, 0.8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.5, 1]} castShadow>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Snout */}
      <mesh position={[0, 1.3, 1.4]} castShadow>
        <boxGeometry args={[0.6, 0.4, 0.2]} />
        <meshStandardMaterial color="#424242" />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.4, 0.5, 0.6]} ref={leg1} castShadow><boxGeometry args={[0.3, 1, 0.3]} /><meshStandardMaterial color="#424242" /></mesh>
      <mesh position={[0.4, 0.5, -0.6]} ref={leg2} castShadow><boxGeometry args={[0.3, 1, 0.3]} /><meshStandardMaterial color="#424242" /></mesh>
    </group>
  );
};

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------

const Minecraft3DAnimals: React.FC = () => {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <Canvas shadows dpr={[1, 1.5]} gl={{ alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 4, 15]} fov={40} />
        
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
        
        <group position={[0, -2, 0]}>
          <Pig position={[4, 0, 0]} speed={0.6} direction={1} />
          <Cow position={[-3, 0, -2]} speed={0.4} direction={-1} />
        </group>

        {/* Optional: Add a invisible plane to catch shadows if desired, 
            but for overlay it might look cleaner without if not perfectly matched */}
      </Canvas>
    </div>
  );
};

export default Minecraft3DAnimals;
