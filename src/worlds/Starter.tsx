import { Spinning, Floating, Model, Fog, HDRI, EnvironmentProps, Collidable, PlayerProps, Player, useEnvironment, useKeyboardLayout, Idea, MenuItem, Video} from "spacesvr";
import {StandardReality, Interactable} from "myvr/mymain.js";
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
    <StandardReality playerProps= {{pos : [-45,1,65] , speed : 8}} environmentProps={{pauseMenu : null}}>
      {/*<ambientLight intensity = {0} />
      {/*<Model scale = {0.007} rotation-x = {-Math.PI/2} position-y = {0.01} src = "./vrShowcaseGlassFixed.glb"/>
      <Model scale = {0.01} position-y = {0.7} src = "./product.glb"/>
      
      <Collidable triLimit={1000} enabled={true} hideCollisionMeshes={false}>
      <Model scale = {1} position-y = {0.3} position-x = {-100} src = "./mainBeamBase.glb"/>
      <Model scale = {0.35} position-y = {0} position-x = {-5} rotation-y={Math.PI/2} src = "./tree.glb"/>
      </Collidable>

      {/*<Model scale = {0.27} position-y = {0.3} position-x = {5} src = "./mainBeamFloor.glb"/>
      <Model scale = {1} position-y = {-5} position-x = {5} rotation-y={(Math.PI/2)+0.1} src = "./Island_Pillars.glb"/>
 
      <Icosahedron args ={[5,1]} position-y = {10}position-x = {-100} >
      </Icosahedron>

      <pointLight intensity = {1} position={[10, 10, 11]} />
      
      <Model scale = {0.5} position-y = {-1} position-x = {-100} rotation-y={(Math.PI/2)+0.153} src = "./Final2.glb"/>*/}

      <Collidable triLimit={10000} enabled={true} hideCollisionMeshes={false}>
      <Model scale = {0.5} position-y = {-1.7} position-x = {-100} rotation-y={(Math.PI/2)+0.153} src = "./Models/Beam.glb"/>
      <Model scale = {0.5} position-y = {-1} position-x = {-100} rotation-y={(Math.PI/2)+0.153} src = "./Models/Islands.glb"/>
      <Model scale = {0.5} position-y = {-1} position-x = {-100} rotation-y={(Math.PI/2)+0.153} src = "./Models/Bridges.glb"/>
      <Model scale = {0.5} position-y = {-1.5} position-x = {-100} rotation-y={(Math.PI/2)+0.153} src = "./Models/Machine_Base.glb"/>
      <Model scale = {0.5} position-y = {-2} position-x = {-100} rotation-y={(Math.PI/2)+0.153} src = "./Models/Machine.glb"/>
      <Model scale = {0.5} position-y = {-1.7} position-x = {-100} rotation-y={(Math.PI/2)+0.153} src = "./Models/Dish.glb"/>
      <Model scale = {0.5} position-y = {-1} position-x = {-100} rotation-y={(Math.PI/2)+0.153} src = "./Models/Hall.glb"/>
      <Model scale = {0.5} position-y = {-1} position-x = {-100} rotation-y={(Math.PI/2)+0.153} src = "./Models/Banners.glb"/>
      </Collidable >
      

      <Interactable onClick={() => window.open("https://www.google.com",'_blank')}>
      <Video src="./Mirrors_Banner.mp4" size={12.1} position = {[-86.2, 6, 11.65]} rotation-y={(Math.PI)+0.153} framed frameWidth={1} /> {/*left first banner*/}
      </Interactable>

      <Interactable onClick={() => window.open("https://www.google.com",'_blank')}>
      <Video src="./Mirrors_Banner.mp4" size={12.1} position = {[-97.65, 6, 13.4]} rotation-y={(Math.PI)+0.153} framed frameWidth={1} />  {/*left middle banner*/}
      </Interactable>

      <Interactable onClick={() => window.open("https://www.google.com",'_blank')}>
      <Video src="./Mirrors_Banner.mp4" size={12.1} position = {[-109.23, 6, 15.2]} rotation-y={(Math.PI)+0.153} framed frameWidth={1} /> {/*left last banner*/}
      </Interactable>

      <Interactable onClick={() => window.open("https://www.google.com",'_blank')}>
      <Video src="./Mirrors_Banner.mp4" size={12.1} position = {[-90.25, 6, -15.3]} rotation-y={0.153} framed frameWidth={1} /> {/*right first banner*/}
      </Interactable>

      <Interactable onClick={() => window.open("https://www.google.com",'_blank')}>
      <Video src="./Mirrors_Banner.mp4" size={12.1} position = {[-101.75, 6, -13.4]} rotation-y={0.153} framed frameWidth={1} /> {/*right middle banner*/}
      </Interactable>

      <Interactable onClick={() => window.open("https://www.google.com",'_blank')}>
      <Video src="./Mirrors_Banner.mp4" size={12.1} position = {[-113.35, 6, -11.75]} rotation-y={0.153} framed frameWidth={1} /> {/*right last banner*/}
      </Interactable>






      <Fog color = "black" near = {0.1} far = {500}/>
      <HDRI src = "./Skyhdr3.hdr" rotation-z = {Math.PI/2} rotation-y = {Math.PI} /> 
      {/*<TransparentFloor opacity={0.1} />*/}
      
    </StandardReality>
  );
}