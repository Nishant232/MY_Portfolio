import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { gsap } from "gsap";

const setLighting = (scene: THREE.Scene, renderer: THREE.WebGLRenderer) => {
  const directionalLight = new THREE.DirectionalLight(0xc7a9ff, 0);
  directionalLight.intensity = 0;
  directionalLight.position.set(-0.47, -0.32, -1);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;
  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0xc2a4ff, 0, 100, 3);
  pointLight.position.set(3, 12, 4);
  pointLight.castShadow = true;
  scene.add(pointLight);

  const ambientLight = new THREE.AmbientLight(0xc7a9ff, 0);
  scene.add(ambientLight);

  const hemisphereLight = new THREE.HemisphereLight(0xc7a9ff, 0x444488, 0);
  hemisphereLight.position.set(0, 20, 0);
  scene.add(hemisphereLight);

  // Use programmatic PMREMGenerator environment — no HDR file needed, never crashes WebGL
  let envReady = false;
  try {
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    const envTexture = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    scene.environment = envTexture;
    scene.environmentIntensity = 0;
    scene.environmentRotation.set(5.76, 85.85, 1);
    roomEnv.dispose();
    pmremGenerator.dispose();
    envReady = true;
  } catch (e) {
    console.warn("PMREMGenerator failed, using fallback lights only.", e);
  }

  function setPointLight(screenLight: any) {
    if (screenLight && screenLight.material && screenLight.material.opacity > 0.9) {
      pointLight.intensity = screenLight.material.emissiveIntensity * 20;
    } else {
      pointLight.intensity = 0;
    }
  }

  const duration = 2;
  const ease = "power2.inOut";

  function turnOnLights() {
    if (envReady) {
      gsap.to(scene, {
        environmentIntensity: 0.64,
        duration: duration,
        ease: ease,
      });
    } else {
      gsap.to(ambientLight, { intensity: 0.8, duration, ease });
      gsap.to(hemisphereLight, { intensity: 0.5, duration, ease });
    }
    gsap.to(directionalLight, { intensity: 1, duration, ease });
    gsap.to(".character-rim", {
      y: "55%",
      opacity: 1,
      delay: 0.2,
      duration: 2,
    });
  }

  return { setPointLight, turnOnLights };
};

export default setLighting;
