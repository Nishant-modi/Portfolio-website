import React from "react";
import _extends from '@babel/runtime/helpers/esm/extends';
import { useRef, useMemo, useEffect, useLayoutEffect, useState, Suspense, useCallback, createContext, useContext, Children, cloneElement, forwardRef } from 'react';
import { useFrame, useThree, Canvas, createPortal as createPortal$1, extend } from '@react-three/fiber';
import { Color, MeshStandardMaterial, DoubleSide, Uniform, Vector3, Vector2, Quaternion, Euler, Fog as Fog$1, AudioListener, PositionalAudio, AudioAnalyser, CanvasTexture, TextureLoader, BoxGeometry, MeshBasicMaterial, AudioContext, NoToneMapping, MathUtils, Raycaster, Box3, sRGBEncoding, MeshLambertMaterial, Matrix4, BufferGeometry, Float32BufferAttribute, Scene, Light, AmbientLight, WebGLCubeRenderTarget, CubeCamera, WebGLRenderTarget, UnsignedByteType, RGBAFormat, Object3D, SphereGeometry, CylinderGeometry, MeshNormalMaterial, NearestFilter, WebGLRenderer } from 'three';
import { useSpring, config, animated, a } from '@react-spring/three';
import * as culori from 'culori';
import { Environment as Environment$1, useGLTF, useProgress, Html, Text as Text$2, PerspectiveCamera } from '@react-three/drei';
import { usePlane, useTrimesh, useCompoundBody, Physics as Physics$1 } from '@react-three/cannon';
import { WebGLExtensions } from 'three/src/renderers/webgl/WebGLExtensions';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader';
import { suspend, preload, clear } from 'suspend-react';
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';
import { acceleratedRaycast, computeBoundsTree, disposeBoundsTree } from 'three-mesh-bvh';
import { css, Global, keyframes } from '@emotion/react';
import nipplejs from 'nipplejs';
import styled from '@emotion/styled';
import { isMobile } from 'react-device-detect';
import { XR, useXR, Controllers, useController, Interactive } from '@react-three/xr';
import { DeviceOrientationControls, SkeletonUtils, mergeVertices, EffectComposer, RenderPass, ShaderPass } from 'three-stdlib';
import { ErrorBoundary } from 'react-error-boundary';
import { createPortal } from 'react-dom';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry';
import { getCaretAtPoint, Text as Text$3 } from 'troika-three-text';
import { SnapshotInterpolation } from '@geckos.io/snapshot-interpolation';
import { Peer } from 'peerjs';
import { useTransition } from '@react-spring/core';

const vertHead$3 = `
    // Description : Array and textureless GLSL 2D/3D/4D simplex
    //               noise functions.
    //      Author : Ian McEwan, Ashima Arts.
    //  Maintainer : ijm
    //     Lastmod : 20110822 (ijm)
    //     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
    //               Distributed under the MIT License. See LICENSE file.
    //               https://github.com/ashima/webgl-noise
    //
    
    vec3 mod289(vec3 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec4 mod289(vec4 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec4 permute(vec4 x) {
         return mod289(((x*34.0)+1.0)*x);
    }
    
    vec4 taylorInvSqrt(vec4 r)
    {
      return 1.79284291400159 - 0.85373472095314 * r;
    }
    
    float snoise(vec3 v)
      {
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    
    // First corner
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 =   v - i + dot(i, C.xxx) ;
    
    // Other corners
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
    
      //   x0 = x0 - 0.0 + 0.0 * C.xxx;
      //   x1 = x0 - i1  + 1.0 * C.xxx;
      //   x2 = x0 - i2  + 2.0 * C.xxx;
      //   x3 = x0 - 1.0 + 3.0 * C.xxx;
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
      vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
    
    // Permutations
      i = mod289(i);
      vec4 p = permute( permute( permute(
                 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
               + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    
    // Gradients: 7x7 points over a square, mapped onto an octahedron.
    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
      float n_ = 0.142857142857; // 1.0/7.0
      vec3  ns = n_ * D.wyz - D.xzx;
    
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)
    
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
    
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
    
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
    
      //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
      //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
    
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
    
    //Normalise gradients
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
    
    // Mix final noise value
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                    dot(p2,x2), dot(p3,x3) ) );
      }
              
    
    float fsnoise(float val1, float val2, float val3){
      return snoise(vec3(val1,val2,val3));
    }
    
    vec3 distortFunct(vec3 transformed, float factor) {
      float radiusVariation = -fsnoise(
        transformed.x * radiusNoiseFrequency + time,
        transformed.y * radiusNoiseFrequency + time,
        transformed.z * radiusNoiseFrequency + time 
      ) * radiusVariationAmplitude * factor;
      return normalize(transformed) * (radiusVariation + radius);
    }
    
    vec3 orthogonal(vec3 v) {
      return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)
      : vec3(0.0, -v.z, v.y));
    }
    
    vec3 distortNormal(vec3 position, vec3 distortedPosition, vec3 normal){
      vec3 tangent1 = orthogonal(normal);
      vec3 tangent2 = normalize(cross(normal, tangent1));
      vec3 nearby1 = position + tangent1 * 0.1;
      vec3 nearby2 = position + tangent2 * 0.1;
      vec3 distorted1 = distortFunct(nearby1, 1.0);
      vec3 distorted2 = distortFunct(nearby2, 1.0);
      return normalize(cross(distorted1 - distortedPosition, distorted2 - distortedPosition));
    }
`;
const vert$3 = `
    #include <begin_vertex>
    float updateTime = time / 10.0;
    transformed = distortFunct(transformed, 1.0);
    vec3 distortedNormal = distortNormal(position, transformed, normal);
    vNormal = normal + distortedNormal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed,1.);
`;
const frag$3 = `
    #include <dithering_fragment>
    float angle = clamp(dot(normalize(vNormal), vec3(0., -1., 0.)), 0., 1.);
    gl_FragColor = vec4(gl_FragColor.rgb * color, gl_FragColor.a);  
    gl_FragColor.rgb = mix(gl_FragColor.rgb, mix(color, vec3(0.), 0.5), angle);
`;

/**
 * Returns a function that, when used every frame, will mark itself
 * as ready maximum {frequency} times per second.
 *
 * @param frequency How many times per second to be marked as ready
 */
const useLimiter = frequency => {
  const lastCall = useRef(0);
  return {
    isReady: clock => {
      const time = clock.elapsedTime;
      const ready = time - lastCall.current > 1 / frequency;

      if (ready) {
        lastCall.current = time;
      }

      return ready;
    }
  };
};
/**
 * A 1:1 copy of useFrame, but adds a limiter
 *
 * Callback will only run {frequency} times per second
 */

const useLimitedFrame = (frequency, callback, renderPriority) => {
  const limiter = useLimiter(frequency);
  useFrame((state, delta) => {
    if (!limiter.isReady(state.clock)) return;
    callback(state, delta);
  }, renderPriority);
};

function VisualIdea(props) {
  const {
    idea,
    ...rest
  } = props;
  const hex = useMemo(() => (idea == null ? void 0 : idea.getHex()) || "#808080", [idea]);
  const seed = useMemo(() => Math.random(), []);
  const color = useMemo(() => new Color(hex), [hex]);
  const RADIUS = 4;
  const NOISE_AMPLITUDE = 0.82;
  const NOISE_FREQ = 0.154;
  const {
    col
  } = useSpring({
    col: hex
  });
  const mat = useMemo(() => {
    const material = new MeshStandardMaterial({
      metalness: 0.18,
      roughness: 0.49,
      envMapIntensity: 0.66,
      side: DoubleSide
    });

    material.onBeforeCompile = function (shader) {
      shader.uniforms.radius = new Uniform(RADIUS);
      shader.uniforms.time = new Uniform(0);
      shader.uniforms.color = new Uniform(color);
      shader.uniforms.radiusVariationAmplitude = new Uniform(NOISE_AMPLITUDE);
      shader.uniforms.radiusNoiseFrequency = new Uniform(NOISE_FREQ);
      const uniforms = `
        uniform float radius;
        uniform float time;
        uniform vec3 color;
        uniform float radiusVariationAmplitude;
        uniform float radiusNoiseFrequency;
      `;
      shader.vertexShader = uniforms + vertHead$3 + shader.vertexShader.replace("#include <begin_vertex>", vert$3);
      shader.fragmentShader = uniforms + shader.fragmentShader.replace("#include <dithering_fragment>", frag$3);
      material.userData.shader = shader;
    };

    return material;
  }, [RADIUS, color, NOISE_AMPLITUDE, NOISE_FREQ, frag$3, vert$3]);
  const limiter = useLimiter(50);
  useFrame(_ref => {
    var _mat$userData;

    let {
      clock
    } = _ref;
    if (!(mat != null && (_mat$userData = mat.userData) != null && _mat$userData.shader) || !limiter.isReady(clock)) return;
    mat.userData.shader.uniforms.time.value = clock.elapsedTime / 6 + seed * 1000;
    mat.userData.shader.uniforms.color.value.set(col.get());
  });
  return /*#__PURE__*/React.createElement("group", _extends({
    name: "spacesvr-basis-idea"
  }, rest), /*#__PURE__*/React.createElement("mesh", {
    material: mat,
    scale: 0.2
  }, /*#__PURE__*/React.createElement("sphereGeometry", {
    args: [RADIUS, 48, 32]
  })));
}

const rgb_helper = `
    vec3 rgb2hsv(vec3 c)
    {
        vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
        vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
        vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    
        float d = q.x - min(q.w, q.y);
        float e = 1.0e-10;
        return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
    }
    
    vec3 hsv2rgb(vec3 c)
    {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }
`;
const noise4D = `
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
float permute(float x){return floor(mod(((x*34.0)+1.0)*x, 289.0));}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float taylorInvSqrt(float r){return 1.79284291400159 - 0.85373472095314 * r;}

vec4 grad4(float j, vec4 ip){
  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
  vec4 p,s;

  p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
  s = vec4(lessThan(p, vec4(0.0)));
  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www; 

  return p;
}

float snoise(vec4 v){
  const vec2  C = vec2( 0.138196601125010504,  // (5 - sqrt(5))/20  G4
                        0.309016994374947451); // (sqrt(5) - 1)/4   F4
// First corner
  vec4 i  = floor(v + dot(v, C.yyyy) );
  vec4 x0 = v -   i + dot(i, C.xxxx);

// Other corners

// Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
  vec4 i0;

  vec3 isX = step( x0.yzw, x0.xxx );
  vec3 isYZ = step( x0.zww, x0.yyz );
//  i0.x = dot( isX, vec3( 1.0 ) );
  i0.x = isX.x + isX.y + isX.z;
  i0.yzw = 1.0 - isX;

//  i0.y += dot( isYZ.xy, vec2( 1.0 ) );
  i0.y += isYZ.x + isYZ.y;
  i0.zw += 1.0 - isYZ.xy;

  i0.z += isYZ.z;
  i0.w += 1.0 - isYZ.z;

  // i0 now contains the unique values 0,1,2,3 in each channel
  vec4 i3 = clamp( i0, 0.0, 1.0 );
  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

  //  x0 = x0 - 0.0 + 0.0 * C 
  vec4 x1 = x0 - i1 + 1.0 * C.xxxx;
  vec4 x2 = x0 - i2 + 2.0 * C.xxxx;
  vec4 x3 = x0 - i3 + 3.0 * C.xxxx;
  vec4 x4 = x0 - 1.0 + 4.0 * C.xxxx;

// Permutations
  i = mod(i, 289.0); 
  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
  vec4 j1 = permute( permute( permute( permute (
             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));
// Gradients
// ( 7*7*6 points uniformly over a cube, mapped onto a 4-octahedron.)
// 7*7*6 = 294, which is close to the ring size 17*17 = 289.

  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

  vec4 p0 = grad4(j0,   ip);
  vec4 p1 = grad4(j1.x, ip);
  vec4 p2 = grad4(j1.y, ip);
  vec4 p3 = grad4(j1.z, ip);
  vec4 p4 = grad4(j1.w, ip);

// Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  p4 *= taylorInvSqrt(dot(p4,p4));

// Mix contributions from the five corners
  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
  m0 = m0 * m0;
  m1 = m1 * m1;
  float final = 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;
    return (final + 1.) / 2.;
}
`;
const oklab$1 = `
float fixedpow(float a, float x)
{
    return pow(abs(a), x) * sign(a);
}

float cbrt(float a)
{
    return fixedpow(a, 0.3333333333);
}

vec3 lsrgb2oklab(vec3 c)
{
    float l = 0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b;
    float m = 0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b;
    float s = 0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b;

    float l_ = cbrt(l);
    float m_ = cbrt(m);
    float s_ = cbrt(s);

    return vec3(
        0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
        1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
        0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
    );
}

vec3 oklab2lsrgb(vec3 c)
{
    float l_ = c.r + 0.3963377774 * c.g + 0.2158037573 * c.b;
    float m_ = c.r - 0.1055613458 * c.g - 0.0638541728 * c.b;
    float s_ = c.r - 0.0894841775 * c.g - 1.2914855480 * c.b;

    float l = l_ * l_ * l_;
    float m = m_ * m_ * m_;
    float s = s_ * s_ * s_;

    return vec3(
        4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
    );
}
`;
const vertHead$2 = `
    precision highp float;
    varying vec2 vUv;
    varying float terrain;
    varying float terrain_perc;
    varying vec3 vfNormal;

    uniform float radius;
    uniform float time;
    uniform vec3 color;

    ${noise4D}
`;
const vert$2 = `
    vec3 pos = position;
    
    terrain = 0.;
    float u_time = time * 0.25;
    
    terrain += 1. * pow(snoise(vec4(pos.xyz * 0.15, u_time + 100.)), 1.);
    terrain += 0.8 * pow(snoise(vec4(pos.xyz * 0.2, u_time + 200.)), 1.5);
    terrain += 0.4 * pow(snoise(vec4(pos.xyz * 0.8, u_time + 300.)), 2.);
    terrain += 0.2 * pow(snoise(vec4(pos.xyz * 1.6, u_time + 400.)), 8.);
    terrain_perc = terrain / (1. + 0.8 + 0.4 + 0.2);
    terrain_perc = terrain_perc;
    
    pos = pos + normal * 2. * 2. * (terrain_perc - 0.5);
    vfNormal = normal;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
`;
const fragHead$1 = `
    precision highp float;
    varying vec2 vUv;
    varying vec3 vfNormal;
    varying float terrain;
    varying float terrain_perc;

    uniform float time;
    uniform vec3 axiom;
    uniform float range;
    uniform vec3 up_norm;
    
    
    ${rgb_helper}
    ${oklab$1}
`;
const frag$2 = `
    vec3 hsv_col = rgb2hsv(gl_FragColor.rgb);
    
    // todo: offset vfNormal by up_norm
    vec3 oklab_axiom = lsrgb2oklab(axiom);
    vec3 oklab_range_idea = lsrgb2oklab(axiom + 0.35 * range * vfNormal);
    vec3 col = oklab2lsrgb(mix(oklab_axiom, oklab_range_idea, 1. - terrain_perc));
    
    gl_FragColor.rgb = col * pow(hsv_col.z, 1.3);
    
    
    gl_FragColor.rgb *= 0.15 + 1.85 * pow((1. - terrain_perc), 1.5);
`;

// @ts-ignore

/**
 * an idea is the fundamental substrate of reality.
 */
class Idea {
  // identifiers
  // mediation
  // [0, 1)
  // [0, 1]
  // [0, 1]
  constructor(m, s, u) {
    if (m === void 0) {
      m = 0;
    }

    if (s === void 0) {
      s = 0;
    }

    if (u === void 0) {
      u = 0.5;
    }

    this.setFromCreation(m, s, u);
    return this;
  }

  setFromCreation(m, s, u) {
    if (m === void 0) {
      m = 0;
    }

    if (s === void 0) {
      s = 0;
    }

    if (u === void 0) {
      u = 0.5;
    }

    this.mediation = m;
    this.specificity = s;
    this.utility = u;
    return this;
  }

  setFromHex(hex) {
    const color = culori.oklch(culori.rgb(hex));

    if (!color) {
      console.warn("idea :: setFromHex - invalid hex color");
      return this;
    }

    this.mediation = color.h / 360;
    this.specificity = color.c / 0.322;
    this.utility = color.l;
    return this;
  }

  updateFromText(text) {
    const len = text.length;
    this.mediation = hashStringToRange$1(text);
    this.specificity = (1 - (len == 0 ? 1 : 1 / len)) * 0.5;
    return this;
  }

  setUtility(utility) {
    this.utility = utility;
    return this;
  }

  getHex() {
    const fixedColor = culori.rgb({
      mode: "oklch",
      l: this.utility,
      c: this.specificity * 0.322,
      h: this.mediation * 360
    });
    return culori.formatHex(fixedColor);
  }

  getOpposite() {
    const newM = this.mediation + 0.5 > 1 ? this.mediation - 0.5 : this.mediation + 0.5;
    const newS = this.specificity;
    const newU = 0.5 - (this.utility - 0.5);
    return new Idea().setFromCreation(newM, newS, newU);
  }

  clone() {
    return new Idea(this.mediation, this.specificity, this.utility);
  }

}
const AVG_CHAR_VAL$1 = 100; // each char is roughly 100, so loop every ~50 chars

const hashStringToRange$1 = function (str, loop) {
  if (loop === void 0) {
    loop = 20;
  }

  let count = 0;

  for (let i = 0; i < str.length; i++) {
    count += str.substr(i, 1).charCodeAt(0);
  }

  const scaledLoop = loop * AVG_CHAR_VAL$1;
  return count % scaledLoop / scaledLoop;
};

function VisualWorld(props) {
  const {
    world,
    ...rest
  } = props;
  const RADIUS = 4;
  const SEED = useMemo(() => Math.random(), []);
  const mat = useMemo(() => {
    const material = new MeshStandardMaterial({
      metalness: 0.18,
      roughness: 0.49,
      side: DoubleSide
    });

    material.onBeforeCompile = function (shader) {
      const uniforms = {
        time: new Uniform(0),
        axiom: new Uniform(new Color("#888888")),
        up_norm: new Uniform(new Vector3(0, 1, 0)),
        range: new Uniform(0)
      };
      shader.uniforms = { ...shader.uniforms,
        ...uniforms
      };
      shader.vertexShader = vertHead$2 + shader.vertexShader.replace("#include <worldpos_vertex>", "#include <worldpos_vertex>\n" + vert$2);
      shader.fragmentShader = fragHead$1 + shader.fragmentShader.replace("#include <dithering_fragment>", "#include <dithering_fragment>\n" + frag$2);
      material.userData.shader = shader;
    };

    material.needsUpdate = true;
    return material;
  }, []);
  useEffect(() => {
    if (!mat || !mat.userData.shader || !world) return;
    const unifs = mat.userData.shader.uniforms;
    const axiom = world ? world.getAxiom() : new Idea();
    unifs.axiom.value.set(new Color(axiom.getHex()));
    unifs.up_norm.value = world == null ? void 0 : world.getUpNorm();
    unifs.range.value = world == null ? void 0 : world.getRange();
  }, [world, mat]);
  useLimitedFrame(50, _ref => {
    let {
      clock
    } = _ref;
    if (!mat || !mat.userData.shader) return;
    mat.userData.shader.uniforms.time.value = clock.elapsedTime + SEED * 500;
  });
  return /*#__PURE__*/React.createElement("group", _extends({
    name: "spacesvr-basis-world"
  }, rest), /*#__PURE__*/React.createElement("mesh", {
    material: mat,
    scale: 0.2
  }, /*#__PURE__*/React.createElement("sphereGeometry", {
    args: [RADIUS, 48, 32]
  })));
}

const DOWN_AXIS = new Vector3(0, -1, 0);
/**
 * Will smoothly rotate its children to face the camera along the Y axis, regardless of the parent's rotation.
 */

function LookAtPlayer(props) {
  const {
    enabled = true,
    children
  } = props;
  const group = useRef(null);
  const flatDelta = useMemo(() => new Vector2(), []);
  const worldPos = useMemo(() => new Vector3(), []);
  const worldQuat = useMemo(() => new Quaternion(), []);
  const targetQuat = useMemo(() => new Quaternion(), []);
  const parentQuat = useMemo(() => new Quaternion(), []);
  const offsetRot = useMemo(() => new Euler(), []);
  useLimitedFrame(50, (_ref, delta) => {
    var _group$current$parent;

    let {
      camera
    } = _ref;
    if (!group.current) return;
    (_group$current$parent = group.current.parent) == null ? void 0 : _group$current$parent.getWorldQuaternion(parentQuat);
    offsetRot.setFromQuaternion(parentQuat, "YXZ");
    targetQuat.set(0, 0, 0, 1);

    if (enabled) {
      group.current.getWorldPosition(worldPos);
      group.current.getWorldQuaternion(worldQuat);
      flatDelta.x = camera.position.x - worldPos.x;
      flatDelta.y = camera.position.z - worldPos.z;
      const angle = flatDelta.angle() - Math.PI / 2 + offsetRot.y;
      targetQuat.setFromAxisAngle(DOWN_AXIS, angle);
    }

    group.current.quaternion.slerp(targetQuat, 0.11);
  });
  return /*#__PURE__*/React.createElement("group", {
    name: "look-at-player",
    ref: group
  }, children);
}

function Background$1(props) {
  const {
    color
  } = props;
  const scene = useThree(state => state.scene);
  useLayoutEffect(() => {
    const oldBackground = scene.background;
    const col = color instanceof Color ? color : new Color(color);
    scene.background = col;
    return () => {
      scene.background = oldBackground;
    };
  }, [color]);
  return null;
}

function Fog(props) {
  const {
    color = "white",
    near = 10,
    far = 80
  } = props;
  const scene = useThree(state => state.scene);
  useEffect(() => {
    const col = color instanceof Color ? color : new Color(color);
    scene.fog = new Fog$1(col, near, far);
    return () => {
      scene.fog = null;
    };
  }, [scene, color, near, far]);
  return null;
}

function InfinitePlane(props) {
  const {
    height = -0.0001,
    size = [100, 100],
    visible
  } = props;
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, height, 0],
    args: size,
    type: "Static"
  }));
  if (!visible) return null;
  return /*#__PURE__*/React.createElement("mesh", {
    name: "spacesvr-infinite-plane",
    ref: ref
  }, /*#__PURE__*/React.createElement("planeGeometry", {
    args: size
  }), /*#__PURE__*/React.createElement("meshPhongMaterial", {
    color: "#660000"
  }));
}

function Audio$1(props) {
  const {
    url,
    dCone = new Vector3(180, 230, 0.1),
    rollOff = 1,
    volume = 1,
    setAudioAnalyser,
    fftSize = 128,
    ...rest
  } = props;
  const [speaker, setSpeaker] = useState();
  const camera = useThree(state => state.camera);
  const audio = useMemo(() => {
    const a = document.createElement("audio");
    a.src = url;
    a.autoplay = false;
    a.preload = "auto";
    a.crossOrigin = "Anonymous";
    a.loop = true;
    return a;
  }, []);
  useEffect(() => {
    const setupAudio = () => {
      if (!audio.paused && !speaker) {
        const listener = new AudioListener();
        camera.add(listener);
        const speak = new PositionalAudio(listener);
        speak.setMediaElementSource(audio);
        speak.setRefDistance(0.75);
        speak.setRolloffFactor(rollOff);
        speak.setVolume(volume);
        speak.setDirectionalCone(dCone.x, dCone.y, dCone.z);

        if (setAudioAnalyser) {
          setAudioAnalyser(new AudioAnalyser(speak, fftSize));
        }

        setSpeaker(speak);
      }
    };

    const playAudio = () => audio.play().then(() => setupAudio());

    if (audio) {
      audio.setAttribute("src", url);
      audio.play().then(() => setupAudio());
      document.addEventListener("click", playAudio);
      return () => {
        document.removeEventListener("click", playAudio);
      };
    }
  }, [speaker, audio, url]);
  useEffect(() => {
    if (!speaker) return;
    speaker.setRolloffFactor(rollOff);
    speaker.setVolume(volume);
    speaker.setDirectionalCone(dCone.x, dCone.y, dCone.z);
  }, [dCone, rollOff, volume]);
  return /*#__PURE__*/React.createElement("group", _extends({
    name: "spacesvr-audio"
  }, rest), speaker && /*#__PURE__*/React.createElement("primitive", {
    object: speaker
  }));
}

function HDRI(props) {
  const {
    src,
    disableBackground,
    disableEnvironment
  } = props;
  return /*#__PURE__*/React.createElement(Suspense, {
    fallback: null
  }, /*#__PURE__*/React.createElement(Environment$1, {
    files: src,
    background: !disableBackground && !disableEnvironment ? true : disableEnvironment && !disableBackground ? "only" : false
  }));
}

let fallbackTexture;
const SIZE = 128;
const SIZE_2 = SIZE / 2;
const RAD = 12;
const LINE_W = 1;
/**
 * Provides a default texture that is created locally
 */

function getFallbackTexture() {
  if (fallbackTexture) return fallbackTexture;
  const canvas = document.createElement("canvas");
  canvas.height = SIZE;
  canvas.width = SIZE;
  const context = canvas.getContext("2d");
  context.fillStyle = "#FFFFFF";
  context.fillRect(0, 0, SIZE, SIZE); // main circle

  context.fillStyle = "#000000";
  context.beginPath();
  context.arc(SIZE_2, SIZE_2, RAD, 0, 2 * Math.PI);
  context.fill(); // draw a white line down the middle of the circle

  context.strokeStyle = "#FFFFFF";
  context.lineWidth = Math.ceil(LINE_W);
  context.beginPath();
  context.moveTo(SIZE_2, SIZE_2 - RAD);
  context.lineTo(SIZE_2, SIZE_2 + RAD);
  context.stroke(); // draw a horizontal line across the middle of the circle

  context.beginPath();
  context.moveTo(SIZE_2 - RAD, SIZE_2);
  context.lineTo(SIZE_2 + RAD, SIZE_2);
  context.stroke();
  fallbackTexture = new CanvasTexture(canvas);
  return fallbackTexture;
}

const KTX_CDN = "https://cdn.jsdelivr.net/gh/pmndrs/drei-assets@master/basis/";
const textureLoader = new TextureLoader();
let ktx2loader; // it's inconvenient to have to produce a gl object to check for ktx2 support, especially when it comes to the cache keys
// solution is to create a skeleton object that provides the minimum requirements to check for ktx support, defined below
// https://github.com/mrdoob/three.js/blob/master/examples/jsm/loaders/KTX2Loader.js#L113-L135

const setupKtx2 = () => {
  if (ktx2loader) return;
  ktx2loader = new KTX2Loader();
  ktx2loader.setTranscoderPath(KTX_CDN);
  let supportsWebgl2;
  const el = document.createElement("canvas");
  let gl = el.getContext("webgl2");

  if (gl) {
    supportsWebgl2 = true;
  } else {
    gl = el.getContext("webgl");
    supportsWebgl2 = false;
  }

  if (!gl) {
    throw new Error("No WebGL support");
  }

  el.remove();
  const minimumGL = {
    extensions: new WebGLExtensions(gl),
    capabilities: {
      isWebGL2: supportsWebgl2
    }
  }; // @ts-ignore

  ktx2loader.detectSupport(minimumGL);
};

function loadimage() {
  return function (url) {
    const IS_KTX2 = url.toLowerCase().endsWith("ktx2");
    setupKtx2();
    const loader = IS_KTX2 ? ktx2loader : textureLoader;
    return new Promise(res => loader.load(url, res, undefined, error => {
      console.error(error);
      res(getFallbackTexture());
    }));
  };
}
/**
 * A single hook akin to useTexture but with ktx support
 *
 * KTX_CDN is from drei so that we don't download two separate transcoders when using the useKtx2 hook elsewhere
 * https://github.com/pmndrs/drei/blob/a2daf02853f624ef6062c70ba0b218bc03e5b626/src/core/useKTX2.tsx#L7
 * @param url
 */


function useImage(url) {
  return suspend(loadimage(), [url]);
}

useImage.preload = function (url) {
  return preload(loadimage(), [url]);
};

useImage.clear = function (url) {
  return clear([url]);
};
/**
 * A hook to load gltf models with draco, meshopt, and ktx2 support out of the box
 *
 * For all cases, functionality is to only download decoder files if needed by the file
 * @param url
 */


function useModel(url) {
  return useGLTF(url, true, true, loader => {
    setupKtx2();
    loader.setKTX2Loader(ktx2loader);
  });
}

useModel.preload = function (url) {
  return useGLTF.preload(url, true, true, loader => {
    setupKtx2();
    loader.setKTX2Loader(ktx2loader);
  });
};

useModel.clear = function (url) {
  return useGLTF.clear([url]);
};

/**
 *
 * Builds a frame for a mesh with a texture (image, video, etc.)
 *
 * In the code, the frame is the back panel and the border is the
 * four meshes that make up the top, left, right, and bottom sides
 * of the border.
 *
 * @param props
 * @constructor
 */
function Frame(props) {
  const {
    width,
    height,
    thickness = 1,
    material: passedMaterial,
    innerFrameMaterial
  } = props;
  const material = useMemo(() => passedMaterial || new MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.8,
    metalness: 0.05
  }), [passedMaterial]);
  const frameDepth = 0.075;
  const frameWidth = 0.06;
  const borderDepth = 0.08;
  const borderThickness = 0.05 * thickness;
  const meshOffset = 0.0005;
  const geometry = useMemo(() => {
    const backPanel = new BoxGeometry(width + frameWidth, height + frameWidth, frameDepth);
    backPanel.translate(0, 0, -frameDepth - meshOffset);
    const topFrame = new BoxGeometry(width + frameWidth, borderThickness, borderDepth);
    topFrame.translate(0, height / 2 + frameWidth / 2 - borderThickness / 2, 0);
    const bottomFrame = new BoxGeometry(width + frameWidth, borderThickness, borderDepth);
    bottomFrame.translate(0, -height / 2 - frameWidth / 2 + borderThickness / 2, 0);
    const leftFrame = new BoxGeometry(borderThickness, height + frameWidth, borderDepth);
    leftFrame.translate(-width / 2 - frameWidth / 2 + borderThickness / 2, 0, 0);
    const rightFrame = new BoxGeometry(borderThickness, height + frameWidth, borderDepth);
    rightFrame.translate(width / 2 + frameWidth / 2 - borderThickness / 2, 0, 0);
    const geos = [backPanel, topFrame, bottomFrame, leftFrame, rightFrame];
    const geo = mergeBufferGeometries(geos);
    backPanel.dispose();
    topFrame.dispose();
    bottomFrame.dispose();
    leftFrame.dispose();
    rightFrame.dispose();
    return geo;
  }, [innerFrameMaterial, borderThickness, width, height]);
  const backFrameGeometry = useMemo(() => {
    if (!innerFrameMaterial) return undefined;
    const backPanel = new BoxGeometry(width + frameWidth, height + frameWidth, frameDepth);
    backPanel.translate(0, 0, -frameDepth - meshOffset);
    return backPanel;
  }, [innerFrameMaterial, width, height]);
  return /*#__PURE__*/React.createElement("group", {
    name: "spacesvr-frame"
  }, /*#__PURE__*/React.createElement("mesh", {
    geometry: geometry,
    material: material
  }), backFrameGeometry && innerFrameMaterial && /*#__PURE__*/React.createElement("mesh", {
    geometry: backFrameGeometry,
    material: innerFrameMaterial
  }));
}

function UnsuspensedImage(props) {
  const {
    src,
    size = 1,
    framed,
    frameMaterial,
    frameWidth = 1,
    innerFrameMaterial,
    ...rest
  } = props;
  const tex = useImage(src);
  const {
    width,
    height
  } = tex.image;
  const max = Math.max(width, height);
  const WIDTH = width / max * size;
  const HEIGHT = height / max * size;
  const IS_COMPRESSED = tex.isCompressedTexture;
  return /*#__PURE__*/React.createElement("group", _extends({
    name: "spacesvr-image"
  }, rest), /*#__PURE__*/React.createElement("mesh", {
    rotation: IS_COMPRESSED ? [0, Math.PI, Math.PI] : [0, 0, 0]
  }, /*#__PURE__*/React.createElement("planeGeometry", {
    args: [WIDTH, HEIGHT]
  }), /*#__PURE__*/React.createElement("meshBasicMaterial", {
    map: tex,
    side: DoubleSide,
    transparent: true
  })), framed && /*#__PURE__*/React.createElement(Frame, {
    width: WIDTH,
    height: HEIGHT,
    thickness: frameWidth,
    material: frameMaterial,
    innerFrameMaterial: innerFrameMaterial
  }));
}

function Image$1(props) {
  return /*#__PURE__*/React.createElement(Suspense, {
    fallback: null
  }, /*#__PURE__*/React.createElement(UnsuspensedImage, props));
}

/**
 * a world is a set of ideas
 */
class World {
  constructor() {
    return this;
  }

  getIdea() {
    return new Idea().setFromCreation(hashStringToRange(JSON.stringify(this.tree || this.id), 3), 0.3 + 0.7 * hashStringToRange(this.id), 0.8);
  }

