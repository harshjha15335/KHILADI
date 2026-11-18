import React, { useEffect, useRef } from "react";
import * as THREE from "three";
export type SceneControl = {
  paint: (x: number, y: number) => void;
  pause: (p: boolean) => void;
};
let activeRenderers = 0;
const vertex = `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
// Original masked cricket-field foil. No reference shader or asset is reused.
const fragment = `precision highp float;
varying vec2 vUv;uniform vec2 uTilt;uniform vec2 uPointer;
float line(float v,float w){return 1.-smoothstep(w,w+.003,abs(v));}
void main(){
 vec2 uv=vUv;vec2 q=(uv-.5)*vec2(1.,1.55);
 vec3 N=normalize(vec3(uTilt.x*.9,uTilt.y*.9,1.));vec3 V=normalize(vec3(-uTilt.x*.6,-uTilt.y*.6,2.));
 vec3 L=normalize(vec3(.6+uPointer.x,-.2+uPointer.y,1.4));vec3 H=normalize(L+V);
 float fres=pow(1.-max(dot(N,V),0.),2.5);float spec=pow(max(dot(N,H),0.),26.);
 float phase=dot(q,vec2(3.8,2.1))+dot(uTilt,vec2(2.7,-1.8));
 vec3 rose=vec3(.93,.15,.48),royal=vec3(.10,.24,.63),lav=vec3(.65,.66,.95),gold=vec3(.91,.77,.43);
 float hue=.5+.5*sin(phase*3.5);vec3 foil=mix(royal,rose,hue);foil=mix(foil,lav,pow(.5+.5*cos(phase*2.+1.),3.)*.5);
 float broad=pow(max(0.,1.-abs(q.x*.9+q.y*.5+uTilt.x*.8-uTilt.y*.6)),4.);
 float rings=line(sin(length(q-vec2(0.,.06))*33.)*.08,.003);
 float field=line(length(q-vec2(0.,-.08))-.32,.002)+line(length(q-vec2(0.,-.08))-.48,.002);
 float pitch=line(abs(q.x)-.065,.002)*step(abs(q.y),.19)+line(abs(q.y)-.19,.002)*step(abs(q.x),.065);
 float etch=(rings*.23+field*.65+pitch*.5);
 float grain=fract(sin(dot(floor(uv*vec2(700.,1000.)),vec2(127.1,311.7)))*43758.5453);
 vec3 base=mix(vec3(.035,.085,.24),foil,.38+.38*broad);
 base+=foil*broad*.32+lav*spec*.48+gold*pow(spec,2.)*.19+etch*mix(lav,gold,hue)*(.14+.36*broad);
 base+=grain*.016;float rim=pow(1.-min(min(uv.x,1.-uv.x),min(uv.y,1.-uv.y))*2.,12.);
 base+=lav*rim*.13+fres*rose*.15;
 gl_FragColor=vec4(base,1.);
}`;
export default function FoilScene({
  control,
  onFallback,
}: {
  control: React.MutableRefObject<SceneControl | null>;
  onFallback: () => void;
}) {
  const mount = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    let renderer: THREE.WebGLRenderer | undefined,
      disposed = false,
      paused = false,
      painted = 0,
      frame = 0;
    const scene = new THREE.Scene(),
      resources: Array<{ dispose: () => void }> = [];
    const telemetry = (kind: string) =>
      window.dispatchEvent(
        new CustomEvent("royal-renderer-lifecycle", {
          detail: { kind, active: activeRenderers, paints: painted },
        }),
      );
    const fallback = () => {
      if (!disposed) {
        el.dataset.context = "lost";
        onFallback();
      }
    };
    try {
      if (activeRenderers) throw new Error("A card renderer is already active");
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2", {
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
      if (!gl) throw new Error("WebGL2 unavailable");
      renderer = new THREE.WebGLRenderer({
        canvas,
        context: gl,
        alpha: true,
        antialias: true,
      });
      activeRenderers++;
      telemetry("mount");
      renderer.setPixelRatio(
        Math.min(devicePixelRatio, innerWidth < 600 ? 1 : 1.5),
      );
      renderer.setClearColor(0, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      el.appendChild(renderer.domElement);
      el.dataset.context = "ready";
      renderer.domElement.setAttribute("aria-hidden", "true");
      renderer.domElement.addEventListener("webglcontextlost", lost);
      const camera = new THREE.OrthographicCamera(
        -1.08,
        1.08,
        1.68,
        -1.68,
        0.1,
        20,
      );
      camera.position.z = 7;
      const uniforms = {
        uTilt: { value: new THREE.Vector2() },
        uPointer: { value: new THREE.Vector2() },
      };
      const foil = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: vertex,
        fragmentShader: fragment,
      });
      const geometry = new THREE.PlaneGeometry(1.96, 3.11);
      resources.push(foil, geometry);
      scene.add(new THREE.Mesh(geometry, foil));
      function rounded(w: number, h: number, r: number) {
        const s = new THREE.Shape();
        s.moveTo(-w / 2 + r, -h / 2);
        s.lineTo(w / 2 - r, -h / 2);
        s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
        s.lineTo(w / 2, h / 2 - r);
        s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
        s.lineTo(-w / 2 + r, h / 2);
        s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
        s.lineTo(-w / 2, -h / 2 + r);
        s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
        return s;
      }
      const shape = rounded(2.05, 3.2, 0.13);
      const hole = rounded(1.94, 3.09, 0.1);
      shape.holes.push(new THREE.Path(hole.getPoints().reverse()));
      const frameG = new THREE.ExtrudeGeometry(shape, {
        depth: 0.045,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: 0.014,
        bevelThickness: 0.018,
      });
      const frameM = new THREE.MeshStandardMaterial({
        color: 0xb7b8dd,
        metalness: 0.82,
        roughness: 0.24,
      });
      resources.push(frameG, frameM);
      const border = new THREE.Mesh(frameG, frameM);
      border.position.z = 0.025;
      scene.add(border);
      scene.add(new THREE.AmbientLight(0xb6c4ff, 2));
      const pink = new THREE.PointLight(0xff65aa, 17, 20);
      pink.position.set(-2, 1, 3);
      scene.add(pink);
      const blue = new THREE.PointLight(0xe8d4ac, 22, 20);
      blue.position.set(2, 2, 4);
      scene.add(blue);
      const draw = () => {
        frame = 0;
        if (disposed || paused || !renderer) return;
        renderer.render(scene, camera);
        painted++;
        el.dataset.paints = String(painted);
        el.dataset.geometries = String(renderer.info.memory.geometries);
        el.dataset.textures = String(renderer.info.memory.textures);
      };
      const schedule = () => {
        if (!frame && !paused && !disposed) frame = requestAnimationFrame(draw);
      };
      control.current = {
        paint: (x, y) => {
          uniforms.uTilt.value.set(y / 18, -x / 18);
          uniforms.uPointer.value.set(y / 20, -x / 20);
          pink.position.x = -2 + y / 8;
          blue.position.y = 2 - x / 10;
          schedule();
        },
        pause: (p) => {
          paused = p;
          if (p) {
            cancelAnimationFrame(frame);
            frame = 0;
          } else schedule();
        },
      };
      const resize = () => {
        if (disposed || !renderer) return;
        renderer.setSize(el.clientWidth, el.clientHeight, false);
        schedule();
      };
      const observer = new ResizeObserver(resize);
      observer.observe(el);
      resize();
      return () => {
        observer.disconnect();
        cleanup();
      };
    } catch {
      fallback();
      return cleanup;
    }
    function lost(e: Event) {
      e.preventDefault();
      fallback();
    }
    function cleanup() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(frame);
      control.current = null;
      resources.forEach((r) => r.dispose());
      scene.clear();
      if (renderer) {
        renderer.domElement.removeEventListener("webglcontextlost", lost);
        renderer.dispose();
        renderer.forceContextLoss();
        renderer.domElement.remove();
        activeRenderers--;
        telemetry("dispose");
      }
    }
  }, [control, onFallback]);
  return <div className="rc-webgl" ref={mount} aria-hidden="true" />;
}
