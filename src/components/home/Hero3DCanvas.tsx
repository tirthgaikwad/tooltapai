import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useApp } from '@/contexts/AppContext';
import type { UserRole } from '@/types/tool';

const ROLE_THEMES: Record<UserRole, { primary: number; secondary: number; lightColor: number }> = {
  general: { primary: 0xF2994A, secondary: 0xE05A47, lightColor: 0xF2994A },
  student: { primary: 0x10B981, secondary: 0x34D399, lightColor: 0x10B981 },
  developer: { primary: 0x38BDF8, secondary: 0x6366F1, lightColor: 0x38BDF8 },
  creator: { primary: 0xF43F5E, secondary: 0xFB923C, lightColor: 0xF43F5E },
  marketer: { primary: 0xA855F7, secondary: 0xFBBF24, lightColor: 0xA855F7 },
};

export default function Hero3DCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
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
    let height = container.clientHeight || 560;
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.8);
    camera.lookAt(0, 0, 0);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance',
      precision: isMobile ? 'mediump' : 'highp',
    });
    renderer.setSize(width, height);

    const maxDpr = isMobile ? 1.0 : 2.0;
    const dpr = Math.min(Math.max(window.devicePixelRatio || 1, 1.0), maxDpr);
    renderer.setPixelRatio(dpr);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.pointerEvents = 'none';
    container.appendChild(renderer.domElement);

    // 4. Lights - Dynamic role-colored illumination
    const ambientLight = new THREE.AmbientLight(0x18181c, 2.5);
    scene.add(ambientLight);

    const mainLight = new THREE.PointLight(ROLE_THEMES.general.primary, 4.0, 30);
    mainLight.position.set(4, 3.5, 4);
    scene.add(mainLight);

    const secondaryLight = new THREE.PointLight(ROLE_THEMES.general.secondary, 3.0, 30);
    secondaryLight.position.set(-4, -3.5, 3.5);
    scene.add(secondaryLight);

    const centerLight = new THREE.PointLight(0xF2994A, 1.5, 10);
    centerLight.position.set(0, 0, 2);
    scene.add(centerLight);

    const topLight = new THREE.DirectionalLight(0xffffff, 0.6);
    topLight.position.set(0, 6, 4);
    scene.add(topLight);

    // 5. Central Hero 3D Group
    const group = new THREE.Group();
    group.position.set(0, 0, 0);

    const calculateScale = (w: number) => {
      if (w < 640) return 0.6;
      if (w < 1024) return 0.72;
      return 0.85;
    };

    const initialScale = calculateScale(width);
    group.scale.set(initialScale, initialScale, initialScale);
    scene.add(group);

    // Centerpiece Model: Torus Knot Geometry
    const torusKnotGeo = new THREE.TorusKnotGeometry(1.5, 0.42, 80, 16);

    const torusWireMaterial = new THREE.MeshStandardMaterial({
      color: 0xF2994A,
      emissive: 0xF2994A,
      emissiveIntensity: 0.5,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
      roughness: 0.2,
      metalness: 0.8,
    });
    const torusWireMesh = new THREE.Mesh(torusKnotGeo, torusWireMaterial);
    group.add(torusWireMesh);

    const torusInnerMaterial = new THREE.MeshStandardMaterial({
      color: 0x18181C,
      emissive: 0xE05A47,
      emissiveIntensity: 0.25,
      roughness: 0.4,
      metalness: 0.5,
      transparent: true,
      opacity: 0.45,
    });
    const torusInnerMesh = new THREE.Mesh(torusKnotGeo, torusInnerMaterial);
    torusInnerMesh.scale.set(0.97, 0.97, 0.97);
    group.add(torusInnerMesh);

    // Balanced Center Orbit Rings
    const ringGeo1 = new THREE.TorusGeometry(2.7, 0.02, 16, 64);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0xF2994A,
      emissive: 0xF2994A,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.35,
    });
    const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat1);
    ringMesh1.rotation.x = Math.PI / 3;
    group.add(ringMesh1);

    const ringGeo2 = new THREE.TorusGeometry(3.1, 0.015, 16, 64);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0xE05A47,
      emissive: 0xE05A47,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.25,
    });
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    ringMesh2.rotation.y = Math.PI / 4;
    ringMesh2.rotation.x = -Math.PI / 6;
    group.add(ringMesh2);

    // Secondary Floating Geometric Accents
    const floatingObjects: { mesh: THREE.Mesh; rotSpeedX: number; rotSpeedY: number; floatOffset: number; basePos: THREE.Vector3 }[] = [];
    const shapeGeo1 = new THREE.IcosahedronGeometry(0.35, 0);
    const shapeGeo2 = new THREE.OctahedronGeometry(0.4, 0);

    const accentMat1 = new THREE.MeshStandardMaterial({
      color: 0xF2994A,
      emissive: 0xF2994A,
      emissiveIntensity: 0.4,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });

    const accentMat2 = new THREE.MeshStandardMaterial({
      color: 0xE05A47,
      emissive: 0xE05A47,
      emissiveIntensity: 0.4,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });

    const positions = [
      { x: -3.8, y: 1.6, z: -1.0, geo: shapeGeo1, mat: accentMat1 },
      { x: 3.8, y: -1.5, z: -0.8, geo: shapeGeo2, mat: accentMat2 },
      { x: -3.2, y: -1.8, z: -1.5, geo: shapeGeo2, mat: accentMat2 },
      { x: 3.2, y: 1.9, z: -1.2, geo: shapeGeo1, mat: accentMat1 },
      { x: 0, y: 2.6, z: -2.0, geo: shapeGeo1, mat: accentMat1 },
      { x: 0, y: -2.6, z: -2.0, geo: shapeGeo2, mat: accentMat2 },
    ];

    positions.forEach((pos, idx) => {
      const mesh = new THREE.Mesh(pos.geo, pos.mat);
      mesh.position.set(pos.x, pos.y, pos.z);
      group.add(mesh);
      floatingObjects.push({
        mesh,
        basePos: new THREE.Vector3(pos.x, pos.y, pos.z),
        rotSpeedX: (Math.random() - 0.5) * 0.025,
        rotSpeedY: (Math.random() - 0.5) * 0.025,
        floatOffset: idx * 1.2,
      });
    });

    // Particle Cloud
    const particleCount = isMobile ? 50 : 110;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const initialTheme = ROLE_THEMES.general;
    const colorPrim = new THREE.Color(initialTheme.primary);
    const colorSec = new THREE.Color(initialTheme.secondary);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 16;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      const mixColor = Math.random() > 0.45 ? colorPrim : colorSec;
      particleColors[i * 3] = mixColor.r;
      particleColors[i * 3 + 1] = mixColor.g;
      particleColors[i * 3 + 2] = mixColor.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: isMobile ? 0.06 : 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Mouse Movement Listener
    const handleMouseMove = (event: MouseEvent | PointerEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.x = x;
      mouseRef.current.y = y;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('pointermove', handleMouseMove, { passive: true });

    const updateSize = () => {
      if (!container) return;
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || 560;
      const newScale = calculateScale(newW);
      group.scale.set(newScale, newScale, newScale);
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
      const currentIsMobile = newW < 768;
      const newMaxDpr = currentIsMobile ? 1.0 : 2.0;
      renderer.setPixelRatio(Math.min(Math.max(window.devicePixelRatio || 1, 1.0), newMaxDpr));
    };

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    resizeObserver.observe(container);
    window.addEventListener('resize', updateSize, { passive: true });

    // Animation & Color Morphing Loop
    let animationFrameId: number | null = null;
    let isRunning = true;
    const clock = new THREE.Clock();

    const targetColor1 = new THREE.Color(initialTheme.primary);
    const targetColor2 = new THREE.Color(initialTheme.secondary);
    const currentColor1 = new THREE.Color(initialTheme.primary);
    const currentColor2 = new THREE.Color(initialTheme.secondary);

    const animate = () => {
      if (!isRunning) return;

      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsedTime = clock.getElapsedTime();

      // Dynamic Color Interpolation based on active persona
      const currentTheme = ROLE_THEMES[activeRoleRef.current] || ROLE_THEMES.general;
      targetColor1.setHex(currentTheme.primary);
      targetColor2.setHex(currentTheme.secondary);

      currentColor1.lerp(targetColor1, delta * 3.0);
      currentColor2.lerp(targetColor2, delta * 3.0);

      torusWireMaterial.color.copy(currentColor1);
      torusWireMaterial.emissive.copy(currentColor1);
      torusInnerMaterial.emissive.copy(currentColor2);
      ringMat1.color.copy(currentColor1);
      ringMat1.emissive.copy(currentColor1);
      ringMat2.color.copy(currentColor2);
      ringMat2.emissive.copy(currentColor2);
      accentMat1.color.copy(currentColor1);
      accentMat1.emissive.copy(currentColor1);
      accentMat2.color.copy(currentColor2);
      accentMat2.emissive.copy(currentColor2);
      mainLight.color.copy(currentColor1);
      secondaryLight.color.copy(currentColor2);

      // Centered rotation based on mouse coordinates
      const targetRotX = mouseRef.current.y * 0.45;
      const targetRotY = mouseRef.current.x * 0.65;

      const lerpSpeed = Math.min(delta * 5.0, 0.3);
      group.rotation.x += (targetRotX - group.rotation.x) * lerpSpeed;
      group.rotation.y += (targetRotY - group.rotation.y) * lerpSpeed;

      group.position.set(0, 0, 0);

      // Continuous ambient self-rotation
      const spinSpeed = delta * (isMobile ? 0.22 : 0.32);
      torusWireMesh.rotation.y += spinSpeed;
      torusWireMesh.rotation.z += spinSpeed * 0.4;
      torusInnerMesh.rotation.y += spinSpeed;
      torusInnerMesh.rotation.z += spinSpeed * 0.4;
      ringMesh1.rotation.z += delta * 0.15;
      ringMesh2.rotation.z -= delta * 0.12;

      // Parallax camera
      const targetCamX = mouseRef.current.x * 0.4;
      const targetCamY = mouseRef.current.y * 0.3;
      camera.position.x += (targetCamX - camera.position.x) * (delta * 2.0);
      camera.position.y += (targetCamY - camera.position.y) * (delta * 2.0);
      camera.lookAt(0, 0, 0);

      // Particle system movement
      particleSystem.rotation.y = elapsedTime * 0.025;
      particleSystem.rotation.x = elapsedTime * 0.012;

      // Floating shapes
      floatingObjects.forEach((obj) => {
        obj.mesh.rotation.x += obj.rotSpeedX * delta * 60;
        obj.mesh.rotation.y += obj.rotSpeedY * delta * 60;
        obj.mesh.position.y = obj.basePos.y + Math.sin(elapsedTime * 1.5 + obj.floatOffset) * 0.2;
      });

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      } else {
        clock.start();
        if (!animationFrameId) {
          animate();
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isRunning = false;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      resizeObserver.disconnect();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('pointermove', handleMouseMove);
      window.removeEventListener('resize', updateSize);

      torusKnotGeo.dispose();
      torusWireMaterial.dispose();
      torusInnerMaterial.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      shapeGeo1.dispose();
      shapeGeo2.dispose();
      accentMat1.dispose();
      accentMat2.dispose();
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
      className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none flex items-center justify-center opacity-30"
      style={{ touchAction: 'none' }}
    />
  );
}