  getAxiom() {
    const str = JSON.stringify(this.tree || this.id);
    const strHash = new Array(10).fill(1).map(() => str).join("");
    return new Idea().setFromCreation(hashStringToRange(strHash, 15), 0.3 + 0.7 * hashStringToRange(strHash, 10), 0.8);
  }

  getUpNorm() {
    // 4 digit long hex values
    const x = parseInt(this.id.split("-")[1], 16) / Math.pow(16, 4);
    const y = parseInt(this.id.split("-")[2], 16) / Math.pow(16, 4);
    const z = parseInt(this.id.split("-")[3], 16) / Math.pow(16, 4);
    return new Vector3(x, y, z).normalize();
  }

  getRange() {
    const r = parseInt(this.id.split("-")[0], 16) / Math.pow(16, 8);
    return 0.3 + 0.7 * r;
  }

  getHex() {
    return this.getIdea().getHex();
  }

}
const AVG_CHAR_VAL = 100; // each char is roughly 100, so loop every ~50 chars

const hashStringToRange = function (str, loop) {
  if (loop === void 0) {
    loop = 8;
  }

  let count = 0;

  for (let i = 0; i < str.length; i++) {
    count += str.substr(i, 1).charCodeAt(0);
  }

  const scaledLoop = loop * AVG_CHAR_VAL;
  return count % scaledLoop / scaledLoop;
};

/**
 * A site is a delivery method of a world.
 */
class Site {
  constructor() {
    return this;
  }

}

/**
 * Gets the number of triangles in a geometry
 */

const getGeometryTriCount$1 = geometry => {
  return geometry.index ? geometry.index.count / 3 : geometry.attributes.position.count / 3;
};
/**
 * For a given mesh, set up bvh raycasting for it if it meets the threshold for
 * amount of triangles to use
 *
 * @param mesh
 * @param threshold
 */


const enableBVHRaycast = function (mesh, threshold) {
  if (threshold === void 0) {
    threshold = 0;
  }

  if (!mesh.geometry || !mesh.geometry.isBufferGeometry) {
    return;
  }

  const geometry = mesh.geometry;
  const triCount = getGeometryTriCount$1(geometry);
  if (geometry.boundsTree || triCount < threshold) return;
  mesh.raycast = acceleratedRaycast;
  geometry.computeBoundsTree = computeBoundsTree;
  geometry.disposeBoundsTree = disposeBoundsTree;
  geometry.computeBoundsTree({
    verbose: true
  });
};

const universe_cache = new Map();

function getResource(key, constructor, opts) {
  let resource = universe_cache.get(key);

  if (!resource) {
    if (opts != null && opts.verbose) console.log(`[CACHE] ${key} not found, creating new`);
    resource = constructor();
    universe_cache.set(key, resource);
  } else {
    if (opts != null && opts.verbose) console.log(`[CACHE] ${key} found, returning`);
  }

  return resource;
}

const cache = {
  getResource,
  useResource: (key, constructor, opts) => {
    const [resource, setResource] = useState(getResource(key, constructor, opts));
    useEffect(() => {
      setResource(getResource(key, constructor, opts));
    }, [key]);
    return resource;
  },

  get mat_standard_white() {
    return getResource("mat_standard_white", () => new MeshStandardMaterial({
      color: "white"
    }));
  },

  get mat_standard_cream_double() {
    return getResource("mat_standard_cream_double", () => new MeshStandardMaterial({
      color: "#aaa",
      side: DoubleSide
    }));
  },

  get mat_standard_black() {
    return getResource("mat_standard_black", () => new MeshStandardMaterial({
      color: "black"
    }));
  },

  get mat_standard_rose() {
    return getResource("mat_standard_rose", () => new MeshStandardMaterial({
      color: "#ff007f"
    }));
  },

  get mat_standard_red() {
    return getResource("mat_standard_red", () => new MeshStandardMaterial({
      color: "#ff0000"
    }));
  },

  get mat_basic_white() {
    return getResource("mat_basic_white", () => new MeshBasicMaterial({
      color: "white"
    }));
  },

  get mat_basic_black() {
    return getResource("mat_basic_black", () => new MeshBasicMaterial({
      color: "black"
    }));
  },

  get mat_basic_gray() {
    return getResource("mat_basic_gray", () => new MeshBasicMaterial({
      color: "#828282"
    }));
  },

  get mat_basic_red() {
    return getResource("mat_basic_red", () => new MeshBasicMaterial({
      color: "red"
    }));
  },

  get mat_basic_black_wireframe() {
    return getResource("mat_basic_black_wireframe", () => new MeshBasicMaterial({
      color: "black",
      wireframe: true
    }));
  }

};

const useTrimeshCollision$1 = geometry => {
  const indices = geometry.index.array;
  const isInterleaved = // @ts-ignore
  geometry.attributes.position.isInterleavedBufferAttribute;
  let vertices = [];

  if (isInterleaved) {
    const attr = geometry.attributes.position;
    const data = attr.data;

    for (let i = attr.offset; i < data.array.length; i += data.stride) {
      for (let x = 0; x < attr.itemSize; x++) {
        vertices.push(data.array[i + x]);
      }
    }
  } else {
    vertices = geometry.attributes.position.array;
  }

  const [hitbox] = useTrimesh(() => ({
    type: "Static",
    args: [vertices, indices]
  }));
  return hitbox;
};

// check whether the user is currently typing
const isTyping = () => {
  var _document, _document$activeEleme, _document2;

  return ((_document = document) == null ? void 0 : (_document$activeEleme = _document.activeElement) == null ? void 0 : _document$activeEleme.tagName) === "INPUT" && ((_document2 = document) == null ? void 0 : _document2.hasFocus());
};

const useDrag = function (callback, domElem, deps) {
  if (deps === void 0) {
    deps = [];
  }

  const {
    clock,
    size,
    viewport
  } = useThree();
  const aspect = size.width / viewport.width;
  const [downPoint] = useState(new Vector2());
  const [dragPoint] = useState(new Vector2());
  const [velocity] = useState(new Vector2());
  const [delta] = useState(new Vector2());
  const lastTouchRead = useRef(0);
  const onStart = useCallback(p => {
    if (callback.onStart) callback.onStart(p);
  }, [...deps]);
  const onMove = useCallback(p => {
    if (callback.onMove) callback.onMove(p);
  }, [...deps]);
  const onEnd = useCallback(p => {
    if (callback.onEnd) callback.onEnd(p);
  }, [...deps]);
  const startDrag = useCallback(e => {
    e.preventDefault();
    const touch = e.changedTouches[0];
    downPoint.set(touch.clientX, touch.clientY);
    onStart({
      e,
      touch,
      downPoint,
      dragPoint: downPoint,
      velocity
    });
  }, [onStart, downPoint, velocity]);
  const moveDrag = useCallback(e => {
    const touch = e.touches[0];
    dragPoint.set(touch.clientX, touch.clientY);
    const delta = dragPoint.sub(downPoint);
    const time = clock.elapsedTime;
    const elapsed = time - lastTouchRead.current;
    velocity.set(delta.x / elapsed / aspect, delta.y / elapsed / aspect);
    lastTouchRead.current = time;
    onMove({
      e,
      touch,
      downPoint,
      dragPoint,
      velocity,
      delta
    });
  }, [aspect, onMove, clock, downPoint, dragPoint, velocity]);
  const endDrag = useCallback(e => {
    const touch = e.changedTouches[0];
    dragPoint.set(touch.clientX, touch.clientY);
    delta.copy(dragPoint).sub(downPoint);
    onEnd({
      e,
      touch,
      downPoint,
      dragPoint,
      velocity,
      delta
    });
  }, [onEnd, delta, downPoint, dragPoint, velocity]);
  useEffect(() => {
    const elem = domElem || document;
    elem.addEventListener("touchstart", startDrag);
    elem.addEventListener("touchmove", moveDrag);
    elem.addEventListener("touchend", endDrag);
    return () => {
      elem.removeEventListener("touchstart", startDrag);
      elem.removeEventListener("touchmove", moveDrag);
      elem.removeEventListener("touchend", endDrag);
    };
  }, [domElem, endDrag, moveDrag, startDrag]);
  return {
    startDrag,
    moveDrag,
    endDrag
  };
};

const PADDING_X = 0.125;
const PADDING_X_2 = PADDING_X * 2;
const PADDING_Y = 0.125;
const PADDING_Y_2 = PADDING_Y * 2;
const RAD_PER_DEG_2 = Math.PI / 180 / 2;
const getHudPos = (pos, camera, distance, target) => {
  const vFOV = camera.fov * RAD_PER_DEG_2;
  const height = 2 * Math.tan(vFOV) * Math.abs(distance);
  const width = height * camera.aspect;
  const px = pos.x || pos[0];
  const py = pos.y || pos[1];
  const x = px * (width - PADDING_X_2) * 0.5;
  const y = py * (height - PADDING_Y_2) * 0.5;

  if (target) {
    target.x = x;
    target.y = y;
    return target;
  }

  return new Vector2(x, y);
};
const getHudDims = (camera, distance) => {
  const vFOV = camera.fov * RAD_PER_DEG_2;
  const height = 2 * Math.tan(vFOV) * Math.abs(distance);
  const width = height * camera.aspect;
  return {
    width,
    height
  };
};
const useHudDims = function (distance) {
  if (distance === void 0) {
    distance = 1;
  }

  const camera = useThree(state => state.camera);
  return useMemo(() => {
    return getHudDims(camera, distance); // make sure aspect is there
  }, [camera, distance, camera.aspect]);
};

const Container$3 = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;

  canvas {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    outline: 0;
  }
`;



const globalStyles = css`

@import url("https://use.typekit.net/eqf0dzv.css");

  @font-face {
    font-family: "Quicksand";
    src: url("https://d27rt3a60hh1lx.cloudfront.net/fonts/Quicksand_Bold.otf");
  }

  @font-face {
    font-family:"sketchnote-square";
    src:url("https://use.typekit.net/af/78d776/00000000000000007735a31a/30/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3") format("woff2"),url("https://use.typekit.net/af/78d776/00000000000000007735a31a/30/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3") format("woff"),url("https://use.typekit.net/af/78d776/00000000000000007735a31a/30/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3") format("opentype");
    font-display:auto;font-style:normal;font-weight:400;font-stretch:normal;
    }

    @font-face {
      font-family:"rig-solid-bold-fill";
      src:url("https://use.typekit.net/af/932505/00000000000000007735bf40/30/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"),url("https://use.typekit.net/af/932505/00000000000000007735bf40/30/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"),url("https://use.typekit.net/af/932505/00000000000000007735bf40/30/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
      font-display:auto;font-style:normal;font-weight:700;font-stretch:normal;
      }  

  html {
    position: fixed;
    height: 100%;
    overflow: hidden;
  }

  
  body {
    margin: 0;
    width: 100vw;
    height: 100vh;
    user-select: none;
    overflow: hidden;
    touch-action: none;
    -webkit-overflow-scrolling: touch;
  }
`;
function GlobalStyles() {
  useEffect(() => {
    const view = document.createElement("meta");
    view.name = "viewport";
    view.content = "initial-scale=1, viewport-fit=cover";
    document.head.append(view);
    return () => {
      document.head.removeChild(view);
    };
  }, []);
  return /*#__PURE__*/React.createElement(Global, {
    styles: globalStyles
  });
}

/**
 * A modified version of the controlled progress hooks that adds
 * - a minimum wait time, in case it takes a second to register an asset
 * - a delay after it reaches 100 in case it goes back down
 * - a timeout when it reaches > 50%, marked as stuck
 */

const useControlledProgress = () => {
  const MIN_TIME = 2000; // minimum time to wait before moving to 100

  const AFTER_TIME = 300; // extra time to prevent bouncing at reaching 100

  const {
    progress,
    total
  } = useProgress();
  const startTime = useRef(new Date());
  const controlledProgress = useRef(0);
  const finished = useRef(false);
  const [, setForceRender] = useState(0);
  useEffect(() => {
    const newTime = new Date();
    const timeElapsed = newTime.getTime() - startTime.current.getTime();
    const diff = Math.min(progress - controlledProgress.current, timeElapsed < MIN_TIME ? 99 : 100);

    if (diff > 0) {
      if (progress === 100) {
        finished.current = true; // if progress 100, check in AFTER_TIME ms to make sure it hasn't
        // bounced back down

        setTimeout(() => {
          if (finished.current) {
            controlledProgress.current = progress; // set state to force re render

            setForceRender(Math.random());
          }
        }, AFTER_TIME);
      } else {
        finished.current = false;
        controlledProgress.current = progress;
      }
    }

    if (progress !== 100) {
      finished.current = false;
    }
  }, [progress]); // wait TIMEOUT (ms) to check if any objects are waiting to be loaded

  const [counter, setCounter] = useState(0);
  const [skip, setSkip] = useState(false);
  useEffect(() => {
    if (total > 0) {
      return;
    } else if (counter > 0) {
      setSkip(true);
    } else {
      setTimeout(() => setCounter(counter + 1), MIN_TIME);
    }
  }, [counter]);
  return skip ? 100 : Math.floor(controlledProgress.current);
};

const float = keyframes`
  0% {
    transform: translatey(0px);
  }

  50% {
    transform: translatey(-15px);
  }

  100% {
    transform: translatey(0px);
  }
`;
const grow = keyframes`
  0% {
    opacity: 0.8;
  }

  50% {
    opacity: 0.2;
  }

  100% {
    opacity: 0.8;
  }
`;
const Container$2 = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 11;
  background: white;
  transition: opacity 0.75s ease-in;
  transition-delay: 0.5s;
  opacity: ${props => props.finished ? "0" : "1"};
  pointer-events: ${props => props.finished ? "none" : "all"};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: rig-solid-bold-fill, sans-serif;
  font-size: 20px;
  @media screen and (max-width: 500px) {
    font-size: 24px;
  }
`;
const Text$1 = styled.div`
  animation: ${float} 7s ease-in-out infinite;
`;
const Wrapper$1 = styled.div`
  position: relative;

  &:before {
    pointer-events: none;
    position: absolute;
    content: "";
    top: 100%;
    left: 5%;
    height: 10px;
    width: 90%;
    background: -webkit-radial-gradient(
      center,
      ellipse,
      rgba(0, 0, 0, 0.35) 0%,
      transparent 80%
    );
    background: radial-gradient(
      ellipse at center,
      rgba(0, 0, 0, 0.35) 0%,
      transparent 80%
    );
    -webkit-transition-duration: 0.3s;
    transition-duration: 0.3s;
    -webkit-transition-property: transform, opacity;
    transition-property: transform, opacity;
    animation: ${grow} 7s ease-in-out infinite;
  }
`;
function LoadingScreen() {
  const progress = useControlledProgress();
  return /*#__PURE__*/React.createElement(Container$2, {
    finished: progress === 100
  }, /*#__PURE__*/React.createElement(Wrapper$1, null, /*#__PURE__*/React.createElement(Text$1, null, Math.round(progress), "%")));
}

const Container$1 = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  transition: opacity 0.25s ease;
  background: rgba(0, 0, 0, ${props => props.dev ? 0 : 0.25});
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  opacity: ${props => props.paused ? 1 : 0};
  pointer-events: ${props => props.paused ? "all" : "none"};
  font-family: rig-solid-bold-fill, sans-serif;
  font-weight: 400;
  font-style: normal; 
  font-size: 27px;
  @media screen and (max-width: 500px) {
    font-size: 24px;
  }
`;
const ClickContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
`;
const Window = styled.div`
  width: 90%;
  max-width: 400px;
  padding: 20px 20px;
  color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 10px;
  background-color: white;
  background-position: center;
  background-size: cover;
  box-sizing: border-box;

  box-shadow: 12px 12px 16px 0 rgba(0, 0, 0, 0.25),
    -8px -8px 12px 0 rgba(255, 255, 255, 0.3);
`;
const Continue = styled.div`
  width: 90%;
  max-width: 400px;
  height: auto;
  cursor: pointer;
  text-align: center;
  font-size: 1.3em;
  font-family: rig-solid-bold-fill, sans-serif;
  transition: opacity 0.15s linear;
  margin-top: 20px;
  background: ${props => props.color};
  color: white;
  //border: 2px solid black;
  line-height: 1em;
  padding: 12px 0;
  border-radius: 10px;
  :hover {
    opacity: 0.5;
  }

  box-shadow: 12px 12px 16px 0 rgba(0, 0, 0, 0.25),
    -8px -8px 12px 0 rgba(255, 255, 255, 0.3);
`;
const Instructions = styled.div`
  width: 100%;
  height: auto;
  margin: 30px 0;
  font-size: 0.7em;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;

  & > p {
    margin: 0.2em;
  }
`;
const MenuButton = styled.div`
  border: 1px solid black;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0);
  padding: 5px 10px;
  margin: 8px 4px;
  transition: background 0.15s linear;
  font-size: 0.5em;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.15);
  }
`;
const MenuLink = styled.a`
  border: 1px solid black;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0);
  padding: 5px 10px;
  margin: 8px 4px;
  transition: background 0.15s linear;
  font-size: 0.5em;
  cursor: pointer;
  text-decoration: none;
  color: black !important;

  &:hover {
    background: rgba(0, 0, 0, 0.15);
  }
`;
const Title = styled.h1`
  margin: 0;
`;

const SubTitle = styled.div`
width: 100%;
height: auto;
margin: 30px 0;
font-size: 0.7em;
text-align: center;
display: flex;
flex-direction: column;
justify-content: center;

& > p {
  margin: 0.2em;
}
`;
const Actions = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
`;

/**
 * Check validity of browser to run 3d experiences,
 * Automatically blacklists Facebook & Instagram in-app
 * browsers
 */
const useKeyboardLayout = () => {
  const [layout, setLayout] = useState("W/A/S/D");
  useEffect(() => {
    const IS_IN_IFRAME = window.self !== window.top;
    if (!navigator.keyboard || IS_IN_IFRAME) return;
    const keyboard = navigator.keyboard;
    keyboard.getLayoutMap().then(keyboardLayoutMap => {
      const upKey = keyboardLayoutMap.get("KeyW");
      if (upKey === "z") setLayout("Z/Q/S/D");
    });
  }, []);
  return layout;
};

const useDevice = () => {
  const [device, setDevice] = useState(isMobile ? "mobile" : "desktop");
  return {
    device: {
      mobile: device === "mobile",
      desktop: device === "desktop",
      xr: device === "xr"
    },
    setDevice
  };
};

const EnvironmentContext = /*#__PURE__*/createContext({});
const useEnvironment = () => useContext(EnvironmentContext);
const useEnvironmentState = name => {
  const [menuItems, setMenuItems] = useState([]);
  const container = useRef(null);
  const [paused, setPausedValue] = useState(true);
  const events = useMemo(() => [], []);
  const [played, setPlayed] = useState(false);
  const setPaused = useCallback(p => {
    setPausedValue(p); // hook into paused click event to make sure global context is running.
    // https://github.com/mrdoob/three.js/blob/342946c8392639028da439b6dc0597e58209c696/src/audio/AudioContext.js#L9
    // local state to only do once so we don't interfere with MuteOnHide

    if (!played) {
      const context = AudioContext.getContext();
      if (context.state !== "running") context.resume();
      setPlayed(true);
    } // call all pause events


    events.map(ev => ev.apply(null, [p]));
  }, [events, played]);
  const device = useDevice();
  return { ...device,
    name,
    paused,
    setPaused,
    events,
    containerRef: container,
    menuItems,
    setMenuItems
  };
};

function PauseMenu(props) {
  const {
    title = "spacesvr",
    title2 = "jmangoes",
    subTitle = "Game designer, artist, developer",
    pauseMenuItems = [],
    dev = false
  } = props;
  const {
    paused,
    setPaused,
    menuItems,
    device
  } = useEnvironment();
  const layout = useKeyboardLayout();
  const closeOverlay = useCallback(() => {
    const item = menuItems.find(item => item.text === "Enter VR");
    if (item && item.action) item.action();else setPaused(false);
  }, [menuItems, setPaused]);
  const hex = useMemo(() => new Idea().setFromCreation(Math.random(), 0.8, 0.95).getHex(), []);
  const PAUSE_ITEMS = [...pauseMenuItems, {
    text: "github",
    link: "https://www.npmjs.com/package/spacesvr"
  },
  {
    text: "itch",
    link: "https://www.npmjs.com/package/spacesvr"
  }, ...menuItems];
  return /*#__PURE__*/React.createElement(Container$1, {
    paused: paused,
    dev: dev
  }, /*#__PURE__*/React.createElement(ClickContainer, {
    onClick: closeOverlay
  }), !dev && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Window, null, /*#__PURE__*/React.createElement(Title, null, title2), /*#__PURE__*/React.createElement(SubTitle, null, subTitle), /*#__PURE__*/React.createElement(Instructions, null, /*#__PURE__*/React.createElement("p", null, "Move \u2013 ", device.mobile ? "Joystick" : layout), /*#__PURE__*/React.createElement("p", null, "Look \u2013 ", device.mobile ? "Drag" : "Mouse"), /*#__PURE__*/React.createElement("p", null, "Pause \u2013 ", device.mobile ? "Menu Button" : "Esc"), /*#__PURE__*/React.createElement("p", null, "Cycle Tool \u2013 ", device.mobile ? "Edge Swipe" : "Tab")), /*#__PURE__*/React.createElement(Actions, null, PAUSE_ITEMS.map(item => item.link ? /*#__PURE__*/React.createElement(MenuLink, {
    key: item.text,
    href: item.link,
    target: "_blank"
  }, item.text) : /*#__PURE__*/React.createElement(MenuButton, {
    key: item.text,
    onClick: item.action
  }, item.text)))), /*#__PURE__*/React.createElement(Continue, {
    onClick: closeOverlay,
    color: hex
  }, "continue")));
}

const Element = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 1;
  mix-blend-mode: difference;

  &::before {
    content: "";
    position: absolute;
    height: 16px;
    width: 1.5px;
    transform: translate(-50%, -50%);
    border-radius: 6px;
    background: #ffffff;
  }

  &::after {
    content: "";
    position: absolute;
    width: 16px;
    height: 1.5px;
    transform: translate(-50%, -50%);
    border-radius: 6px;
    background: #ffffff;
  }
`;

const Crosshair = () => {
  if (isMobile) {
    return null;
  }

  return /*#__PURE__*/React.createElement(Element, null);
};

// thank you a-frame https://github.com/aframevr/aframe/blob/042a3d6b7087a632c5165227b14bc37573375cde/src/utils/device.js
function isOculusBrowser() {
  return /(OculusBrowser)/i.test(window.navigator.userAgent);
}

function isFirefoxReality() {
  return /(Mobile VR)/i.test(window.navigator.userAgent);
}

function isStandaloneVR() {
  return isOculusBrowser() || isFirefoxReality();
}

/**
 * Component to register menu items to the environment.
 * Needs to be a component because it needs access to the three context to run
 * but ideas outside of the three context need to access it, so it uses
 * the environment as a mediator
 */

function RegisterMenuItems() {
  const {
    setMenuItems
  } = useEnvironment();
  const vrMenu = useVRMenuItem();
  const fsMenu = useFsMenuItem();
  const oqMenu = useOculusMenuItem();
  useEffect(() => {
    const arr = [];
    if (vrMenu) arr.push(vrMenu);
    if (fsMenu) arr.push(fsMenu);
    if (oqMenu) arr.push(oqMenu);
    setMenuItems(arr);
  }, [vrMenu == null ? void 0 : vrMenu.text, fsMenu == null ? void 0 : fsMenu.text, oqMenu == null ? void 0 : oqMenu.text, setMenuItems]);
  return null;
}
const useVRMenuItem = () => {
  const gl = useThree(state => state.gl);
  const {
    setDevice,
    setPaused
  } = useEnvironment();
  const session = useRef();
  const [text, setText] = useState("Enter VR");
  const action = useCallback(() => {
    async function onSessionStarted(sesh) {
      sesh.addEventListener("end", onSessionEnded);
      await gl.xr.setSession(sesh);
      setText("Exit VR");
      setDevice("xr");
      setPaused(false);
      session.current = sesh;
    }

    function onSessionEnded() {
      var _session$current;

      (_session$current = session.current) == null ? void 0 : _session$current.removeEventListener("end", onSessionEnded);
      setDevice(isMobile ? "mobile" : "desktop");
      setText("Enter VR");
      setPaused(true);
      session.current = undefined;
    }

    if (session.current === undefined) {
      const sessionInit = {
        optionalFeatures: ["local-floor", "bounded-floor", "hand-tracking", "layers"]
      }; // @ts-ignore

      const xr = navigator.xr;
      xr.requestSession("immersive-vr", sessionInit).then(onSessionStarted);
    } else {
      var _session$current2;

      (_session$current2 = session.current) == null ? void 0 : _session$current2.end();
    }
  }, [gl.xr, setDevice, setPaused]);

  if (!isStandaloneVR()) {
    return undefined;
  }

  return {
    text,
    action
  };
};
const useOculusMenuItem = () => {
  if (isStandaloneVR()) return;
  return {
    text: "Open in Meta Quest",
    link: "https://www.oculus.com/open_url/?url=" + window.location.href
  };
};
const useFsMenuItem = () => {
  const domElement = document.body;
  const rfs = domElement.requestFullscreen || // @ts-ignore
  domElement.webkitRequestFullScreen || // @ts-ignore
  domElement.mozRequestFullScreen || // @ts-ignore
  domElement.msRequestFullscreen || undefined;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenAvailable] = useState(rfs !== undefined);
  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(document.fullscreenElement !== null);

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);
  const action = useCallback(() => {
    if (!rfs) return;

    if (!document.fullscreenElement) {
      rfs.apply(domElement, [{
        navigationUI: "hide"
      }]);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, [domElement, rfs]);

  if (!fullscreenAvailable || isStandaloneVR()) {
    return undefined;
  }

  return {
    text: `${isFullscreen ? "Exit" : "Enter"} Fullscreen`,
    action
  };
};

const defaultCanvasProps = {
  gl: {
    powerPreference: "high-performance",
    antialias: true,
    depth: true,
    alpha: false,
    stencil: false,
    useLegacyLights: false,
    toneMapping: NoToneMapping
  },
  shadows: false,
  camera: {
    position: [0, 2, 0],
    near: 0.01,
    far: 300
  },
  dpr: 1,
  raycaster: {
    far: 3
  },
  events: undefined
};

function MuteOnHide() {
  useEffect(() => {
    function handleChange() {
      const context = AudioContext.getContext();
      if (document.hidden) context.suspend();else context.resume();
    }

    document.addEventListener("visibilitychange", handleChange);
    return () => document.removeEventListener("visibilitychange", handleChange);
  }, []);
  return null;
}

function Environment(props) {
  const {
    loadingScreen,
    pauseMenu,
    dev,
    canvasProps,
    name = "spacesvr",
    children
  } = props;
  const state = useEnvironmentState(name);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(GlobalStyles, null), /*#__PURE__*/React.createElement(MuteOnHide, null), /*#__PURE__*/React.createElement(Container$3, {
    id: "__spacesvr",
    ref: state.containerRef
  }, /*#__PURE__*/React.createElement(EnvironmentContext.Provider, {
    value: state
  }, loadingScreen || /*#__PURE__*/React.createElement(LoadingScreen, null), pauseMenu || /*#__PURE__*/React.createElement(PauseMenu, {
    dev: dev,
    title: name
  }), /*#__PURE__*/React.createElement(Crosshair, null)), /*#__PURE__*/React.createElement(Canvas, _extends({}, defaultCanvasProps, canvasProps), /*#__PURE__*/React.createElement(XR, null, /*#__PURE__*/React.createElement(EnvironmentContext.Provider, {
    value: state
  }, /*#__PURE__*/React.createElement(RegisterMenuItems, null), children)))));
}

/**
 * NippleMovement gives the player a direction to move by taking
 * input from a nipple (joystick).
 *
 * Direction is stored as a Vector3 with the following format
 *    x: left/right movement, + for right
 *    y: forward/back movement, + for forwards
 *    z: up/down movement, + for up
 *
 * @param props
 * @constructor
 */
const NippleMovement = props => {
  const {
    direction
  } = props;
  const nipple = useRef();
  const nippleContainer = useRef();
  const {
    containerRef
  } = useEnvironment();
  useEffect(() => {
    if (containerRef.current) {
      nippleContainer.current = document.createElement("div");
      nippleContainer.current.style.position = "fixed";
      nippleContainer.current.style.left = "0";
      nippleContainer.current.style.bottom = "0";
      nippleContainer.current.style.width = "40%";
      nippleContainer.current.style.maxWidth = "160px";
      nippleContainer.current.style.height = "25%";
      nippleContainer.current.style.height = "160px";
      nippleContainer.current.style.zIndex = "5"; // add class identifier to nippleContainer to identify touchEvents

      nippleContainer.current.classList.add("nipple-container");
      containerRef.current.appendChild(nippleContainer.current);
      nipple.current = nipplejs.create({
        zone: nippleContainer.current,
        mode: "static",
        position: {
          left: "50%",
          top: "50%"
        },
        color: "#fff",
        size: 120,
        restOpacity: 0.75
      });
      nipple.current.on("move", (evt, data) => {
        // i kinda pulled 60 out of my ass tbh
        const x = data.distance / 60 * Math.cos(data.angle.radian);
        const z = -data.distance / 60 * Math.sin(data.angle.radian);
        direction.current.set(x, 0, z);
      });
      nipple.current.on("end", () => {
        direction.current.set(0, 0, 0);
      });
      nippleContainer.current.addEventListener("touchstart", ev => {
        ev.preventDefault();
      });
      return () => {
        if (nipple.current) nipple.current.destroy();
      };
    }
  }, []);
  const nippleStyles = css`
    .nipple-container > * > .front,
    .nipple-container > * > .back {
      background: radial-gradient(white, white 64%, black 86%) !important;
    }
  `;
  return /*#__PURE__*/React.createElement(Global, {
    styles: nippleStyles
  });
};

/**
 * KeyboardMovement gives the player a direction to move by taking
 * input from any source (currently keyboard) and calculating
 * relative direction.
 *
 * Direction is stored as a Vector3 with the following format
 *    x: left/right movement, + for right
 *    y: forward/back movement, + for forwards
 *    z: up/down movement, + for up
 *
 * @param props
 * @constructor
 */
