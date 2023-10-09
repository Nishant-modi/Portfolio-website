import { Spinning, Floating,Model, Fog, HDRI, PlayerProps, Player, useEnvironment, useKeyboardLayout, Idea, MenuItem, Video, Image, Interactable, VisualEffect, Collidable, StandardReality, Camera, Audio} from "spacesvr";
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
//import {Box, Center, Icosahedron, Sky, shaderMaterial} from "@react-three/drei";
import Bloom from "../ideas/Bloom";
//import { sync } from 'glob';

//import glsl from 'glslify';




/*function Effects() {
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
}*/

//const dirGlob = require('dir-glob');

let trees: string[] = [];
  for (let i = 1; i <= 45; i++) {
    trees.push("./Models/Trees/tree"+i+".glb");
  }


export default function Starter() {
  return (
    
    
    <StandardReality environmentProps={{name:"jmangoes", dev:false}} playerProps= {{pos : [-50,1,1.4] , speed : 7.5, rot: -Math.PI/2}}> 
    {/*<StandardReality>  */}
      
          


      
      

      {/*
      
      <pointLight intensity = {0} position={[10, 10, 11]} />
        <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10]} />
      </directionalLight>
      <Audio url="./Audio/cricket.mp3" position = {[0,0,-100]} volume = {0.2} rollOff = {0}/>
      <Audio url="./Audio/beam.mp3" position = {[0,1,-40]} volume = {2} rollOff = {1.3}/>
      
      
      {/*main models
    <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/CompressedModels/staticObjects - meshopt medium.glb"/>


    
      */}
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Mountains.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Floor.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/FloorGuide.glb"/>
      
      
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/MachineBase.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/MainMachine.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Umbrella.glb"/>
      
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Beam.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/IconStands.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/jmangoes.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/SphereBeam.glb"/>
      <Model scale = {1} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.03} src = "./Models/skybox.glb"/>


      

      {/*landing screen and buttons*/}
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Screen.glb"/>

      <Interactable onClick={() => window.open("https://drive.google.com/file/d/1KPIGCFLc_1ots8Wl-Wi5hb-tNVTn-UBP/view?usp=sharing",'_blank')}>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Buttons/Button1.glb"/>
      
      </Interactable>
      <Interactable onClick={() => window.open("https://www.behance.net/nishant_modi",'_blank')}>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Buttons/Button2.glb"/>
      
      </Interactable>
      <Interactable onClick={() => window.open("https://jmangoes.itch.io/",'_blank')}>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Buttons/Button3.glb"/>
      
      </Interactable>
      <Interactable onClick={() => window.open("https://www.linkedin.com/in/nishant-modi/",'_blank')}>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Buttons/Button4.glb"/>
      
      </Interactable>

      {/*project screens*/}
      <Interactable onClick={() => window.open("https://www.behance.net/gallery/179602967/de_canopy_0_1",'_blank')}>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/ProjectScreens/ProjectScreenL1.glb"/>
      </Interactable>
      <Interactable onClick={() => window.open("https://www.behance.net/gallery/181548207/Players-Paradox-Game-Prototype",'_blank')}>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/ProjectScreens/ProjectScreenL2.glb"/>
      </Interactable>
      <Interactable onClick={() => window.open("https://www.artstation.com/jumping_mangoes",'_blank')}>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/ProjectScreens/ProjectScreenL3.glb"/>
      </Interactable>
      <Interactable onClick={() => window.open("https://www.behance.net/gallery/181633421/Forgotten-Melodies-Game-Prototype",'_blank')}>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/ProjectScreens/ProjectScreenR1.glb"/>
      </Interactable>
      <Interactable onClick={() => window.open("https://www.behance.net/gallery/179602263/Mirrors20",'_blank')}>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/ProjectScreens/ProjectScreenR2.glb"/>
      </Interactable>
      <Interactable onClick={() => window.open("https://www.behance.net/gallery/179603239/jMangoes-Portfolio-Website",'_blank')}>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/ProjectScreens/ProjectScreenR3.glb"/>
      </Interactable>


      {/*icons*/}
      
      <Interactable onClick={() => window.open("https://www.linkedin.com/in/nishant-modi/",'_blank')}>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Icons/iconButtons/button1.glb"/>
      <Floating height = {0.06} speed = {11}>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Icons/linkedin.glb"/>
      </Floating>
      </Interactable>
      

      
      <Interactable onClick={() => window.open("https://www.artstation.com/jumping_mangoes",'_blank')}>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Icons/iconButtons/button2.glb"/>
      <Floating height = {0.06} speed = {11}>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Icons/artstation.glb"/>
      </Floating>
      </Interactable>
      

      
      <Interactable onClick={() => window.open("https://drive.google.com/file/d/1KPIGCFLc_1ots8Wl-Wi5hb-tNVTn-UBP/view?usp=sharing",'_blank')}>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Icons/iconButtons/button3.glb"/>
      <Floating height = {0.07} speed = {11}>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Icons/resume.glb"/>
      </Floating>
      </Interactable>
      

      

      
      <Interactable onClick={() => window.open("https://www.behance.net/nishant_modi",'_blank')}>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Icons/iconButtons/button4.glb"/>
      <Floating height = {0.07} speed = {11}>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Icons/behance.glb"/>
      </Floating>
      </Interactable>
      

      
      <Interactable onClick={() => window.open("https://jmangoes.itch.io/",'_blank')}>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Icons/iconButtons/button5.glb"/>
      <Floating height = {0.07} speed = {11}>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Icons/itch.glb"/>
      </Floating>
      </Interactable>
      

      
      <Interactable onClick={() => window.open("https://github.com/Nishant-modi",'_blank')}>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Icons/iconButtons/button6.glb"/>
      <Floating height = {0.07} speed = {11}>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Icons/github.glb"/>
      </Floating>
      </Interactable>
      


      
      <Interactable onClick={() => window.open("mailto:mnishant0123@gmail.com",'_blank')}>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Icons/iconButtons/button7.glb"/>
      <Floating height = {0.07} speed = {11}>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Icons/mail.glb"/>
      </Floating>
      </Interactable>
      
      
      <Floating height = {0.06} speed = {11}>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Buttons/Cone.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Buttons/ConeScreen.glb"/>
      </Floating>
      
      {/*<Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Buttons/cone2.glb"/>
      
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Buttons/cone3.glb"/>
      
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Buttons/cone4.glb"/>
      
      
      
      trees
      
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree9.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree10.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree11.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree8.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree20.glb"/>
      
      
      
      {/*icons
      
      <Floating height = {0.06} speed = {11}>*/}
      
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree1.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree2.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree3.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree4.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree5.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree6.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree7.glb"/>
      
      
      
      
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree12.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree13.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree14.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree15.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree16.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree17.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree18.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree19.glb"/>
      
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree21.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree22.glb"/>
      
      
      

      
      
      
      
      <directionalLight intensity = {4} position={[1, 0.3, 0]} color={0xF0F1FF}/>
      <ambientLight intensity = {0.63} color = {0xC9C2B3}/>
      <Bloom/>
      
      
      {/*
      <HDRI src = "./Skyhdr4.hdr" rotation-z = {Math.PI/2} rotation-y = {Math.PI} /> 
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree21.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree22.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree23.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree24.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree25.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree26.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree27.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree28.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree29.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree30.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree31.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree32.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree33.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree34.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree35.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree36.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree37.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree38.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree39.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree40.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree41.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree42.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree43.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree44.glb"/>
      <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = "./Models/Trees/tree45.glb"/>
      

      

      { /*
        trees.map(tree => (
          <Model scale = {0.25} position-y = {-1.7} position-x = {0} rotation-y={(-Math.PI/2)+1.6} src = {tree}/>
        ))
        }
      

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

      
      

      {/*<Fog color = "#2C1A10" near = {0.1} far = {80}/>
      
      
      {/*<TransparentFloor opacity={0.1} />
      <Camera />
      */}
      
      
    </StandardReality>
    
  );
}