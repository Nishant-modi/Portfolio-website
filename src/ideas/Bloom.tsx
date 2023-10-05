//import { VisualEffect } from "myvr/mymain.js";
import { VisualEffect } from "spacesvr";
import { UnrealBloomPass, DotScreenPass, HalftonePass, HalftoneShader, OutlinePass} from "three-stdlib";
import { extend, ReactThreeFiber } from "@react-three/fiber";

import { useState } from "react";
import { Vector2 } from "three";

extend({ UnrealBloomPass, DotScreenPass, HalftonePass, HalftoneShader,OutlinePass });


const params = {
    shape: 3,
    radius: 0.005,
    rotateR: Math.PI/12,
    rotateB: Math.PI/12,
    rotateG: Math.PI/12,
    scatter: 0.1,
    blending: 1,
    blendingMode: 1,
    greyscale: 0,
    disable: 0
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      unrealBloomPass: ReactThreeFiber.Node<
        UnrealBloomPass,
        typeof UnrealBloomPass
      >;
      dotScreenPass: ReactThreeFiber.Node<
        DotScreenPass,
        typeof DotScreenPass
      >;
      halftonePass: ReactThreeFiber.Node<
        HalftonePass,
        typeof HalftonePass
      >;
      outlinePass: ReactThreeFiber.Node<
        OutlinePass,
        typeof OutlinePass
      >;
    }
  }
}



export default function Bloom() {
  const [res] = useState(() => new Vector2(1024, 1024));

  return (
    <VisualEffect index={1}>
      <unrealBloomPass args={[res, 1, 1, 0.95]} />
      
      <halftonePass args = {[1,1,params]}/>
      
      {/*
      <unrealBloomPass args={[res, 1, 1, 0.95]} />
      <halftonePass args = {[1,1,params]}/>
      <dotScreenPass args={[res, 1, 20]} />
      */}
      
    </VisualEffect>
  );
}