//import { VisualEffect } from "myvr/mymain.js";
import { VisualEffect } from "spacesvr";
import { UnrealBloomPass, DotScreenPass, HalftonePass, HalftoneShader} from "three-stdlib";
import { extend, ReactThreeFiber } from "@react-three/fiber";

import { useState } from "react";
import { Vector2 } from "three";

extend({ UnrealBloomPass, DotScreenPass, HalftonePass, HalftoneShader });


const params = {
    shape: 1,
    radius: 5,
    rotateR: Math.PI / 12,
    rotateB: Math.PI / 12 * 2,
    rotateG: Math.PI / 12 * 3,
    scatter: 0.3,
    blending: 0.5,
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
    }
  }
}



export default function Bloom() {
  const [res] = useState(() => new Vector2(1024, 1024));

  return (
    <VisualEffect index={1}>
      
      <unrealBloomPass args={[res, 1, 1, 0.95]} />
      <dotScreenPass args={[res, 1, 2]} />
      {/*<halftonePass args = {[1,1,params]}/>*/}
    </VisualEffect>
  );
}