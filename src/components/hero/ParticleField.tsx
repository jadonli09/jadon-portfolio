"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * A GPU points field arranged on a disc, displaced by layered sine waves in the
 * vertex shader. Colour ramps from ember to gold by height. Reacts subtly to
 * the pointer. All motion is on the GPU — cheap and smooth.
 */
export function ParticleField({ reduced = false }: { reduced?: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();

  const COUNT = 14000;

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const seeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      const r = Math.sqrt(Math.random()) * 9;
      const a = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = Math.sin(a) * r;
      seeds[i] = Math.random();
    }
    return { positions, seeds };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uColorA: { value: new THREE.Color("#d9603f") },
      uColorB: { value: new THREE.Color("#e8b15a") },
      uSize: { value: 18 },
    }),
    []
  );

  useFrame((state, delta) => {
    if (mat.current) {
      mat.current.uniforms.uTime.value += reduced ? 0 : delta;
      const px = (state.pointer.x * viewport.width) / 6;
      const py = (state.pointer.y * viewport.height) / 6;
      mat.current.uniforms.uPointer.value.lerp(new THREE.Vector2(px, py), 0.05);
    }
    if (ref.current && !reduced) {
      ref.current.rotation.y += delta * 0.04;
    }
  });

  return (
    <points ref={ref} rotation={[-0.55, 0, 0]} position={[0, -1.4, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={`
          uniform float uTime;
          uniform vec2 uPointer;
          uniform float uSize;
          attribute float aSeed;
          varying float vH;
          void main() {
            vec3 p = position;
            float d = length(p.xz);
            float w = sin(d * 0.6 - uTime * 1.2) * 0.6
                    + sin(p.x * 0.4 + uTime * 0.8) * 0.4
                    + cos(p.z * 0.5 - uTime * 0.6) * 0.4;
            // pointer ripple
            float pd = distance(p.xz, uPointer);
            w += sin(pd * 0.9 - uTime * 2.0) * exp(-pd * 0.15) * 0.9;
            p.y += w + aSeed * 0.3;
            vH = (w + 1.0) * 0.5;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = uSize * (1.0 / -mv.z) * (0.6 + aSeed * 0.8);
          }
        `}
        fragmentShader={`
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          varying float vH;
          void main() {
            vec2 c = gl_PointCoord - 0.5;
            float a = smoothstep(0.5, 0.0, length(c));
            if (a < 0.02) discard;
            vec3 col = mix(uColorA, uColorB, clamp(vH, 0.0, 1.0));
            gl_FragColor = vec4(col, a * 0.9);
          }
        `}
      />
    </points>
  );
}
