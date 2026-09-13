import { useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

const MAP_SOURCE = "/hero/canada-map.webp";
const MAP_PIXEL_WIDTH = 802;
const MAP_PIXEL_HEIGHT = 504;
const MAP_WIDTH = 8;
const MAP_HEIGHT = (MAP_WIDTH * MAP_PIXEL_HEIGHT) / MAP_PIXEL_WIDTH;
const ROUTE_LIFT = 0.06;

/** Hub positions as fractions of the map image, west → east. */
const HUBS: [number, number][] = [
  [0.0521, 0.649], // Vancouver
  [0.1947, 0.6267], // Calgary
  [0.6115, 0.7503], // Ottawa
  [0.6468, 0.9119], // Toronto
  [0.7215, 0.833] // Montreal
];

const toLocal = ([fx, fy]: [number, number]) =>
  new THREE.Vector3((fx - 0.5) * MAP_WIDTH, (0.5 - fy) * MAP_HEIGHT, ROUTE_LIFT);

const MapPlane = () => {
  const texture = useLoader(THREE.TextureLoader, MAP_SOURCE);

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
  }, [texture]);

  return (
    <mesh>
      <planeGeometry args={[MAP_WIDTH, MAP_HEIGHT, 1, 1]} />
      <meshBasicMaterial map={texture} transparent toneMapped={false} />
    </mesh>
  );
};

/** Glowing lane with a parcel pulse running its length on a loop. */
const Lanes = () => {
  const pulseRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(HUBS.map(toLocal), false, "centripetal"),
    []
  );
  const points = useMemo(() => curve.getPoints(160), [curve]);

  useFrame(({ clock }) => {
    const t = (clock.getElapsedTime() * 0.13) % 1;
    const position = curve.getPoint(t);

    pulseRef.current?.position.copy(position);
    haloRef.current?.position.copy(position);

    if (haloRef.current) {
      const breathe = 1 + Math.sin(clock.getElapsedTime() * 3) * 0.25;
      haloRef.current.scale.setScalar(breathe);
    }
  });

  return (
    <group>
      <Line points={points} color="#65AF02" lineWidth={1.6} transparent opacity={0.35} />
      <Line
        points={points}
        color="#A6F03A"
        lineWidth={2.4}
        dashed
        dashSize={0.12}
        gapSize={0.1}
        transparent
        opacity={0.9}
      />

      {HUBS.map((hub) => (
        <group key={hub.join()} position={toLocal(hub)}>
          <mesh>
            <sphereGeometry args={[0.035, 16, 16]} />
            <meshBasicMaterial color="#A6F03A" toneMapped={false} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshBasicMaterial color="#65AF02" transparent opacity={0.18} toneMapped={false} />
          </mesh>
        </group>
      ))}

      <mesh ref={haloRef}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#65AF02" transparent opacity={0.28} toneMapped={false} />
      </mesh>
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshBasicMaterial color="#D9FF8A" toneMapped={false} />
      </mesh>
    </group>
  );
};

/** Tilts the whole map toward the pointer. */
const Rig = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ pointer, clock }, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const time = clock.getElapsedTime();

    // The map never sits still: it sways on both axes on its own, and the
    // pointer adds to that rather than being the only source of movement.
    const idleX = Math.sin(time * 0.36) * 0.09;
    const idleY = Math.sin(time * 0.23) * 0.16;
    const idleZ = Math.sin(time * 0.19) * 0.035;

    group.rotation.x = THREE.MathUtils.damp(group.rotation.x, pointer.y * 0.28 + idleX, 3.5, delta);
    group.rotation.y = THREE.MathUtils.damp(group.rotation.y, pointer.x * 0.4 + idleY, 3.5, delta);
    group.rotation.z = THREE.MathUtils.damp(group.rotation.z, idleZ, 2.5, delta);

    group.position.y = THREE.MathUtils.damp(group.position.y, Math.sin(time * 0.5) * 0.11, 3, delta);
    group.position.x = THREE.MathUtils.damp(
      group.position.x,
      Math.cos(time * 0.31) * 0.07 + pointer.x * 0.12,
      3,
      delta
    );
  });

  return (
    <group ref={groupRef}>
      <MapPlane />
      <Lanes />
    </group>
  );
};

const CoverageScene = () => (
  <Canvas
    orthographic
    camera={{ zoom: 74, position: [0, 0, 6] }}
    gl={{ antialias: true, alpha: true }}
    dpr={[1, 1.75]}
  >
    <Rig />
  </Canvas>
);

export default CoverageScene;
