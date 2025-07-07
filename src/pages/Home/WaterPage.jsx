import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  simulationVertexShader,
  simulationFragmentShader,
  renderVertexShader,
  renderFragmentShader,
} from "./shaders";

const WaterPage = () => {
  const containerRef = useRef();

  useEffect(() => {
    const DPR = Math.min(window.devicePixelRatio, 2);
    const mouse = new THREE.Vector2(-1, -1);
    let frame = 0;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const simScene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const getSize = () => {
      const bounds = containerRef.current.getBoundingClientRect();
      return {
        width: bounds.width * DPR,
        height: bounds.height * DPR,
      };
    };

    let { width, height } = getSize();

    renderer.setPixelRatio(DPR);
    renderer.setSize(width / DPR, height / DPR); // divide back to logical pixels

    const renderTargetOptions = {
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      stencilBuffer: false,
      depthBuffer: false,
    };

    let rtA = new THREE.WebGLRenderTarget(width, height, renderTargetOptions);
    let rtB = new THREE.WebGLRenderTarget(width, height, renderTargetOptions);

    const simMaterial = new THREE.ShaderMaterial({
      uniforms: {
        textureA: { value: null },
        mouse: { value: mouse },
        resolution: { value: new THREE.Vector2(width, height) },
        time: { value: 0 },
        frame: { value: 0 },
      },
      vertexShader: simulationVertexShader,
      fragmentShader: simulationFragmentShader,
    });

    const renderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        textureA: { value: null },
        textureB: { value: null },
      },
      vertexShader: renderVertexShader,
      fragmentShader: renderFragmentShader,
      transparent: true,
    });

    const plane = new THREE.PlaneGeometry(2, 2);
    const simQuad = new THREE.Mesh(plane, simMaterial);
    const renderQuad = new THREE.Mesh(plane, renderMaterial);
    simScene.add(simQuad);
    scene.add(renderQuad);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { alpha: true });

   const drawTextTexture = () => {
  const bounds = containerRef.current.getBoundingClientRect();
  const logicalWidth = bounds.width;
  const logicalHeight = bounds.height;

  const pixelWidth = Math.floor(logicalWidth * DPR);
  const pixelHeight = Math.floor(logicalHeight * DPR);

  canvas.width = pixelWidth;
  canvas.height = pixelHeight;

  ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
  ctx.clearRect(0, 0, pixelWidth, pixelHeight); // Avoid text overlapping
  ctx.scale(DPR, DPR); // Draw using logical pixels

  const fontSize = Math.min(logicalWidth, logicalHeight) * 0.2;

  ctx.fillStyle = "#0C0C0C";
  ctx.fillRect(0, 0, logicalWidth, logicalHeight);
  ctx.fillStyle = "#F2613F";
  ctx.font = `bold ${Math.round(fontSize)}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("ABHINAND", logicalWidth / 2, logicalHeight / 2);
};



    drawTextTexture();
    const textTexture = new THREE.CanvasTexture(canvas);
    textTexture.minFilter = THREE.LinearFilter;
    textTexture.magFilter = THREE.LinearFilter;

    const handleResize = () => {
  const bounds = containerRef.current.getBoundingClientRect();
  const newWidth = Math.floor(bounds.width * DPR);
  const newHeight = Math.floor(bounds.height * DPR);

  renderer.setSize(bounds.width, bounds.height);
  rtA.setSize(newWidth, newHeight);
  rtB.setSize(newWidth, newHeight);
  simMaterial.uniforms.resolution.value.set(newWidth, newHeight);

  drawTextTexture(); // Will update size based on bounds + DPR
  textTexture.needsUpdate = true;
};


    const handleMouseMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = (e.clientX - rect.left) * DPR;
      const y = (e.clientY - rect.top) * DPR;

      const width = rect.width * DPR;
      const height = rect.height * DPR;

      mouse.x = x / width;
      mouse.y = 1.0 - y / height;
    };

    const handleMouseLeave = () => {
      mouse.set(-1, -1);
    };

    window.addEventListener("resize", handleResize);
    renderer.domElement.addEventListener("mousemove", handleMouseMove);
    renderer.domElement.addEventListener("mouseleave", handleMouseLeave);

    const animate = () => {
      const { width, height } = getSize();
      simMaterial.uniforms.resolution.value.set(width, height);

      simMaterial.uniforms.frame.value = frame++;
      simMaterial.uniforms.time.value = performance.now() / 1000;
      simMaterial.uniforms.textureA.value = rtA.texture;

      renderer.setRenderTarget(rtB);
      renderer.render(simScene, camera);

      renderMaterial.uniforms.textureA.value = rtB.texture;
      renderMaterial.uniforms.textureB.value = textTexture;
      renderer.setRenderTarget(null);
      renderer.render(scene, camera);

      [rtA, rtB] = [rtB, rtA];

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("mousemove", handleMouseMove);
      renderer.domElement.removeEventListener("mouseleave", handleMouseLeave);
      renderer.dispose();
      rtA.dispose();
      rtB.dispose();
      textTexture.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="three-container"
      style={{ width: "100%", height: "100vh", overflow: "hidden" }}
    />
  );
};

export default WaterPage;
