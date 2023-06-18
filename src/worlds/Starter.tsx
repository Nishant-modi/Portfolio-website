import { Spinning, Floating, StandardReality, Model, Fog, HDRI, EnvironmentProps} from "spacesvr";
import TransparentFloor from "ideas/TransparentFloor";
import CloudySky from "ideas/CloudySky";
import React, {useRef} from 'react';
import THREE from 'three';
import { useFrame, useThree, useLoader, Canvas, createPortal as createPortal$1, extend } from '@react-three/fiber';
//import { Canvas } from 'react-three-fiber';
import {Box, Sky, shaderMaterial} from "@react-three/drei";

//import glsl from 'glslify';


export default function Starter() {
  return (
    <StandardReality>
      <ambientLight intensity = {1} />
      <Model scale = {0.007} rotation-x = {-Math.PI/2} position-y = {0.01} src = "./vrShowcaseGlassFixed.glb"/>
      <Model scale = {0.01} position-y = {0.7} src = "./product.glb"/>
      
      <pointLight intensity = {1} position={[10, 10, 11]} />
      <Fog color = "black" near = {0.1} far = {10}/>
      <HDRI src = "./Skyhdr1.hdr"  disableBackground = {false} disableEnvironment = {true}/>
      <TransparentFloor opacity={0.1} />
      
    </StandardReality>
  );
}