import * as THREE from "three";
import { RGBELoader } from "three-stdlib";
import { gsap } from "gsap";

const setLighting = (scene: THREE.Scene) => {
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

  // Fallback ambient lighting in case HDR fails to load
  const ambientLight = new THREE.AmbientLight(0xc7a9ff, 0);
  scene.add(ambientLight);

  const hemisphereLight = new THREE.HemisphereLight(0xc7a9ff, 0x444488, 0);
  hemisphereLight.position.set(0, 20, 0);
  scene.add(hemisphereLight);

  let hdrLoaded = false;

  new RGBELoader()
    .setPath("/models/")
    .load(
      "char_enviorment.hdr",
      function (texture) {
        hdrLoaded = true;
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
        scene.environmentIntensity = 0;
        scene.environmentRotation.set(5.76, 85.85, 1);
      },
      undefined,
      function (error) {
        // HDR failed to load (corrupted/missing) – fallback to ambient lighting
        console.warn("HDR environment map failed to load, using fallback lighting.", error);
        hdrLoaded = false;
      }
    );

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
    if (hdrLoaded) {
      gsap.to(scene, {
        environmentIntensity: 0.64,
        duration: duration,
        ease: ease,
      });
    } else {
      // Fallback: animate ambient and hemisphere lights instead
      gsap.to(ambientLight, {
        intensity: 0.8,
        duration: duration,
        ease: ease,
      });
      gsap.to(hemisphereLight, {
        intensity: 0.5,
        duration: duration,
        ease: ease,
      });
    }
    gsap.to(directionalLight, {
      intensity: 1,
      duration: duration,
      ease: ease,
    });
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
