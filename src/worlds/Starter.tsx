import { Spinning, Floating, StandardReality, Model } from "spacesvr";
import TransparentFloor from "ideas/TransparentFloor";
import CloudySky from "ideas/CloudySky";
import {Sky} from "@react-three/drei";
export default function Starter() {
  return (
    <StandardReality>
      <ambientLight intensity = {4} />
      <Model scale = {0.007} rotation-x = {-Math.PI/2} position-y = {0.01} src = "./vrShowcaseGlassFixed.glb"/>
      <Model scale = {0.01} position-y = {0.7} src = "./product.glb"/>
      <TransparentFloor opacity={0.1} />
      <Sky/>
    </StandardReality>
  );
}