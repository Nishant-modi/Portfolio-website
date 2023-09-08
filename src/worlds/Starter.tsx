import { Spinning, Floating,Model, Fog, HDRI, PlayerProps, Player, useEnvironment, useKeyboardLayout, Idea, MenuItem, Video, Image, Interactable, VisualEffect, Collidable, StandardReality, Camera} from "spacesvr";
//import {PauseMenu} from "worlds/PauseMenu.js"; 
//import {PauseMenu} from "myvr/mymain.js";
//import{PauseMenu} from "spacesvr/main.js";
import TransparentFloor from "ideas/TransparentFloor";
import CloudySky from "ideas/CloudySky";
import React, {Suspense, useRef, useState} from 'react';
import THREE, { IcosahedronGeometry} from 'three';
import { EffectComposer, DotScreen, LensFlare} from "@react-three/postprocessing";
import { BlendFunction} from "postprocessing";
//import {DotScreenPass} from "three/examples/jsm/postprocessing/DotScreenPass";
import { UnrealBloomPass, DotScreenPass } from "three-stdlib";
//import {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { useFrame, useThree, useLoader, Canvas, createPortal as createPortal$1, extend, ReactThreeFiber } from '@react-three/fiber';
//import { Canvas } from 'react-three-fiber';
import {Box, Center, Icosahedron, Sky, shaderMaterial} from "@react-three/drei";
import Bloom from "../ideas/Bloom";

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
    
    
    <StandardReality environmentProps={{name:"jmangoes", pauseMenu : null, dev : false}} playerProps= {{pos : [20,1,130] , speed : 6}} toolbeltProps={{showOnSpawn : false}}> 
    {/*<StandardReality>  */}
      <Bloom/>
      <ambientLight intensity = {0} />
      <pointLight intensity = {0} position={[10, 10, 11]} />
      
      
      <directionalLight intensity = {3} castShadow position={[1, 0.3, 0]} shadow-mapSize={[1024, 1024]}>
          <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10]} />
      </directionalLight>
  
      

      {/*
      <EffectComposer>
      <DotScreen
        blendFunction={BlendFunction.NORMAL}
        angle={Math.PI * 0.5}
        scale={5}
        opacity = {0.2}
      />
    </EffectComposer>

    

    <VisualEffect index={0}>
    <UnrealBloomPass args={[new Vector2(256, 256), 0.1, 0.01, 0.95]} />
    </VisualEffect>
      <ambientLight intensity = {0} />
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
      
      <Model scale = {0.5} position-y = {-1} position-x = {-100} rotation-y={(-Math.PI/2)+1.6} src = "./Final2.glb"/>

      <Collidable triLimit={10000} enabled={true} hideCollisionMeshes={false}>
      <Model scale = {0.5} position-y = {-1.7} position-x = {-100} rotation-y={(-Math.PI/2)+1.6} src = "./Models/BeamLines.glb"/>
      <Model scale = {0.5} position-y = {-1.7} position-x = {-100} rotation-y={(-Math.PI/2)+1.6} src = "./Models/MainBeam.glb"/>
      <Model receiveShadow scale = {0.5} position-y = {-1} position-x = {-100} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Islands.glb"/>
      <Model castShadow receiveShadow scale = {0.5} position-y = {-1} position-x = {-100} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Bridges.glb"/>
      <Model scale = {0.5} position-y = {-1.5} position-x = {-100} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Machine_Base.glb"/>
      <Model castShadow scale = {0.5} position-y = {-2} position-x = {-100} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Machine.glb"/>
      <Model castShadow scale = {0.5} position-y = {-1.7} position-x = {-100} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Dish.glb"/>
      <Model castShadow scale = {0.5} position-y = {-1} position-x = {-100} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Hall.glb"/>
      <Model scale = {0.5} position-y = {-1} position-x = {-100} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Banners.glb"/>
      </Collidable >
      */}
      
      {/*main models*/}
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Floor.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/FloorGuide.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Mountains.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Beam.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/MachineBase.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/MainMachine.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Umbrella.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/IconStands.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/jmangoes.glb"/>
      <Floating height = {0.2} speed = {11}>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/SphereBeam.glb"/>
      </Floating>

      {/*landing screen and buttons*/}
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Screen.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Buttons/button1.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Buttons/button2.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Buttons/button3.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Buttons/button4.glb"/>

      {/*project screens*/}
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/ProjectScreens/ProjectScreenL1.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/ProjectScreens/ProjectScreenL2.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/ProjectScreens/ProjectScreenL3.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/ProjectScreens/ProjectScreenR1.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/ProjectScreens/ProjectScreenR2.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/ProjectScreens/ProjectScreenR3.glb"/>


      
      {/*icons*/}
      
      <Floating height = {0.06} speed = {11}>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Icons/insta.glb"/>
      </Floating>
      <Floating height = {0.06} speed = {11}>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Icons/github.glb"/>
      </Floating>
      <Floating height = {0.06} speed = {11}>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Icons/artstation.glb"/>
      </Floating>
      <Floating height = {0.06} speed = {11}>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Icons/behance.glb"/>
      </Floating>
      <Floating height = {0.06} speed = {11}>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Icons/itch.glb"/>
      </Floating>
      <Floating height = {0.06} speed = {11}>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Icons/mail.glb"/>
      </Floating>
      <Floating height = {0.06} speed = {11}>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Icons/resume.glb"/>
      </Floating>






      {/*trees*/}
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree1.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree2.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree3.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree4.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree5.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree6.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree7.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree8.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree9.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree10.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree11.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree12.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree13.glb"/>
      


      

      {/*
      <Image src = "./Screen/Welcome.png" size = {10}/>
      <Interactable onClick={() => window.open("https://jmangoes.itch.io/mirrors",'_blank')}>
      <Video src="./Banners/Green_Screen.mp4" size={12.1} position = {[-86.2, 6, 11.65]} rotation-y={(Math.PI)+0.153} framed frameWidth={1} /> {/*left first banner


      <Model scale = {0.5} position = {[-101, -1 , 0]} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Buttons/Button_LF.glb"/>

      </Interactable>

      <Interactable onClick={() => window.open("https://www.facebook.com",'_blank')}>
      <Video src="./Banners/Green_Screen.mp4" size={12.1} position = {[-97.65, 6, 13.4]} rotation-y={(Math.PI)+0.153} framed frameWidth={1} />  {/*left middle banner
      <Model scale = {0.5} position = {[-100.7, -1 , 0]} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Buttons/Button_LM.glb"/>
      </Interactable>

      <Interactable onClick={() => window.open("https://www.google.com",'_blank')}>
      <Video src="./Banners/Website_Banner.mp4" size={12.1} position = {[-109.23, 6, 15.2]} rotation-y={(Math.PI)+0.153} framed frameWidth={1} /> {/*left last banner
      <Model scale = {0.5} position = {[-100.5, -1 , 0]} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Buttons/Button_LL.glb"/>
      </Interactable>

      <Interactable onClick={() => window.open("https://jmangoes.itch.io/mirrors",'_blank')}>
      <Video src="./Banners/Mirrors_Banner2.gif" size={12.1} position = {[-90.25, 6, -15.3]} rotation-y={0.153} framed frameWidth={1} /> {/*right first banner

      <Image src = "./Banners/Mirrors_Banner2.gif" size={12.1} position = {[-90.25, 6, -15.3]} rotation-y={0.153}/>
      <Model scale = {0.5} position = {[-101, -1 , 0]} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Buttons/Button_RF.glb"/>
      </Interactable>

      <Interactable onClick={() => window.open("https://jmangoes.itch.io/rock-my-boat",'_blank')}>
      <Video src="./Banners/Rockmyboat_Banner.mp4" size={12.1} position = {[-101.75, 6, -13.4]} rotation-y={0.153} framed frameWidth={1} /> {/*right middle banner
      <Model scale = {0.5} position = {[-100.7, -1 , 0]} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Buttons/Button_RM.glb"/>
      </Interactable>

      <Interactable onClick={() => window.open("https://jumping_mangoes.artstation.com/",'_blank')}>
      <Video src="./Banners/Artworks_Banner.mp4" size={12.1} position = {[-113.35, 6, -11.75]} rotation-y={0.153} framed frameWidth={1} /> {/*right last banner
      <Model scale = {0.5} position = {[-100.5, -1 , 0]} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Buttons/Button_RL.glb"/>
      </Interactable>
      */}

      
      

      {/*<Fog color = "#2C1A10" near = {0.1} far = {80}/>*/}
      <HDRI src = "./Skyhdr4.hdr" rotation-z = {Math.PI/2} rotation-y = {Math.PI} /> 
      <Camera />
      {/*<TransparentFloor opacity={0.1} />*/}
      
      
    </StandardReality>
    
  );
}