const KeyboardMovement = props => {
  const {
    direction,
    flying
  } = props;
  const {
    paused
  } = useEnvironment();
  const pressedKeys = useRef([false, false, false, false, false]); // key events

  const calcDirection = useCallback(() => {
    const press = pressedKeys.current; // [w, a, s, d]

    const yAxis = -1 * Number(press[0]) + Number(press[2]);
    const xAxis = -1 * Number(press[1]) + Number(press[3]);
    return [xAxis, flying && press[4] ? 1 : 0, yAxis];
  }, [flying]);
  const updatePressedKeys = useCallback((ev, pressedState) => {
    // We try to use `code` first because that's the layout-independent property.
    // Then we use `key` because some browsers, notably Internet Explorer and
    // Edge, support it but not `code`. Then we use `keyCode` to support older
    // browsers like Safari, older Internet Explorer and older Chrome.
    switch (ev.code || ev.key || ev.keyCode) {
      case "KeyW":
      case "KeyI":
      case "ArrowUp":
      case "Numpad8":
      case 38:
        // keyCode for arrow up
        pressedKeys.current[0] = pressedState;
        break;

      case "KeyA":
      case "KeyJ":
      case "ArrowLeft":
      case "Numpad4":
      case 37:
        // keyCode for arrow left
        pressedKeys.current[1] = pressedState;
        break;

      case "KeyS":
      case "KeyK":
      case "ArrowDown":
      case "Numpad5":
      case "Numpad2":
      case 40:
        // keyCode for arrow down
        pressedKeys.current[2] = pressedState;
        break;

      case "KeyD":
      case "KeyL":
      case "ArrowRight":
      case "Numpad6":
      case 39:
        // keyCode for arrow right
        pressedKeys.current[3] = pressedState;
        break;

      case "Space":
        pressedKeys.current[4] = pressedState;
        break;

      default:
        return;
    }
  }, []);
  const onKeyDown = useCallback(ev => {
    if (ev.defaultPrevented) {
      return;
    } // We don't want to mess with the browser's shortcuts


    if (ev.ctrlKey || ev.altKey || ev.metaKey) {
      return;
    }

    updatePressedKeys(ev, true);
    const [x, y, z] = calcDirection();
    direction.current.set(x, y, z);
  }, [calcDirection, direction, updatePressedKeys]);
  const onKeyUp = useCallback(ev => {
    updatePressedKeys(ev, false);
    const [x, y, z] = calcDirection();
    direction.current.set(x, y, z);
  }, [calcDirection, direction, updatePressedKeys]);
  useEffect(() => {
    if (paused) {
      direction.current.set(0, 0, 0);
      pressedKeys.current = [false, false, false, false, false];
      return;
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [paused, onKeyDown, onKeyUp, direction]);
  return null;
};

const EPS = 0.0001;
const MIN_POLAR_ANGLE = EPS; // radians

const MAX_POLAR_ANGLE = Math.PI - EPS; // radians

const SENSITIVITY = 0.8;
const PI_2 = Math.PI / 2;
/**
 * PointerLockCamera is a react port of PointerLockControls.js from THREE,
 * with some changes. Some parameters are listed above
 *
 * https://github.com/mrdoob/three.js/blob/master/examples/jsm/controls/PointerLockControls.js
 *
 * @constructor
 */

function PointerLockCamera() {
  const camera = useThree(state => state.camera);
  const gl = useThree(state => state.gl);
  const {
    domElement
  } = gl;
  const {
    paused,
    setPaused,
    events
  } = useEnvironment();
  const isLocked = useRef(false);
  const [euler] = useState(new Euler(0, 0, 0, "YXZ"));
  const isCurrentlyLocked = useCallback(() => domElement.ownerDocument.pointerLockElement === domElement, [domElement]);
  const leaveTime = useRef(0);
  useEffect(() => {
    // update camera while controls are locked
    const onMouseMove = ev => {
      if (!isLocked.current) return; // @ts-ignore

      const dx = ev.movementX || ev.mozMovementX || ev.webkitMovementX || 0; // @ts-ignore

      const dy = ev.movementY || ev.mozMovementY || ev.webkitMovementY || 0;
      euler.setFromQuaternion(camera.quaternion);
      euler.y -= dx * SENSITIVITY * 0.002;
      euler.x -= dy * SENSITIVITY * 0.002;
      euler.x = Math.max(PI_2 - MAX_POLAR_ANGLE, Math.min(PI_2 - MIN_POLAR_ANGLE, euler.x));
      camera.quaternion.setFromEuler(euler);
    }; // automatically unlock on pointer lock error


    function onError() {
      isLocked.current = false;
      setPaused(true);
    } // handle pointer lock change


    function onChange() {
      if (isCurrentlyLocked()) {
        isLocked.current = true;

        if (paused) {
          setPaused(false);
        }
      } else {
        leaveTime.current = performance.now();
        isLocked.current = false;

        if (!paused) {
          setPaused(true);
        }
      }
    }

    const {
      ownerDocument
    } = domElement;
    ownerDocument.addEventListener("mousemove", onMouseMove);
    ownerDocument.addEventListener("pointerlockchange", onChange);
    ownerDocument.addEventListener("pointerlockerror", onError);
    return () => {
      ownerDocument.removeEventListener("mousemove", onMouseMove);
      ownerDocument.removeEventListener("pointerlockchange", onChange);
      ownerDocument.removeEventListener("pointerlockerror", onError);
    };
  }, [paused, domElement, setPaused, euler, camera.quaternion, isCurrentlyLocked]); // detect failed, uncaught pointer lock errors

  useEffect(() => {
    setTimeout(() => {
      if (!isLocked.current && !paused) {
        setPaused(true);
      }
    }, 250);
  }, [paused, setPaused]);
  useEffect(() => {
    const ev = paused => {
      if (paused) {
        domElement.ownerDocument.exitPointerLock();
      } else {
        // leaving pointer lock makes you wait for 1.25s to relock, trying will throw error
        if (performance.now() - leaveTime.current > 1250) {
          domElement.requestPointerLock();
        }
      }
    };

    events.push(ev);
    return () => {
      const ind = events.indexOf(ev);
      if (ind >= 0) events.splice(ind, 1);
    };
  }, [domElement, events, isCurrentlyLocked]);
  return null;
}

const DefaultTouch = {
  pos: new Vector2(0, 0),
  id: -1
}; // get the current touch from touch array

const getCurrentTouch = (curTouchId, touches) => {
  const len = touches.length;

  for (let i = 0; i < len; i++) {
    if (curTouchId === touches[i].identifier) {
      return touches[i];
    }
  }

  return undefined;
}; // check whether given touch tapped nipple

const tappedNipple = ev => {
  // get the relevant touched element (casted as an Element)
  const ele = ev.touches[ev.touches.length - 1].target;
  return ele.classList.contains("nipple-container") || ele.classList.contains("front") || ele.classList.contains("back");
};

const DRAG_SENSITIVITY = new Vector2(0.7, 0.7);
/**
 * TouchFPSCamera controls the camera rotation by detecting
 * touch drag on the screen. Unlike MouseFPSCamera, this component
 * does not have a way to pause, that must be done externally.
 *
 * @param props
 * @constructor
 */

function TouchFPSCamera() {
  const touchStartPos = useRef(DefaultTouch);
  const originEuler = useRef(new Euler(0, 0, 0, "YXZ"));
  const camera = useThree(state => state.camera);

  const getNewEuler = (dragX, dragY) => {
    const newEuler = originEuler.current.clone();
    const moveX = dragX - touchStartPos.current.pos.x;
    const moveY = dragY - touchStartPos.current.pos.y;
    newEuler.setFromQuaternion(camera.quaternion);
    newEuler.y = originEuler.current.y - moveX * DRAG_SENSITIVITY.x / 100;
    newEuler.x = originEuler.current.x - moveY * DRAG_SENSITIVITY.y / 100;
    newEuler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, newEuler.x));
    return newEuler;
  }; // touch move scripts


  const onTouchStart = ev => {
    if (touchStartPos.current.id !== -1) {
      return;
    }

    if (tappedNipple(ev)) {
      touchStartPos.current = DefaultTouch;
      return;
    } // get last in list (most recent touch) to not confuse with movement


    const touchIndex = ev.touches.length - 1;
    const {
      clientX,
      clientY,
      identifier: id
    } = ev.touches[touchIndex];
    touchStartPos.current = {
      pos: new Vector2(clientX, clientY),
      id
    };
    originEuler.current.setFromQuaternion(camera.quaternion);
  };

  const onTouchMove = ev => {
    const touch = getCurrentTouch(touchStartPos.current.id, ev.touches);
    if (!touch) return;
    const {
      clientX,
      clientY
    } = touch;
    const newEuler = getNewEuler(clientX, clientY);
    camera.quaternion.setFromEuler(newEuler);
  };

  const onTouchEnd = ev => {
    const touch = getCurrentTouch(touchStartPos.current.id, ev.changedTouches);
    if (!touch) return;
    const {
      clientX,
      clientY
    } = touch;
    originEuler.current = getNewEuler(clientX, clientY);
    touchStartPos.current.id = -1;
  };

  useEffect(() => {
    document.addEventListener("touchstart", onTouchStart);
    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("touchend", onTouchEnd);
    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [onTouchEnd, onTouchMove, onTouchStart]);
  return null;
}

// height of 0.9 (eye level) for a perceived height of 1
const HEIGHT = 0.9;
const RADIUS = 0.225;
const SEGMENTS = 8;
const SPHERE_SHAPE = "Sphere";
const sphereProps = {
  type: SPHERE_SHAPE,
  args: [RADIUS, SEGMENTS, SEGMENTS]
};
const topSphere = { ...sphereProps,
  position: [0, -RADIUS, 0]
};
const middleSphere = { ...sphereProps,
  position: [0, -(HEIGHT / 2), 0]
};
const bottomSphere = { ...sphereProps,
  position: [0, -(HEIGHT - RADIUS), 0]
};
const useCapsuleCollider = initPos => {
  const {
    paused
  } = useEnvironment();
  const compoundBody = useCompoundBody(() => ({
    mass: 0,
    position: initPos.current.toArray(),
    segments: SEGMENTS,
    fixedRotation: true,
    type: "Dynamic",
    shapes: [topSphere, middleSphere, bottomSphere]
  }));
  useEffect(() => {
    if (!paused) compoundBody[1].mass.set(62);
  }, [paused, compoundBody]);
  return compoundBody;
};

const ALPHA_SENSITIVITY = 0.008;

/**
 *
 * Gyro controls uses device orientation controls from three js, if applicable.
 * A required fallback component will be used in the place of the gyroscope
 * controls until they are accepted and in use.
 *
 * Some code sampled from TouchFPSCamera.ts
 *
 * @param props
 * @constructor
 */
const GyroControls = props => {
  const {
    fallback
  } = props;
  const camera = useThree(state => state.camera);
  const [controls, setControls] = useState();
  const [enableGyro, setEnableGyro] = useState(false);
  const [alphaVal, setAlphaVal] = useState(0); // dragging for y axis offset

  const touchStartPos = useRef(DefaultTouch);
  const currentOffset = useRef(0);
  const {
    alpha
  } = useSpring({
    alpha: alphaVal,
    config: { ...config.default,
      precision: 0.001
    }
  }); // try to prompt user for device controls

  useEffect(() => {
    if (!controls) {
      const func = () => {
        const cont = new DeviceOrientationControls(camera);
        cont.enabled = false; // set to disabled in case they're not working yet

        setControls(cont);
      };

      window.addEventListener("click", func);
      return () => {
        window.removeEventListener("click", func);
      };
    }
  }, [controls]);
  useFrame(() => {
    if (controls && !enableGyro) {
      // check if an event has been received yet
      if (Object.keys(controls.deviceOrientation).length !== 0) {
        setEnableGyro(true);
        controls.enabled = true;
      }
    }

    if (controls) {
      controls.alphaOffset = -alpha.get() * ALPHA_SENSITIVITY;
      controls.update();
    }
  }); // touch move scripts

  const onTouchStart = ev => {
    if (touchStartPos.current.id !== -1) {
      return;
    }

    if (tappedNipple(ev)) {
      touchStartPos.current = DefaultTouch;
      return;
    } // get last in list (most recent touch) to not confuse with movement


    const touchIndex = ev.touches.length - 1;
    const {
      clientX,
      clientY,
      identifier: id
    } = ev.touches[touchIndex];
    touchStartPos.current = {
      pos: new Vector2(clientX, clientY),
      id
    };
  };

  const onTouchMove = ev => {
    const touch = getCurrentTouch(touchStartPos.current.id, ev.touches);

    if (!touch) {
      return;
    }

    const extraOffset = touch.clientX - touchStartPos.current.pos.x;
    setAlphaVal(currentOffset.current + extraOffset);
  };

  const onTouchEnd = ev => {
    const touch = getCurrentTouch(touchStartPos.current.id, ev.changedTouches);

    if (!touch) {
      return;
    }

    const finalOffset = touch.clientX - touchStartPos.current.pos.x;
    setAlphaVal(currentOffset.current + finalOffset);
    currentOffset.current += finalOffset;
    touchStartPos.current.id = -1;
  }; // register touch events


  useEffect(() => {
    document.addEventListener("touchstart", onTouchStart);
    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("touchend", onTouchEnd);
    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  if (!enableGyro) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, fallback);
  }

  return null;
};

const useSpringVelocity = (bodyApi, speed) => {
  const direction = useRef(new Vector3());
  const {
    device
  } = useEnvironment();
  const dummy = useMemo(() => new Vector3(), []);
  const [quat] = useState(new Quaternion());
  const targetYVel = useRef(0);
  const clock = useThree(state => state.clock);
  const lastvelocity = useRef(new Vector3());
  const lastTime = useRef(0);
  const y_accel = useRef(0);
  const [dumdum] = useState(new Vector3());

  const updateVelocity = (cam, velocity) => {
    dumdum.x = velocity.x || 0;
    dumdum.y = 0;
    dumdum.z = velocity.z || 0;
    const vel = dumdum.length() / speed;
    const y_change = (velocity.y || 0) - lastvelocity.current.y;
    const elapsedTime = clock.getElapsedTime();
    const delta = Math.abs(elapsedTime - lastTime.current);
    y_accel.current = MathUtils.lerp(y_accel.current, y_change / delta || 0, // i think this is the bad one!!! (for all the || 0's)
    0.1); // get forward/back movement and left/right movement velocities

    dummy.x = (direction.current.x || 0) * 0.75;
    dummy.z = direction.current.z || 0; // forward/back

    dummy.y = 0;
    dummy.multiplyScalar(speed + Math.abs(y_accel.current) * 0.085);
    quat.copy(cam.quaternion);
    quat.x = 0;
    quat.z = 0;
    dummy.applyQuaternion(quat); // calc y velocity

    targetYVel.current = MathUtils.lerp(targetYVel.current, (direction.current.y || 0) * 0.6, 0.05 + vel * 0.075);
    dummy.y = Math.min((velocity.y || 0) + targetYVel.current, 4 + vel); // keep y velocity intact and update velocity

    if (!device.desktop) {
      bodyApi.velocity.set(dummy.x, dummy.y, dummy.z);
      lastvelocity.current.set(dummy.x, dummy.y, dummy.z);
    } else {
      const newX = MathUtils.lerp(velocity.x || 0, dummy.x, 0.25);
      const newZ = MathUtils.lerp(velocity.z || 0, dummy.z, 0.25);
      bodyApi.velocity.set(newX, dummy.y, newZ);
      lastvelocity.current.set(newX, dummy.y, newZ);
    }

    lastTime.current = elapsedTime;
  };

  return {
    direction,
    updateVelocity
  };
};

/**
 * VRControllerMovement gives the player a direction to move by taking
 * input from the Oculus Quest Gamepad.
 *
 *
 * @param props
 * @constructor
 */
const SnapTurn = props => {
  const {
    hand = "right",
    increment = Math.PI / 6,
    threshold = 0.8
  } = props;
  const controller = useController(hand);
  const {
    player
  } = useXR();
  const isSnapping = useRef(false);
  useFrame(() => {
    if (controller && controller.inputSource.gamepad) {
      const [,, x] = controller.inputSource.gamepad.axes;

      if (Math.abs(x) > threshold) {
        if (!isSnapping.current) {
          player.rotateY(-increment * Math.sign(x));
        }

        isSnapping.current = true;
      } else {
        isSnapping.current = false;
      }
    }
  });
  return null;
};

const SmoothLocomotion = props => {
  const {
    hand = "left",
    direction
  } = props;
  const controller = useController(hand);
  useFrame(() => {
    if (controller && controller.inputSource.gamepad) {
      const [,, x, z] = controller.inputSource.gamepad.axes;
      direction.current.x = x;
      direction.current.z = z;
    }
  });
  return null;
};

const Fly = props => {
  const {
    direction
  } = props;
  const controller = useController("left");
  useFrame(() => {
    if (controller && controller.inputSource.gamepad) {
      const [aButton] = controller.inputSource.gamepad.buttons;
      if (!aButton) return;
      direction.current.y = aButton.pressed ? 0.5 : 0;
    }
  });
  return null;
};

function VRControllerMovement(props) {
  const {
    position,
    direction,
    snapTurn,
    smoothLocomotion
  } = props;
  const {
    player
  } = useXR();
  useFrame(() => {
    player.position.copy(position.current); // average human height is ~1.7, player height is 1.
    // somehow subtracting 1 is more correct idk
    // update: now 1.4 seems right? who fukn knows
    // update: definitely a difference between sitting + standing

    player.position.y -= 1.4;
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Fly, {
    direction: direction
  }), /*#__PURE__*/React.createElement(SnapTurn, snapTurn), /*#__PURE__*/React.createElement(SmoothLocomotion, _extends({}, smoothLocomotion, {
    direction: direction
  })), /*#__PURE__*/React.createElement(Controllers, null));
}

const useControlLock = lockControls => {
  return useMemo(() => ({
    lock: () => lockControls.current = true,
    unlock: () => lockControls.current = false,
    isLocked: () => lockControls.current
  }), [lockControls]);
};

const useBob = (velocity, direction) => {
  const camera = useThree(st => st.camera);
  const {
    bob
  } = useSpring({
    bob: 0,
    config: config.default
  });
  const [offset] = useState(new Vector3());

  const update = clock => {
    const IS_MOVING = direction.current.length() > 0.1;
    const IS_GROUNDED = Math.abs(velocity.current.y) < 0.01;
    bob.set(IS_MOVING && IS_GROUNDED ? 1 : 0);
    const amt = bob.get();
    const y = Math.sin(clock.elapsedTime * 20) * 0.0055 * amt;
    const x = Math.cos(clock.elapsedTime * 15 + 0.3) * 0.002 * amt;
    offset.set(x, y, 0);
    offset.applyQuaternion(camera.quaternion);
    camera.position.add(offset);
  };

  return {
    update
  };
};

const PlayerContext = /*#__PURE__*/createContext({});
const usePlayer = () => useContext(PlayerContext);
const SPEED = 7; // (m/s) 1.4 walking, 2.6 jogging, 4.1 running

const SHOW_PLAYER_HITBOX = false;

/**
 * Player represents a user controlled entity, complete with a
 * control scheme and a physical representation that interacts with other physics-
 * enabled objects.
 *
 * @constructor
 */
function Player(props) {
  const {
    children,
    pos = [0, 1, 0],
    rot = 0,
    flying = false,
    speed = SPEED,
    controls = {
      disableGyro: true
    }
  } = props;
  const camera = useThree(state => state.camera);
  const defaultRaycaster = useThree(state => state.raycaster);
  const {
    device
  } = useEnvironment(); // local state

  const initPos = useRef(new Vector3().fromArray(pos));
  const position = useRef(new Vector3());
  const velocity = useRef(new Vector3());
  const lockControls = useRef(false);
  const raycaster = useMemo(() => new Raycaster(new Vector3(), new Vector3(), 0, 5), []); // physical body

  const [, bodyApi] = useCapsuleCollider(initPos);
  const {
    direction,
    updateVelocity
  } = useSpringVelocity(bodyApi, speed);
  const bob = useBob(velocity, direction); // initial rotation

  useEffect(() => {
    // rotation happens before position move
    camera.rotation.setFromQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), rot));
  }, []);
  useEffect(() => {
    const unsubPos = bodyApi.position.subscribe(p => position.current.fromArray(p));
    const unsubVel = bodyApi.velocity.subscribe(v => velocity.current.fromArray(v));
    return () => {
      unsubPos();
      unsubVel();
    };
  }, [bodyApi, bodyApi.position, bodyApi.velocity]);
  useFrame(_ref => {
    let {
      clock
    } = _ref;

    // update raycaster on desktop (mobile uses default)
    if (device.desktop) {
      raycaster.ray.origin.copy(position.current);
      raycaster.ray.direction.set(0, 0, -1);
      raycaster.ray.direction.applyQuaternion(camera.quaternion);
    }

    if (device.mobile) {
    raycaster.ray.origin.default;
    raycaster.ray.direction.set(0, 0, -1);
    raycaster.ray.direction.applyQuaternion(camera.quaternion);
    }

    camera.position.copy(position.current);

    if (!lockControls.current) {
      updateVelocity(camera, velocity.current);
      bob.update(clock);
    }
  });
  const setPosition = useCallback(pos => {
    // in case it gets called before bodyapi is initialized
    initPos.current.copy(pos);
    bodyApi.position.set(pos.x, pos.y, pos.z);
    position.current.copy(pos);
  }, [bodyApi.position]);
  const setVelocity = useCallback(vel => {
    bodyApi.velocity.set(vel.x, vel.y, vel.z);
    velocity.current.copy(vel);
  }, [bodyApi.velocity]);
  const controlLock = useControlLock(lockControls);
  const value = {
    position: {
      get: () => position.current.clone(),
      set: setPosition
    },
    velocity: {
      get: () => velocity.current.clone(),
      set: setVelocity
    },
    raycaster: device.desktop ? raycaster : defaultRaycaster,
    controls: controlLock
  };
  return /*#__PURE__*/React.createElement(PlayerContext.Provider, {
    value: value
  }, device.mobile && /*#__PURE__*/React.createElement(React.Fragment, null, (controls == null ? void 0 : controls.disableGyro) && /*#__PURE__*/React.createElement(TouchFPSCamera, null), !(controls != null && controls.disableGyro) && /*#__PURE__*/React.createElement(GyroControls, {
    fallback: /*#__PURE__*/React.createElement(TouchFPSCamera, null)
  }), /*#__PURE__*/React.createElement(NippleMovement, {
    direction: direction
  })), device.desktop && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(KeyboardMovement, {
    direction: direction,
    flying: flying
  }), /*#__PURE__*/React.createElement(PointerLockCamera, null)), device.xr && /*#__PURE__*/React.createElement(VRControllerMovement, {
    position: position,
    direction: direction
  }), SHOW_PLAYER_HITBOX , children);
}

/**
 * A hook that provides a function to re-render the component.
 *
 * You can use the function itself as a dependency.
 */

function useRerender() {
  const [ct, setCt] = useState(0);
  return useCallback(() => setCt(Math.random()), [ct]);
}

const useHTMLInput = type => {
  const input = useMemo(() => {
    const inp = document.createElement("input");
    document.body.appendChild(inp);
    return inp;
  }, []);
  useEffect(() => {
    input.setAttribute("type", type);
    input.style.zIndex = "-99";
    input.style.opacity = "0";
    input.style.fontSize = "16px"; // this disables zoom on mobile

    input.style.position = "absolute";
    input.style.left = "50%";
    input.style.top = "0";
    input.style.transform = "translate(-50%, 0%)";
  }, [input, type]);
  useEffect(() => {
    return () => {
      document.body.removeChild(input);
    };
  }, [input]);
  return input;
};
const useTextInput = (type, value, onChange) => {
  // number isn't selectable, so we use text
  const input = useHTMLInput(type === "password" ? "password" : "text");
  const {
    paused
  } = useEnvironment();
  const {
    controls,
    velocity
  } = usePlayer();
  const rerender = useRerender();
  const [focused, setFocused] = useState(false);
  const protectClick = useRef(false); // used to click off of the input to blur
  // input setup

  useEffect(() => {
    input.addEventListener("focus", () => setFocused(true));
    input.addEventListener("blur", () => setFocused(false));
    input.autocomplete = "off";
  }, [input]); // blur on pause

  useEffect(() => {
    if (focused && paused) input.blur();
  }, [input, focused, paused]); // stop player from moving while they type (free up wasd)

  useEffect(() => {
    if (focused) {
      velocity.set(new Vector3());
      controls.lock();
    } else if (!isTyping()) {
      velocity.set(new Vector3());
      controls.unlock();
    }
  }, [focused, velocity, controls]); // free up wasd on unmount

  useEffect(() => {
    return () => {
      if (!isTyping()) controls.unlock();
    };
  }, [controls]); // set up event listeners

  useEffect(() => {
    const formatNumber = s => {
      const re = /[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)/;
      const res = s.match(re);
      if (!res) return "";
      if (res.input !== res[0]) return value;else return res[0];
    };

    const onDocClick = () => {
      const focused = input === document.activeElement;
      if (!protectClick.current && focused) input.blur();else if (protectClick.current && !focused) input.focus();
      protectClick.current = false;
    };

    const onInput = () => {
      if (input !== document.activeElement) return;
      if (type === "number") input.value = formatNumber(input.value);
      onChange(input.value);
    };

    const onSelectionChange = () => {
      if (input !== document.activeElement) return;
      rerender();
    };

    document.addEventListener("click", onDocClick);
    input.addEventListener("input", onInput);
    document.addEventListener("selectionchange", onSelectionChange);
    return () => {
      document.removeEventListener("click", onDocClick);
      input.removeEventListener("input", onInput);
      document.removeEventListener("selectionchange", onSelectionChange);
    };
  }, [input, onChange, rerender, type, value]); // keep the input's value in sync with the passed state value

  useEffect(() => {
    if (input.value !== value) {
      input.value = value;
      rerender();
    }
  }, [input, value]); // call to focus input and protect the click from blurring the input

  const focusInput = () => {
    protectClick.current = true;
    input.focus();
  };

  return {
    input,
    focused,
    focusInput
  };
};

/*
  hook to detect when the meta key (cmd on mac, ctrl on windows) is pressed
  includes a timeout since moving your finger to hold it down can jitter a bit
  returns ref containing the state of the press
 */

const useMetaHold = () => {
  const meta = useRef(false);
  const timestamp = useRef();
  const TIMEOUT = 75;
  useEffect(() => {
    const onKeyChange = e => {
      const newMeta = e.ctrlKey || e.metaKey;

      if (meta.current && !newMeta) {
        if (!timestamp.current) {
          timestamp.current = new Date().getTime();
          setTimeout(() => {
            meta.current = false;
            timestamp.current = undefined;
          }, TIMEOUT);
        }
      } else {
        meta.current = newMeta;
      }
    };

    document.addEventListener("keydown", onKeyChange);
    document.addEventListener("keyup", onKeyChange);
    return () => {
      document.removeEventListener("keydown", onKeyChange);
      document.removeEventListener("keyup", onKeyChange);
    };
  }, [TIMEOUT]);
  return meta;
};
/**
 * Same as useMetaHold but for shift
 */

const useShiftHold = () => {
  const shift = useRef(false);
  const timestamp = useRef();
  const TIMEOUT = 75;
  useEffect(() => {
    const onKeyChange = e => {
      const newShift = e.shiftKey;

      if (shift.current && !newShift) {
        if (!timestamp.current) {
          timestamp.current = new Date().getTime();
          setTimeout(() => {
            shift.current = false;
            timestamp.current = undefined;
          }, TIMEOUT);
        }
      } else {
        shift.current = newShift;
      }
    };

    document.addEventListener("keydown", onKeyChange);
    document.addEventListener("keyup", onKeyChange);
    return () => {
      document.removeEventListener("keydown", onKeyChange);
      document.removeEventListener("keyup", onKeyChange);
    };
  }, [TIMEOUT]);
  return shift;
};
/**
 * hook to run a callback when a given key is pressed
 * @param keys key or keys to listen for, by .key property
 * @param callback callback to run when key is pressed
 * @param deps any additional dependencies to watch for changes
 */

const useKeypress = (keys, callback, deps) => {
  useEffect(() => {
    const locKeys = Array.isArray(keys) ? keys : [keys];

    const thisCallback = e => {
      if (locKeys.includes(e.key)) callback(e);
    };

    document.addEventListener("keypress", thisCallback);
    return () => {
      document.removeEventListener("keypress", thisCallback);
    };
  }, [callback, keys, ...(deps || [])]);
};

/**
 * Given a spring animated value, return a visible value when the springed value reaches 0.
 * Used for setting the visible prop to false when a component is scaled to 0
 * @param val
 */

const useVisible = val => {
  const [visible, setVisible] = useState(false);
  useLimitedFrame(5, () => {
    const v = val.get();
    if (visible && v === 0) setVisible(false);else if (!visible && v > 0) setVisible(true);
  });
  return visible;
};

function UnsuspensedModel(props) {
  const {
    src,
    center,
    normalize,
    ...rest
  } = props;
  const gltf = useModel(src);
  const model = useMemo(() => SkeletonUtils.clone(gltf.scene), [gltf.scene]);
  const bbox = useMemo(() => new Box3().setFromObject(model), [model]);
  const centerVec = useMemo(() => bbox.getCenter(new Vector3()).multiplyScalar(-1), [bbox]);
  const sizeX = bbox.max.x - bbox.min.x;
  const sizeY = bbox.max.y - bbox.min.y;
  const sizeZ = bbox.max.z - bbox.min.z;
  const maxSide = Math.max(sizeX, sizeY, sizeZ);
  const NORM_SCALE = 1 / maxSide;
  return /*#__PURE__*/React.createElement("group", _extends({
    name: "spacesvr-model"
  }, rest), /*#__PURE__*/React.createElement("group", {
    scale: normalize ? NORM_SCALE : 1
  }, /*#__PURE__*/React.createElement("primitive", {
    object: model,
    position: center ? centerVec : undefined
  })));
}

function FallbackModel(props) {
  const {
    src,
    center,
    normalize,
    ...rest
  } = props;
  return /*#__PURE__*/React.createElement("group", _extends({
    name: "spacesvr-fallback-model"
  }, rest), /*#__PURE__*/React.createElement("mesh", {
    material: cache.mat_basic_black_wireframe
  }, /*#__PURE__*/React.createElement("boxGeometry", {
    args: [1, 1, 1]
  })));
}

function Model(props) {
  return /*#__PURE__*/React.createElement(ErrorBoundary, {
    fallbackRender: () => /*#__PURE__*/React.createElement(FallbackModel, props),
    onError: err => console.error(err)
  }, /*#__PURE__*/React.createElement(Suspense, {
    fallback: null
  }, /*#__PURE__*/React.createElement(UnsuspensedModel, props)));
}

function Video(props) {
  const {
    src,
    size = 1,
    framed,
    muted,
    volume = 1,
    frameMaterial,
    frameWidth = 1,
    ...rest
  } = props;
  const camera = useThree(state => state.camera);
  const listener = useRef();
  const [speaker, setSpeaker] = useState();
  const [dims, setDims] = useState();
  const video = useMemo(() => {
    const v = document.createElement("video"); // @ts-ignore

    v.playsInline = true;
    v.crossOrigin = "Anonymous";
    v.loop = true;
    v.src = src;
    v.autoplay = false;
    v.muted = muted ? muted : false;
    return v;
  }, []);
  useEffect(() => {
    const setupAudio = () => {
      if (!muted && !video.paused && !speaker) {
        const listener = new AudioListener();
        camera.add(listener);
        const speak = new PositionalAudio(listener);
        speak.setMediaElementSource(video);
        speak.setRefDistance(0.75);
        speak.setRolloffFactor(1);
        speak.setVolume(volume);
        speak.setDirectionalCone(180, 230, 0.1);
        setSpeaker(speak);
      }
    };

    const playVideo = () => {
      video.play().then(() => setDims(new Vector2(video.videoWidth, video.videoHeight)));
      setupAudio();
    };

    if (video) {
      video.play().then(() => {
        setDims(new Vector2(video.videoWidth, video.videoHeight));
        setupAudio();
      });
      document.addEventListener("click", playVideo);
      return () => {
        document.removeEventListener("click", playVideo);
      };
    }
  }, [speaker, video, muted]);
  useEffect(() => {
    return () => {
      if (listener.current) {
        camera.remove(listener.current);
        listener.current.clear();
        listener.current = undefined;
      }

      if (speaker) {
        speaker.clear();
        speaker.disconnect();
        setSpeaker(undefined);
      }

      if (video) {
        video.pause();
        video.remove();
      }
    };
  }, []);

  if (!dims || !video) {
    return null;
  }

  const max = Math.max(dims.x, dims.y);
  const width = dims.x / max * size;
  const height = dims.y / max * size;
  return /*#__PURE__*/React.createElement("group", _extends({
    name: "spacesvr-video"
  }, rest), /*#__PURE__*/React.createElement("mesh", null, /*#__PURE__*/React.createElement("planeGeometry", {
    args: [width, height]
  }), /*#__PURE__*/React.createElement("meshBasicMaterial", {
    side: DoubleSide
  }, /*#__PURE__*/React.createElement("videoTexture", {
    attach: "map",
    args: [video],
    encoding: sRGBEncoding
  }))), speaker && /*#__PURE__*/React.createElement("primitive", {
    object: speaker
  }), framed && /*#__PURE__*/React.createElement(Frame, {
    width: width,
    height: height,
    thickness: frameWidth,
    material: frameMaterial
  }));
}

function LostFloor() {
  const mat = useMemo(() => {
    const m = new MeshLambertMaterial();

    m.onBeforeCompile = function (shader) {
      shader.vertexShader = vertHead$1 + shader.vertexShader.replace("#include <worldpos_vertex>", "#include <worldpos_vertex>\n" + vertBody);
      shader.fragmentShader = fragHead + shader.fragmentShader.replace("#include <color_fragment>", "#include <color_fragment>\n  " + fragColorFragment);
    };

    return m;
  }, []);
  return /*#__PURE__*/React.createElement("group", {
    name: "spacesvr-lost-floor"
  }, /*#__PURE__*/React.createElement("mesh", {
    "rotation-x": -Math.PI / 2,
    material: mat
  }, /*#__PURE__*/React.createElement("planeGeometry", {
    args: [10000, 10000, 1, 1]
  })));
}
const noise = `
   //
  // Description : Array and textureless GLSL 2D/3D/4D simplex
  //               noise functions.
  //      Author : Ian McEwan, Ashima Arts.
  //  Maintainer : ijm
  //     Lastmod : 20110822 (ijm)
  //     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
  //               Distributed under the MIT License. See LICENSE file.
  //               https://github.com/ashima/webgl-noise
  //
  
  vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }
  
  vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }
  
  vec4 permute(vec4 x) {
       return mod289(((x*34.0)+1.0)*x);
  }
  
  vec4 taylorInvSqrt(vec4 r)
  {
    return 1.79284291400159 - 0.85373472095314 * r;
  }
  
  float snoise(vec3 v)
    {
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  
  // First corner
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;
  
  // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
  
    //   x0 = x0 - 0.0 + 0.0 * C.xxx;
    //   x1 = x0 - i1  + 1.0 * C.xxx;
    //   x2 = x0 - i2  + 2.0 * C.xxx;
    //   x3 = x0 - 1.0 + 3.0 * C.xxx;
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
    vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
  
  // Permutations
    i = mod289(i);
    vec4 p = permute( permute( permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  
  // Gradients: 7x7 points over a square, mapped onto an octahedron.
  // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
    float n_ = 0.142857142857; // 1.0/7.0
    vec3  ns = n_ * D.wyz - D.xzx;
  
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)
  
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
  
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
  
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
  
    //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
    //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
  
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
  
  //Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
  
  // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                  dot(p2,x2), dot(p3,x3) ) );
    } 
  
`;
const oklab = `
float fixedpow(float a, float x)
{
    return pow(abs(a), x) * sign(a);
}

float cbrt(float a)
{
    return fixedpow(a, 0.3333333333);
}

vec3 lsrgb2oklab(vec3 c)
{
    float l = 0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b;
    float m = 0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b;
    float s = 0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b;

    float l_ = cbrt(l);
    float m_ = cbrt(m);
    float s_ = cbrt(s);

    return vec3(
        0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
        1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
        0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
    );
}

vec3 oklab2lsrgb(vec3 c)
{
    float l_ = c.r + 0.3963377774 * c.g + 0.2158037573 * c.b;
    float m_ = c.r - 0.1055613458 * c.g - 0.0638541728 * c.b;
    float s_ = c.r - 0.0894841775 * c.g - 1.2914855480 * c.b;

    float l = l_ * l_ * l_;
    float m = m_ * m_ * m_;
    float s = s_ * s_ * s_;

    return vec3(
        4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
    );
}
`;
const vertHead$1 = `
  varying vec3 vPos;
`;
const vertBody = `
  vPos = position;
`;
const fragHead = `
  ${noise}
  ${oklab}
  
  varying vec3 vPos;
`;
const fragColorFragment = `
  diffuseColor.rgb -= 0.2 * (snoise(vPos) + 1.) / 2.;
  diffuseColor.r -= 0.025 * (snoise(-vPos) + 1.) / 2.;
`;

