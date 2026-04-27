import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Sky, Stars, Cloud, Float, Instances, Instance, Environment } from '@react-three/drei';
import * as THREE from 'three';

const BlockTerrain = () => {
  const size = 100;
  const divisions = 50;
  
  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      {/* Main Ground */}
      <mesh receiveShadow>
        <planeGeometry args={[size, size, divisions, divisions]} />
        <meshStandardMaterial 
          color="#3c8527" 
          roughness={1} 
          metalness={0} 
          vertexColors={false}
          flatShading
        />
      </mesh>
      
      {/* Decorative Grid for "Blocky" look */}
      <gridHelper args={[size, divisions, "#2d6a1c", "#2d6a1c"]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.01]} />
    </group>
  );
};

const Tree = ({ position }: { position: [number, number, number] }) => {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[0.8, 3, 0.8]} />
        <meshStandardMaterial color="#5d4037" />
      </mesh>
      {/* Leaves */}
      <mesh position={[0, 4, 0]} castShadow>
        <boxGeometry args={[3, 3, 3]} />
        <meshStandardMaterial color="#2e7d32" />
      </mesh>
    </group>
  );
};

const ParticleField = () => {
  const count = 200;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = Math.random() * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return pos;
  }, []);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.001;
      ref.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.5;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.15} color="#ffffff" transparent opacity={0.4} />
    </points>
  );
};

const CameraController = () => {
  const { camera, mouse } = useThree();
  const targetRotation = useRef(new THREE.Euler(0, 0, 0));
  
  useFrame((state) => {
    // Subtle float animation
    const time = state.clock.getElapsedTime();
    camera.position.y = 2 + Math.sin(time * 0.5) * 0.5;
    camera.position.x = Math.cos(time * 0.2) * 2;
    
    // Mouse parallax
    targetRotation.current.y = -mouse.x * 0.1;
    targetRotation.current.x = mouse.y * 0.05;
    
    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, targetRotation.current.x, 0.1);
    camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, targetRotation.current.y, 0.1);
    
    camera.lookAt(0, 5, -20);
  });
  
  return null;
};

const MinecraftScene = () => {
  return (
    <>
      <Sky sunPosition={[100, 20, 100]} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize={[1024, 1024]}
      />
      
      <BlockTerrain />
      
      {/* Scattered Trees */}
      <Tree position={[-10, -2, -15]} />
      <Tree position={[15, -2, -25]} />
      <Tree position={[-20, -2, -30]} />
      <Tree position={[8, -2, -10]} />
      
      {/* Floating Clouds */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh position={[-15, 12, -20]}>
          <boxGeometry args={[10, 2, 6]} />
          <meshStandardMaterial color="white" transparent opacity={0.8} />
        </mesh>
      </Float>
      
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.8}>
        <mesh position={[20, 15, -30]}>
          <boxGeometry args={[12, 3, 8]} />
          <meshStandardMaterial color="white" transparent opacity={0.7} />
        </mesh>
      </Float>

      <ParticleField />
      <CameraController />
    </>
  );
};

const Minecraft3DBackground: React.FC = () => {
  const isMobile = useMemo(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
           || window.innerWidth < 768;
  }, []);

  if (isMobile) {
    return (
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url("/assets/minecraft-bg.png")' }}
      />
    );
  }

  return (
    <div className="absolute inset-0 z-0 bg-[#87CEEB]">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 5, 15]} fov={50} />
        <MinecraftScene />
        <fog attach="fog" args={['#87CEEB', 20, 60]} />
      </Canvas>
      {/* Blur Overlay as requested */}
      <div className="absolute inset-0 pointer-events-none bg-black/10 backdrop-blur-[2px]" />
    </div>
  );
};

export default Minecraft3DBackground;
