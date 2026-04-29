import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Sky, Stars, Float, Instance, Instances } from '@react-three/drei';
import * as THREE from 'three';

// ----------------------------------------------------------------------
// ENVIRONMENT
// ----------------------------------------------------------------------

const BlockTerrain = () => {
  const size = 200;
  
  return (
    <group position={[0, -2, 0]}>
      {/* Main Grass */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[size, size, 50, 50]} />
        <meshStandardMaterial color="#68a036" roughness={1} metalness={0} flatShading />
      </mesh>

      {/* Dirt Edge near Water */}
      <mesh receiveShadow position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color="#79553a" roughness={1} />
      </mesh>

      {/* River / Water */}
      <mesh receiveShadow position={[10, -0.8, -20]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, size]} />
        <meshStandardMaterial color="#3f76e4" transparent opacity={0.8} />
      </mesh>
      
      {/* Distant Hills */}
      <mesh position={[-30, 4, -80]} castShadow receiveShadow>
        <boxGeometry args={[80, 12, 40]} />
        <meshStandardMaterial color="#558b2f" flatShading />
      </mesh>
      <mesh position={[40, 8, -100]} castShadow receiveShadow>
        <boxGeometry args={[100, 20, 50]} />
        <meshStandardMaterial color="#558b2f" flatShading />
      </mesh>
    </group>
  );
};

const Tree = ({ position, scale = 1, delay = 0 }: { position: [number, number, number], scale?: number, delay?: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Subtle swaying
      const t = state.clock.getElapsedTime() + delay;
      groupRef.current.rotation.z = Math.sin(t * 0.5) * 0.02;
      groupRef.current.rotation.x = Math.cos(t * 0.4) * 0.02;
    }
  });

  return (
    <group position={position} scale={scale} ref={groupRef}>
      {/* Trunk */}
      <mesh position={[0, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 4, 1]} />
        <meshStandardMaterial color="#5d4037" />
      </mesh>
      {/* Leaves Layer 1 */}
      <mesh position={[0, 4.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 3, 4]} />
        <meshStandardMaterial color="#388e3c" />
      </mesh>
      {/* Leaves Layer 2 */}
      <mesh position={[0, 6.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#388e3c" />
      </mesh>
    </group>
  );
};

// ----------------------------------------------------------------------
// LIVING DETAILS (Animals)
// ----------------------------------------------------------------------

const Pig = ({ position, speed = 0.5, direction = 1 }: { position: [number, number, number], speed?: number, direction?: number }) => {
  const ref = useRef<THREE.Group>(null);
  const leg1 = useRef<THREE.Mesh>(null);
  const leg2 = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      // Walk back and forth
      ref.current.position.z = position[2] + Math.sin(t * speed) * 5 * direction;
      ref.current.rotation.y = Math.cos(t * speed) > 0 ? 0 : Math.PI;
    }
    if (leg1.current && leg2.current) {
      leg1.current.rotation.x = Math.sin(t * speed * 4) * 0.5;
      leg2.current.rotation.x = -Math.sin(t * speed * 4) * 0.5;
    }
  });

  return (
    <group position={position} ref={ref}>
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

const Cow = ({ position, speed = 0.3 }: { position: [number, number, number], speed?: number }) => {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.x = position[0] + Math.sin(t * speed) * 8;
      ref.current.rotation.y = Math.cos(t * speed) > 0 ? Math.PI / 2 : -Math.PI / 2;
    }
  });

  return (
    <group position={position} ref={ref} scale={1.2}>
      {/* Body */}
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[1.2, 1, 1.8]} />
        <meshStandardMaterial color="#424242" /> {/* Dark grey/black cow */}
      </mesh>
      {/* Spots */}
      <mesh position={[0, 1.01, 0]} castShadow>
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
    </group>
  );
};

const Butterflies = () => {
  const count = 50;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 60,
        y: Math.random() * 5 + 1,
        z: (Math.random() - 0.5) * 60 - 20,
        speed: Math.random() * 2 + 1,
        offset: Math.random() * Math.PI * 2
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    
    particles.forEach((p, i) => {
      // Erratic butterfly motion
      const px = p.x + Math.sin(t * p.speed + p.offset) * 2;
      const py = p.y + Math.sin(t * p.speed * 2) * 0.5;
      const pz = p.z + Math.cos(t * p.speed + p.offset) * 2;
      
      dummy.position.set(px, py, pz);
      // Flapping wings
      dummy.rotation.y = t * p.speed * 5;
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <planeGeometry args={[0.2, 0.2]} />
      <meshBasicMaterial color="#ffeb3b" side={THREE.DoubleSide} />
    </instancedMesh>
  );
};

// ----------------------------------------------------------------------
// CAMERA
// ----------------------------------------------------------------------

const CameraController = () => {
  const { camera } = useThree();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Official style slow cinematic float
    const radius = 25;
    const speed = 0.005;
    
    camera.position.x = Math.sin(time * speed) * radius;
    camera.position.z = Math.cos(time * speed) * radius - 10;
    camera.position.y = 4 + Math.sin(time * 0.1) * 1;
    
    camera.lookAt(0, 4, -30);
  });
  
  return null;
};

// ----------------------------------------------------------------------
// MAIN SCENE
// ----------------------------------------------------------------------

const MinecraftScene = () => {
  return (
    <>
      <Sky sunPosition={[100, 50, -50]} turbidity={0.3} rayleigh={1.2} />
      
      <ambientLight intensity={1.5} color="#ffffff" />
      <directionalLight 
        position={[50, 100, 20]} 
        intensity={2.5} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      
      <BlockTerrain />
      
      {/* Trees */}
      <Tree position={[-15, -2, -20]} scale={1.2} delay={0} />
      <Tree position={[20, -2, -35]} scale={1} delay={1} />
      <Tree position={[-25, -2, -45]} scale={1.5} delay={2} />
      <Tree position={[12, -2, -15]} scale={0.9} delay={3} />
      <Tree position={[-40, -2, -50]} scale={1.1} delay={4} />
      <Tree position={[45, -2, -60]} scale={1.3} delay={5} />
      <Tree position={[0, -2, -60]} scale={1} delay={6} />

      {/* Animals */}
      <Pig position={[-5, -2, -15]} speed={0.8} direction={1} />
      <Pig position={[15, -2, -25]} speed={0.6} direction={-1} />
      <Cow position={[8, -2, -30]} speed={0.4} />
      <Cow position={[-20, -2, -35]} speed={0.5} />

      {/* Atmosphere */}
      <Butterflies />
      
      {/* Soft Clouds */}
      <Float speed={0.5} rotationIntensity={0.01} floatIntensity={0.5}>
        <mesh position={[-30, 30, -50]}>
          <boxGeometry args={[40, 4, 20]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>
      </Float>
      <Float speed={0.3} rotationIntensity={0.01} floatIntensity={0.5}>
        <mesh position={[40, 35, -80]}>
          <boxGeometry args={[50, 5, 25]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
        </mesh>
      </Float>

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
    <div className="absolute inset-0 z-0 bg-[#69c5f0]">
      <Canvas shadows dpr={[1, 1.5]}>
        <PerspectiveCamera makeDefault position={[0, 5, 15]} fov={50} />
        <MinecraftScene />
        <fog attach="fog" args={['#69c5f0', 30, 150]} />
      </Canvas>
    </div>
  );
};

export default Minecraft3DBackground;