/**
 * Traverses an object 3d to find any meshes marked collidable by their name
 */

const KEYWORDS = ["collider", "collision"];
const findColliderMeshes = obj => {
  const result = [];
  obj.traverse(node => {
    if (node.isMesh) {
      for (const keyword of KEYWORDS) {
        if (node.name.toLowerCase().includes(keyword)) {
          result.push(node);
        }
      }
    }
  });

  if (result.length > 0) {
    return result;
  }

  return undefined;
};
/**
 * Gets the number of triangles in a geometry
 */

const getGeometryTriCount = geometry => {
  return geometry.index ? geometry.index.count / 3 : geometry.attributes.position.count / 3;
};
/**
 * Traverses an object 3d to find and return all meshes
 */

const getMeshes = obj => {
  const result = [];
  obj.traverse(node => {
    if (node.isMesh) {
      result.push(node);
    }
  });
  return result;
};
/**
 * Given a mesh, clone the geo and apply the transformations. pass a parent to cap off transforms
 */

const getTransformedMeshGeo = (mesh, parent) => {
  const geo = mesh.geometry.clone();
  mesh.updateWorldMatrix(true, false);
  const pos = new Vector3();
  const quat = new Quaternion();
  const euler = new Euler();
  const scale = new Vector3();
  let obj = mesh;

  do {
    obj.matrix.decompose(pos, quat, scale);
    euler.setFromQuaternion(quat);
    geo.scale(scale.x, scale.y, scale.z);
    geo.rotateX(euler.x);
    geo.rotateY(euler.y);
    geo.rotateZ(euler.z);
    geo.translate(pos.x, pos.y, pos.z);
    obj = obj.parent;
  } while (obj && obj !== parent);

  return geo;
};
/**
 * Gets a uuid for an arr of meshes
 */

const getMeshesUUID = meshes => {
  const uuids = meshes.map(mesh => mesh.uuid);
  uuids.sort();
  return uuids.join("-");
};

const useTrimeshCollision = (geometry, trans) => {
  const indices = geometry.index.array;
  const isInterleaved = // @ts-ignore
  geometry.attributes.position.isInterleavedBufferAttribute;
  let vertices = [];

  if (isInterleaved) {
    const attr = geometry.attributes.position;
    const data = attr.data;

    for (let i = attr.offset; i < data.array.length; i += data.stride) {
      for (let x = 0; x < attr.itemSize; x++) {
        vertices.push(data.array[i + x]);
      }
    }
  } else {
    vertices = geometry.attributes.position.array;
  }

  return useTrimesh(() => ({
    type: "Static",
    args: [vertices, indices],
    position: trans == null ? void 0 : trans.pos,
    rotation: trans == null ? void 0 : trans.rot
  }), undefined, [geometry.uuid]);
};

function TrimeshCollider(props) {
  const {
    geo
  } = props;
  const group = useRef(null);
  const [pos] = useState(() => new Vector3());
  const [quat] = useState(() => new Quaternion());
  const [scale] = useState(() => new Vector3());
  const [euler] = useState(() => new Euler());
  const [curScale, setCurScale] = useState(new Vector3(1, 1, 1));
  const geometry = useMemo(() => {
    const g = geo.clone().scale(curScale.x, curScale.y, curScale.z);
    g.computeVertexNormals();
    return g;
  }, [geo, curScale]);
  const [, api] = useTrimeshCollision(geometry, {
    pos: pos.toArray(),
    rot: [euler.x, euler.y, euler.z]
  });
  const lastUpdatedMatrix = useRef(new Matrix4());
  useLimitedFrame(8, () => {
    if (!group.current) return; // get global position, rotation, scale

    group.current.updateWorldMatrix(true, false);
    group.current.matrixWorld.decompose(pos, quat, scale); // no need to update if nothing changed

    if (lastUpdatedMatrix.current.equals(group.current.matrixWorld)) {
      return;
    } // update last values


    lastUpdatedMatrix.current.copy(group.current.matrixWorld); // if a change was found, update collider

    api.position.copy(pos);
    api.rotation.copy(euler.setFromQuaternion(quat));
    if (!scale.equals(curScale)) setCurScale(scale.clone());
  });
  return /*#__PURE__*/React.createElement("group", {
    ref: group
  });
}

// manually copied and modified from three-stdlib to fix bug here: https://github.com/mrdoob/three.js/pull/24169
const cb = new Vector3(),
      ab = new Vector3();

function pushIfUnique(array, object) {
  if (array.indexOf(object) === -1) array.push(object);
}

function removeFromArray(array, object) {
  const k = array.indexOf(object);
  if (k > -1) array.splice(k, 1);
}

class Vertex {
  minCost = 0;
  totalCost = 0;
  costCount = 0;

  constructor(v, id) {
    this.position = v;
    this.id = id; // old index id

    this.faces = []; // faces vertex is connected

    this.neighbors = []; // neighbouring vertices aka "adjacentVertices"
    // these will be computed in computeEdgeCostAtVertex()

    this.collapseCost = 0; // cost of collapsing this vertex, the less the better. aka objdist

    this.collapseNeighbor = null; // best candinate for collapsing
  }

  addUniqueNeighbor(vertex) {
    pushIfUnique(this.neighbors, vertex);
  }

  removeIfNonNeighbor(n) {
    const neighbors = this.neighbors;
    const faces = this.faces;
    const offset = neighbors.indexOf(n);
    if (offset === -1) return;

    for (let i = 0; i < faces.length; i++) {
      if (faces[i].hasVertex(n)) return;
    }

    neighbors.splice(offset, 1);
  }

} // we use a triangle class to represent structure of face slightly differently


class Triangle {
  normal = new Vector3();

  constructor(v1, v2, v3, a, b, c) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.v1 = v1;
    this.v2 = v2;
    this.v3 = v3;
    this.computeNormal();
    v1.faces.push(this);
    v1.addUniqueNeighbor(v2);
    v1.addUniqueNeighbor(v3);
    v2.faces.push(this);
    v2.addUniqueNeighbor(v1);
    v2.addUniqueNeighbor(v3);
    v3.faces.push(this);
    v3.addUniqueNeighbor(v1);
    v3.addUniqueNeighbor(v2);
  }

  computeNormal() {
    const vA = this.v1.position;
    const vB = this.v2.position;
    const vC = this.v3.position;
    cb.subVectors(vC, vB);
    ab.subVectors(vA, vB);
    cb.cross(ab).normalize();
    this.normal.copy(cb);
  }

  hasVertex(v) {
    return v === this.v1 || v === this.v2 || v === this.v3;
  }

  replaceVertex(oldv, newv) {
    if (oldv === this.v1) this.v1 = newv;else if (oldv === this.v2) this.v2 = newv;else if (oldv === this.v3) this.v3 = newv;
    removeFromArray(oldv.faces, this);
    newv.faces.push(this);
    oldv.removeIfNonNeighbor(this.v1);
    this.v1.removeIfNonNeighbor(oldv);
    oldv.removeIfNonNeighbor(this.v2);
    this.v2.removeIfNonNeighbor(oldv);
    oldv.removeIfNonNeighbor(this.v3);
    this.v3.removeIfNonNeighbor(oldv);
    this.v1.addUniqueNeighbor(this.v2);
    this.v1.addUniqueNeighbor(this.v3);
    this.v2.addUniqueNeighbor(this.v1);
    this.v2.addUniqueNeighbor(this.v3);
    this.v3.addUniqueNeighbor(this.v1);
    this.v3.addUniqueNeighbor(this.v2);
    this.computeNormal();
  }

}
/**
 *	Simplification Geometry Modifier
 *    - based on code and technique
 *	  - by Stan Melax in 1998
 *	  - Progressive Mesh type Polygon Reduction Algorithm
 *    - http://www.melax.com/polychop/
 */


class SimplifyModifier {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  computeEdgeCollapseCost = (u, v) => {
    // if we collapse edge uv by moving u to v then how
    // much different will the model change, i.e. the "error".
    const edgelength = v.position.distanceTo(u.position);
    let curvature = 0;
    const sideFaces = [];
    let i,
        // eslint-disable-next-line prefer-const
    il = u.faces.length,
        face,
        sideFace; // find the "sides" triangles that are on the edge uv

    for (i = 0; i < il; i++) {
      face = u.faces[i];

      if (face.hasVertex(v)) {
        sideFaces.push(face);
      }
    } // use the triangle facing most away from the sides
    // to determine our curvature term


    for (i = 0; i < il; i++) {
      let minCurvature = 1;
      face = u.faces[i];

      for (let j = 0; j < sideFaces.length; j++) {
        sideFace = sideFaces[j]; // use dot product of face normals.

        const dotProd = face.normal.dot(sideFace.normal);
        minCurvature = Math.min(minCurvature, (1.001 - dotProd) / 2);
      }

      curvature = Math.max(curvature, minCurvature);
    } // crude approach in attempt to preserve borders
    // though it seems not to be totally correct


    const borders = 0;

    if (sideFaces.length < 2) {
      // we add some arbitrary cost for borders,
      // borders += 10;
      curvature = 1;
    }

    const amt = edgelength * curvature + borders;
    return amt;
  };

  removeVertex(v, vertices) {
    console.assert(v.faces.length === 0);

    while (v.neighbors.length) {
      const n = v.neighbors.pop();
      removeFromArray(n.neighbors, v);
    }

    removeFromArray(vertices, v);
  }

  computeEdgeCostAtVertex = v => {
    // compute the edge collapse cost for all edges that start
    // from vertex v.  Since we are only interested in reducing
    // the object by selecting the min cost edge at each step, we
    // only cache the cost of the least cost edge at this vertex
    // (in member variable collapse) as well as the value of the
    // cost (in member variable collapseCost).
    if (v.neighbors.length === 0) {
      // collapse if no neighbors.
      v.collapseNeighbor = null;
      v.collapseCost = -0.01;
      return;
    }

    v.collapseCost = 100000;
    v.collapseNeighbor = null; // search all neighboring edges for "least cost" edge

    for (let i = 0; i < v.neighbors.length; i++) {
      const collapseCost = this.computeEdgeCollapseCost(v, v.neighbors[i]);

      if (!v.collapseNeighbor) {
        v.collapseNeighbor = v.neighbors[i];
        v.collapseCost = collapseCost;
        v.minCost = collapseCost;
        v.totalCost = 0;
        v.costCount = 0;
      }

      v.costCount++;
      v.totalCost += collapseCost;

      if (collapseCost < v.minCost) {
        v.collapseNeighbor = v.neighbors[i];
        v.minCost = collapseCost;
      }
    } // we average the cost of collapsing at this vertex


    v.collapseCost = v.totalCost / v.costCount; // v.collapseCost = v.minCost;
  };
  removeFace = (f, faces) => {
    removeFromArray(faces, f);
    if (f.v1) removeFromArray(f.v1.faces, f);
    if (f.v2) removeFromArray(f.v2.faces, f);
    if (f.v3) removeFromArray(f.v3.faces, f); // TODO optimize this!

    const vs = [f.v1, f.v2, f.v3];
    let v1, v2;

    for (let i = 0; i < 3; i++) {
      v1 = vs[i];
      v2 = vs[(i + 1) % 3];
      if (!v1 || !v2) continue;
      v1.removeIfNonNeighbor(v2);
      v2.removeIfNonNeighbor(v1);
    }
  };
  collapse = (vertices, faces, u, v) => {
    // u and v are pointers to vertices of an edge
    // Collapse the edge uv by moving vertex u onto v
    if (!v) {
      // u is a vertex all by itself so just delete it..
      this.removeVertex(u, vertices);
      return;
    }

    let i;
    const tmpVertices = [];

    for (i = 0; i < u.neighbors.length; i++) {
      tmpVertices.push(u.neighbors[i]);
    } // delete triangles on edge uv:


    for (i = u.faces.length - 1; i >= 0; i--) {
      if (u.faces[i] && u.faces[i].hasVertex(v)) {
        this.removeFace(u.faces[i], faces);
      }
    } // update remaining triangles to have v instead of u


    for (i = u.faces.length - 1; i >= 0; i--) {
      u.faces[i].replaceVertex(u, v);
    }

    this.removeVertex(u, vertices); // recompute the edge collapse costs in neighborhood

    for (i = 0; i < tmpVertices.length; i++) {
      this.computeEdgeCostAtVertex(tmpVertices[i]);
    }
  };
  minimumCostEdge = vertices => {
    // O(n * n) approach. TODO optimize this
    let least = vertices[0];

    for (let i = 0; i < vertices.length; i++) {
      if (vertices[i].collapseCost < least.collapseCost) {
        least = vertices[i];
      }
    }

    return least;
  };
  modify = (geometry, targetFaces) => {
    geometry = geometry.clone();
    const attributes = geometry.attributes; // this modifier can only process indexed and non-indexed geomtries with a position attribute

    for (const name in attributes) {
      if (name !== "position") geometry.deleteAttribute(name);
    }

    geometry = mergeVertices(geometry); //
    // put data of original geometry in different data structures
    //

    const vertices = [];
    const faces = []; // add vertices

    const positionAttribute = geometry.getAttribute("position");

    for (let i = 0; i < positionAttribute.count; i++) {
      const v = new Vector3().fromBufferAttribute(positionAttribute, i);
      const vertex = new Vertex(v, i);
      vertices.push(vertex);
    } // add faces


    const geomIndex = geometry.getIndex();

    if (geomIndex !== null) {
      for (let i = 0; i < geomIndex.count; i += 3) {
        const a = geomIndex.getX(i);
        const b = geomIndex.getX(i + 1);
        const c = geomIndex.getX(i + 2);
        const triangle = new Triangle(vertices[a], vertices[b], vertices[c], a, b, c);
        faces.push(triangle);
      }
    } else {
      for (let i = 0; i < positionAttribute.count; i += 3) {
        const a = i;
        const b = i + 1;
        const c = i + 2;
        const triangle = new Triangle(vertices[a], vertices[b], vertices[c], a, b, c);
        faces.push(triangle);
      }
    } // compute all edge collapse costs


    for (let i = 0, il = vertices.length; i < il; i++) {
      this.computeEdgeCostAtVertex(vertices[i]);
    }

    let nextVertex;
    let z = faces.length - targetFaces;

    while (z--) {
      nextVertex = this.minimumCostEdge(vertices);

      if (!nextVertex) {
        console.log("THREE.SimplifyModifier: No next vertex");
        break;
      } else if (faces.length <= targetFaces) {
        break;
      } else {
        this.collapse(vertices, faces, nextVertex, nextVertex.collapseNeighbor);
      }
    } //


    const simplifiedGeometry = new BufferGeometry();
    const position = [];
    const index = []; //

    for (let i = 0; i < vertices.length; i++) {
      const vertex = vertices[i].position;
      position.push(vertex.x, vertex.y, vertex.z);
    } //


    for (let i = 0; i < faces.length; i++) {
      const face = faces[i];
      const a = vertices.indexOf(face.v1);
      const b = vertices.indexOf(face.v2);
      const c = vertices.indexOf(face.v3);
      index.push(a, b, c);
    } //


    simplifiedGeometry.setAttribute("position", new Float32BufferAttribute(position, 3));
    simplifiedGeometry.setIndex(index);
    return simplifiedGeometry;
  };
}

const generateSimplifiedGeo = (geo, triTarget) => {
  const modifier = new SimplifyModifier();
  return modifier.modify(geo, Math.floor(triTarget));
};

function Collidable(props) {
  const {
    children,
    triLimit = 1000,
    enabled = true,
    hideCollisionMeshes = false
  } = props;
  const group = useRef(null);
  const geoUUID = useRef();
  const [collisionMeshes, setCollisionMeshes] = useState();
  const [collisionGeos, setCollisionGeos] = useState(); // func to create uuid to know when to regenerate

  const createUUID = meshes => triLimit + "-" + getMeshesUUID(meshes); // register collision meshes and collision geos


  useEffect(() => {
    if (!group.current || !enabled) {
      setCollisionGeos(undefined);
      setCollisionMeshes(undefined);
      geoUUID.current = undefined;
      return;
    } // if the user names the meshes themselves, give them full control


    const colliderMeshes = findColliderMeshes(group.current);

    if (colliderMeshes) {
      if (createUUID(colliderMeshes) === geoUUID.current) return;
      setCollisionMeshes(colliderMeshes);
      const geos = colliderMeshes.map(m => getTransformedMeshGeo(m, group.current));
      setCollisionGeos(geos);
      geoUUID.current = createUUID(colliderMeshes);
      return;
    } // otherwise, use all the meshes in the model


    const meshes = getMeshes(group.current);
    if (createUUID(meshes) === geoUUID.current) return;
    setCollisionMeshes(meshes);
    geoUUID.current = createUUID(meshes); // aggregate geos in the model

    const geos = meshes.map(m => getTransformedMeshGeo(m, group.current)); // either use geo directly or bvh version, depending on tri count

    const triCount = geos.reduce((c, g) => c + getGeometryTriCount(g), 0);

    if (triCount < triLimit) {
      setCollisionGeos(geos);
    } else {
      const perc = triLimit / triCount;
      const simpGeos = geos.map(g => generateSimplifiedGeo(g, getGeometryTriCount(g) * perc)).filter(g => g);
      setCollisionGeos(simpGeos);
    }
  }, [children, triLimit, enabled]); // hide or show collision meshes

  useEffect(() => {
    if (!collisionMeshes) return;
    collisionMeshes.map(collider => collider.visible = !hideCollisionMeshes);
    return () => {
      collisionMeshes.map(collider => collider.visible = true);
    };
  }, [collisionMeshes, hideCollisionMeshes]);
  return /*#__PURE__*/React.createElement("group", {
    name: "spacesvr-collidable",
    ref: group
  }, children, enabled && collisionGeos && collisionGeos.map((geo, i) => /*#__PURE__*/React.createElement(TrimeshCollider, {
    key: geo.uuid,
    geo: geo
  })));
}

function XRInteractable(props) {
  const {
    onClick,
    onHover,
    onUnHover,
    children
  } = props;
  return /*#__PURE__*/React.createElement("group", {
    name: "spacesvr-interactable"
  }, /*#__PURE__*/React.createElement(Interactive, {
    onHover: onHover,
    onBlur: onUnHover,
    onSelect: onClick ? e => onClick(e.intersection) : undefined
  }, children));
}

const CLICK_TIMEOUT$1 = 0.4; // seconds

const MAX_DRAG = 0.1; // meters

function MobileDesktopInteractable(props) {
  const {
    onClick,
    onHover,
    onUnHover,
    raycaster: passedRaycaster,
    children
  } = props;
  const gl = useThree(state => state.gl);
  const clock = useThree(state => state.clock);
  const {
    device
  } = useEnvironment();
  const player = usePlayer();
  const group = useRef(null);
  const down = useMemo(() => ({
    start: new Vector3(),
    time: 0
  }), []);
  const intersection = useRef();
  const RAYCASTER = passedRaycaster || player.raycaster;
  const DETECT_HOVER = !!onHover || !!onUnHover; // only detect hover if we have a hover handler

  const getIntersection = useCallback(() => {
    if (!group.current) return undefined;
    RAYCASTER.firstHitOnly = true;
    const intersects = RAYCASTER.intersectObject(group.current, true);
    RAYCASTER.firstHitOnly = false;
    return intersects.length > 0 ? intersects[0] : undefined;
  }, [RAYCASTER]); // continuously update the hover state if we have a hover handler

  useLimitedFrame(17, () => {
    if (!group.current || !DETECT_HOVER) return;
    const inter = getIntersection();

    if (inter) {
      if (!intersection.current) {
        if (onHover) onHover();
      }

      intersection.current = inter;
    } else {
      if (intersection.current) {
        intersection.current = undefined;
        if (onUnHover) onUnHover();
      }
    }
  }); // enable bvh raycasting for children

  useEffect(() => {
    if (!group.current) return;
    group.current.traverse(obj => {
      const mesh = obj;
      if (mesh.isMesh) enableBVHRaycast(mesh, 50);
    });
  }, []);
  useEffect(() => {
    const startPress = () => {
      RAYCASTER.ray.at(1, down.start);
      down.time = clock.elapsedTime;
    };

    const endPress = () => {
      if (!onClick || !group.current) return;
      const newPos = RAYCASTER.ray.at(1, new Vector3());
      const dist = down.start.distanceTo(newPos);
      const timeDiff = clock.elapsedTime - down.time;
      if (dist > MAX_DRAG || timeDiff > CLICK_TIMEOUT$1) return; // either look for hover state or re-do raycast

      if (DETECT_HOVER) {
        if (intersection.current) onClick(intersection.current);
      } else {
        const inter = getIntersection();
        if (inter) onClick(inter);
      }
    };

    const startev = device.mobile ? "touchstart" : "mousedown";
    const endev = device.mobile ? "touchend" : "mouseup";
    gl.domElement.addEventListener(startev, startPress);
    gl.domElement.addEventListener(endev, endPress);
    return () => {
      gl.domElement.removeEventListener(startev, startPress);
      gl.domElement.removeEventListener(endev, endPress);
    };
  }, [DETECT_HOVER, RAYCASTER, clock, device.mobile, down, getIntersection, gl.domElement, onClick]);
  return /*#__PURE__*/React.createElement("group", {
    name: "spacesvr-interactable",
    ref: group
  }, children);
}

/**
 * Interactable adds on click and hover methods to any group of Object3D's.
 */
function Interactable(props) {
  const {
    device
  } = useEnvironment();
  if (device.xr) return /*#__PURE__*/React.createElement(XRInteractable, props);
  return /*#__PURE__*/React.createElement(MobileDesktopInteractable, props);
}

const ToolbeltContext = /*#__PURE__*/createContext({});
const useToolbelt = () => useContext(ToolbeltContext);
const useToolbeltState = showOnSpawn => {
  const [hudScene] = useState(() => new Scene());
  const rerender = useRerender();
  const tools = useMemo(() => [], []);
  const [activeIndex, setActiveIndex] = useState(showOnSpawn ? 0 : undefined);
  const lastActiveIndex = useRef(0);
  const [direction, setDirection] = useState("right");
  const grant = useCallback((name, icon, orderIndex) => {
    // make sure no tool with same name or key exists
    if (tools.find(tool => tool.name === name)) {
      console.error(`Toolbelt: Tool with same name already exists: ${name}`);
      return;
    }

    if (tools.length === 0) rerender();
    const tool = {
      name,
      icon,
      orderIndex: orderIndex || 0
    };
    tools.push(tool); // sort tools by orderIndex, then by name

    tools.sort((a, b) => a.orderIndex !== b.orderIndex ? a.orderIndex - b.orderIndex : a.name.localeCompare(b.name));
  }, [tools]);
  const revoke = useCallback(name => {
    const tool = tools.find(tool => tool.name === name);

    if (tool) {
      tools.splice(tools.indexOf(tool), 1);
    }
  }, [tools]);
  useEffect(() => {
    if (activeIndex !== undefined) lastActiveIndex.current = activeIndex;
  }, [activeIndex]);
  const next = useCallback(() => {
    setDirection("right");

    if (tools.length === 1) {
      setActiveIndex(actInd => actInd === undefined ? 0 : undefined);
    } else {
      setActiveIndex(actInd => actInd !== undefined ? (actInd + 1) % tools.length : 0);
    }
  }, [tools]);
  const prev = useCallback(() => {
    setDirection("left");

    if (tools.length === 1) {
      setActiveIndex(actInd => actInd === undefined ? 0 : undefined);
    } else {
      setActiveIndex(actInd => actInd !== undefined ? (actInd - 1 + tools.length) % tools.length : 0);
    }
  }, [tools]);
  const hide = useCallback(() => {
    setActiveIndex(undefined);
  }, []);
  const show = useCallback(() => {
    setActiveIndex(oldInd => oldInd === undefined ? lastActiveIndex.current : oldInd);
  }, []);
  const setActiveTool = useCallback(name => {
    const index = tools.findIndex(tool => tool.name === name);
    if (index !== -1) setActiveIndex(index);
  }, [tools]);
  return {
    tools,
    activeTool: activeIndex !== undefined ? tools[activeIndex] : undefined,
    grant,
    revoke,
    hide,
    next,
    prev,
    show,
    activeIndex,
    setActiveIndex,
    setActiveTool,
    hudScene,
    direction,
    setDirection
  };
};

/**
 * A hook that allows you to toggle a boolean value.
 * @param delay time in ms
 */

