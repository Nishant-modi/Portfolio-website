import { Spinning, Floating, StandardReality, Model } from "spacesvr";
import TransparentFloor from "ideas/TransparentFloor";
import CloudySky from "ideas/CloudySky";
import {Sky} from "@react-three/drei";
export default function Starter() {
  return (
    <StandardReality>
      <ambientLight intensity = {0} />
      <Model scale = {0.007} rotation-x = {-Math.PI/2} position-y = {0.01} src = "./vrShowcaseGlassFixed.glb"/>
      <Model scale = {0.01} position-y = {0.7} src = "./product.glb"/>
      <Model scale = {1} position-y = {0.7} src = "./shader test cycles.glb"/>
      <TransparentFloor opacity={2} />
      <Sky/>
    </StandardReality>
  );
}