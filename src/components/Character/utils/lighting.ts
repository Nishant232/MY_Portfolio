import * as THREE from "three";
import { gsap } from "gsap";

const setLighting = (scene: THREE.Scene, _renderer: THREE.WebGLRenderer) => {
  // Simple directional light — animates in when character loads
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

  // Ambient and hemisphere lights as the primary environment
  const ambientLight = new THREE.AmbientLight(0xc7a9ff, 0);
  scene.add(ambientLight);

  const hemisphereLight = new THREE.HemisphereLight(0xd0b0ff, 0x222244, 0);
  hemisphereLight.position.set(0, 20, 0);
  scene.add(hemisphereLight);

  // Additional fill lights for character visibility
  const fillLight = new THREE.DirectionalLight(0x9966ff, 0);
  fillLight.position.set(1, 5, 3);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xcc99ff, 0);
  rimLight.position.set(-2, 3, -2);
  scene.add(rimLight);

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
    // Fade in all lights
    gsap.to(ambientLight, { intensity: 0.6, duration, ease });
    gsap.to(hemisphereLight, { intensity: 0.5, duration, ease });
    gsap.to(directionalLight, { intensity: 1.2, duration, ease });
    gsap.to(fillLight, { intensity: 0.8, duration, ease });
    gsap.to(rimLight, { intensity: 0.4, duration, ease });
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