const useDelayedToggle = function (delay) {
  if (delay === void 0) {
    delay = 1000;
  }

  const timeoutId = useRef(null);
  const [active, setActiveState] = useState(false);
  const setActive = useCallback(() => {
    if (timeoutId.current !== null) {
      clearTimeout(timeoutId.current);
    }

    setActiveState(true);
    timeoutId.current = setTimeout(() => {
      setActiveState(false);
    }, delay);
  }, [delay]);
  useEffect(() => {
    return () => {
      if (timeoutId.current !== null) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);
  return {
    active,
    setActive
  };
};

const OUTER_PADDING = 40;
const INNER_PADDING = 10;
const FIXED_PADDING = OUTER_PADDING - INNER_PADDING;
const OUTER_BORDER_RADIUS = 25;
const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  padding: ${FIXED_PADDING}px ${FIXED_PADDING}px 0 ${FIXED_PADDING}px;
  border-radius: ${OUTER_BORDER_RADIUS}px;
  pointer-events: ${props => props.open ? "all" : "none"};

  display: flex;
  max-width: calc(100% - 80px);
  flex-basis: calc(100% - 80px);
  flex-wrap: wrap;
  box-sizing: border-box;
  justify-content: center;
  width: max-content;
  max-height: 100%;
  overflow-y: auto;

  opacity: ${props => props.open ? 1 : 0};
  ${props => props.open ? "transition: opacity 0.075s ease-in-out;" : "transition: opacity 0.4s ease-in-out;"};

  @media screen and (max-width: 600px) {
    padding: ${FIXED_PADDING}px 10px ${FIXED_PADDING}px 10px;
  }

  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: hsl(0deg 0% 90% / 50%);
    border-radius: ${OUTER_BORDER_RADIUS}px;
    backdrop-filter: blur(15px);
    z-index: -1;
  }
`;
const ToolItem = styled.div`
  position: relative;
  width: 125px;
  height: 125px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  margin: 10px 10px ${OUTER_PADDING}px 10px;
  
  @media screen and (max-width: 600px) {
    width: 90px;
    height: 90px;
  }
  
  &:before {
    ${props => !props.active && "display: none;"}
    content: "";
    position: absolute;
    box-sizing: content-box;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    padding: ${INNER_PADDING}px;
    background: hsl(0deg 0% 50% / 50%);
    border-radius: 10px;
    z-index: -2;
  }
  
  // place text directly below the main box
  &:after {
    ${props => !props.active && "display: none;"}
    content: "${props => props.title}";
    position: absolute;
    bottom: -${OUTER_PADDING}px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 1.1rem;
    font-family: sans-serif;
    padding: 4px 10px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
    text-align: center;
    color: #222;
    

    @media screen and (max-width: 600px) {
      font-size: 0.9rem;
    }
  }
`;
const LetterContent = styled.div`
  width: 100%;
  height: 100%;
  background: oklch(75% 0.132 ${props => props.perc * 360});
  font-size: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: sans-serif;
  border-radius: 10px;
  color: #444;

  @media screen and (max-width: 600px) {
    font-size: 3rem;
  }
`;
const ImageContent = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;
const NoneItem = styled.div`
  display: inline-block;
  position: relative;
  border: 6px solid #444;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  box-sizing: content-box;

  &::after {
    content: "";
    width: 84px;
    height: 6px;
    position: absolute;
    left: 50%;
    top: 50%;
    background-color: #444;
    transform: translate(-50%, -50%) rotate(45deg);
  }
`;
function ToolSwitcher() {
  const {
    paused,
    containerRef
  } = useEnvironment();
  const {
    next,
    prev,
    activeIndex,
    setActiveIndex,
    tools,
    setDirection
  } = useToolbelt();
  const {
    size,
    gl
  } = useThree();
  const {
    active: showing,
    setActive: setShowing
  } = useDelayedToggle(850);
  const registered = useRef(false);
  const DETECT_RANGE_X = screen.width * 0.05;
  const DRAG_RANGE_X = screen.width * 0.08;
  const DETECT_RANGE_Y = screen.height * 0.5;
  const valid = useRef(false);
  useDrag({
    onStart: _ref => {
      let {
        e,
        touch
      } = _ref;
      valid.current = false;
      const inSideEdge = Math.min(touch.clientX, size.width - touch.clientX) < DETECT_RANGE_X;
      const inTopThird = touch.clientY < DETECT_RANGE_Y; // ignore if not in top third or side edge

      if (!inSideEdge || !inTopThird) return;
      valid.current = true;
      registered.current = false;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    },
    onMove: _ref2 => {
      let {
        delta
      } = _ref2;
      if (!valid.current || registered.current) return;

      if (Math.abs(delta.x) > DRAG_RANGE_X) {
        registered.current = true;

        if (delta.x > 0) {
          setShowing();
          next();
        } else {
          setShowing();
          prev();
        }
      }
    }
  }, gl.domElement, [screen.width, screen.height, next, prev]);
  useEffect(() => {
    const handleKeypress = e => {
      if (isTyping() || e.metaKey || e.ctrlKey || paused) return;

      if (e.key == "Tab") {
        if (e.shiftKey) {
          setDirection("left");
          setShowing();
          if (activeIndex === undefined) setActiveIndex(tools.length - 1);else if (activeIndex === 0) setActiveIndex(undefined);else setActiveIndex((activeIndex - 1 + tools.length) % tools.length);
        } else {
          setDirection("right");
          setShowing();
          if (activeIndex === undefined) setActiveIndex(0);else if (activeIndex === tools.length - 1) setActiveIndex(undefined);else setActiveIndex((activeIndex + 1) % tools.length);
        }

        e.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeypress);
    return () => document.removeEventListener("keydown", handleKeypress);
  }, [activeIndex, paused, setActiveIndex, setDirection, setShowing, tools]);
  const clickItem = useCallback(index => {
    setShowing();
    setActiveIndex(index);
  }, [setActiveIndex, setShowing]);
  return /*#__PURE__*/React.createElement(Html, null, /*#__PURE__*/createPortal( /*#__PURE__*/React.createElement(Container, {
    open: showing
  }, /*#__PURE__*/React.createElement(ToolItem, {
    title: "None",
    active: activeIndex === undefined,
    onClick: () => clickItem(undefined)
  }, /*#__PURE__*/React.createElement(NoneItem, null)), tools.map((tool, i) => /*#__PURE__*/React.createElement(ToolItem, {
    key: `${tool.name}-${i}`,
    title: tool.name,
    active: activeIndex === i,
    onClick: () => clickItem(i)
  }, tool.icon ? /*#__PURE__*/React.createElement(ImageContent, {
    src: tool.icon
  }) : /*#__PURE__*/React.createElement(LetterContent, {
    perc: new Idea().updateFromText(tool.name).mediation
  }, tool.name.substring(0, 1))))), containerRef.current));
}

function Lights() {
  return /*#__PURE__*/React.createElement("group", {
    name: "lights"
  }, /*#__PURE__*/React.createElement("ambientLight", {
    intensity: Math.PI * 0.5
  }), /*#__PURE__*/React.createElement("pointLight", {
    intensity: Math.PI * 0.5
  }));
}

function WorldLights(props) {
  const {
    enabled = true,
    directional
  } = props;
  const {
    scene
  } = useThree();
  const group = useRef(null);
  const toolbelt = useToolbelt();
  const rerender = useRerender();
  const trackedLights = useRef([]);
  const renderedLights = useRef([]);
  useLimitedFrame(1 / 2, () => {
    const sceneLights = [];
    scene.traverse(obj => {
      if (obj instanceof Light && (!directional || obj instanceof AmbientLight)) {
        sceneLights.push(obj);
      }
    });
    let changed = false;

    for (const light of sceneLights) {
      // if light is not rendered, register it
      if (!renderedLights.current.find(obj => obj.userData.uuid === light.uuid)) {
        const newLight = light.clone();
        newLight.userData.uuid = light.uuid;
        renderedLights.current.push(newLight);
        changed = true;
      }
    } // if light is rendered but not in scene, unregister it


    for (const light of renderedLights.current) {
      if (!sceneLights.find(obj => obj.uuid === light.userData.uuid)) {
        renderedLights.current.splice(renderedLights.current.indexOf(light), 1);
        light.dispose();
        changed = true;
      }
    }

    if (changed) {
      rerender();
      trackedLights.current = sceneLights;
    }
  });
  useLimitedFrame(30, _ref => {
    let {
      camera
    } = _ref;
    if (!enabled || !group.current) return;
    group.current.position.copy(camera.position);
    renderedLights.current.forEach(light => {
      const trackedLight = trackedLights.current.find(li => li.uuid === light.userData.uuid);
      if (!trackedLight) return;
      light.matrixWorld.copy(trackedLight.matrixWorld);
    });
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, createPortal$1( /*#__PURE__*/React.createElement("group", {
    name: "world-lights",
    ref: group
  }, renderedLights.current.map(light => /*#__PURE__*/React.createElement("primitive", {
    object: light,
    key: light.uuid
  }))), toolbelt.hudScene));
}

function Toolbelt(props) {
  const {
    children,
    showOnSpawn = true,
    worldLights = true,
    localLights = true
  } = props;
  const {
    camera
  } = useThree();
  const value = useToolbeltState(showOnSpawn);
  const {
    hudScene
  } = value; // hud render loop, use copied camera to render at 0,0,0

  const [camClone] = useState(() => camera.clone());
  useFrame(_ref => {
    let {
      gl
    } = _ref;
    const _cam = camera;
    camClone.position.set(0, 0, 0);
    camClone.quaternion.copy(_cam.quaternion);
    camClone.near = _cam.near;
    camClone.far = _cam.far;
    camClone.aspect = _cam.aspect;
    camClone.fov = _cam.fov;
    camClone.updateProjectionMatrix(); // for all intents and purposes, the hud items are placed in real world coordinates
    // this is very important for raycasting

    hudScene.position.set(0, 0, 0);
    gl.autoClear = false;
    gl.clearDepth();
    gl.render(hudScene, camClone);
    hudScene.position.copy(camera.position);
    hudScene.updateMatrixWorld(true);
  }, 100);
  return /*#__PURE__*/React.createElement(ToolbeltContext.Provider, {
    value: value
  }, /*#__PURE__*/React.createElement(ToolSwitcher, null), localLights && createPortal$1( /*#__PURE__*/React.createElement(Lights, null), hudScene), worldLights && /*#__PURE__*/React.createElement(WorldLights, null), children);
}

const dummy$1 = new Quaternion(); // taken from https://gist.github.com/sketchpunk/3568150a04b973430dfe8fd29bf470c8

class QuaterionSpring {
  constructor(damping, stiffness) {
    if (damping === void 0) {
      damping = 5;
    }

    if (stiffness === void 0) {
      stiffness = 30;
    }

    this.velocity = new Float32Array(4);
    this.stiffness = stiffness;
    this.damping = damping;
  }

  _velLenSqr() {
    return this.velocity[0] ** 2 + this.velocity[1] ** 2 + this.velocity[2] ** 2 + this.velocity[3] ** 2;
  } // Harmonic oscillation
  // https://stackoverflow.com/questions/44688112/spring-physics-applied-to-quaternions-using-python


  oscillationStep(cq, target, dt) {
    // Check when the spring is done.
    const dot = cq.dot(target);

    if (dot >= 0.9999 && this._velLenSqr() < 0.000001) {
      cq.copy(target);
      return;
    }

    const tq = dummy$1;

    if (dot < 0) {
      // Use the closest rotation
      tq.x = -target.x;
      tq.y = -target.y;
      tq.z = -target.z;
      tq.w = -target.w;
    } else {
      tq.copy(target);
    }

    this.velocity[0] += (-this.stiffness * (cq.x - tq.x) - this.damping * this.velocity[0]) * dt;
    this.velocity[1] += (-this.stiffness * (cq.y - tq.y) - this.damping * this.velocity[1]) * dt;
    this.velocity[2] += (-this.stiffness * (cq.z - tq.z) - this.damping * this.velocity[2]) * dt;
    this.velocity[3] += (-this.stiffness * (cq.w - tq.w) - this.damping * this.velocity[3]) * dt;
    cq.x += this.velocity[0] * dt;
    cq.y += this.velocity[1] * dt;
    cq.z += this.velocity[2] * dt;
    cq.w += this.velocity[3] * dt;
    cq.normalize();
  } // Critically Damped Spring


  criticallyStep(cq, target, dt) {
    // Check when the spring is done.
    const dot = cq.dot(target);

    if (dot >= 0.9999 && this._velLenSqr() < 0.000001) {
      cq.copy(target);
      return;
    }

    const tq = dummy$1;

    if (dot < 0) {
      // Use the closest rotation
      tq.x = -target.x;
      tq.y = -target.y;
      tq.z = -target.z;
      tq.w = -target.w;
    } else {
      tq.copy(target);
    }

    const dSqrDt = this.damping * this.damping * dt,
          n2 = 1 + this.damping * dt,
          n2Sqr = n2 * n2;
    this.velocity[0] = (this.velocity[0] - (cq.x - tq.x) * dSqrDt) / n2Sqr;
    this.velocity[1] = (this.velocity[1] - (cq.y - tq.y) * dSqrDt) / n2Sqr;
    this.velocity[2] = (this.velocity[2] - (cq.z - tq.z) * dSqrDt) / n2Sqr;
    this.velocity[3] = (this.velocity[3] - (cq.w - tq.w) * dSqrDt) / n2Sqr;
    cq.x += this.velocity[0] * dt;
    cq.y += this.velocity[1] * dt;
    cq.z += this.velocity[2] * dt;
    cq.w += this.velocity[3] * dt;
    cq.normalize();
    return cq;
  }

}

/**
 * Place the children in front of the camera with some sway
 * 1. I tried springing the quaternion, but it's not continuous and causes a jump
 * 2. I found a continuous quaternion spring, but it was not tight enough https://gist.github.com/sketchpunk/3568150a04b973430dfe8fd29bf470c8
 * 3. solution was to move tool in screen spacing by springing pos value offsets based on rotation velocity
 *    springed quat rotation still used for range
 *
 * @param props
 * @constructor
 */
function HUD(props) {
  const {
    children,
    pos,
    pinY = false,
    distance,
    range = 0,
    bobStrength
  } = props;
  const {
    velocity
  } = usePlayer();
  const t = 0.0001;
  const group = useRef(null);
  const [targetPos] = useState(new Vector2());
  const [lerpedPos] = useState(new Vector2().fromArray(pos));
  const [lerpedQuat] = useState(new Quaternion());
  const [targetQuat] = useState(new Quaternion());
  const [lastQuat] = useState(new Quaternion());
  const [lastEuler] = useState(new Euler(0, 0, 0, "YXZ"));
  const [thisEuler] = useState(new Euler(0, 0, 0, "YXZ"));
  const [dummy1] = useState(new Quaternion());
  const [dummy2] = useState(new Quaternion());
  const [hud] = useState(new Vector2());
  const [spring, set] = useSpring(() => ({
    offset: [0, 0],
    config: config.stiff
  }));
  const qs = useMemo(() => new QuaterionSpring(50, 100), []);
  useFrame((_ref, delta) => {
    let {
      camera,
      clock
    } = _ref;
    if (!group.current) return;
    const alpha = 1 - Math.pow(t, delta); // apply passes pos and offset pos

    const off = spring.offset.get();
    targetPos.fromArray(pos);
    targetPos.x += off[0] || 0;
    targetPos.y += off[1] || 0;
    lerpedPos.lerp(targetPos, alpha); // calculate x position based on camera and screen width

    getHudPos(lerpedPos, camera, distance, hud);
    group.current.position.set(hud.x, hud.y, -distance); // calculate rotation velocities about the respective ROTATION axis (not screen space)

    dummy1.copy(lastQuat);
    dummy2.copy(camera.quaternion);
    thisEuler.setFromQuaternion(camera.quaternion);
    let y_axis_vel = dummy1.multiply(dummy2.invert()).y / (delta || 0.00001);
    let x_axis_vel = (thisEuler.x - lastEuler.x) / (delta || 0.00001); // implement range

    const RANGE_SET = range > 0;

    if (!RANGE_SET) {
      lerpedQuat.copy(camera.quaternion);
    } else {
      // find angle along y axis
      dummy1.copy(lerpedQuat);
      dummy1.x = 0;
      dummy1.z = 0;
      dummy1.normalize();
      dummy2.copy(camera.quaternion);
      dummy2.x = 0;
      dummy2.z = 0;
      dummy2.normalize();
      const angle = dummy1.angleTo(dummy2); // if out of range, move it back

      if (angle > range) {
        const diff = angle - range;
        targetQuat.copy(lerpedQuat);
        targetQuat.rotateTowards(camera.quaternion, diff);

        if (!pinY) {
          targetQuat.x = 0;
          targetQuat.z = 0;
          targetQuat.normalize();
        }
      } else {
        // disable offsets if moving camera within range
        x_axis_vel = 0;
        y_axis_vel = 0;
      }

      qs.criticallyStep(lerpedQuat, targetQuat, delta);
    } // bob a bit based on player velocity


    const vel_len = velocity.get().length() > 1 ? 1 : 0;
    const strength = bobStrength || Math.max(lerpedPos.length(), 0.05);
    x_axis_vel += Math.sin(clock.elapsedTime * 15) * vel_len * 0.2 * strength;
    y_axis_vel += Math.cos(clock.elapsedTime * 20 + 12) * vel_len * 0.1 * strength; // set spring targets based on velocities

    const scale_ang = 0.1;
    const max_ang = 0.3;
    const x_off = MathUtils.clamp(-y_axis_vel * scale_ang, -max_ang, max_ang);
    const y_off = MathUtils.clamp(-x_axis_vel * scale_ang, -max_ang, max_ang);
    set({
      offset: [x_off, y_off]
    }); // range dependent, move items to camera quat

    group.current.position.applyQuaternion(lerpedQuat); // needed so that children positions are applied in screen space
    // should probably be moved to draggable .. ? idk, maybe the supposition is that children of hud are in screen space

    group.current.quaternion.copy(camera.quaternion); // update last values

    lastQuat.copy(camera.quaternion);
    lastEuler.setFromQuaternion(camera.quaternion);
  });
  return /*#__PURE__*/React.createElement("group", {
    name: "spacesvr-hud",
    ref: group
  }, children);
}

function Draggable(props) {
  const {
    set,
    distance,
    enabled,
    children
  } = props;
  const toolbelt = useToolbelt();
  const {
    size,
    gl
  } = useThree();
  const {
    device
  } = useEnvironment();
  const {
    raycaster
  } = usePlayer();
  const group = useRef(null);
  const DOWN_SWIPE_DIST = size.height * 0.28;
  const SIDE_SWIPE_DIST = size.width * 0.3;
  const valid = useRef(false);
  useDrag({
    onStart: _ref => {
      let {
        e
      } = _ref;
      valid.current = false;
      if (!group.current || !device.mobile || !enabled) return;
      const intersections = raycaster.intersectObject(group.current, true);

      if (intersections.length > 0) {
        valid.current = true;
        e.stopPropagation();
      }
    },
    onMove: _ref2 => {
      let {
        delta
      } = _ref2;
      if (!valid.current) return;
      set({
        pos: [delta.x * 0.003 * distance * 0.7, -delta.y * 0.003 * distance * (delta.y < 0 ? 0.15 : 0.5), 0]
      });
    },
    onEnd: _ref3 => {
      let {
        delta
      } = _ref3;
      if (!valid.current) return;

      if (delta.y > DOWN_SWIPE_DIST) {
        toolbelt.hide();
      } else if (Math.abs(delta.x) > SIDE_SWIPE_DIST) {
        if (delta.x > 0) {
          toolbelt.next();
        } else {
          toolbelt.prev();
        }
      }

      set({
        pos: [0, 0, 0]
      });
      valid.current = false;
    }
  }, gl.domElement, [device.mobile, enabled, toolbelt.hide, toolbelt.next, toolbelt.prev]);
  return /*#__PURE__*/React.createElement("group", {
    ref: group
  }, children);
}

/**
 * The logic to show a tool on screen and move it depending on the active tool
 */
function OnScreen(props) {
  const {
    distance,
    name,
    pos,
    disableDraggable,
    children
  } = props;
  const toolbelt = useToolbelt();
  const camera = useThree(state => state.camera);
  const TOOL = toolbelt.tools.find(t => t.name == name);
  const TOOL_INDEX = TOOL ? toolbelt.tools.indexOf(TOOL) : undefined;
  const ENABLED = toolbelt.activeIndex === TOOL_INDEX;
  const [spring, set] = useSpring(() => ({
    pos: [0, 0, 0],
    config: {
      mass: 4,
      friction: 90,
      tension: 800
    }
  })); // animate position on tool switches

  const lastActiveIndex = useRef();
  useEffect(() => {
    if (lastActiveIndex.current === toolbelt.activeIndex) return;
    lastActiveIndex.current = toolbelt.activeIndex;
    if (TOOL_INDEX === undefined) return;
    const _cam = camera;
    const AMT = 1.5;

    if (ENABLED) {
      // show it
      if (toolbelt.direction !== "up") {
        // unless the tool was hidden as will fly in bottom to top,
        const {
          x: leftX
        } = getHudPos([-AMT, 0], _cam, distance);
        const {
          x: rightX
        } = getHudPos([AMT, 0], _cam, distance);
        const {
          x
        } = getHudPos(pos, _cam, distance);
        const swipeInX = toolbelt.direction === "left" ? rightX - x : leftX + x;
        spring.pos.update({
          immediate: true
        });
        set({
          pos: [swipeInX, 0, distance]
        });
        spring.pos.finish();
        spring.pos.update({
          immediate: false
        });
      }

      set({
        pos: [0, 0, 0]
      });
    } else {
      // swipe it away
      const {
        x: leftX
      } = getHudPos([-AMT, 0], _cam, distance * 2);
      const {
        x: rightX
      } = getHudPos([AMT, 0], _cam, distance * 2);
      const {
        x
      } = getHudPos(pos, _cam, distance);
      const swipeOutX = (toolbelt.direction === "left" ? leftX : rightX) - x;
      set({
        pos: [swipeOutX, 0, 0]
      });
    }
  }, [ENABLED, TOOL_INDEX, camera, distance, pos, set, spring.pos, toolbelt.activeIndex, toolbelt.activeTool, toolbelt.direction]);
  return /*#__PURE__*/React.createElement(animated.group, {
    position: spring.pos,
    name: "onscreen"
  }, /*#__PURE__*/React.createElement(Draggable, {
    set: set,
    distance: distance,
    enabled: ENABLED && !disableDraggable
  }, children));
}

function FacePlayer(props) {
  const {
    children,
    enabled = true,
    lockX = false,
    lockY = false,
    lockZ = false
  } = props;
  const group = useRef(null);
  const [prev] = useState(new Euler());
  useLimitedFrame(50, _ref => {
    let {
      camera
    } = _ref;
    if (!group.current) return;

    if (!enabled) {
      group.current.rotation.set(0, 0, 0);
    } else {
      prev.copy(group.current.rotation);
      group.current.lookAt(camera.position);
      if (lockX) group.current.rotation.x = prev.x;
      if (lockY) group.current.rotation.y = prev.y;
      if (lockZ) group.current.rotation.z = prev.z;
    }
  });
  return /*#__PURE__*/React.createElement("group", {
    name: "spacesvr-faceplayer",
    ref: group
  }, children);
}

// if the children suspense, this will call set done once suspense is resolved
function LifecycleDetector(props) {
  const {
    didMount,
    setMounted
  } = props;
  didMount.current = true;
  useEffect(() => {
    return () => {
      setMounted(true);
    };
  }, []);
  return null;
}

// adapted from https://github.com/pmndrs/drei/blob/master/src/core/Preload.tsx
function ToolPreload(props) {
  const {
    setPreloadDone,
    children
  } = props;
  const gl = useThree(_ref => {
    let {
      gl
    } = _ref;
    return gl;
  });
  const camera = useThree(_ref2 => {
    let {
      camera
    } = _ref2;
    return camera;
  });
  const {
    hudScene
  } = useToolbelt();
  const didMount = useRef(false);
  const [firstRender, setFirstRender] = useState(true);
  const [mounted, setMounted] = useState(false); // if the children don't suspense, the second render will detect that and mark it as finished

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }

    if (!didMount.current) {
      // mounted with no suspense trigger, so UnloadComponent will never be called
      setMounted(true);
    }
  }, [firstRender]); // Layout effect because it must run before React commits

  useLayoutEffect(() => {
    if (!mounted) return; // compile the scene, then hit it with a cube camera

    gl.compile(hudScene, camera);
    const cubeRenderTarget = new WebGLCubeRenderTarget(128);
    const cubeCamera = new CubeCamera(0.01, 100000, cubeRenderTarget);
    cubeCamera.update(gl, hudScene);
    cubeRenderTarget.dispose();
    setPreloadDone(true);
  }, [camera, gl, hudScene, mounted, setPreloadDone]);
  return createPortal$1( /*#__PURE__*/React.createElement("group", {
    name: "tool-preload"
  }, /*#__PURE__*/React.createElement(Suspense, {
    fallback: /*#__PURE__*/React.createElement(LifecycleDetector, {
      didMount: didMount,
      setMounted: setMounted
    })
  }, children)), hudScene);
}

/**
 * Tool modifier will place its children in constant view of the camera
 *
 * pos will determine relative placement on [x, y] axis
 * face will make item face the player (defaults to true)
 *
 * @param props
 * @constructor
 */
function Tool(props) {
  const {
    children,
    name,
    icon,
    pos = [0, 0],
    face = true,
    pinY = false,
    range,
    bobStrength,
    orderIndex,
    disableDraggable = false,
    onSwitch
  } = props;
  const {
    grant,
    revoke,
    activeTool,
    hudScene
  } = useToolbelt();
  const ENABLED = (activeTool == null ? void 0 : activeTool.name) === name;
  const DISTANCE = 1;
  const [preloadDone, setPreloadDone] = useState(false);
  const {
    prog
  } = useSpring({
    prog: ENABLED ? 1 : 0,
    config: {
      mass: 4,
      friction: 90,
      tension: 800
    }
  });
  const visible = useVisible(prog);
  useEffect(() => {
    grant(name, icon, orderIndex);
    return () => revoke(name);
  }, [name, icon, grant, revoke, orderIndex]);
  useEffect(() => {
    if (onSwitch) onSwitch((activeTool == null ? void 0 : activeTool.name) === name);
  }, [activeTool, onSwitch, name]);

  if (!preloadDone) {
    return /*#__PURE__*/React.createElement(ToolPreload, {
      setPreloadDone: setPreloadDone
    }, children);
  }

  if (!visible) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, createPortal$1( /*#__PURE__*/React.createElement("group", {
    name: `tool-${name}`
  }, /*#__PURE__*/React.createElement(HUD, {
    pos: pos,
    pinY: pinY,
    distance: DISTANCE,
    range: range,
    bobStrength: bobStrength
  }, /*#__PURE__*/React.createElement(OnScreen, {
    distance: DISTANCE,
    name: name,
    pos: pos,
    disableDraggable: disableDraggable
  }, /*#__PURE__*/React.createElement(FacePlayer, {
    enabled: face
  }, /*#__PURE__*/React.createElement(Suspense, {
    fallback: null
  }, visible && children))))), hudScene));
}

function Anchor(props) {
  const {
    href,
    target = "_self",
    children,
    ...rest
  } = props;
  const gl = useThree(st => st.gl);

  const onClick = () => {
    if (gl.xr.isPresenting) {
      var _gl$xr$getSession;

      (_gl$xr$getSession = gl.xr.getSession()) == null ? void 0 : _gl$xr$getSession.end();
    }

    window.open(href, target);
  };

  return /*#__PURE__*/React.createElement("group", _extends({
    name: `spacesvr-anchor-${href}`
  }, rest), /*#__PURE__*/React.createElement(Interactable, {
    onClick: onClick
  }, children));
}

function Floating(props) {
  const {
    children,
    height = 0.2,
    speed = 1
  } = props;
  const group = useRef(null);
  const seed = useRef(Math.random());
  useLimitedFrame(75, _ref => {
    let {
      clock
    } = _ref;
    if (!group.current) return;
    group.current.position.y = height * Math.sin(clock.elapsedTime * speed * 0.4 + seed.current * 10000);
  });
  return /*#__PURE__*/React.createElement("group", {
    name: "spacesvr-floating",
    ref: group
  }, children);
}

function Spinning(props) {
  const {
    children,
    xSpeed = 0,
    ySpeed = 1,
    zSpeed = 0
  } = props;
  const group = useRef(null);
  const [seed] = useState(Math.random());
  useLimitedFrame(75, _ref => {
    let {
      clock
    } = _ref;
    if (!group.current) return;
    group.current.rotation.x = clock.elapsedTime * xSpeed * 0.25 + xSpeed * seed * 100;
    group.current.rotation.y = clock.elapsedTime * ySpeed * (0.25 + seed / 10) + ySpeed * seed * 1000;
    group.current.rotation.z = clock.elapsedTime * zSpeed * 0.25 + zSpeed * seed * 40;
  });
  return /*#__PURE__*/React.createElement("group", {
    name: "spacesvr-spinning",
    ref: group
  }, children);
}

/**
 *  Lots of code copied from https://github.com/pmndrs/drei/blob/master/src/core/Effects.tsx
 */
function Effects(props) {
  const {
    children
  } = props;
  useMemo(() => extend({
    EffectComposer,
    RenderPass,
    ShaderPass
  }), []);
  const composer = useRef(null);
  const {
    scene,
    camera,
    gl,
    size,
    viewport
  } = useThree();
  const [target] = useState(() => {
    const t = new WebGLRenderTarget(size.width, size.height, {
      type: UnsignedByteType,
      format: RGBAFormat,
      encoding: gl.outputEncoding,
      depthBuffer: true,
      stencilBuffer: true,
      anisotropy: 2
    });
    t.samples = 4;
    return t;
  });
  useEffect(() => {
    var _composer$current, _composer$current2;

    (_composer$current = composer.current) == null ? void 0 : _composer$current.setSize(size.width, size.height);
    (_composer$current2 = composer.current) == null ? void 0 : _composer$current2.setPixelRatio(viewport.dpr);
  }, [gl, size, viewport.dpr]);
  useFrame(() => {
    var _composer$current3;

    if (!composer.current) return; // remove undefined passes

    composer.current.passes = composer.current.passes.filter(pass => pass !== undefined);
    (_composer$current3 = composer.current) == null ? void 0 : _composer$current3.render();
  }, 1); // build passes array

  const passes = [];
  passes.push( /*#__PURE__*/React.createElement("renderPass", {
    key: "renderpass",
    attach: `passes-${passes.length}`,
    args: [scene, camera]
  }));
  Children.forEach(children, el => {
    el && passes.push( /*#__PURE__*/cloneElement(el, {
      key: passes.length,
      attach: `passes-${passes.length}`
    }));
  });
  return /*#__PURE__*/React.createElement("effectComposer", {
    ref: composer,
    args: [gl, target]
  }, passes);
}

const VisualContext = /*#__PURE__*/createContext({});
const useVisual = () => useContext(VisualContext);
function Visual(props) {
  const {
    children
  } = props;
  const {
    scene,
    camera,
    gl
  } = useThree();
  const {
    device
  } = useEnvironment();
  const childPasses = useRef([]);
  const rerender = useRerender();
  const registerPass = useCallback(p => {
    childPasses.current.push(p);
    childPasses.current.sort((a, b) => a.index - b.index);
    rerender();
  }, []);
  const unregisterPass = useCallback(uuid => {
    childPasses.current = childPasses.current.filter(p => p.uuid !== uuid);
    rerender();
  }, []);
  const USE_EFFECTS = childPasses.current.length > 0 && !device.xr;
  useFrame(() => {
    if (USE_EFFECTS) return;
    gl.autoClear = true;
    gl.render(scene, camera);
  }, 1);
  return /*#__PURE__*/React.createElement(VisualContext.Provider, {
    value: {
      registerPass,
      unregisterPass
    }
  }, USE_EFFECTS && /*#__PURE__*/React.createElement(Effects, null, childPasses.current.map(p => p.node)), children);
}

function VisualEffect(props) {
  const {
    index,
    children
  } = props;
  const [uuid] = useState(() => Math.random().toString(36).substring(2));
  const {
    registerPass,
    unregisterPass
  } = useVisual();
  useEffect(() => {
    if (!children) return;

    if (!Array.isArray(children)) {
      registerPass({
        uuid,
        node: children,
        index
      });
    } else {
      children.forEach((child, i) => {
        registerPass({
          uuid,
          node: child,
          index: i
        });
      });
    }

    return () => unregisterPass(uuid);
  }, [children, index, registerPass, unregisterPass, uuid]);
  return null;
}

const HitBox = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    args,
    visible = false,
    color = "red",
    onClick,
    onHover,
    onUnHover,
    raycaster,
    ...rest
  } = props;
  return /*#__PURE__*/React.createElement(Interactable, {
    onClick: onClick,
    onHover: onHover,
    onUnHover: onUnHover,
    raycaster: raycaster
  }, /*#__PURE__*/React.createElement("mesh", _extends({
    visible: visible,
    name: "spacesvr-hitbox",
    ref: ref
  }, rest), /*#__PURE__*/React.createElement("boxGeometry", {
    args: args
  }), visible && /*#__PURE__*/React.createElement("meshBasicMaterial", {
    color: color,
    transparent: true,
    opacity: 0.7
  })));
});

const local_cache = [];
function RoundedBox(props) {
  const {
    args: [width = 1, height = 1, depth = 0.25] = [],
    material,
    children,
    ...rest
  } = props;
  const [locScale, setLocScale] = useState(new Vector3(1, 1, 1));
  const geo = useMemo(() => {
    var _closestBox, _closestBox2, _closestBox3, _closestBox4;

    const tolerance = 0.25; // 25% tolerance

    let closestBox = undefined;
    let closestOffset = Infinity;

    for (const box of local_cache) {
      const scale = box.width / width;
      const heightDiff = Math.abs(box.height - height * scale);
      const depthDiff = Math.abs(box.depth - depth * scale);

      if (heightDiff / box.height < tolerance && depthDiff / box.depth < tolerance && heightDiff + depthDiff < closestOffset) {
        closestBox = box;
        closestOffset = heightDiff + depthDiff;
      }
    }

    const key = ((_closestBox = closestBox) == null ? void 0 : _closestBox.key) ?? `geo_rounded_box_${width}x${height}x${depth}`;
    const w = ((_closestBox2 = closestBox) == null ? void 0 : _closestBox2.width) ?? width;
    const h = ((_closestBox3 = closestBox) == null ? void 0 : _closestBox3.height) ?? height;
    const d = ((_closestBox4 = closestBox) == null ? void 0 : _closestBox4.depth) ?? depth;
    const r = Math.min(w, h, d) / 2;

    const get_geo = () => cache.getResource(key, () => new RoundedBoxGeometry(width, height, depth, 4, r)); // make sure to cache result if it's not already cached


    if (!closestBox) local_cache.push({
      key,
      width,
      height,
      depth
    });
    setLocScale(new Vector3(width / w, height / h, depth / d));
    return get_geo();
  }, [width, height, depth]);
  return /*#__PURE__*/React.createElement("group", _extends({
    name: "spacesvr-rounded-box"
  }, rest), /*#__PURE__*/React.createElement("mesh", {
    scale: locScale,
    material: material,
    geometry: geo
  }, children));
}

const useIdeaMaterial = (idea, radius) => {
  const hex = useMemo(() => (idea == null ? void 0 : idea.getHex()) || "#808080", [idea]);
  const seed = useMemo(() => Math.random(), []);
  const color = useMemo(() => new Color(hex), [hex]);
  const {
    col
  } = useSpring({
    col: hex
  });
  const NOISE_AMPLITUDE = radius * 0.32;
  const NOISE_FREQ = 0.554 / radius;
  const mat = useMemo(() => {
    const material = new MeshStandardMaterial({
      metalness: 0.18,
      roughness: 0.49,
      envMapIntensity: 0.66,
      side: DoubleSide
    });

    material.onBeforeCompile = function (shader) {
      shader.uniforms.radius = new Uniform(radius);
      shader.uniforms.time = new Uniform(0);
      shader.uniforms.color = new Uniform(color);
      shader.uniforms.radiusVariationAmplitude = new Uniform(NOISE_AMPLITUDE);
      shader.uniforms.radiusNoiseFrequency = new Uniform(NOISE_FREQ);
      const uniforms = `
        uniform float radius;
        uniform float time;
        uniform vec3 color;
        uniform float radiusVariationAmplitude;
        uniform float radiusNoiseFrequency;
      `;
      shader.vertexShader = uniforms + vertHead + shader.vertexShader.replace("#include <begin_vertex>", vert$1);
      shader.fragmentShader = uniforms + shader.fragmentShader.replace("#include <dithering_fragment>", frag$1);
      material.userData.shader = shader;
    };

    return material;
  }, [radius, color, NOISE_AMPLITUDE, NOISE_FREQ, frag$1, vert$1]);
  useLimitedFrame(50, _ref => {
    var _mat$userData;

    let {
      clock
    } = _ref;
    if (!(mat != null && (_mat$userData = mat.userData) != null && _mat$userData.shader)) return;
    mat.userData.shader.uniforms.time.value = clock.elapsedTime / 6 + seed * 100;
    mat.userData.shader.uniforms.color.value.set(col.get());
  });
  return mat;
};
const vertHead = `
    // Description : Array and textureless GLSL 2D/3D/4D simplex
    //               noise functions.
    //      Author : Ian McEwan, Ashima Arts.
    //  Maintainer : ijm
    //     Lastmod : 20110822 (ijm)
    //     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
    //               Distributed under the MIT License. See LICENSE file.
    //               https://github.com/ashima/webgl-noise
    //
    
    vec3 mod289(vec3 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec4 mod289(vec4 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec4 permute(vec4 x) {
         return mod289(((x*34.0)+1.0)*x);
    }
    
    vec4 taylorInvSqrt(vec4 r)
    {
      return 1.79284291400159 - 0.85373472095314 * r;
    }
    
    float snoise(vec3 v)
      {
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    
    // First corner
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 =   v - i + dot(i, C.xxx) ;
    
    // Other corners
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
    
      //   x0 = x0 - 0.0 + 0.0 * C.xxx;
      //   x1 = x0 - i1  + 1.0 * C.xxx;
      //   x2 = x0 - i2  + 2.0 * C.xxx;
      //   x3 = x0 - 1.0 + 3.0 * C.xxx;
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
      vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
    
    // Permutations
      i = mod289(i);
      vec4 p = permute( permute( permute(
                 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
               + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    
    // Gradients: 7x7 points over a square, mapped onto an octahedron.
    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
      float n_ = 0.142857142857; // 1.0/7.0
      vec3  ns = n_ * D.wyz - D.xzx;
    
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)
    
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
    
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
    
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
    
      //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
      //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
    
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
    
    //Normalise gradients
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
    
    // Mix final noise value
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                    dot(p2,x2), dot(p3,x3) ) );
      }
              
    
    float fsnoise(float val1, float val2, float val3){
      return snoise(vec3(val1,val2,val3));
    }
    
    vec3 distortFunct(vec3 transformed, float factor) {
      float radiusVariation = -fsnoise(
        transformed.x * radiusNoiseFrequency + time,
        transformed.y * radiusNoiseFrequency + time,
        transformed.z * radiusNoiseFrequency + time 
      ) * radiusVariationAmplitude * factor;
      return normalize(transformed) * (radiusVariation + radius);
    }
    
    vec3 orthogonal(vec3 v) {
      return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)
      : vec3(0.0, -v.z, v.y));
    }
    
    vec3 distortNormal(vec3 position, vec3 distortedPosition, vec3 normal){
      vec3 tangent1 = orthogonal(normal);
      vec3 tangent2 = normalize(cross(normal, tangent1));
      vec3 nearby1 = position + tangent1 * 0.1;
      vec3 nearby2 = position + tangent2 * 0.1;
      vec3 distorted1 = distortFunct(nearby1, 1.0);
      vec3 distorted2 = distortFunct(nearby2, 1.0);
      return normalize(cross(distorted1 - distortedPosition, distorted2 - distortedPosition));
    }
`;
const vert$1 = `
    #include <begin_vertex>
    float updateTime = time / 10.0;
    transformed = distortFunct(transformed, 1.0);
    vec3 distortedNormal = distortNormal(position, transformed, normal);
    vNormal = normal + distortedNormal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed,1.);
`;
const frag$1 = `
    #include <dithering_fragment>
    float angle = clamp(dot(normalize(vNormal), vec3(0., -1., 0.)), 0., 1.);
    gl_FragColor = vec4(gl_FragColor.rgb * color, gl_FragColor.a);  
    gl_FragColor.rgb = mix(gl_FragColor.rgb, mix(color, vec3(0.), 0.5), angle);
