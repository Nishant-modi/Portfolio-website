import * as THREE from 'three';
import React, { Suspense, useEffect, useState, useRef} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Preload, useGLTF } from '@react-three/drei';

import CanvasLoader from '../Loader';
const Computers = ({isMobile}) => {

  const computer = useGLTF('./desktop_pc/scene.gltf')

  return (
    <mesh>
      <hemisphereLight intensity={0.15} groundColor="black"/>
      <pointLight intensity={1}/>
      <spotLight
      position={[-20,50,10]}
      angle={0.12}
      penumbra={1}
      intensity={1}
      castShadow
      shadow-mapSize={1024}
      />

      <primitive
      object={computer.scene}
      scale={isMobile?0.7:0.75}
      position={isMobile?[0,-3,-2.2]:[1,-4,-2]}
      rotation={[-0,-1.5,-0]}
      />
    </mesh>
  )
}

const ComputersCanvas = () => {

  const [isMobile, setIsMobile]
= useState(false);

useEffect(()=>{
  const mediaQuery = window.matchMedia('(max-width:500px)');

  setIsMobile(mediaQuery.matches);

  const handleMediaQueryChange = (event) =>{
    setIsMobile(event.matches);
  }

  mediaQuery.addEventListener('change', handleMediaQueryChange);

  return()=>{
    mediaQuery.removeEventListener('change', handleMediaQueryChange);
  }

}, [])


  return(
    <Canvas 
    frameLoop = "demand"
    shadows
    camera={{position: [0,0,5],near:5, far:40}}
    gL={{preserveDrawingBuffer: true}}>
      <Suspense fallback={<CanvasLoader/>}>
      
        <Computers isMobile = {isMobile}/>
        <Rig/>
      </Suspense>
      <Preload all/>
      
    </Canvas>
  )
}


function Rig() {
  const { camera, mouse } = useThree()
  const vec = new THREE.Vector3()
  return useFrame(() => camera.position.lerp(vec.set(mouse.x * 2, mouse.y * 1, camera.position.z), 0.02))
}


export default ComputersCanvas
