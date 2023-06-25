import { Spinning, Floating, Model, Fog, HDRI, EnvironmentProps, Collidable, Interactable, PlayerProps, Player, useEnvironment, useKeyboardLayout, Idea, MenuItem} from "spacesvr";
import {StandardReality} from "myvr/mymain.js";
import TransparentFloor from "ideas/TransparentFloor";
import CloudySky from "ideas/CloudySky";
import React, {useRef} from 'react';
import THREE, { IcosahedronGeometry } from 'three';
import { useFrame, useThree, useLoader, Canvas, createPortal as createPortal$1, extend } from '@react-three/fiber';
//import { Canvas } from 'react-three-fiber';
import {Box, Icosahedron, Sky, shaderMaterial} from "@react-three/drei";

//import glsl from 'glslify';


export default function Starter() {
  return (
    <StandardReality playerProps = {{speed : 8}} environmentProps={{pauseMenu : null}}>
      {/*<ambientLight intensity = {0} />
      {/*<Model scale = {0.007} rotation-x = {-Math.PI/2} position-y = {0.01} src = "./vrShowcaseGlassFixed.glb"/>
      <Model scale = {0.01} position-y = {0.7} src = "./product.glb"/>*/}
      
      <Collidable triLimit={1000} enabled={true} hideCollisionMeshes={false}>
      <Model scale = {1} position-y = {0.3} position-x = {-100} src = "./mainBeamBase.glb"/>
      <Model scale = {0.35} position-y = {0} position-x = {-5} rotation-y={Math.PI/2} src = "./tree.glb"/>
      </Collidable>

      {/*<Model scale = {0.27} position-y = {0.3} position-x = {5} src = "./mainBeamFloor.glb"/>*/}
      <Model scale = {1} position-y = {-5} position-x = {5} rotation-y={(Math.PI/2)+0.1} src = "./Island_Pillars.glb"/>
 
      <Icosahedron args ={[5,1]} position-y = {10}position-x = {-100} >
      </Icosahedron>

      <pointLight intensity = {1} position={[10, 10, 11]} />
      <Fog color = "black" near = {0.1} far = {500}/>
      <HDRI src = "./Skyhdr2.hdr" rotation-z = {Math.PI/2} rotation-x = {Math.PI} /> 
      {/*<TransparentFloor opacity={0.1} />*/}
      
    </StandardReality>
  );
}