`;

function Bubbles(props) {
  const {
    numStops,
    enabled,
    offset
  } = props;
  const group = useRef(null);
  const mesh = useRef(null);
  const clock = useThree(st => st.clock);
  const [pos] = useState(new Vector3());
  const [obj] = useState(new Object3D());
  const startTime = useRef(0);
  useEffect(() => {
    startTime.current = clock.elapsedTime;
  }, [enabled]);
  useLimitedFrame(40, _ref => {
    let {
      clock
    } = _ref;
    if (!mesh.current || !group.current) return;
    group.current.updateMatrix();
    group.current.matrix.decompose(pos, obj.quaternion, obj.scale);

    for (let i = 0; i < numStops; i++) {
      const perc = i / (numStops - 1);
      obj.position.set(perc * pos.x, perc * pos.y, perc * pos.z);
      const sc = 0.8 + perc * 4;
      const delay = 60 / 1000;
      const time = 400 / 1000;
      const delta = clock.elapsedTime - startTime.current;
      const iter = enabled ? i : numStops - i - 1;
      const x = MathUtils.clamp((delta - iter * delay) / time, 0, 1);
      let val = (Math.cos(Math.PI * x) + 1) / 2;
      if (enabled) val = 1 - val;
      obj.scale.setScalar(sc * 0.2 * val);
      obj.updateMatrix();
      mesh.current.setMatrixAt(i, obj.matrix);
    }

    mesh.current.instanceMatrix.needsUpdate = true;
  });
  const geo = useMemo(() => new SphereGeometry(0.05, 32, 16), []);
  const mat = useIdeaMaterial(undefined, 0.05);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("group", {
    position: offset,
    ref: group
  }), /*#__PURE__*/React.createElement("instancedMesh", {
    args: [geo, mat, numStops],
    ref: mesh
  }));
}

/**
 * helper function to detect when text needs to be synced based on arbitrary values
 *
 * @param text
 * @param property
 * @param val
 */
const syncOnChange = (text, property, val) => {
  if (text._needsSync) return;
  if (!text.userData) text.userData = {};

  if (text.userData[property] !== val) {
    text.userData[property] = val;
    text._needsSync = true;
  }
};

/**
 * Given an input, handle logic for shift clicking to select text
 * @param input
 * @param newIndex
 */
const handleShiftSelect = (input, newIndex) => {
  const HAS_SELECTION = input.selectionStart !== input.selectionEnd;

  if (!HAS_SELECTION) {
    if (newIndex < (input.selectionStart || 0)) {
      input.setSelectionRange(newIndex, input.selectionStart || 0, "backward");
    } else {
      input.setSelectionRange(input.selectionStart || 0, newIndex, "forward");
    }

    return;
  } // shift clicking to select text


  const isForward = input.selectionDirection === "forward";
  const start = input.selectionStart || 0;
  const end = input.selectionEnd || 0;

  if (isForward) {
    if (start === newIndex) {
      input.setSelectionRange(start, newIndex, "none");
    } else if (newIndex > start) {
      input.setSelectionRange(start, newIndex, "forward");
    } else {
      input.setSelectionRange(newIndex, start, "backward");
    }
  } else {
    if (end === newIndex) {
      input.setSelectionRange(newIndex, end, "none");
    } else if (newIndex < end) {
      input.setSelectionRange(newIndex, end, "backward");
    } else {
      input.setSelectionRange(end, newIndex, "forward");
    }
  }
};
const dummy = new Vector2();

/**
 * Return the caret position of the last click
 * @param text
 * @param raycaster
 */
const getClickedCaret = (text, raycaster) => {
  const intersections = raycaster.intersectObject(text, true);
  if (intersections.length === 0) return null;
  const inter = intersections[0];
  const textPos = text.worldPositionToTextCoords(inter.point, dummy);
  return getCaretAtPoint(text.textRenderInfo, textPos.x, textPos.y);
};
const CLICK_TIMEOUT = 0.2; // seconds

/**
 * Calling this indicates a click. Return whether it was a single, double, or triple click
 * @param clock
 * @param lastClickTime
 * @param lastDoubleClickTime
 */

const getClickType = (clock, lastClickTime, lastDoubleClickTime) => {
  const time = clock.elapsedTime;
  const clickTime = time - lastClickTime.current;
  const doubleClickTime = time - lastDoubleClickTime.current;

  if (clickTime < CLICK_TIMEOUT) {
    if (doubleClickTime < CLICK_TIMEOUT * 2) {
      lastDoubleClickTime.current = time;
      return 3;
    } else {
      lastClickTime.current = time;
      lastDoubleClickTime.current = time;
      return 2;
    }
  } else {
    lastClickTime.current = time;
    return 1;
  }
};
/**
 * Return the start and end indexes of the word that the caret is in
 * @param text
 * @param caret
 */

const getWordBoundsAtCaret = (text, caret) => {
  let left = caret;
  let right = caret;

  while (left > 0 && text[left - 1] !== " ") {
    left--;
  }

  while (right < text.length && text[right] !== " ") {
    right++;
  }

  return [left, right];
};

const RESET_TIMEOUT = 1; // seconds, amount of time to wait after reset before continuing to blink

/**
 * Manages the blinking of a caret.
 * @param rate
 */
const useCaretBlink = function (rate) {
  if (rate === void 0) {
    rate = 1;
  }

  const blinkRef = useRef(null);
  const clock = useThree(st => st.clock);
  const startTime = useRef(0);
  useFrame(_ref => {
    let {
      clock
    } = _ref;
    if (!blinkRef.current) return;
    const diff = clock.elapsedTime - startTime.current;

    if (diff < RESET_TIMEOUT) {
      blinkRef.current.visible = true;
    } else {
      // formula below makes sure that after exactly RESET_TIMEOUT, blinking starts with "off"
      blinkRef.current.visible = Boolean(Math.round((-Math.sin(rate * Math.PI * 2 * (diff - RESET_TIMEOUT)) + 1) / 2));
    }
  });

  const reset = () => {
    startTime.current = clock.elapsedTime;
  };

  return {
    blinkRef,
    reset
  };
};

const useDragSelect = (input, text, raycaster, focusInput) => {
  const gl = useThree(state => state.gl);
  const mouse = useThree(state => state.mouse);
  const camera = useThree(state => state.camera);
  const {
    device
  } = useEnvironment();
  const startCar = useRef(0);
  const dragging = useRef(false);
  useEffect(() => {
    const _text = text.current;
    if (!_text || !_text.textRenderInfo) return;

    const handleMove = () => {
      const car = getClickedCaret(_text, raycaster);
      if (car == null) return;

      if (!dragging.current) {
        // consider it a drag when mouse moves by at least 1 character
        if (car.charIndex === startCar.current) return;
        dragging.current = true;
        input.setSelectionRange(startCar.current, startCar.current);
      }

      handleShiftSelect(input, car.charIndex);
    };

    const touchMove = e => {
      // because we stop propagation, we need to manually set the mouse position
      mouse.x = e.touches[0].clientX / gl.domElement.clientWidth * 2 - 1;
      mouse.y = -(e.touches[0].clientY / gl.domElement.clientHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      handleMove();
    };

    const dragEnd = () => {
      if (device.mobile) {
        gl.domElement.removeEventListener("touchmove", touchMove);
        gl.domElement.removeEventListener("touchend", dragEnd);
      } else {
        gl.domElement.removeEventListener("mousemove", handleMove);
        gl.domElement.removeEventListener("mouseup", dragEnd);
      }
    };

    const dragStart = e => {
      dragging.current = false;
      const car = getClickedCaret(_text, raycaster);
      if (car === null) return;
      focusInput();
      e.stopPropagation(); // stop touch controls from running so screen doesn't move while dragging

      startCar.current = car.charIndex;

      if (device.mobile) {
        gl.domElement.addEventListener("touchmove", touchMove);
        gl.domElement.addEventListener("touchend", dragEnd);
      } else {
        gl.domElement.addEventListener("mousemove", handleMove);
        gl.domElement.addEventListener("mouseup", dragEnd);
      }
    };

    if (device.mobile) {
      gl.domElement.addEventListener("touchstart", dragStart);
      return () => gl.domElement.removeEventListener("touchstart", dragStart);
    } else {
      gl.domElement.addEventListener("mousedown", dragStart);
      return () => gl.domElement.removeEventListener("mousedown", dragStart);
    }
  }, [gl.domElement, focusInput, input, text, device.mobile, mouse, camera, raycaster]);
};

function TextInput(props) {
  const {
    value,
    onChange,
    onSubmit,
    onFocus,
    onBlur,
    type = "text",
    font = "https://d27rt3a60hh1lx.cloudfront.net/fonts/Quicksand_Bold.otf",
    fontSize = 0.1,
    width = 1,
    placeholder,
    raycaster: passedRaycaster,
    ...rest
  } = props;
  const clock = useThree(st => st.clock);
  const camera = useThree(st => st.camera);
  const player = usePlayer();
  const {
    device
  } = useEnvironment();
  const RAYCASTER = passedRaycaster || player.raycaster;
  const group = useRef(null);
  const textRef = useRef();
  const caret = useRef(null);
  const highlight = useRef(null);
  const [localValue, setLocalValue] = useState("");
  const val = value ?? localValue;

  const setVal = s => {
    if (onChange) onChange(s);
    setLocalValue(s);
  };

  const {
    input,
    focused,
    focusInput
  } = useTextInput(type, val, setVal); // focus callback

  useEffect(() => {
    if (!onFocus) return;
    input.addEventListener("focus", onFocus);
    return () => input.removeEventListener("focus", onFocus);
  }, [input, onFocus]); // blur callback

  useEffect(() => {
    if (!onBlur) return;
    input.addEventListener("blur", onBlur);
    return () => input.removeEventListener("blur", onBlur);
  }, [input, onBlur]); // look at input when focused, only on mobile

  useEffect(() => {
    if (!group.current || !focused || !device.mobile) return;
    const worldpos = group.current.getWorldPosition(new Vector3());
    camera.lookAt(worldpos);
  }, [focused, camera, device]);
  const {
    color
  } = useSpring({
    color: focused ? "#000" : "#828282"
  });
  const highlightMat = cache.useResource("spacesvr_textinput_highlight", () => new MeshStandardMaterial({
    color: "blue",
    transparent: true,
    opacity: 0.3,
    depthWrite: false
  }));
  const BORDER = fontSize * 0.1;
  const PADDING_X = fontSize * 0.5;
  const INNER_WIDTH = width - PADDING_X * 2;
  const INPUT_HEIGHT = fontSize * 1.75;
  const INPUT_WIDTH = width;
  const OUTER_HEIGHT = INPUT_HEIGHT + BORDER;
  const OUTER_WIDTH = width + BORDER * 2;
  const DEPTH = fontSize * 0.5;
  const shift = useShiftHold();
  const lastClickTime = useRef(0);
  const lastDoubleClickTime = useRef(0);

  const registerClick = () => {
    focusInput();
    const _text = textRef.current;
    if (!_text || !_text.textRenderInfo || !input || !focused) return;
    const car = getClickedCaret(_text, RAYCASTER);

    if (car === null) {
      // clicked in empty space in the text box
      input.setSelectionRange(input.value.length, input.value.length);
    } else if (!shift.current) {
      const clickType = getClickType(clock, lastClickTime, lastDoubleClickTime);

      if (clickType === 1) {
        input.setSelectionRange(car.charIndex, car.charIndex);
      } else if (clickType === 2) {
        const wordBounds = getWordBoundsAtCaret(input.value, car.charIndex);
        input.setSelectionRange(wordBounds[0], wordBounds[1]);
      } else {
        input.setSelectionRange(0, input.value.length);
      }
    } else {
      lastClickTime.current = 0;
      lastDoubleClickTime.current = 0;
      handleShiftSelect(input, car.charIndex);
    }
  };

  useDragSelect(input, textRef, RAYCASTER, focusInput);
  useKeypress("Enter", () => {
    if (!focused || !onSubmit) return;
    onSubmit(input.value);
    input.blur();
  }, [input, focused, onSubmit]);
  const updateText = useCallback((leftOffset, width) => {
    const _text = textRef.current;
    if (!_text) return;
    if (!_text.clipRect) _text.clipRect = [0, 0, 0, 0];
    _text.clipRect[0] = leftOffset;
    _text.clipRect[1] = -Infinity;
    _text.clipRect[2] = width + leftOffset;
    _text.clipRect[3] = Infinity;
    _text.minWidth = width;
    _text.position.x = -width / 2 - leftOffset;

    _text.sync();
  }, []);
  const SHOW_PLACEHOLDER = !focused && placeholder && !input.value;
  const VAL = SHOW_PLACEHOLDER ? placeholder : type === "password" ? input.value.replace(/./g, "•") : input.value;
  const COL = SHOW_PLACEHOLDER ? "#828282" : "#000";
  const scrollLeft = useRef(0);
  const blink = useCaretBlink(0.65);

  if (textRef.current && input && caret.current && highlight.current) {
    const _text = textRef.current;
    const _caret = caret.current;
    const _highlight = highlight.current;
    _text.text = VAL;
    _text.color = COL;
    syncOnChange(_text, "focused", focused);
    syncOnChange(_text, "selectionStart", input.selectionStart);
    syncOnChange(_text, "selectionEnd", input.selectionEnd);
    syncOnChange(_text, "fontSize", fontSize);
    syncOnChange(_text, "scrollLeft", scrollLeft.current);
    syncOnChange(_text, "width", width);

    _text.sync(() => {
      blink.reset();
      const caretPositions = _text.textRenderInfo.caretPositions;
      const TEXT_SELECTED = input.selectionStart !== input.selectionEnd && focused;
      _caret.visible = false;
      _highlight.visible = false; // CASE 1: not focused

      if (!focused) {
        updateText(0, INNER_WIDTH);
      } // CASE 2: focused, maybe selected, get caret in view


      if (focused) {
        _caret.visible = true;
        const activeSel = (TEXT_SELECTED && input.selectionDirection === "forward" ? input.selectionEnd : input.selectionStart) || 0; // get it all the way to the left

        _caret.position.x = -INNER_WIDTH / 2 - scrollLeft.current; // calculate char indexes and x positions

        const lastIndex = caretPositions.length - 2;
        const activeIndex = Math.min(activeSel * 3, input.value.length * 3 - 2);
        const lastCaretX = caretPositions[lastIndex];
        const activeCaretX = activeSel == 0 ? 0 : caretPositions[activeIndex] || lastCaretX; // fallback for fast typing
        // move it to the active character

        if (activeCaretX !== undefined) {
          _caret.position.x += activeCaretX;
        } // scroll to keep caret in view if it goes too far right


        if (_caret.position.x > INNER_WIDTH / 2) {
          if (activeSel === input.value.length) {
            // scroll one char right
            scrollLeft.current += _caret.position.x - INNER_WIDTH / 2;
            _caret.position.x = INNER_WIDTH / 2;
          } else {
            // center caret
            scrollLeft.current += _caret.position.x;
            _caret.position.x -= _caret.position.x;
          }
        } // scroll to keep caret in view if it goes too far left


        if (_caret.position.x < -INNER_WIDTH / 2) {
          scrollLeft.current += _caret.position.x;
          _caret.position.x = 0;
        } // right adjust


        const lastCharOffset = INNER_WIDTH - lastCaretX + scrollLeft.current;

        if (lastCharOffset > 0 && scrollLeft.current > 0) {
          _caret.position.x += lastCharOffset;
          scrollLeft.current -= lastCharOffset;
        } // left adjust


        if (scrollLeft.current < 0) {
          _caret.position.x += scrollLeft.current;
          scrollLeft.current = 0;
        }

        updateText(scrollLeft.current, INNER_WIDTH);
      } // CASE 3: focused and selected, show highlight


      if (TEXT_SELECTED) {
        _highlight.visible = true;
        _caret.visible = false;
        const finalCharIndex = input.value.length * 3 - 2;
        const startIndex = Math.min((input.selectionStart || 0) * 3, finalCharIndex);
        const startX = caretPositions[startIndex];
        const endIndex = Math.min((input.selectionEnd || 0) * 3, finalCharIndex);
        const endX = caretPositions[endIndex];

        if (startX !== undefined && endX !== undefined) {
          const highWidth = endX - startX;
          _highlight.position.x = -INNER_WIDTH / 2 + startX - scrollLeft.current + highWidth / 2;
          _highlight.scale.x = highWidth;
          const leftEdge = _highlight.position.x - _highlight.scale.x / 2;

          if (leftEdge < -INNER_WIDTH / 2) {
            const diff = -INNER_WIDTH / 2 - leftEdge;
            _highlight.position.x += diff / 2;
            _highlight.scale.x -= diff;
          }

          const rightEdge = _highlight.position.x + _highlight.scale.x / 2;

          if (rightEdge > INNER_WIDTH / 2) {
            const diff = rightEdge - INNER_WIDTH / 2;
            _highlight.position.x -= diff / 2;
            _highlight.scale.x -= diff;
          }
        }
      }
    });
  } // scroll the input if user is dragging a selection to the left or right


  const SCROLL_BUFFER = fontSize;
  const MOVE_SPEED = fontSize * 0.25;
  useLimitedFrame(1, () => {
    const _text = textRef.current;
    const _caret = caret.current;
    const TEXT_SELECTED = input.selectionStart !== input.selectionEnd && focused;
    if (!_text || !_caret || !TEXT_SELECTED) return; // scroll to the right

    if (_caret.position.x > INNER_WIDTH / 2 - SCROLL_BUFFER) {
      scrollLeft.current += MOVE_SPEED;
    } // scroll to the left


    if (_caret.position.x < -INNER_WIDTH / 2 + SCROLL_BUFFER) {
      scrollLeft.current -= MOVE_SPEED;
    }
  });
  return /*#__PURE__*/React.createElement("group", _extends({
    name: "spacesvr-text-input"
  }, rest, {
    ref: group
  }), /*#__PURE__*/React.createElement("group", {
    name: "content",
    "position-z": DEPTH / 2 + 0.001
  }, /*#__PURE__*/React.createElement(Suspense, {
    fallback: null
  }, /*#__PURE__*/React.createElement(Text$2, {
    name: "text",
    ref: textRef,
    color: COL,
    anchorX: "left",
    fontSize: fontSize,
    font: font,
    maxWidth: INNER_WIDTH,
    "position-x": -INNER_WIDTH / 2 // @ts-ignore
    ,
    whiteSpace: "nowrap",
    renderOrder: 2
  }, VAL)), /*#__PURE__*/React.createElement("group", {
    name: "blink",
    ref: blink.blinkRef
  }, /*#__PURE__*/React.createElement("mesh", {
    name: "caret",
    ref: caret,
    visible: false,
    material: cache.mat_basic_black
  }, /*#__PURE__*/React.createElement("planeGeometry", {
    args: [0.075 * fontSize, fontSize]
  }))), /*#__PURE__*/React.createElement("mesh", {
    name: "highlight",
    ref: highlight,
    visible: false,
    material: highlightMat
  }, /*#__PURE__*/React.createElement("boxGeometry", {
    args: [1, fontSize, DEPTH * 0.45]
  }))), /*#__PURE__*/React.createElement(HitBox, {
    args: [INPUT_WIDTH, INPUT_HEIGHT, DEPTH],
    raycaster: RAYCASTER,
    onClick: registerClick
  }), /*#__PURE__*/React.createElement(RoundedBox, {
    args: [INPUT_WIDTH, INPUT_HEIGHT, DEPTH],
    material: cache.mat_standard_white
  }), /*#__PURE__*/React.createElement(RoundedBox, {
    args: [OUTER_WIDTH, OUTER_HEIGHT, DEPTH],
    "position-z": -0.001
  }, /*#__PURE__*/React.createElement(animated.meshStandardMaterial, {
    color: color
  })));
}

function Button$1(props) {
  const {
    children,
    onClick,
    font = "https://d27rt3a60hh1lx.cloudfront.net/fonts/Quicksand_Bold.otf",
    fontSize = 0.05,
    width,
    maxWidth,
    textColor = "black",
    color = "#fff",
    outline = true,
    outlineColor = "white",
    idea,
    raycaster,
    ...rest
  } = props;
  const textRef = useRef();
  const [dims, setDims] = useState([0, 0]);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const REST_COLOR = useMemo(() => {
    return idea ? idea.getHex() : color;
  }, [color, idea]);
  const HOVER_COLOR = useMemo(() => {
    const hoverIdea = idea ? idea.clone() : new Idea().setFromHex("#" + new Color(REST_COLOR).getHexString());
    const offset = 0.175 * (hoverIdea.utility > 0.5 ? -1 : 1);
    hoverIdea.setUtility(hoverIdea.utility + offset);
    return hoverIdea.getHex();
  }, [REST_COLOR, idea]);
  const {
    animColor,
    scale
  } = useSpring({
    animColor: hovered ? HOVER_COLOR : REST_COLOR,
    scale: clicked ? 0.75 : 1,
    ...config.stiff
  }); // spring animation on click

  useEffect(() => {
    if (clicked) setTimeout(() => setClicked(false), 150);
  }, [clicked]);

  const onButtonClick = () => {
    if (onClick) onClick();
    setClicked(true);
  }; // keep dimensions up to date


  useLayoutEffect(() => {
    textRef.current.addEventListener("synccomplete", () => {
      var _textRef$current;

      const info = (_textRef$current = textRef.current) == null ? void 0 : _textRef$current.textRenderInfo;
      if (!info) return;
      const w = info.blockBounds[2] - info.blockBounds[0];
      const h = info.blockBounds[3] - info.blockBounds[1];
      setDims([w, h]);
    });
    textRef.current.sync();
  }, []);
  const PADDING = fontSize * 0.9;
  const MAX_WIDTH = !maxWidth ? Infinity : width ? Math.max(width, maxWidth) : maxWidth;
  const WIDTH = (width || dims[0]) + PADDING * 2;
  const HEIGHT = dims[1] + PADDING;
  const DEPTH = fontSize * 1.1;
  const OUTLINE_WIDTH = outline ? fontSize * 0.075 : 0;
  return /*#__PURE__*/React.createElement("group", _extends({
    name: `spacesvr-button-${children}`
  }, rest), /*#__PURE__*/React.createElement(animated.group, {
    scale: scale
  }, /*#__PURE__*/React.createElement(Text$2, {
    ref: textRef,
    color: textColor,
    font: font,
    fontSize: fontSize,
    maxWidth: MAX_WIDTH,
    outlineWidth: OUTLINE_WIDTH,
    outlineColor: outlineColor,
    anchorY: "middle",
    textAlign: "center",
    "position-z": DEPTH / 2 + 0.001,
    renderOrder: 2
  }, children), /*#__PURE__*/React.createElement(HitBox, {
    args: [WIDTH, HEIGHT, DEPTH],
    onClick: onButtonClick,
    onHover: () => setHovered(true),
    onUnHover: () => setHovered(false),
    raycaster: raycaster
  }), /*#__PURE__*/React.createElement(RoundedBox, {
    args: [WIDTH, HEIGHT, DEPTH]
  }, /*#__PURE__*/React.createElement(animated.meshStandardMaterial, {
    color: animColor
  }))));
}

function VisualDecisions(props) {
  const {
    decisions,
    setCurKey,
    width
  } = props;
  const FONT_FILE = "https://d27rt3a60hh1lx.cloudfront.net/fonts/Quicksand_Bold.otf";
  const FONT_SIZE = 0.05;
  const OUTLINE_WIDTH = FONT_SIZE * 0.1;
  const PADDING_Y = 0.065;
  const SPACING_Y = 0.015;
  const SPACING_X = 0.08;
  const PADDING_X = 0.025;
  const [dimMap] = useState(() => new Map());
  const [ready, setReady] = useState(false); // for every new set of values, generate a new text object and store width
  // keep ready state in sync with whether all values have been measured

  useEffect(() => {
    if (decisions.every(d => dimMap.has(d.name))) return;
    setReady(false);

    for (const decision of decisions) {
      if (dimMap.has(decision.name)) continue;
      setReady(false);
      const t = new Text$3();
      t.text = decision.name;
      t.font = FONT_FILE;
      t.fontSize = FONT_SIZE;
      t.maxWidth = width;
      t.outlineWidth = OUTLINE_WIDTH;
      t.sync(() => {
        const {
          blockBounds
        } = t.textRenderInfo;
        const w = blockBounds[2] - blockBounds[0];
        const h = blockBounds[3] - blockBounds[1];
        dimMap.set(decision.name, {
          w,
          h
        });
        if (decisions.every(d => dimMap.has(d.name))) setReady(true);
      });
    }
  }, [decisions, dimMap, FONT_SIZE, FONT_FILE, width, OUTLINE_WIDTH]);
  const objValues = useMemo(() => {
    const lines = [];
    let thisLineWidth = 0;
    let thisLineIndex = 0;
    let y = -FONT_SIZE;
    let lastHei = 0; // calculate lines and y positions

    for (const decision of decisions) {
      var _dimMap$get, _dimMap$get2;

      const wid = (((_dimMap$get = dimMap.get(decision.name)) == null ? void 0 : _dimMap$get.w) || 0) + PADDING_X * 2 + SPACING_X;
      const hei = ((_dimMap$get2 = dimMap.get(decision.name)) == null ? void 0 : _dimMap$get2.h) || 0;

      if (thisLineWidth + wid <= width) {
        if (!lines[thisLineIndex]) lines.push({
          y,
          decisions: []
        });
        lines[thisLineIndex].decisions.push(decision);
        lastHei = hei;
        thisLineWidth += wid;
      } else {
        var _dimMap$get3;

        // by default, overflow means new line
        thisLineIndex++;
        const hei = ((_dimMap$get3 = dimMap.get(decision.name)) == null ? void 0 : _dimMap$get3.h) || 0;
        y -= lastHei / 2 + SPACING_Y + PADDING_Y + hei / 2;

        if (hei > FONT_SIZE + OUTLINE_WIDTH * 2) {
          // if it's taller than one line, force it to be on its own line
          lines.push({
            y,
            decisions: [decision]
          });
          y -= hei / 2 + PADDING_Y + SPACING_Y;
          thisLineIndex++;
          thisLineWidth = 0;
          lastHei = hei;
        } else {
          // add to this new line
          lines.push({
            y,
            decisions: [decision]
          });
          thisLineWidth += wid;
          lastHei = hei;
        }
      }
    } // from lines, calculate x positions by centering each decision within its line


    const objMap = [];

    for (const line of lines) {
      const lineObjMap = []; // place each decision in the center then shift left

      let x = 0;

      for (const decision of line.decisions) {
        var _dimMap$get4;

        const wid = ((_dimMap$get4 = dimMap.get(decision.name)) == null ? void 0 : _dimMap$get4.w) || 0;
        x -= wid / 2;
        lineObjMap.push({
          decision,
          position: [x, line.y, 0]
        });
        x -= wid / 2 + PADDING_X * 2 + SPACING_X;
      } // shift all decisions in the line to the right


      const lineWid = -x - PADDING_X * 2 - SPACING_X;
      const shift = lineWid / 2;

      for (const obj of lineObjMap) {
        obj.position[0] += shift;
      }

      objMap.push(...lineObjMap);
    }

    return objMap;
  }, [decisions, dimMap, width, ready]);
  const [offset] = useState(Math.random());
  const ideaMap = useMemo(() => {
    const map = new Map();

    for (const decision of decisions) {
      const m = (offset + decisions.indexOf(decision) / decisions.length) % 1;
      const s = 0.7;
      map.set(decision.name, new Idea(m, s, decision.utility || 0.8));
    }

    return map;
  }, [decisions, offset]);
  if (!ready) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, objValues.map((_ref, i) => {
    let {
      decision,
      position
    } = _ref;
    return /*#__PURE__*/React.createElement("group", {
      key: decision.name + i + position.toString(),
      position: position
    }, /*#__PURE__*/React.createElement(FacePlayer, null, /*#__PURE__*/React.createElement(Button$1, {
      font: FONT_FILE,
      fontSize: FONT_SIZE,
      maxWidth: width,
      idea: ideaMap.get(decision.name),
      onClick: () => {
        if (decision.onClick) decision.onClick();
        if (decision.nextKey) setCurKey(decision.nextKey || "");
      }
    }, decision.name)));
  }));
}

const FONT_FILE$1 = "https://d27rt3a60hh1lx.cloudfront.net/fonts/Quicksand_Bold.otf";
function VisualInteraction(props) {
  const {
    interaction,
    enabled,
    width,
    height,
    setCurKey
  } = props;
  const {
    effect,
    text,
    input,
    decisions
  } = interaction;
  const [prevEnabled, setPrevEnabled] = useState(false);
  const {
    posZ,
    scaleY
  } = useSpring({
    posZ: enabled ? 0.003 : -0.003,
    scaleY: enabled ? 1 : 0
  });
  const onSubmit = useMemo(() => {
    if (!decisions) return () => {
      return;
    };

    for (const decision of decisions) {
      if (decision.name === "submit") {
        return () => {
          if (decision.onClick) decision.onClick();
          if (decision.nextKey) setCurKey(decision.nextKey || "");
        };
      }
    }
  }, [decisions, setCurKey]);
  useEffect(() => {
    if (prevEnabled !== enabled) {
      setPrevEnabled(enabled);

      if (enabled && effect) {
        effect().then(newKey => {
          if (newKey) {
            setCurKey(newKey);
          }
        });
      }
    }
  }, [effect, setCurKey, prevEnabled, enabled]);
  const textStyles = {
    font: FONT_FILE$1,
    maxWidth: 0.8,
    textAlign: "center",
    fontSize: 0.06,
    outlineWidth: 0.0065,
    renderOrder: 10
  };
  if (!enabled) return null;
  return /*#__PURE__*/React.createElement(animated.group, {
    name: `interaction-${text}`,
    "position-z": posZ,
    "scale-y": scaleY
  }, /*#__PURE__*/React.createElement(Text$2, _extends({}, textStyles, {
    anchorY: input ? "bottom" : "middle"
  }), text), input && (input.persist || enabled) && /*#__PURE__*/React.createElement(TextInput, {
    value: input.value,
    onChange: input.setValue,
    "position-y": -0.065,
    onSubmit: onSubmit,
    fontSize: 0.06,
    width: width * 0.825,
    type: input.type === "email" ? "text" : input.type
  }), /*#__PURE__*/React.createElement("group", {
    "position-y": -height / 2
  }, decisions && /*#__PURE__*/React.createElement(VisualDecisions, {
    decisions: decisions,
    width: width,
    setCurKey: setCurKey
  })));
}

function Dialogue(props) {
  const {
    numStops = 5,
    enabled = true,
    side = "left",
    offset = [side === "right" ? 0.4 : -0.4, 0, 0],
    dialogue,
    face = true,
    ...rest
  } = props;
  const [curKey, setCurKey] = useState("init");
  const {
    scale
  } = useSpring({
    scale: enabled ? 1 : 0,
    delay: enabled ? (numStops + 1) * 60 : 0
  });
  const group = useRef(null);
  useLimitedFrame(40, _ref => {
    let {
      camera
    } = _ref;
    if (!group.current) return;
    group.current.position.x += side === "right" ? WIDTH : -WIDTH;
    group.current.lookAt(camera.position);
    group.current.position.set(0, 0, 0);
  });
  const WIDTH = 1;
  const HEIGHT = 0.35;
  const DEPTH = 0.125;
  const POS_X = side === "right" ? WIDTH / 2 : -WIDTH / 2;
  return /*#__PURE__*/React.createElement("group", _extends({
    name: "dialogue"
  }, rest), /*#__PURE__*/React.createElement(FacePlayer, {
    enabled: face
  }, /*#__PURE__*/React.createElement(Bubbles, {
    numStops: numStops,
    enabled: enabled,
    offset: offset
  }), /*#__PURE__*/React.createElement("group", {
    name: "main-dialogue",
    position: offset
  }, /*#__PURE__*/React.createElement("group", {
    name: "look-at",
    ref: group
  }, /*#__PURE__*/React.createElement(animated.group, {
    scale: scale,
    "position-x": POS_X
  }, /*#__PURE__*/React.createElement(RoundedBox, {
    args: [WIDTH, HEIGHT, DEPTH],
    material: cache.mat_standard_cream_double
  }), /*#__PURE__*/React.createElement("group", {
    name: "interactions",
    "position-z": DEPTH / 2 + 0.003
  }, dialogue.map(interaction => /*#__PURE__*/React.createElement(VisualInteraction, {
    key: interaction.key,
    interaction: interaction,
    enabled: interaction.key === curKey,
    setCurKey: setCurKey,
    width: WIDTH,
    height: HEIGHT
  }))))))));
}

const IMAGE_SRC = "https://d27rt3a60hh1lx.cloudfront.net/images/whiteArrow.png";
const IMAGE_SRC_DARK = "https://d27rt3a60hh1lx.cloudfront.net/images/blackArrow.png";
function Arrow(props) {
  const {
    dark,
    ...rest
  } = props;
  const texture = useImage(dark ? IMAGE_SRC_DARK : IMAGE_SRC);
  const arrowMat = cache.useResource(`spacesvr_arrow_${dark ? "dark" : "light"}`, () => new MeshStandardMaterial({
    map: texture,
    alphaTest: 0.5,
    transparent: true
  }));
  return /*#__PURE__*/React.createElement("group", _extends({
    name: "spacesvr-arrow"
  }, rest), /*#__PURE__*/React.createElement("mesh", {
    scale: 0.004,
    material: arrowMat
  }, /*#__PURE__*/React.createElement("planeGeometry", {
    args: [98, 51]
  })));
}

function Key(props) {
  const {
    keyCode,
    keyPress = [keyCode],
    onPress,
    ...rest
  } = props;
  const [pressed, setPressed] = useState(false);
  const {
    color,
    scale
  } = useSpring({
    color: pressed ? "#aaa" : "#fff",
    scale: pressed ? 0.5 : 1,
    ...config.stiff
  });
  const DEPTH = 0.25;
  useEffect(() => {
    const pressed = e => keyPress.map(k => k.toLowerCase()).includes(e.key.toLowerCase());

    const detectDown = e => {
      if (e.key && pressed(e)) setPressed(true);
    };

    const detectUnPress = e => {
      if (e.key && pressed(e)) setPressed(false);
    };

    const detectPress = e => {
      if (e.key && pressed(e)) onPress == null ? void 0 : onPress(e);
    };

    document.addEventListener("keydown", detectDown);
    document.addEventListener("keyup", detectUnPress);
    document.addEventListener("keypress", detectPress);
    return () => {
      document.removeEventListener("keydown", detectDown);
      document.removeEventListener("keyup", detectUnPress);
      document.removeEventListener("keypress", detectPress);
    };
  }, [keyPress, onPress]);
  return /*#__PURE__*/React.createElement("group", _extends({
    name: "spacesvr-key"
  }, rest), /*#__PURE__*/React.createElement("group", {
    "position-z": -DEPTH
  }, /*#__PURE__*/React.createElement(animated.group, {
    "scale-z": scale
  }, /*#__PURE__*/React.createElement("group", {
    "position-z": DEPTH / 2
  }, /*#__PURE__*/React.createElement(RoundedBox, {
    args: [1, 1, DEPTH],
    "position-z": -DEPTH / 2 - 0.01
  }, /*#__PURE__*/React.createElement(animated.meshStandardMaterial, {
    color: color
  })), /*#__PURE__*/React.createElement(Text$2, {
    color: "black",
    fontSize: 0.5,
    renderOrder: 2
  }, keyCode)))));
}

function Switch(props) {
  const {
    value,
    onChange,
    raycaster: passedRaycaster,
    ...rest
  } = props;
  const [localValue, setLocalValue] = useState(false); // if no value is passed, use local state

  const val = value ?? localValue;

  const setVal = v => {
    if (onChange) onChange(v);
    setLocalValue(v);
  };

  const SIZE = 0.075;
  const BORDER = SIZE * 0.05;
  const WIDTH = 2.5 * SIZE;
  const HEIGHT = SIZE * 0.75;
  const DEPTH = WIDTH * 0.1;
  const OUTER_WIDTH = WIDTH + BORDER * 2;
  const OUTER_HEIGHT = HEIGHT + BORDER;
  const KNOB_SIZE = SIZE * 0.8;
  const {
    posX,
    knobColor
  } = useSpring({
    posX: val ? WIDTH / 2 : -WIDTH / 2,
    knobColor: val ? "#417E25" : "#828282",
    config: {
      mass: 0.1
    }
  });
  const [onIdea] = useState(new Idea(0, 0, 1));
  const [offIdea] = useState(new Idea(0, 0, 0.75));
  return /*#__PURE__*/React.createElement("group", _extends({
    name: "spacesvr-switch-input"
  }, rest), /*#__PURE__*/React.createElement(animated.group, {
    "position-x": posX
  }, /*#__PURE__*/React.createElement(VisualIdea, {
    scale: KNOB_SIZE,
    idea: val ? onIdea : offIdea
  })), /*#__PURE__*/React.createElement(HitBox, {
    args: [KNOB_SIZE, KNOB_SIZE, KNOB_SIZE],
    onClick: () => setVal(!val),
    "position-x": val ? WIDTH / 2 : -WIDTH / 2,
    raycaster: passedRaycaster
  }), /*#__PURE__*/React.createElement(HitBox, {
    args: [OUTER_WIDTH, OUTER_HEIGHT, DEPTH],
    onClick: () => setVal(!val),
    raycaster: passedRaycaster
  }), /*#__PURE__*/React.createElement(RoundedBox, {
    args: [WIDTH, HEIGHT, DEPTH]
  }, /*#__PURE__*/React.createElement(animated.meshBasicMaterial, {
    color: knobColor
  })), /*#__PURE__*/React.createElement(RoundedBox, {
    args: [OUTER_WIDTH, OUTER_HEIGHT, DEPTH],
    material: cache.mat_basic_gray,
    "position-z": -0.001
  }));
}

const NetworkContext = /*#__PURE__*/createContext({});
const useNetwork = () => useContext(NetworkContext);

const useListener = () => {
  const cam = useThree(st => st.camera);
  return useMemo(() => {
    const listen = new AudioListener();
    cam.add(listen);
    return listen;
  }, [cam]);
};
const useObj = () => {
  return useMemo(() => {
    const o = new Object3D();
    o.matrixAutoUpdate = false;
    return o;
  }, []);
};

const useEntities = () => {
  const {
    connections,
    connected,
    mediaConnections
  } = useNetwork();
  const {
    paused
  } = useEnvironment();
  const listener = useListener();
  const [ct, setCt] = useState(0);

  const rerender = () => setCt(Math.random());

  const [firstPaused, setFirstPaused] = useState(true);
  useEffect(() => setFirstPaused(paused && firstPaused), [paused, firstPaused]);
  const entities = useMemo(() => [], []);

  const needsAudio = e => mediaConnections.has(e.id) && !e.posAudio; // check for a change in player list, re-render if there is a change


  useLimitedFrame(3, () => {
    if (!connected) return; // changed flag to trigger re-render at the end

    let changed = false; // remove old entities

    entities.map(e => {
      if (!connections.has(e.id)) {
        if (e.posAudio) {
          e.posAudio.remove();
          e.posAudio = undefined;
        }

        entities.splice(entities.indexOf(e), 1);
        changed = true;
      }
    }); // add in new entities

    for (const id of Array.from(connections.keys())) {
      if (!entities.some(e => e.id === id)) {
        entities.push({
          id,
          posAudio: undefined
        });
        changed = true;
      }
    } // dont run until first time unpaused to make sure audio context is running from first press


    if (!firstPaused) {
      // remove media connections streams that are no longer connected
      entities.map(e => {
        if (!mediaConnections.has(e.id)) {
          var _e$posAudio;

          (_e$posAudio = e.posAudio) == null ? void 0 : _e$posAudio.remove();
          e.posAudio = undefined;
          changed = true;
        }
      });
      entities.filter(needsAudio).map(e => {
        // add in new media connections if the stream is active
        const mediaConn = mediaConnections.get(e.id);
        if (!mediaConn) return;
        if (!mediaConn.remoteStream) return;
        console.log("adding audio for", e.id);
        const audioElem = document.createElement("audio");
        audioElem.srcObject = mediaConn.remoteStream; // remote is incoming, local is own voice

        audioElem.muted = true;
        audioElem.autoplay = true;
        audioElem.loop = true; //@ts-ignore

        audioElem.playsInline = true;
        const posAudio = new PositionalAudio(listener);
        posAudio.userData.peerId = e.id;
        posAudio.setMediaStreamSource(audioElem.srcObject);
        posAudio.setRefDistance(2);
        posAudio.setDirectionalCone(200, 290, 0.35); // posAudio.add(new PositionalAudioHelper(posAudio, 1));

        e.posAudio = posAudio;
        changed = true;
      });
    }

    if (changed) rerender();
  });
  return entities;
};

function NetworkedEntities() {
  const {
    connected,
    useChannel
  } = useNetwork();
  const mesh = useRef(null);
  const geo = useMemo(() => new CylinderGeometry(0.3, 0.3, 1, 32), []);
  const mat = useMemo(() => new MeshNormalMaterial(), []);
  const obj = useObj();
  const entities = useEntities(); // set up channel to send/receive data

  const NETWORK_FPS = 12;
  const SI = useMemo(() => new SnapshotInterpolation(NETWORK_FPS), []);
  const entityChannel = useChannel("player", "stream", (m, s) => {
    if (!m.conn) return;
    s[m.conn.peer] = m.data;
    const state = Object.keys(s).map(key => ({
      id: key,
      x: s[key].pos[0],
      y: s[key].pos[1],
      z: s[key].pos[2],
      q: {
        x: s[key].rot[0],
        y: s[key].rot[1],
        z: s[key].rot[2],
        w: s[key].rot[3]
      }
    }));
    SI.vault.add({
      id: Math.random().toString(),
      time: new Date().getTime(),
      state
    });
  }); // send own player data

  useLimitedFrame(NETWORK_FPS, _ref => {
    let {
      camera
    } = _ref;
    if (!connected) return;
    entityChannel.send({
      pos: camera.position.toArray(),
      rot: camera.quaternion.toArray()
    });
  }); // receive player data

  useLimitedFrame(55, () => {
    if (!mesh.current) return;
    const snapshot = SI.calcInterpolation("x y z q(quat)");
    if (!snapshot) return;
    let i = 0;

    for (const entityState of snapshot.state) {
      var _entities$i;

      const {
        x,
        y,
        z,
        q
      } = entityState;
      obj.position.set(x, y, z);
      obj.position.y -= 0.2; // they were floating before, idk where the constant comes from really

      const quat = q;
      obj.quaternion.set(quat.x, quat.y, quat.z, quat.w);
      obj.updateMatrix();
      mesh.current.setMatrixAt(i, obj.matrix);
      const posAudio = (_entities$i = entities[i]) == null ? void 0 : _entities$i.posAudio;

      if (posAudio) {
        obj.matrix.decompose(posAudio.position, posAudio.quaternion, posAudio.scale);
        posAudio.rotation.y += Math.PI; // for some reason it's flipped

        posAudio.updateMatrix();
      }

      i++;
    }

    mesh.current.instanceMatrix.needsUpdate = true;
  });

  if (!connected) {
    return null;
  }

  return /*#__PURE__*/React.createElement("group", {
    name: "spacesvr-entities"
  }, entities.map(entity => entity.posAudio && /*#__PURE__*/React.createElement("primitive", {
    key: entity.posAudio.uuid,
    object: entity.posAudio,
    matrixAutoUpdate: false
  })), /*#__PURE__*/React.createElement("instancedMesh", {
    ref: mesh,
    args: [geo, mat, entities.length],
    matrixAutoUpdate: false
  }));
}

const isLocalNetwork = function (hostname) {
  if (hostname === void 0) {
    hostname = window.location.hostname;
  }

  return ["localhost", "127.0.0.1", "", "::1"].includes(hostname) || hostname.startsWith("192.168.") || hostname.startsWith("10.0.") || hostname.endsWith(".local");
};

const SESSION_ID = "spacesvr-local-signalling";
const TIMEOUT_MIN = 1.25;
class LocalSignaller {
  constructor(peer) {
    console.info("using local signaller");
    if (peer.id) this.peerId = peer.id;
  }

  readStore() {
    const str = localStorage.getItem(SESSION_ID);
    if (!str) return [];

    try {
      return JSON.parse(str);
    } catch (err) {
      return [];
    }
  }

  writeStore(peers) {
    localStorage.setItem(SESSION_ID, JSON.stringify(peers));
  }

  cleanStore() {
    const peers = this.readStore();
    const time = new Date().getTime();
    const newPeers = peers.filter(peer => {
      const keep = time - peer.last_seen <= TIMEOUT_MIN * 60 * 1000;
      if (!keep) console.info("removing local peer with id ", peer.id);
      return keep;
    });
    this.writeStore(newPeers);
  }

  async join() {
    if (!this.peerId) {
      console.error("peer id not established, aborting signal");
      return;
    }

    this.cleanStore();
    console.info("local network detected, signalling with localStorage");
    const peer = {
      id: this.peerId,
      last_seen: new Date().getTime()
    };
    const peers = this.readStore();
    peers.push(peer);
    this.writeStore(peers);
    return peers.map(peer => peer.id);
  }

  async leave() {
    if (!this.peerId) {
      console.error("peer id not established, aborting signal");
      return;
    }

    console.info(`updating local signal list to remove self`);
    const peers = this.readStore();
    const index = peers.findIndex(peer => peer.id === this.peerId);

    if (index < 0) {
      console.error("peer not in local signal list, aborting ...");
    } else {
      peers.splice(index, 1);
      this.writeStore(peers);
    }
  }

  async wave() {
    if (!this.peerId) {
      console.error("peer id not established, wave failed");
      return false;
    }

    const peers = this.readStore();
    let foundAndUpdated = false;
    peers.map(peer => {
      if (peer.id === this.peerId) {
        peer.last_seen = new Date().getTime();
        foundAndUpdated = true;
      }
    });
    this.writeStore(peers);
    return foundAndUpdated;
  }

}

class MuseSignaller {
  constructor(peer, config) {
    if (config === void 0) {
      config = {};
    }

    console.info("using muse signaller"); // set up signalling identification

    if (config.sessionId) this.sessionId = config.sessionId;else if (config.worldName) this.worldName = config.worldName;else this.worldName = window.location.pathname; // where to point requests to

    this.host = config.host || "https://muse-web.onrender.com";
    if (config.sessionPassword) this.sessionPassword = config.sessionPassword;
    if (peer.id) this.peerId = peer.id;
  }

  async callBackend(path, body) {
    return await fetch(`${this.host}/sessions/${path}`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json"
      }
    });
  }

  async join() {
    if (!this.peerId) {
      console.error("peer id not established, aborting signal");
      return;
    }

    const body = {
      peer_id: this.peerId
    };
    if (this.sessionId) body.session_id = this.sessionId;else body.world = this.worldName;
    if (this.sessionPassword) body.password = this.sessionPassword;
    const response = await this.callBackend("join", body);
    let json = await response.json();

    if (response.status !== 200) {
      json = json;
      console.error("failed to signal: ", json.message);
      return undefined;
    }

    json = json;
    this.sessionId = json.session_id;
    return json.peer_ids;
  }

  async leave() {
    if (!this.sessionId || !this.peerId) {
      console.error("no session id / peer id, can't leave");
      return;
    }

    const body = {
      peer_id: this.peerId,
      session_id: this.sessionId
    };
    const response = await this.callBackend("leave", body);

    if (response.status !== 200) {
      const json = await response.json();
      console.error("leave failed ... ", json.message);
    }
  }

  async wave() {
    if (!this.sessionId || !this.peerId) {
      console.error("no session id / peer id, can't wave");
      return false;
    }

    const body = {
      peer_id: this.peerId,
      session_id: this.sessionId
    };
    const response = await this.callBackend("wave", body);

    if (response.status !== 200) {
      const json = await response.json();
      console.error("wave check failed ... ", json.message);
      return false;
    }

    return true;
  }

}

const MAX_TRIES = 4;
const useWaving = (minuteFrequency, singaller, disconnect) => {
  const numFailed = useRef(0);
  const waveLimiter = useLimiter(1 / (minuteFrequency * 60));
  const failLimiter = useLimiter(1 / 10);
  useFrame(_ref => {
    let {
      clock
    } = _ref;
    if (!singaller || numFailed.current > MAX_TRIES) return;
    const FAIL_STATE = numFailed.current > 0;

    if (!(FAIL_STATE ? failLimiter : waveLimiter).isReady(clock)) {
      return;
    }

    singaller.wave().then(succeeded => {
      if (!succeeded) {
        numFailed.current += 1;
      } else {
        numFailed.current = 0;
      }

      if (numFailed.current > MAX_TRIES) {
        console.error("too many failed waves, disconnecting ...");
        disconnect();
      }
    });
  });
};

/**
 * The most basic channel type just sends data to all the peers and receives
 * the same data.
 *
 * The state built locally, where the intention is that it can be recovered
 * on the fly.
 *
 * This is best used for data like streaming player position/rotation, where
 * old values don't matter.
 */
class StreamChannel {
  constructor(id, reducer, connections) {
    this.id = id;
    this.reducer = reducer;
    this.connections = connections;
    this.state = {};
  }

  send(data) {
    for (const [, conn] of this.connections.entries()) {
      if (conn.open) {
        conn.send({
          id: this.id,
          data
        });
      }
    }
  }

  receive(message) {
    this.reducer(message, this.state);
  }

}

/**
 * This Channel is responsible for keeping one state synchronized across
 * all peers. It does this by keeping one local state.
 *
 * Every time a new connection appears, you "greet" them with a new state and a time
 * to represent when the peer was instantiated, letting older peers take precedence.
 *
 */
class SyncChannel {
  constructor(id, reducer, connections) {
    this.id = id;
    this.reducer = reducer;
    this.initTime = new Date().getTime();
    this.connections = connections;
    this.state = {};
  }

  send(data) {
    for (const [, conn] of this.connections.entries()) {
      if (conn.open) {
        conn.send({
          id: this.id,
          data
        });
      }
    }

    this.reducer({
      id: this.id,
      data
    }, this.state);
  }

  receive(message) {
    if (message.greet) {
      if (message.time && message.state) {
        if (message.time < this.initTime) {
          this.state = message.state;
          this.initTime = message.time - 50; // add a buffer in case same peer sends it twice
        }
      }
    } else {
      this.reducer(message, this.state);
    }
  }

  greet(conn) {
    conn.send({
      id: this.id,
      time: this.initTime,
      state: this.state,
      greet: true
    });
  }

}

const useChannels = connections => {
  const channels = useMemo(() => new Map(), []);

  const receive = message => {
    for (const [id, channel] of channels.entries()) {
      if (id == message.id) {
        channel.receive(message);
      }
    }
  };

  const greet = conn => {
    for (const [, channel] of channels.entries()) {
      if (channel instanceof SyncChannel) {
        channel.greet(conn);
      }
    }
  };

  const useChannel = (id, type, reducer) => {
    const channel = useMemo(() => {
      if (type === "stream") return new StreamChannel(id, reducer, connections);
      if (type === "sync") return new SyncChannel(id, reducer, connections);
      return new StreamChannel(id, reducer, connections);
    }, [id, type]); // keep reducer up to date

    useEffect(() => {
      channel.reducer = reducer;
    }, [channel, reducer]); // keep channel registered

    useEffect(() => {
      if (channels.has(channel.id)) {
        throw new Error(`id '${channel.id}' has been taken, can't register channel ...`);
      } else {
        channels.set(channel.id, channel);
      }

      return () => {
        if (!channels.has(channel.id)) return;
        channels.delete(channel.id);
      };
    }, [channel]);
    return channel;
  };

  return {
    receive,
    greet,
    useChannel
  };
};

