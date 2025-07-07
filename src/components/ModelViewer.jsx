import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const ModelViewer = ({ url }) => {
  const ref = useRef();
  const { scene, animations } = useGLTF(url);
  const { actions, mixer } = useAnimations(animations, ref);
  const { scene: mainScene, gl, size } = useThree();

  const targetRotation = useRef({ x: 0, y: 0 });
  const scrollRotation = useRef(0);
  const lastScrollY = useRef(window.scrollY);
  const scrollTimeout = useRef(null);

  // Handle mouse move
  const handleMouseMove = useCallback((event) => {
    const xNorm = (event.clientX / size.width) * 2 - 1;
    const yNorm = -(event.clientY / size.height) * 2 + 1;

    targetRotation.current.x = yNorm * Math.PI * 0.3;
    targetRotation.current.y = xNorm * Math.PI * 0.3;
  }, [size.width, size.height]);


useEffect(() => {
  if (scene) {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color('white'),
          roughness: 0.4,
          metalness: 0.1,
        });
        child.material.needsUpdate = true;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }
}, [scene]);
  
  // Add mouse move listener
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Throttled scroll handler
  const handleScroll = useCallback(() => {
    if (scrollTimeout.current) return;

    scrollTimeout.current = setTimeout(() => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      let newRotation = scrollRotation.current - delta * 0.005;
      scrollRotation.current = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, newRotation));

      lastScrollY.current = currentScrollY;
      scrollTimeout.current = null;
    }, 16); // Roughly 60fps
  }, []);

  // Add scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [handleScroll]);

  // Play animations
  useEffect(() => {
    if (actions) {
      Object.values(actions).forEach((action) =>
        action.reset().fadeIn(0.5).play()
      );
    }
    return () => {
      mixer?.stopAllAction();
    };
  }, [actions, mixer]);

  // Animate model
  useFrame((state, delta) => {
    mixer?.update(delta);

    const model = ref.current;
    if (model) {
      model.rotation.y += (targetRotation.current.y - model.rotation.y) * 0.05;
      model.rotation.x += (targetRotation.current.x + scrollRotation.current - model.rotation.x) * 0.05;
      model.position.y = Math.sin(state.clock.getElapsedTime() * 2) * 0.1;
    }
  });

  // Load environment once
  const envMap = useMemo(() => {
    const loader = new THREE.CubeTextureLoader();
    const map = loader.load([
      '/env/px.jpg', '/env/nx.jpg',
      '/env/py.jpg', '/env/ny.jpg',
      '/env/pz.jpg', '/env/nz.jpg',
    ]);
    map.encoding = THREE.sRGBEncoding;
    return map;
  }, []);

  useEffect(() => {
    mainScene.environment = envMap;
    gl.outputEncoding = THREE.sRGBEncoding;
  }, [mainScene, gl, envMap]);

  return <primitive ref={ref} object={scene} scale={0.56} />;
};

export default ModelViewer;
