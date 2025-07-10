import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import ModelViewer from '../components/ModelViewer';


const Home = () => {
  return (
    <div className="min-h-[100vh] relative" style={{ backgroundColor: '#0C0C0C' }}> 
      <div className="sticky top-0 h-screen">
        <Canvas shadows>
          <directionalLight 
            castShadow 
            position={[1, 1, 5]} 
            intensity={3} 
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <ModelViewer url="/space_station_3.glb" />
          
        </Canvas>
        
      </div>
    </div>
  );
};


export default Home;