/**
 * WHen enabled, will ask user for mic permissions and return the local microphone stream
 * @param enabled
 */

const useMicrophone = function (enabled, inputDeviceId) {
  if (enabled === void 0) {
    enabled = true;
  }

  const {
    paused
  } = useEnvironment();
  const [firstPaused, setFirstPaused] = useState(true);
  useEffect(() => setFirstPaused(paused && firstPaused), [paused, firstPaused]);

  function iOS() {
    return ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(navigator.platform) || // iPad on iOS 13 detection
    navigator.userAgent.includes("Mac") && "ontouchend" in document;
  }

  const [localStream, setLocalStream] = useState(); // attempt to request permission for microphone, only try once

  useEffect(() => {
    var _navigator$mediaDevic;

    // https://bugs.webkit.org/show_bug.cgi?id=230902#c47
    if (!enabled || iOS() && firstPaused) return;
    (_navigator$mediaDevic = navigator.mediaDevices) == null ? void 0 : _navigator$mediaDevic.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        ...(inputDeviceId ? {
          deviceId: inputDeviceId
        } : {})
      }
    }).then(stream => {
      setLocalStream(stream);
    }).catch(err => {
      console.error(err);
    });
  }, [enabled, firstPaused, inputDeviceId]);
  return localStream;
};

/**
 * When enabled, is responsible for requesting mic permissions, calling and answering peers to create media connections,
 * and closing media connections on disable
 *
 * @param enabled
 * @param peer
 * @param connections
 */

const useVoiceConnections = (enabled, peer, connections, inputDeviceId) => {
  const mediaConns = useMemo(() => new Map(), []);
  const localStream = useMicrophone(enabled, inputDeviceId); // handle calling and answering peers

  useEffect(() => {
    if (!peer || !localStream || !enabled) return; // handle a new media connection (incoming or created

    const handleMediaConn = mediaConn => {
      console.log("media connection opened with peer", mediaConn.peer);
      mediaConn.answer(localStream);
      mediaConns.set(mediaConn.peer, mediaConn);
      mediaConn.on("close", () => {
        console.log("closing voice stream with peer", mediaConn.peer);
        mediaConns.delete(mediaConn.peer);
      });
      mediaConn.on("error", err => {
        console.error("error with voice stream with peer", mediaConn.peer, err);
        mediaConns.delete(mediaConn.peer);
      });
    };

    const call = conn => {
      console.log("calling peer with id", conn.peer);
      handleMediaConn(peer.call(conn.peer, localStream));
      conn.on("close", () => {
        console.log("closing voice stream with peer", conn.peer);
        mediaConns.delete(conn.peer);
      });
    };

    const handleDataConn = conn => {
      conn.on("open", () => call(conn));
    }; // set up incoming and outgoing calls for any future connections


    peer.on("call", handleMediaConn);
    peer.on("connection", handleDataConn); // call any already connected peers

    for (const [peerId, conn] of connections) {
      if (mediaConns.has(peerId)) return;
      call(conn);
    }

    return () => {
      peer.removeListener("call", handleMediaConn);
      peer.removeListener("connection", call);
    };
  }, [connections, peer, localStream, mediaConns, enabled]); // close all media connections with peers on disable

  useEffect(() => {
    if (!enabled) {
      mediaConns.forEach(conn => {
        conn.close();
        mediaConns.delete(conn.peer);
      });
    }
  }, [enabled, mediaConns]);
  return {
    mediaConnections: mediaConns,
    localStream
  };
};

const KEY = "spacesvr-ice-servers"; // 24 hours

const EXPIRE_TIME = 24 * 60 * 60 * 1000;

const storeLocalIceServers = servers => {
  const store = {
    iceServers: servers,
    time: new Date().getTime()
  };
  localStorage.setItem(KEY, JSON.stringify(store));
};

const getLocalIceServers = () => {
  const str = localStorage.getItem(KEY);
  if (!str) return undefined;

  try {
    const res = JSON.parse(str); // clear if expired

    if (new Date().getTime() - res.time > EXPIRE_TIME) {
      localStorage.removeItem(KEY);
      return undefined;
    }

    return res.iceServers;
  } catch (err) {
    return undefined;
  }
};

const getMuseIceServers = async function (host) {
  if (host === void 0) {
    host = "https://muse-web.onrender.com";
  }

  const local = getLocalIceServers();
  if (local) return local;

  try {
    const res = await fetch(`${host}/sessions/get_ice`);
    const json = await res.json();
    const servers = json.iceServers;
    storeLocalIceServers(servers);
    return servers;
  } catch (err) {
    console.error("failed to fetch ice servers", err);
    return undefined;
  }
};

const useConnection = externalConfig => {
  const [connected, setConnected] = useState(false);
  const [peer, setPeer] = useState();
  const connections = useMemo(() => new Map(), []);
  const [signaller, setSignaller] = useState();
  const channels = useChannels(connections); // given any connection, store and set up data channels

  const registerConnection = conn => {
    conn.on("open", () => {
      console.log("connection opened with peer", conn.peer);
      conn.on("data", message => channels.receive({
        conn,
        ...message
      }));
      conn.on("close", () => {
        console.log("connection closed with peer");
        connections.delete(conn.peer);
      });
      conn.on("error", () => {
        console.log("connection closed with peer");
        connections.delete(conn.peer);
      });
      channels.greet(conn);
      connections.set(conn.peer, conn);
    });
  }; // attempt to connect to a p2p network


  const connect = async config => {
    console.log("connecting to network");

    if (peer) {
      console.error("peer already created, aborting");
      return;
    }

    if (connected) {
      console.error("already connected, aborting");
      return;
    }

    const finalConfig = { ...externalConfig,
      ...config
    };

    if (!finalConfig.iceServers) {
      const servers = await getMuseIceServers(finalConfig.host);
      if (servers) finalConfig.iceServers = servers;
    }

    const peerConfig = {};
    if (finalConfig.iceServers) peerConfig.iceServers = finalConfig.iceServers;
    const p = new Peer({
      config: peerConfig
    });
    p.on("connection", registerConnection); // incoming

    p.on("close", disconnect);
    p.on("error", err => {
      if (err.message.includes("Could not connect to peer")) {
        const messageWords = err.message.split(" ");
        const connId = messageWords[messageWords.length - 1];
        console.error(`could not establish connection to peer ${connId}`);
      } else {
        console.error(err);
      }
    });
    p.on("open", async () => {
      setConnected(true);
      const s = isLocalNetwork() && !finalConfig.host ? new LocalSignaller(p) : new MuseSignaller(p, finalConfig);
      const ids = await s.join();
      console.log("found peers:", ids);
      if (!ids) return;
      ids.map(id => {
        if (id === p.id) return;
        const conn = p.connect(id);
        registerConnection(conn);
      });
      setPeer(p);
      setSignaller(s);
    });
  }; // attempt to disconnect from a p2p network


  const disconnect = () => {
    console.log("disconnecting from network");

    if (!connected) {
      console.error("not connected, no need to disconnect");
      return;
    }

    if (!peer) {
      console.error("peer doesn't exist, no need to disconnect");
      return;
    }

    if (!peer.disconnected) peer.disconnect();
    if (signaller) signaller.leave();
    connections.forEach(conn => conn.close());
    peer.destroy();
    setConnected(false);
    setPeer(undefined);
  };

  useWaving(1, signaller, disconnect);
  const [voice, setVoice] = useState(!!externalConfig.voice);
  const [inputDeviceId, setInputDevice] = useState();
  useEffect(() => setVoice(!!externalConfig.voice), [externalConfig.voice]);
  const {
    mediaConnections,
    localStream
  } = useVoiceConnections(voice, peer, connections, inputDeviceId);
  return {
    connected,
    connect,
    disconnect,
    connections,
    useChannel: channels.useChannel,
    voice,
    setVoice,
    localStream,
    mediaConnections,
    setInputDevice
  };
};

const useModifiedStandardShader = (config, vert, frag) => {
  const {
    time = true,
    ...rest
  } = config;
  const mat = useMemo(() => {
    const material = new MeshStandardMaterial({
      side: DoubleSide,
      ...rest
    });

    material.onBeforeCompile = function (shader) {
      shader.uniforms.time = new Uniform(0);
      const uniforms = `
        varying vec2 vUv;
        varying vec3 vNorm;
        varying vec3 vPos;
        uniform float time;
      `;
      const varyingSet = `
        vUv = uv;
        vPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
      `;
      shader.vertexShader = uniforms + shader.vertexShader.replace("#include <worldpos_vertex>", vert + varyingSet + "\n#include <worldpos_vertex>\n");
      shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n" + "vNorm = normal;\n"); // gets inserted right here: https://github.com/mrdoob/three.js/blob/f16386d8bb3db60ce4f6254ccf006c2e0b90bc1c/src/renderers/shaders/ShaderLib/meshphysical.glsl.js#L171

      shader.fragmentShader = uniforms + shader.fragmentShader.replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n" + frag);
      material.userData.shader = shader;
    };

    material.customProgramCacheKey = () => frag + vert + JSON.stringify(rest);

    return material;
  }, [frag, rest, time, vert]);
  useLimitedFrame(70, _ref => {
    var _mat$userData$shader, _mat$userData$shader$;

    let {
      clock
    } = _ref;
    if (!time || !((_mat$userData$shader = mat.userData.shader) != null && (_mat$userData$shader$ = _mat$userData$shader.uniforms) != null && _mat$userData$shader$.time)) return;
    mat.userData.shader.uniforms.time.value = clock.elapsedTime;
  });
  return mat;
};

const vert = `
`;
const GRAY = "vec3(0.6)";
const frag = `
    diffuseColor.rgb = ${GRAY};
    
    // apply grip
    float radius = 0.25;
    vec2 l = (fract((vUv - vec2(0.21, 0.)) * vec2(9., 0.)) - vec2(0.5, 0.));
    float blur = 5.;
    float circle_mask = 1.0 - smoothstep(radius - (radius * blur),radius + (radius * blur),dot(l,l) * 2.0);
    float side_mask = pow(abs(dot(vNorm, vec3(1.0, 0.0, 0.0))), 0.9);
    float up_mask = 0.2 * pow(dot(vNorm, vec3(0.0, 1.0, 0.0)), 1.);
    float grip_mask = min(1., (side_mask + up_mask)) * circle_mask;
    diffuseColor.rgb *= clamp(1. - (0.8 * grip_mask), 0., 1.);
    
    // apply speaker and mic
    // create mask for facing the camera
    float facing_mask = pow(clamp(dot(vNorm, vec3(0., 0., 1.0)), 0., 1.), 2000.);
    // create a mask for the bottom of the phone
    float bottom_mask = smoothstep(0.0, 0.2, abs(vUv.y + 0.1));
    float speaker_mask = facing_mask * bottom_mask;
    // diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.9), speaker_mask);
`;

function TalkieModel(props) {
  const {
    width,
    height,
    depth
  } = props;
  const mat = useModifiedStandardShader({
    color: "#cbcbcb"
  }, vert, frag);
  const ANTENNA_WIDTH = width * 0.22;
  const ANTENNA_HEIGHT = height * 0.45;
  return /*#__PURE__*/React.createElement("group", {
    name: "model"
  }, /*#__PURE__*/React.createElement(RoundedBox, {
    args: [width, height, depth],
    material: mat
  }), /*#__PURE__*/React.createElement(RoundedBox, {
    args: [ANTENNA_WIDTH, ANTENNA_HEIGHT, depth],
    material: mat,
    "position-x": -width / 2 + ANTENNA_WIDTH / 2,
    "position-y": height / 2
  }));
}

function Pane(props) {
  const {
    width,
    height,
    children,
    ...rest
  } = props;
  const BORDER = 0.0075;
  return /*#__PURE__*/React.createElement("group", _extends({
    name: "pane"
  }, rest), /*#__PURE__*/React.createElement("mesh", {
    material: cache.mat_standard_black
  }, /*#__PURE__*/React.createElement("planeGeometry", {
    args: [width + BORDER * 2, height + BORDER * 2]
  })), /*#__PURE__*/React.createElement("mesh", {
    "position-z": 0.001
  }, /*#__PURE__*/React.createElement("planeGeometry", {
    args: [width, height]
  }), /*#__PURE__*/React.createElement("meshStandardMaterial", {
    color: "#20C20E"
  })), /*#__PURE__*/React.createElement("group", {
    name: "content",
    "position-z": 0.002
  }, children));
}

function Option(props) {
  const {
    onClick,
    width,
    children,
    index,
    ...rest
  } = props;
  const [hovered, setHovered] = useState(false);
  const {
    color
  } = useSpring({
    color: hovered ? "#b3b3b3" : "#ffffff"
  });
  const PADDING_X = 0.015;
  const PADDING_Y = 0.0125;
  const FONT_SIZE = 0.02;
  const DEPTH = 0.01;
  const CLIP_WIDTH = index === 0 ? width - PADDING_X * 4 : width - PADDING_X * 2;
  return /*#__PURE__*/React.createElement("group", _extends({
    name: "option"
  }, rest), /*#__PURE__*/React.createElement(RoundedBox, {
    args: [width, FONT_SIZE + PADDING_Y * 2, DEPTH]
  }, /*#__PURE__*/React.createElement(animated.meshStandardMaterial, {
    color: color
  })), /*#__PURE__*/React.createElement(HitBox, {
    args: [width, FONT_SIZE + PADDING_Y * 2, DEPTH],
    onClick: onClick,
    onHover: () => setHovered(true),
    onUnHover: () => setHovered(false)
  }), /*#__PURE__*/React.createElement("group", {
    "position-z": DEPTH / 2 + 0.001
  }, /*#__PURE__*/React.createElement(Text$2, {
    fontSize: FONT_SIZE,
    color: "black",
    anchorX: "left",
    "position-x": -width / 2 + PADDING_X,
    maxWidth: width // @ts-ignore
    ,
    whiteSpace: "nowrap",
    clipRect: [0, -Infinity, CLIP_WIDTH, Infinity]
  }, children)));
}

