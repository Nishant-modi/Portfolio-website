import { Spinning, Floating, Model, Fog, HDRI, EnvironmentProps, Collidable, PlayerProps, Player, useEnvironment, useKeyboardLayout, Idea, MenuItem, Video} from "spacesvr";
import {StandardReality, Interactable} from "myvr/mymain.js";
import TransparentFloor from "ideas/TransparentFloor";
import CloudySky from "ideas/CloudySky";
import React, {Suspense, useRef} from 'react';
import THREE, { IcosahedronGeometry } from 'three';
import { EffectComposer, DotScreen } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useFrame, useThree, useLoader, Canvas, createPortal as createPortal$1, extend } from '@react-three/fiber';
//import { Canvas } from 'react-three-fiber';
import {Box, Icosahedron, Sky, shaderMaterial} from "@react-three/drei";

//import glsl from 'glslify';

function Effects() {
  return (
    <EffectComposer>
      <DotScreen
        blendFunction={BlendFunction.NORMAL}
        angle={Math.PI * 0.5}
        scale={5}
        opacity = {0.1}

      />
    </EffectComposer>
  );
}


export default function Starter() {
  return (
    
    <StandardReality playerProps= {{pos : [-45,1,65] , speed : 6}} environmentProps={{pauseMenu : null}}>
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
      

      <Interactable onClick={() => window.open("https://jmangoes.itch.io/mirrors",'_blank')}>
      <Video src="./Banners/Green_Screen.mp4" size={12.1} position = {[-86.2, 6, 11.65]} rotation-y={(Math.PI)+0.153} framed frameWidth={1} /> {/*left first banner */}


      <Model scale = {0.5} position = {[-101, -1 , 0]} rotation-y={(Math.PI/2)+0.153} src = "./Models/Buttons/Button_LF.glb"/>

      </Interactable>

      <Interactable onClick={() => window.open("https://www.facebook.com",'_blank')}>
      <Video src="./Banners/Green_Screen.mp4" size={12.1} position = {[-97.65, 6, 13.4]} rotation-y={(Math.PI)+0.153} framed frameWidth={1} />  {/*left middle banner*/}
      <Model scale = {0.5} position = {[-100.7, -1 , 0]} rotation-y={(Math.PI/2)+0.153} src = "./Models/Buttons/Button_LM.glb"/>
      </Interactable>

      <Interactable onClick={() => window.open("https://www.google.com",'_blank')}>
      <Video src="./Banners/Website_Banner.mp4" size={12.1} position = {[-109.23, 6, 15.2]} rotation-y={(Math.PI)+0.153} framed frameWidth={1} /> {/*left last banner*/}
      <Model scale = {0.5} position = {[-100.5, -1 , 0]} rotation-y={(Math.PI/2)+0.153} src = "./Models/Buttons/Button_LL.glb"/>
      </Interactable>

      <Interactable onClick={() => window.open("https://jmangoes.itch.io/mirrors",'_blank')}>
      <Video src="./Banners/Mirrors_Banner.mp4" size={12.1} position = {[-90.25, 6, -15.3]} rotation-y={0.153} framed frameWidth={1} /> {/*right first banner*/}
      <Model scale = {0.5} position = {[-101, -1 , 0]} rotation-y={(Math.PI/2)+0.153} src = "./Models/Buttons/Button_RF.glb"/>
      </Interactable>

      <Interactable onClick={() => window.open("https://jmangoes.itch.io/rock-my-boat",'_blank')}>
      <Video src="./Banners/Rockmyboat_Banner.mp4" size={12.1} position = {[-101.75, 6, -13.4]} rotation-y={0.153} framed frameWidth={1} /> {/*right middle banner*/}
      <Model scale = {0.5} position = {[-100.7, -1 , 0]} rotation-y={(Math.PI/2)+0.153} src = "./Models/Buttons/Button_RM.glb"/>
      </Interactable>

      <Interactable onClick={() => window.open("https://jumping_mangoes.artstation.com/",'_blank')}>
      <Video src="./Banners/Artworks_Banner.mp4" size={12.1} position = {[-113.35, 6, -11.75]} rotation-y={0.153} framed frameWidth={1} /> {/*right last banner*/}
      <Model scale = {0.5} position = {[-100.5, -1 , 0]} rotation-y={(Math.PI/2)+0.153} src = "./Models/Buttons/Button_RL.glb"/>
      </Interactable>

      
      <Effects/>


      {/*<Fog color = "#2C1A10" near = {0.1} far = {80}/>*/}
      <HDRI src = "./Skyhdr4.hdr" rotation-z = {Math.PI/2} rotation-y = {Math.PI} /> 
      {/*<TransparentFloor opacity={0.1} />*/}
      
    </StandardReality>
  );
}