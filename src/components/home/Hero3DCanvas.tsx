import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useApp } from '@/contexts/AppContext';
import type { UserRole } from '@/types/tool';

const ROLE_THEMES: Record<UserRole, { primary: string; emissive: string; rimLight: string }> = {
  general: { primary: '#F2994A', emissive: '#E05A47', rimLight: '#7928CA' },
  student: { primary: '#10B981', emissive: '#059669', rimLight: '#3B82F6' },
  developer: { primary: '#38BDF8', emissive: '#0284C7', rimLight: '#8B5CF6' },
  creator: { primary: '#F43F5E', emissive: '#E11D48', rimLight: '#F59E0B' },
  marketer: { primary: '#A855F7', emissive: '#7E22CE', rimLight: '#EC4899' },
};

export default function Hero3DCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const { userRole } = useApp();
  const activeRoleRef = useRef<UserRole>(userRole);

  useEffect(() => {
    activeRoleRef.current = userRole;
  }, [userRole]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup - Centered directly at origin (0, 0, 0)
    let width = container.clientWidth || window.innerWidth || 1200;
    let height = container.clientHeight || 580;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.2);
    camera.lookAt(0, 0, 0);

    // 3. Renderer setup - Capped Device Pixel Ratio strictly between 1.0 and 1.25
    // Lock DPR to prevent 4K/Retina displays from rendering too many pixels (GPU killer)
    const maxDpr = 1.25;
    const dpr = Math.min(Math.max(window.devicePixelRatio || 1, 1.0), maxDpr);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance',
      precision: isMobile ? 'mediump' : 'highp',
      stencil: false,
      depth: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(dpr);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.pointerEvents = 'none';
    renderer.domElement.style.transform = 'translateZ(0)';
    container.appendChild(renderer.domElement);

    // 4. Lighting Adjustments
    // Soft ambient light: intensity={0.5} to illuminate softly without washing out true amber color
    const ambientLight = new THREE.AmbientLight(0xfff4ea, 0.5);
    scene.add(ambientLight);

    // Subtle Amber Point Light: color="#F2994A", gentle intensity to highlight geometry without bright yellow blowout
    const frontPointLight = new THREE.PointLight(0xF2994A, 2.2, 16);
    frontPointLight.position.set(3, 2.5, 4.5);
    scene.add(frontPointLight);

    // Soft Rim Light (Back/Bottom): color="#7928CA", intensity=1.5 for subtle separation
    const rimPointLight = new THREE.PointLight(0x7928CA, 1.5, 14);
    rimPointLight.position.set(-3.5, -2.5, -3.5);
    scene.add(rimPointLight);

    // 5. Dual Layer Geometry (Outer Wireframe + Inner Dark Glass Core)
    const modelGroup = new THREE.Group();
    modelGroup.position.set(0, 0, 0);

    const calculateScale = (w: number) => {
      if (w < 640) return 0.62;
      if (w < 1024) return 0.78;
      return 0.92;
    };

    const initialScale = calculateScale(width);
    modelGroup.scale.set(initialScale, initialScale, initialScale);
    scene.add(modelGroup);

    // Outer Layer: Wireframe Torus Knot with strictly tuned brand amber/coral palette and subdued opacity
    const outerTorusGeo = new THREE.TorusKnotGeometry(1.4, 0.45, 128, 32);
    const outerWireMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#F2994A'),
      emissive: new THREE.Color('#E05A47'),
      emissiveIntensity: 0.65,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
      roughness: 0.25,
      metalness: 0.65,
    });
    const outerMesh = new THREE.Mesh(outerTorusGeo, outerWireMaterial);
    modelGroup.add(outerMesh);

    // Inner Core Layer: Concentric semi-translucent dark glass mesh
    const innerTorusGeo = new THREE.TorusKnotGeometry(1.4, 0.45, 128, 32);
    const innerGlassMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#14141C'),
      roughness: 0.2,
      metalness: 0.4,
      transparent: true,
      opacity: 0.2,
    });
    const innerMesh = new THREE.Mesh(innerTorusGeo, innerGlassMaterial);
    innerMesh.scale.set(0.96, 0.96, 0.96);
    modelGroup.add(innerMesh);

    // Luminous Orbital Rings for Futuristic Depth
    const orbitRingGeo1 = new THREE.TorusGeometry(2.6, 0.016, 16, 100);
    const orbitRingMat1 = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#F2994A'),
      emissive: new THREE.Color('#E05A47'),
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.20,
      roughness: 0.3,
      metalness: 0.7,
    });
    const orbitRing1 = new THREE.Mesh(orbitRingGeo1, orbitRingMat1);
    orbitRing1.rotation.x = Math.PI / 3.2;
    modelGroup.add(orbitRing1);

    const orbitRingGeo2 = new THREE.TorusGeometry(2.95, 0.012, 16, 100);
    const orbitRingMat2 = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#7928CA'),
      emissive: new THREE.Color('#7928CA'),
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.15,
      roughness: 0.3,
      metalness: 0.7,
    });
    const orbitRing2 = new THREE.Mesh(orbitRingGeo2, orbitRingMat2);
    orbitRing2.rotation.x = -Math.PI / 4;
    orbitRing2.rotation.y = Math.PI / 5;
    modelGroup.add(orbitRing2);

    // Subtle Floating Geometric Shards
    const shardGroup = new THREE.Group();
    modelGroup.add(shardGroup);
    const shardGeo1 = new THREE.OctahedronGeometry(0.22, 0);
    const shardGeo2 = new THREE.IcosahedronGeometry(0.18, 0);
    const shardMatAmber = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#F2994A'),
      emissive: new THREE.Color('#E05A47'),
      emissiveIntensity: 0.6,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const shardMatViolet = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#7928CA'),
      emissive: new THREE.Color('#7928CA'),
      emissiveIntensity: 0.6,
      wireframe: true,
      transparent: true,
      opacity: 0.20,
    });

    const shardPositions = [
      { x: -3.2, y: 1.5, z: -0.6, geo: shardGeo1, mat: shardMatAmber },
      { x: 3.3, y: -1.2, z: -0.4, geo: shardGeo2, mat: shardMatViolet },
      { x: -2.7, y: -1.6, z: -1.0, geo: shardGeo2, mat: shardMatAmber },
      { x: 2.8, y: 1.7, z: -0.8, geo: shardGeo1, mat: shardMatViolet },
    ];

    const shards: { mesh: THREE.Mesh; rotX: number; rotY: number; baseY: number; offset: number }[] = [];
    shardPositions.forEach((pos, idx) => {
      const shardMesh = new THREE.Mesh(pos.geo, pos.mat);
      shardMesh.position.set(pos.x, pos.y, pos.z);
      shardGroup.add(shardMesh);
      shards.push({
        mesh: shardMesh,
        rotX: (Math.random() - 0.5) * 0.03,
        rotY: (Math.random() - 0.5) * 0.03,
        baseY: pos.y,
        offset: idx * 1.5,
      });
    });

    // High-tech micro particle dust
    const particleCount = isMobile ? 25 : 45;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const amberColor = new THREE.Color('#F2994A');
    const coralColor = new THREE.Color('#E05A47');

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 14;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 8;

      const chosenColor = Math.random() > 0.4 ? amberColor : coralColor;
      particleColors[i * 3] = chosenColor.r;
      particleColors[i * 3 + 1] = chosenColor.g;
      particleColors[i * 3 + 2] = chosenColor.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: isMobile ? 0.04 : 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Mouse Tracking - Throttled with rAF / Ref updates only (NO React setState)
    let mouseTicking = false;
    let pendingMouseX = 0;
    let pendingMouseY = 0;

    const handleMouseMove = (event: MouseEvent | PointerEvent) => {
      pendingMouseX = (event.clientX / window.innerWidth) * 2 - 1;
      pendingMouseY = -(event.clientY / window.innerHeight) * 2 + 1;

      if (!mouseTicking) {
        mouseTicking = true;
        requestAnimationFrame(() => {
          mouseRef.current.targetX = pendingMouseX;
          mouseRef.current.targetY = pendingMouseY;
          mouseTicking = false;
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('pointermove', handleMouseMove, { passive: true });

    // Resize Handler
    const updateSize = () => {
      if (!container) return;
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || 580;
      const newScale = calculateScale(newW);
      modelGroup.scale.set(newScale, newScale, newScale);
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
      renderer.setPixelRatio(Math.min(Math.max(window.devicePixelRatio || 1, 1.0), 1.25));
    };

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    resizeObserver.observe(container);
    window.addEventListener('resize', updateSize, { passive: true });

    // Animation Loop with Visibility & Intersection Optimization
    let animationFrameId: number | null = null;
    let isRunning = true;
    let isElementVisible = true;
    const clock = new THREE.Clock();

    const targetColorPrimary = new THREE.Color('#F2994A');
    const targetColorEmissive = new THREE.Color('#E05A47');
    const targetColorRim = new THREE.Color('#7928CA');

    const currentColorPrimary = new THREE.Color('#F2994A');
    const currentColorEmissive = new THREE.Color('#E05A47');
    const currentColorRim = new THREE.Color('#7928CA');

    const animate = () => {
      if (!isRunning || !isElementVisible) return;

      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsedTime = clock.getElapsedTime();

      // Dynamic color morphing based on active persona role
      const currentTheme = ROLE_THEMES[activeRoleRef.current] || ROLE_THEMES.general;
      targetColorPrimary.set(currentTheme.primary);
      targetColorEmissive.set(currentTheme.emissive);
      targetColorRim.set(currentTheme.rimLight);

      currentColorPrimary.lerp(targetColorPrimary, delta * 3.0);
      currentColorEmissive.lerp(targetColorEmissive, delta * 3.0);
      currentColorRim.lerp(targetColorRim, delta * 3.0);

      outerWireMaterial.color.copy(currentColorPrimary);
      outerWireMaterial.emissive.copy(currentColorEmissive);
      orbitRingMat1.color.copy(currentColorPrimary);
      orbitRingMat1.emissive.copy(currentColorEmissive);
      orbitRingMat2.color.copy(currentColorRim);
      orbitRingMat2.emissive.copy(currentColorRim);
      frontPointLight.color.copy(currentColorPrimary);
      rimPointLight.color.copy(currentColorRim);

      // Smooth Mouse Interpolation (Lerp)
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * (delta * 4.0);
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * (delta * 4.0);

      // Continuous gentle rotation & mouse parallax tilt
      outerMesh.rotation.y += delta * 0.15;
      outerMesh.rotation.x += delta * 0.08;
      innerMesh.rotation.y += delta * 0.15;
      innerMesh.rotation.x += delta * 0.08;

      orbitRing1.rotation.z += delta * 0.12;
      orbitRing2.rotation.z -= delta * 0.10;

      // Group orientation tilts smoothly with mouse
      const targetRotX = mouseRef.current.y * 0.45;
      const targetRotY = mouseRef.current.x * 0.65;
      modelGroup.rotation.x += (targetRotX - modelGroup.rotation.x) * (delta * 3.5);
      modelGroup.rotation.y += (targetRotY - modelGroup.rotation.y) * (delta * 3.5);

      // Camera subtle parallax
      const targetCamX = mouseRef.current.x * 0.35;
      const targetCamY = mouseRef.current.y * 0.25;
      camera.position.x += (targetCamX - camera.position.x) * (delta * 2.0);
      camera.position.y += (targetCamY - camera.position.y) * (delta * 2.0);
      camera.lookAt(0, 0, 0);

      // Subtle particle float
      particleSystem.rotation.y = elapsedTime * 0.02;
      particleSystem.rotation.x = elapsedTime * 0.01;

      // Floating Shards
      shards.forEach((shard) => {
        shard.mesh.rotation.x += shard.rotX * delta * 60;
        shard.mesh.rotation.y += shard.rotY * delta * 60;
        shard.mesh.position.y = shard.baseY + Math.sin(elapsedTime * 1.8 + shard.offset) * 0.18;
      });

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    // IntersectionObserver to pause rendering when hero is scrolled out of view
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isElementVisible = entry.isIntersecting;
          if (isElementVisible) {
            clock.start();
            if (!animationFrameId) {
              animationFrameId = requestAnimationFrame(animate);
            }
          } else {
            if (animationFrameId) {
              cancelAnimationFrame(animationFrameId);
              animationFrameId = null;
            }
          }
        });
      },
      { threshold: 0.02 }
    );
    intersectionObserver.observe(container);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      } else if (isElementVisible) {
        clock.start();
        if (!animationFrameId) {
          animationFrameId = requestAnimationFrame(animate);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isRunning = false;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('pointermove', handleMouseMove);
      window.removeEventListener('resize', updateSize);

      outerTorusGeo.dispose();
      outerWireMaterial.dispose();
      innerTorusGeo.dispose();
      innerGlassMaterial.dispose();
      orbitRingGeo1.dispose();
      orbitRingMat1.dispose();
      orbitRingGeo2.dispose();
      orbitRingMat2.dispose();
      shardGeo1.dispose();
      shardGeo2.dispose();
      shardMatAmber.dispose();
      shardMatViolet.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none flex items-center justify-center transform-gpu [transform:translateZ(0)]"
      style={{ touchAction: 'none' }}
    />
  );
}