function DropDown(props) {
  const {
    value,
    items,
    onChange,
    width = 1,
    ...rest
  } = props;
  const [reset, setReset] = useState(false);
  const [open, setOpen] = useState(false);
  const [localIndex, setLocalIndex] = useState(0);
  const val = items.find(it => it.value == value) ?? items[localIndex];

  const setVal = value => {
    const ind = items.findIndex(it => it.value == value);
    if (ind === -1) return;
    if (onChange) onChange(items[ind]);
    setLocalIndex(ind);
  }; // keep local index up to date with incoming value


  useEffect(() => {
    if (!val) return;
    const ind = items.findIndex(item => item.value === (val == null ? void 0 : val.value));
    if (ind === -1 || localIndex === ind) return;
    setLocalIndex(ind);
  }, [items, localIndex, val]);
  const arr = open ? [...items].sort((x, y) => x == val ? -1 : y == val ? 1 : 0) : val ? [val] : [];
  const transition = useTransition(arr, {
    keys: item => item.value,
    trail: 300 / items.length,
    from: {
      scale: 0,
      y: 0
    },
    enter: (a, i) => ({
      scale: 1,
      y: -0.05 * i
    }),
    update: (a, i) => ({
      scale: 1,
      y: -0.05 * i
    }),
    leave: {
      scale: 0,
      y: 0
    },
    reset: reset,
    onRest: () => setReset(false)
  });
  const {
    rot,
    posZ
  } = useSpring({
    rot: open ? Math.PI : 0,
    posZ: open ? 0.025 : 0
  });

  const onClick = value => {
    if (open) {
      setVal(value);
      setReset(true);
    }

    setOpen(!open);
  };

  return /*#__PURE__*/React.createElement("group", _extends({
    name: "spacesvr-dropdown"
  }, rest), /*#__PURE__*/React.createElement(a.group, {
    "position-z": posZ
  }, transition((_ref, it, t, index) => {
    let {
      scale,
      y
    } = _ref;
    return /*#__PURE__*/React.createElement(a.group, {
      scale: scale,
      "position-y": y
    }, /*#__PURE__*/React.createElement(Option, {
      onClick: () => onClick(it.value),
      width: width,
      index: index
    }, it.text));
  }), items.length > 1 && /*#__PURE__*/React.createElement(a.group, {
    "rotation-z": rot,
    "position-x": width / 2 - 0.03 / 2 - 0.01,
    "position-z": 0.01 / 2 + 0.001
  }, /*#__PURE__*/React.createElement(Image$1, {
    src: "https://d27rt3a60hh1lx.cloudfront.net/icons/chevron-down.ktx2",
    scale: 0.03
  }))));
}

function VoiceLevels(props) {
  const {
    localStream
  } = useNetwork();
  const [analyser, setAnalyser] = useState();
  const [canvas] = useState(document.createElement("canvas"));
  const [dataArray] = useState(new Uint8Array(128));
  const canvasTexture = useRef(null);
  useEffect(() => {
    if (!localStream) return; // @ts-ignore

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 128;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);
    analyser.smoothingTimeConstant = 0.8;
    const source = audioCtx.createMediaStreamSource(localStream);
    source.connect(analyser);
    setAnalyser(analyser);
  }, [localStream]);
  useFrame(() => {
    const canvasCtx = canvas.getContext("2d");
    if (!analyser || !canvasCtx || !canvasTexture.current) return;
    canvasTexture.current.needsUpdate = true;
    analyser.getByteFrequencyData(dataArray);
    analyser.smoothingTimeConstant = 0.85;
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height); // canvasCtx.fillStyle = "#20C20E";
    // canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    canvasCtx.fillStyle = "rgb(0, 0, 0)";
    const buckets = 6;
    const spacing = 4;
    const height = 20;
    const sliceWidth = canvas.width / buckets - spacing;
    let x = 0;

    for (let b = 0; b < buckets; b++) {
      const base_perc = 0.2;
      const realY = (dataArray[b] / 256.0 * (1 - base_perc) + base_perc) * canvas.height;
      let y = 0;

      while (y < realY) {
        const nextY = Math.min(y + height, realY);
        canvasCtx.fillRect(x, canvas.height - y, sliceWidth, height);
        y = nextY + spacing;
      }

      x += sliceWidth + spacing;
    }
  });
  if (!localStream) return null;
  return /*#__PURE__*/React.createElement("group", _extends({
    name: "voice-levels"
  }, props), /*#__PURE__*/React.createElement("mesh", null, /*#__PURE__*/React.createElement("planeGeometry", {
    args: [0.095, 0.075]
  }), /*#__PURE__*/React.createElement("meshStandardMaterial", {
    transparent: true
  }, /*#__PURE__*/React.createElement("canvasTexture", {
    // minFilter={LinearFilter}
    ref: canvasTexture,
    args: [canvas],
    attach: "map"
  }))));
}

function Request(props) {
  const {
    width,
    ...rest
  } = props;
  const FONT_SIZE = 0.0225;
  const DEPTH = 0.01;
  const PADDING_Y = 0.0125;
  const NOT_AVAILABLE = !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia;
  const message = NOT_AVAILABLE ? "this site cannot access your microphone" : `give this site access to your microphone to talk!`;
  return /*#__PURE__*/React.createElement("group", rest, /*#__PURE__*/React.createElement(Text$2, {
    fontSize: FONT_SIZE,
    color: "black",
    "position-z": DEPTH / 2 + 0.001,
    maxWidth: width,
    textAlign: "center"
  }, message), /*#__PURE__*/React.createElement(RoundedBox, {
    args: [width, FONT_SIZE * 2 + PADDING_Y * 4, DEPTH],
    material: cache.mat_standard_white
  }));
}

function MicAccess(props) {
  const {
    width,
    ...rest
  } = props;
  const {
    localStream,
    setInputDevice
  } = useNetwork();
  const [inputDevices, setInputDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState();
  const [loading, setLoading] = useState(false);
  const [mute, setMute] = useState(false);
  const permissionGranted = !!localStream;
  const refreshDevices = useCallback(() => {
    var _navigator$mediaDevic;

    (_navigator$mediaDevic = navigator.mediaDevices) == null ? void 0 : _navigator$mediaDevic.enumerateDevices().then(devices => {
      devices = devices.filter(device => device.kind === "audioinput");
      devices = devices.filter((device, index) => devices.findIndex(d => d.groupId === device.groupId) === index);
      setInputDevices(devices);
    });
  }, []);
  useEffect(() => {
    if (localStream) refreshDevices();
  }, [localStream, refreshDevices]);
  useEffect(() => {
    if (!navigator.mediaDevices) return;

    navigator.mediaDevices.ondevicechange = () => refreshDevices();
  }, [refreshDevices]);
  useEffect(() => {
    const id = localStream == null ? void 0 : localStream.getTracks()[0].getSettings().deviceId;
    setLoading(!!selectedDevice && selectedDevice !== id);
  }, [localStream, selectedDevice]);
  useEffect(() => {
    if (!localStream) return;
    localStream.getAudioTracks()[0].enabled = !mute;
  }, [localStream, mute]);
  return /*#__PURE__*/React.createElement("group", _extends({
    name: "mic-access"
  }, rest), /*#__PURE__*/React.createElement(Pane, {
    width: width,
    height: 0.1
  }, /*#__PURE__*/React.createElement(Image$1, {
    src: mute || !permissionGranted ? "https://d27rt3a60hh1lx.cloudfront.net/icons/microphone-off.ktx2" : "https://d27rt3a60hh1lx.cloudfront.net/icons/microphone.ktx2",
    scale: 0.075,
    "position-x": -width / 2 + 0.075 / 2 + 0.04
  }), /*#__PURE__*/React.createElement("group", {
    "position-x": width / 2 - 0.075 / 2 - 0.04
  }, loading || !permissionGranted && /*#__PURE__*/React.createElement(Spinning, {
    ySpeed: 0,
    zSpeed: 2
  }, /*#__PURE__*/React.createElement(Image$1, {
    src: "https://d27rt3a60hh1lx.cloudfront.net/icons/loader.ktx2",
    scale: 0.075
  })), !loading && /*#__PURE__*/React.createElement(VoiceLevels, {
    "position-x": -0.01
  })), permissionGranted && /*#__PURE__*/React.createElement("group", {
    "position-y": -0.095
  }, /*#__PURE__*/React.createElement(Switch, {
    value: mute,
    onChange: setMute,
    scale: 0.4,
    "position-x": 0.07
  }), /*#__PURE__*/React.createElement(Text$2, {
    fontSize: 0.035,
    anchorX: "right",
    "position-x": -0.01,
    color: "black"
  }, "mute")), permissionGranted && /*#__PURE__*/React.createElement(DropDown, {
    "position-y": -0.15,
    value: localStream == null ? void 0 : localStream.getTracks()[0].getSettings().deviceId,
    items: inputDevices.map((device, i) => ({
      text: device.label || `microphone ${i}`,
      value: device.deviceId
    })),
    width: width,
    "position-z": 0,
    onChange: item => {
      setInputDevice(item.value);
      setSelectedDevice(item.value);
    }
  }), !permissionGranted && /*#__PURE__*/React.createElement(Request, {
    "position-y": -0.125,
    "position-z": 0.15,
    width: width
  })));
}

const FONT_URL$3 = "https://d27rt3a60hh1lx.cloudfront.net/fonts/Quicksand_Bold.otf";
function WalkieTalkie() {
  const TOOL_NAME = "Walkie Talkie";
  const toolbelt = useToolbelt();
  const {
    device
  } = useEnvironment();
  const WIDTH = 0.5;
  const HEIGHT = 0.55;
  const DEPTH = 0.1;
  return /*#__PURE__*/React.createElement(Tool, {
    name: TOOL_NAME,
    pos: [0, 0],
    range: device.mobile ? 0 : 0.2,
    pinY: true
  }, /*#__PURE__*/React.createElement("group", {
    "position-y": -0.05,
    scale: 1.25
  }, /*#__PURE__*/React.createElement(TalkieModel, {
    width: WIDTH,
    height: HEIGHT,
    depth: DEPTH
  }), /*#__PURE__*/React.createElement("group", {
    name: "content",
    "position-z": 0.1 / 2 + 0.001
  }, /*#__PURE__*/React.createElement(MicAccess, {
    "position-y": 0.15,
    width: WIDTH * 0.65
  }), /*#__PURE__*/React.createElement(Text$2, {
    fontSize: 0.022,
    color: "black",
    font: FONT_URL$3,
    maxWidth: WIDTH * 0.5,
    anchorY: "top",
    "position-y": -0.05,
    textAlign: "center",
    scale: 1.1
  }, "proximity voice chat is enabled in this world.\n\nwalk up to someone and say hello!"), /*#__PURE__*/React.createElement(Button$1, {
    onClick: () => toolbelt.hide(),
    fontSize: 0.03,
    "position-y": -0.21,
    "rotation-x": -0.4,
    color: "#f2445e"
  }, "close"))));
}

function Network(props) {
  const {
    children,
    disableEntities,
    autoconnect,
    ...connectionConfig
  } = props;
  const connection = useConnection(connectionConfig);
  const {
    connected,
    connect,
    disconnect
  } = connection; // connect on start if autoconnect is enabled

  useEffect(() => {
    if (autoconnect) connect();
  }, [autoconnect]); // log status on changes

  const lastVal = useRef(false);
  useEffect(() => {
    if (lastVal.current !== connected) {
      console.info(`network ${connected ? "connected" : "disconnected"}`);
      lastVal.current = connected;
    }
  }, [connected]); // disconnect on the way out (i hope it works)

  useEffect(() => {
    window.addEventListener("beforeunload", disconnect);
    return () => window.removeEventListener("beforeunload", disconnect);
  }, [disconnect]);
  return /*#__PURE__*/React.createElement(NetworkContext.Provider, {
    value: connection
  }, !disableEntities && /*#__PURE__*/React.createElement(NetworkedEntities, null), connection.voice && /*#__PURE__*/React.createElement(WalkieTalkie, null), children);
}

const defaultPhysicsProps = {
  size: 50,
  allowSleep: false,
  gravity: [0, -9.8, 0],
  defaultContactMaterial: {
    friction: 0
  }
};
function Physics(props) {
  const {
    children,
    ...physicsProps
  } = props;
  return /*#__PURE__*/React.createElement(Physics$1, _extends({}, defaultPhysicsProps, physicsProps), /*#__PURE__*/React.createElement(Suspense, {
    fallback: null
  }, children));
}

function StandardReality(props) {
  const {
    children,
    environmentProps,
    physicsProps,
    networkProps,
    playerProps,
    toolbeltProps,
    disableGround = false
  } = props;
  return /*#__PURE__*/React.createElement(Environment, environmentProps, /*#__PURE__*/React.createElement(Physics, physicsProps, /*#__PURE__*/React.createElement(Player, playerProps, /*#__PURE__*/React.createElement(Toolbelt, toolbeltProps, /*#__PURE__*/React.createElement(Network, networkProps, /*#__PURE__*/React.createElement(Visual, null, !disableGround && /*#__PURE__*/React.createElement(InfinitePlane, null), children))))));
}

const usePhotography = cam => {
  const {
    device
  } = useEnvironment();
  const {
    scene
  } = useThree();
  const [data, setData] = useState();
  const resolution = useMemo(() => new Vector2(3, 2).normalize().multiplyScalar(2186), []);
  const aspect = useMemo(() => resolution.clone().normalize(), [resolution]);
  const target = useMemo(() => new WebGLRenderTarget(resolution.x, resolution.y, {
    stencilBuffer: true,
    // text boxes look strange without this idk man
    minFilter: NearestFilter,
    magFilter: NearestFilter,
    format: RGBAFormat
  }), [resolution]);
  const renderer = useMemo(() => {
    const r = new WebGLRenderer({
      preserveDrawingBuffer: true,
      precision: "highp",
      antialias: true
    });
    r.useLegacyLights = false;
    r.toneMapping = NoToneMapping;
    r.outputEncoding = sRGBEncoding;
    return r;
  }, []);
  useEffect(() => {
    renderer.setSize(target.width, target.height);
    renderer.setPixelRatio(device.desktop ? 2 : 1); // could be 3, just really fat
  }, [device.desktop, target.width, target.height, renderer]);
  const takePicture = useCallback(() => {
    if (!cam.current) return;
    document.body.append(renderer.domElement);
    cam.current.aspect = aspect.x / aspect.y;
    renderer.render(scene, cam.current);
    const today = new Date();
    const name = document.title + " - www.muse.place" + window.location.pathname + " - " + today.toLocaleDateString("en-US") + " " + today.getHours() + ":" + today.getMinutes();

    if (!device.mobile) {
      const link = document.createElement("a");
      link.download = `${name}.jpg`;
      link.href = renderer.domElement.toDataURL("image/jpeg");
      link.click();
      link.remove();
    } else {
      setData(renderer.domElement.toDataURL("image/jpeg"));
    }

    document.body.removeChild(renderer.domElement);
  }, [aspect.x, aspect.y, cam, device.mobile, renderer, scene]);
  return {
    resolution,
    aspect,
    takePicture,
    target,
    renderer,
    data: {
      value: data,
      set: setData
    }
  };
};

const useRendering = (enabled, cam, group, mesh, photo) => {
  const {
    paused
  } = useEnvironment();
  const {
    scene
  } = useThree();
  const dummy = useMemo(() => new Vector3(), []);
  const qummy = useMemo(() => new Quaternion(), []); // prep render the camera until first pause to compile materials in advance rather than first time tool is enabled

  const prepRendering = useRef(true);
  useEffect(() => {
    if (!paused) prepRendering.current = false;
  }, [paused]);
  useLimitedFrame(1 / 4, state => {
    if (enabled || !prepRendering.current || !cam.current) return; // don't double render

    state.gl.autoClear = true;
    state.gl.setRenderTarget(photo.target);
    state.gl.render(scene, cam.current);
    state.gl.setRenderTarget(null);
    state.gl.autoClear = false;
  });
  useLimitedFrame(24, state => {
    if (!cam.current || !mesh.current || !group.current || !enabled) return; // move mesh to camera's position

    mesh.current.getWorldPosition(dummy);
    mesh.current.getWorldQuaternion(qummy);
    cam.current.position.set(0, 0, 0.3).applyQuaternion(qummy); // move back 0.3m

    cam.current.position.add(dummy);
    cam.current.rotation.setFromQuaternion(qummy);
    cam.current.aspect = photo.aspect.x / photo.aspect.y;
    cam.current.updateProjectionMatrix(); // render to camera viewfinder

    state.gl.autoClear = true;
    state.gl.setRenderTarget(photo.target);
    state.gl.render(scene, cam.current);
    state.gl.setRenderTarget(null);
    state.gl.autoClear = false;
  });
};

const FONT_FILE = "https://d27rt3a60hh1lx.cloudfront.net/fonts/Quicksand_Bold.otf";
function Instruction(props) {
  const {
    open,
    setOpen
  } = props;
  const {
    device
  } = useEnvironment();
  const CLOSED_SCALE = device.mobile ? 0.5 : 0.5;
  const {
    scale
  } = useSpring({
    scale: open ? 0 : CLOSED_SCALE
  });
  const FONT_SIZE = 0.055;
  const DESKTOP_TEXT = `Press          to ${open ? "close" : "open"}`;
  const MOBILE_TEXT = "tap to open";
  return /*#__PURE__*/React.createElement(a.group, {
    scale: scale,
    "position-x": device.mobile ? -0.05 : -0.45,
    "position-y": device.mobile ? -0.2 : 0.1,
    "position-z": 0.25,
    "rotation-x": 0.1,
    "rotation-y": -0.4
  }, /*#__PURE__*/React.createElement(Floating, {
    height: FONT_SIZE * 0.1,
    speed: device.mobile ? 8 : 0
  }, /*#__PURE__*/React.createElement(Text$2, {
    color: "white",
    fontSize: FONT_SIZE,
    maxWidth: 100,
    textAlign: "center",
    outlineColor: "black",
    outlineWidth: FONT_SIZE * 0.1,
    font: FONT_FILE,
    "position-y": -0.02
  }, device.mobile ? MOBILE_TEXT : DESKTOP_TEXT)), device.desktop && /*#__PURE__*/React.createElement(Floating, {
    height: FONT_SIZE * 0.1,
    speed: 8
  }, /*#__PURE__*/React.createElement(Key, {
    keyCode: "C",
    keyPress: ["c", "C"],
    scale: 0.1,
    "position-x": -0.035,
    "position-z": 0.1,
    "rotation-x": -0.3
  })));
}

const FONT_URL$2 = "https://d27rt3a60hh1lx.cloudfront.net/fonts/Quicksand_Bold.otf";
function DesktopControls(props) {
  const {
    cam,
    open,
    fov,
    ...rest
  } = props;
  const LINE_LENGTH = 0.05;
  const LINE_THICKNESS = 0.008;
  const AREA_WIDTH = 0.24;
  const INDICATOR_WIDTH = 0.18;
  const {
    posX
  } = useSpring({
    posX: fov.normalized * -INDICATOR_WIDTH + INDICATOR_WIDTH / 2
  });
  useEffect(() => {
    // increase/decrease fov on scroll
    const onScroll = e => {
      if (!cam.current) return;
      const newVal = cam.current.fov + e.deltaY * 0.05;
      fov.set(newVal);
    };

    window.addEventListener("wheel", onScroll);
    return () => window.removeEventListener("wheel", onScroll);
  }, [cam, fov]);
  return /*#__PURE__*/React.createElement("group", rest, /*#__PURE__*/React.createElement("mesh", {
    material: cache.mat_standard_white
  }, /*#__PURE__*/React.createElement("planeGeometry", {
    args: [INDICATOR_WIDTH, LINE_THICKNESS]
  })), /*#__PURE__*/React.createElement(animated.mesh, {
    material: cache.mat_standard_red,
    "position-x": posX,
    "position-y": LINE_LENGTH / 2 - LINE_THICKNESS / 2
  }, /*#__PURE__*/React.createElement("planeGeometry", {
    args: [LINE_THICKNESS, LINE_LENGTH]
  })), /*#__PURE__*/React.createElement(Text$2, {
    font: FONT_URL$2,
    color: "white",
    fontSize: 0.032,
    anchorY: "top",
    anchorX: "right",
    "position-y": -0.02,
    "position-x": AREA_WIDTH / 2,
    "position-z": 0.01,
    lineHeight: 1.3,
    renderOrder: 10,
    textAlign: "center",
    maxWidth: AREA_WIDTH
  }, "Scroll to zoom\n\n\nClick to shoot\n\n\nPress        to close"), /*#__PURE__*/React.createElement(Key, {
    keyCode: "C",
    scale: 0.05,
    position: [0.025, -0.29, 0.03]
  }));
}

const FONT_URL$1 = "https://d27rt3a60hh1lx.cloudfront.net/fonts/Quicksand_Bold.otf";
function ShutterButton(props) {
  const {
    open,
    pressed,
    setPressed,
    onPress,
    ...rest
  } = props;
  const {
    device
  } = useEnvironment();
  const [pressedOnce, setPressedOnce] = useState(false);
  useEffect(() => {
    if (pressed) {
      setTimeout(() => setPressed(false), 750);
      setPressedOnce(true);
    }
  }, [pressed, setPressed]);
  const {
    shutterY
  } = useSpring({
    shutterY: !pressed ? 1 : 0.6,
    config: config.stiff
  });
  return /*#__PURE__*/React.createElement("group", rest, /*#__PURE__*/React.createElement(animated.group, {
    "scale-y": shutterY
  }, /*#__PURE__*/React.createElement(RoundedBox, {
    args: [0.4, 0.55, 0.2],
    material: cache.mat_standard_red
  })), device.mobile && /*#__PURE__*/React.createElement(HitBox, {
    args: [0.4, 0.55, 0.2],
    onClick: onPress,
    scale: 1.5,
    "position-y": 0.2
  }, "close"), !pressedOnce && open && device.mobile && /*#__PURE__*/React.createElement(Floating, {
    height: 0.025,
    speed: 15
  }, /*#__PURE__*/React.createElement(Text$2, {
    font: FONT_URL$1,
    fontSize: 0.15,
    color: "white",
    outlineColor: "black",
    outlineWidth: 0.15 / 10,
    anchorY: "bottom",
    "position-y": 0.325
  }, "Tap to Shoot!")), /*#__PURE__*/React.createElement("mesh", {
    name: "cover-mesh",
    "position-x": 0.05,
    material: cache.mat_standard_black,
    "position-y": -0.17
  }, /*#__PURE__*/React.createElement("boxGeometry", {
    args: [0.5, 0.5, 0.3]
  })));
}

const MIN_FOV = 10;
const MAX_FOV = 85;
const useFov = cam => {
  const [fov, setFov] = useState(50);
  const change = useCallback(newVal => {
    if (!cam.current) return;
    const fov = MathUtils.clamp(newVal, MIN_FOV, MAX_FOV);
    cam.current.fov = fov;
    cam.current.updateProjectionMatrix();
    setFov(fov);
  }, [cam]);
  return {
    val: fov,
    normalized: (fov - MIN_FOV) / (MAX_FOV - MIN_FOV),
    set: change,
    min: MIN_FOV,
    max: MAX_FOV
  };
};

const FONT_URL = "https://d27rt3a60hh1lx.cloudfront.net/fonts/Quicksand_Bold.otf";
function MobileControls(props) {
  const {
    cam,
    open,
    setOpen,
    fov,
    ...rest
  } = props;
  const {
    gl
  } = useThree();
  const {
    raycaster
  } = usePlayer();
  const hitbox = useRef(null);
  const touchInside = useRef(false);
  const startVal = useRef();
  const LINE_LENGTH = 0.05;
  const LINE_THICKNESS = 0.008;
  const AREA_HEIGHT = 0.35;
  const {
    posY
  } = useSpring({
    posY: fov.normalized * -AREA_HEIGHT + AREA_HEIGHT / 2 - LINE_THICKNESS
  });
  useDrag({
    onStart: _ref => {
      let {
        e
      } = _ref;
      if (!hitbox.current) return;
      const intersections = raycaster.intersectObject(hitbox.current);
      if (intersections.length === 0) return;
      touchInside.current = true;
      e.stopImmediatePropagation();
    },
    onMove: _ref2 => {
      var _cam$current;

      let {
        delta
      } = _ref2;
      if (!touchInside.current) return;
      if (!startVal.current) startVal.current = ((_cam$current = cam.current) == null ? void 0 : _cam$current.fov) || 0;
      const newVal = startVal.current + delta.y * 0.5;
      fov.set(newVal);
    },
    onEnd: () => {
      touchInside.current = false;
      startVal.current = undefined;
    }
  }, gl.domElement, [fov]);
  return /*#__PURE__*/React.createElement("group", rest, /*#__PURE__*/React.createElement("group", {
    "position-y": -0.15
  }, /*#__PURE__*/React.createElement(HitBox, {
    ref: hitbox,
    args: [0.25, AREA_HEIGHT * 1.2, 0.05]
  }), /*#__PURE__*/React.createElement("mesh", {
    material: cache.mat_standard_white
  }, /*#__PURE__*/React.createElement("planeGeometry", {
    args: [LINE_THICKNESS * 2, AREA_HEIGHT]
  })), /*#__PURE__*/React.createElement(animated.mesh, {
    material: cache.mat_standard_red,
    "position-y": posY
  }, /*#__PURE__*/React.createElement("planeGeometry", {
    args: [LINE_LENGTH * 2, LINE_THICKNESS * 4]
  }))), /*#__PURE__*/React.createElement(Text$2, {
    font: FONT_URL,
    color: "white",
    fontSize: 0.044,
    anchorY: "top",
    anchorX: "center",
    "position-y": -0.35,
    "position-z": 0.01,
    lineHeight: 1.3,
    renderOrder: 10,
    textAlign: "center"
  }, "FOV Slider"), open && /*#__PURE__*/React.createElement(Button$1, {
    "position-y": 0.48,
    "position-x": -1,
    scale: 1.5,
    "rotation-x": 0.2,
    color: "#ff0000",
    onClick: () => setOpen(false)
  }, "close"));
}

const Wrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  z-index: 10;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 25px 25px 30px;
  box-sizing: border-box;
  background: black;
  width: 90vw;
`;
const Background = styled.div`
  position: absolute;
  z-index: 9;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: black;
  opacity: 0.6;
`;
const Image = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
`;
const Text = styled.p`
  color: white;
  text-align: center;
  font-size: 1.15rem;
`;
const Button = styled.button`
  background: white;
  border: none;
  color: black;
  padding: 10px 20px;
  font-size: 1rem;
  font-family: inherit;
  border-radius: 10px;
  font-weight: bold;
  margin: 0 auto;
`;
function PhotoPreview(props) {
  const {
    photo
  } = props;
  const {
    containerRef,
    device
  } = useEnvironment();
  if (!photo.data.value || !containerRef.current || !device.mobile) return null;
  return /*#__PURE__*/React.createElement(Html, null, /*#__PURE__*/createPortal( /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Wrapper, null, /*#__PURE__*/React.createElement(Image, {
    src: photo.data.value
  }), /*#__PURE__*/React.createElement(Text, null, "press and hold the image to save it"), /*#__PURE__*/React.createElement(Button, {
    onClick: () => photo.data.set(undefined)
  }, "close")), /*#__PURE__*/React.createElement(Background, null)), containerRef.current));
}

const AUDIO_URL = "https://d27rt3a60hh1lx.cloudfront.net/tools/camera/shutter-sound.mp3";
const CAMERA_MODEL_URL = "https://d1htv66kutdwsl.cloudfront.net/0308efc4-0b68-4b2e-b688-92512323178b/aa44f4af-f7c2-4050-9e6c-536ee07bbb1a.glb";
const CAMERA_ICON_URL = "https://d1htv66kutdwsl.cloudfront.net/44e643ef-7fe6-45da-9f99-54a5988ff338/8eb59c54-4aba-479a-b7cd-54a300b36c20.png";
const TIMEOUT = 2; //s

function Camera(props) {
  var _toolbelt$activeTool;

  const {
    onCapture
  } = props;
  const {
    device,
    paused
  } = useEnvironment();
  const {
    scene,
    clock
  } = useThree();
  const toolbelt = useToolbelt();
  const cam = useRef();
  const group = useRef(null);
  const mesh = useRef(null);
  const [open, setOpen] = useState(false);
  const [shutterPressed, setShutterPressed] = useState(false);
  const fov = useFov(cam);
  const lastShotTime = useRef(0);
  const ENABLED = ((_toolbelt$activeTool = toolbelt.activeTool) == null ? void 0 : _toolbelt$activeTool.name) === "Camera";
  const photo = usePhotography(cam);
  const dims = useHudDims();
  const SCALE = Math.min(dims.width * 0.25, device.mobile ? 0.2 : 0.325);
  const {
    rotX,
    rotY,
    scale
  } = useSpring({
    rotX: open ? 0 : 0.3,
    rotY: open ? 0 : device.mobile ? Math.PI - 0.5 : -0.1,
    scale: open ? SCALE : device.mobile ? 0.1 : 0.25,
    config: config.stiff
  });
  useRendering(ENABLED && open, cam, group, mesh, photo);
  const onClick = useCallback(() => {
    if (shutterPressed) return;
    if (lastShotTime.current + TIMEOUT > clock.getElapsedTime()) return;
    lastShotTime.current = clock.getElapsedTime();
    setShutterPressed(true);
    const audio = new Audio(AUDIO_URL);
    audio.play();
    setTimeout(() => {
      // let the shutter sound and anim play
      photo.takePicture();
      if (onCapture) onCapture();
    }, 300);
  }, [clock, onCapture, photo, shutterPressed]);
  useEffect(() => {
    if (!ENABLED || paused || device.mobile || !open) return;
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [ENABLED, device.mobile, onClick, open, paused]);
  useKeypress(["c", "C"], () => {
    if (isTyping() || !ENABLED) return;
    setOpen(!open);
  }, [ENABLED, open]);
  const POS = open ? [0, 0] : device.mobile ? [0.9, 0.9] : [0.8, -0.8];
  return /*#__PURE__*/React.createElement("group", {
    name: "camera-tool-resources",
    ref: group
  }, /*#__PURE__*/React.createElement(Tool, {
    name: "Camera",
    pos: POS,
    pinY: true,
    icon: CAMERA_ICON_URL,
    face: false,
    disableDraggable: open,
    onSwitch: e => !e && setOpen(false)
  }, /*#__PURE__*/React.createElement(Instruction, {
    open: open,
    setOpen: setOpen
  }), /*#__PURE__*/React.createElement(animated.group, {
    scale: scale,
    "rotation-x": rotX,
    "rotation-y": rotY
  }, /*#__PURE__*/React.createElement(Model, {
    src: CAMERA_MODEL_URL,
    center: true,
    normalize: true,
    "rotation-y": Math.PI,
    scale: 3
  }), device.mobile && !open && /*#__PURE__*/React.createElement(HitBox, {
    args: [3, 1.8, 1.6],
    "position-z": 0.3,
    onClick: () => setOpen(true)
  }), /*#__PURE__*/React.createElement("group", {
    name: "top-row",
    position: [1, 0.7, 0.75]
  }, /*#__PURE__*/React.createElement(ShutterButton, {
    open: open,
    pressed: shutterPressed,
    setPressed: setShutterPressed,
    onPress: onClick
  })), /*#__PURE__*/React.createElement("group", {
    name: "content",
    position: [0, -0.18, 1.101],
    scale: 2
  }, /*#__PURE__*/React.createElement("mesh", {
    ref: mesh,
    name: "viewfinder",
    position: [-0.15, 0.03, 0],
    "scale-x": 1.1,
    "scale-y": 1.1
  }, /*#__PURE__*/React.createElement("planeGeometry", {
    args: [photo.aspect.x, photo.aspect.y]
  }), /*#__PURE__*/React.createElement("meshStandardMaterial", {
    map: photo.target.texture,
    metalness: 0.68,
    roughness: 0.7
  })), device.desktop ? /*#__PURE__*/React.createElement(DesktopControls, {
    cam: cam,
    open: open,
    fov: fov,
    position: [0.485, 0.12, 0.005]
  }) : /*#__PURE__*/React.createElement(MobileControls, {
    cam: cam,
    open: open,
    setOpen: setOpen,
    fov: fov,
    position: [0.5, 0.12, 0.004]
  })))), createPortal$1( /*#__PURE__*/React.createElement(PerspectiveCamera, {
    ref: cam,
    near: 0.01,
    far: 300
  }), scene), /*#__PURE__*/React.createElement(PhotoPreview, {
    photo: photo
  }));
}

function LostWorld() {
  return /*#__PURE__*/React.createElement("group", {
    name: "lost-world"
  }, /*#__PURE__*/React.createElement(Fog, {
    color: "white",
    near: 0.1,
    far: 15
  }), /*#__PURE__*/React.createElement("directionalLight", {
    "position-y": 1,
    intensity: 1.8
  }), /*#__PURE__*/React.createElement("ambientLight", {
    intensity: 1
  }), /*#__PURE__*/React.createElement(Background$1, {
    color: "white"
  }), /*#__PURE__*/React.createElement(LostFloor, null));
}

export { Anchor, Arrow, Audio$1 as Audio, Background$1 as Background, Button$1 as Button, Camera, Collidable, Dialogue, Environment, EnvironmentContext, FacePlayer, Floating, Fog, Frame, HDRI, HitBox, Idea, Image$1 as Image, InfinitePlane, Interactable, Key, LookAtPlayer, LostFloor, LostWorld, Model, Network, NetworkContext, Physics, Player, PlayerContext, RoundedBox, Site, Spinning, StandardReality, Switch, TextInput, Tool, Toolbelt, ToolbeltContext, Video, Visual, VisualContext, VisualEffect, VisualIdea, VisualWorld, WalkieTalkie, World, cache, enableBVHRaycast, getHudDims, getHudPos, isTyping, useDrag, useEnvironment, useEnvironmentState, useHTMLInput, useHudDims, useImage, useKeyboardLayout, useKeypress, useLimitedFrame, useLimiter, useMetaHold, useModel, useNetwork, usePlayer, useRerender, useShiftHold, useTextInput, useToolbelt, useToolbeltState, useTrimeshCollision$1 as useTrimeshCollision, useVisible, useVisual };
