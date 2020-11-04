import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";
import { Html, useGLTFLoader } from "drei";
import "./App.scss";
//Components
import Header from "./components/header";
import { Section } from "./components/section";

//Images
import fortuneTeller from "./assets/images/fortune_teller.jpg";

import state from "./components/state";

//intersection observer
import { useInView } from "react-intersection-observer";

const Model = ({ modelPath }) => {
  const gltf = useGLTFLoader(modelPath, true);
  console.log(gltf);
  return (
    <primitive
      attach="map"
      object={gltf.scene}
      dispose={null}
      position={[0, 0, 0]}
    />
  );
};

const Image = ({ img }) => {
  const texture = useLoader(THREE.TextureLoader, img);
  return (
    <mesh>
      <planeBufferGeometry attach="geometry" args={[3, 3]} />
      <meshBasicMaterial attach="material" map={texture} />
    </mesh>
  );
};

const Lights = () => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[0, 10, 0]} intensity={1.5} />
      <spotLight intensity={1} position={[1000, 0, 0]} />
    </>
  );
};
const HtmlContent = ({
  bgColor,
  domContent,
  children,
  modelPath,
  positionY,
  scale,
  yAxis,
}) => {
  const ref = useRef();
  const [isLeftToRight, setLTR] = useState(true);
  useFrame(() => {
    
    if (ref.current.rotation.y > Math.PI / 4) {
      setLTR(false);
    }
    if (ref.current.rotation.y < -Math.PI / 4) {
      setLTR(true);
    }

    if (isLeftToRight) {
      ref.current.rotation.y = ref.current.rotation.y + 0.01;
    } else {
      ref.current.rotation.y = ref.current.rotation.y - 0.01;
    }
  });
  const [refItem, inView] = useInView({
    threshold: 0.1,
  });
  useEffect(() => {
    inView && (document.body.style.backgroundColor = bgColor);
  }, [inView]);
  return (
    <Section factor={1.5} offset={1}>
      <group position={[0, positionY, 0]}>
        <mesh
          ref={ref}
          position={[0, yAxis, 0]}
          scale={scale}
          // material={new THREE.MeshNormalMaterial({ wireframe: true })}
        >
          <Model modelPath={modelPath} />
          {/* <Image img={fortuneTeller}/> */}
        </mesh>

        <Html portal={domContent} fullscreen>
          <div className="container" ref={refItem}>
            {children}
          </div>
        </Html>
      </group>
    </Section>
  );
};
export default function App() {
  const domContent = useRef();
  const scrollArea = useRef();
  const onScroll = (e) => (state.top.current = e.target.scrollTop);
  useEffect(() => void onScroll({ target: scrollArea.current }), []);

  return (
    <>
      <Header />
      <Canvas colorManagement camera={{ position: [0, 0, 120], fov: 70 }}>
        <Lights />
        <Suspense fallback={null}>
          <HtmlContent
            bgColor={"#DB4437"}
            domContent={domContent}
            scale={[3.5, 3.5, 3.5]}
            yAxis={-45}
            modelPath="/oc_october_-_31_irae/scene.gltf"
            positionY={250}
          >
            <div className="text-center">
              <h1 className="title">Fortune Teller</h1>
              <div>
                <button style={{backgroundColor:"#DB4437"}}>Explore Now</button>
              </div>
            </div>
          </HtmlContent>

          <HtmlContent
            bgColor={"#4285F4"}
            domContent={domContent}
            scale={[40, 40, 40]}
            yAxis={-35}
            modelPath="/plague_doctor/scene.gltf"
            positionY={0}
          >
            <div className="text-center">
              <h1 className="title">Movie Recommendations</h1>
              <div>
                <button style={{backgroundColor:"#4285F4"}}>Explore Now</button>
              </div>
            </div>
          </HtmlContent>
          <HtmlContent
            bgColor={"#F4B400"}
            domContent={domContent}
            scale={[3.5, 3.5, 3.5]}
            yAxis={-45}
            modelPath="/oc_october_-_31_irae/scene copy.gltf"
            positionY={-250}
          >
            <div className="text-center">
              <h1 className="title">Fortune Teller</h1>
              <div>
                <button style={{backgroundColor:"#F4B400"}}>Explore Now</button>
              </div>
            </div>
          </HtmlContent>

          <HtmlContent
            bgColor={"#0F9D58"}
            domContent={domContent}
            scale={[40, 40, 40]}
            yAxis={-35}
            modelPath="/plague_doctor/scene copy.gltf"
            positionY={-500}
          >
            <div className="text-center">
              <h1 className="title">Movie Recommendations</h1>
              <div>
                <button style={{backgroundColor:"#0F9D58"}}>Explore Now</button>
              </div>
            </div>
          </HtmlContent>
        </Suspense>
      </Canvas>
      <div className="scrollArea" ref={scrollArea} onScroll={onScroll}>
        <div style={{ position: "sticky", top: 0 }} ref={domContent}></div>
        <div style={{ height: `${state.sections * 100}vh` }}></div>
      </div>
    </>
  );
}
