import { useEffect, useRef } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading } = useLoading();

  useEffect(() => {
    const host = canvasDiv.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let animationFrame = 0;
    let loadingTimeout = 0;
    let lightTimer = 0;
    let touchDebounce = 0;
    let hoverCleanup: (() => void) | undefined;
    let character: THREE.Object3D | null = null;
    let landingDiv: HTMLElement | null = null;
    let disposed = false;
    let removeSceneListeners = () => {};
    const scene = sceneRef.current;

    let mouse = { x: 0, y: 0 };
    let interpolation = { x: 0.1, y: 0.2 };

    const onMouseMove = (event: MouseEvent) => {
      handleMouseMove(event, (x, y) => (mouse = { x, y }));
    };
    const onTouchStart = (event: TouchEvent) => {
      const element = event.target as HTMLElement;
      touchDebounce = window.setTimeout(() => {
        element.addEventListener(
          "touchmove",
          (touchEvent) =>
            handleTouchMove(touchEvent, (x, y) => (mouse = { x, y })),
          { once: true }
        );
      }, 200);
    };
    const onTouchEnd = () => {
      handleTouchEnd((x, y, interpolationX, interpolationY) => {
        mouse = { x, y };
        interpolation = { x: interpolationX, y: interpolationY };
      });
    };

    try {
      const rect = host.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        throw new Error("The 3D character container has no visible size.");
      }

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      const activeRenderer = renderer;
      activeRenderer.setSize(rect.width, rect.height);
      activeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      activeRenderer.toneMapping = THREE.ACESFilmicToneMapping;
      activeRenderer.toneMappingExposure = 1;
      host.appendChild(activeRenderer.domElement);

      const camera = new THREE.PerspectiveCamera(
        14.5,
        rect.width / rect.height,
        0.1,
        1000
      );
      camera.position.set(0, 13.1, 24.7);
      camera.zoom = 1.1;
      camera.updateProjectionMatrix();

      let headBone: THREE.Object3D | null = null;
      let screenLight: THREE.Object3D | null = null;
      let mixer: THREE.AnimationMixer | null = null;
      const clock = new THREE.Clock();
      const light = setLighting(scene, activeRenderer);
      const progress = setProgress(setLoading);
      const { loadCharacter } = setCharacter(activeRenderer, scene, camera);

      const onContextLost = (event: Event) => {
        event.preventDefault();
        console.warn("WebGL context lost; continuing without the 3D character.");
        progress.clear();
        host.classList.add("character-model-failed");
      };
      const onResize = () => {
        if (character) {
          handleResize(activeRenderer, camera, canvasDiv, character);
        }
      };

      activeRenderer.domElement.addEventListener(
        "webglcontextlost",
        onContextLost
      );
      window.addEventListener("resize", onResize);
      document.addEventListener("mousemove", onMouseMove);
      landingDiv = document.getElementById("landingDiv");
      landingDiv?.addEventListener("touchstart", onTouchStart);
      landingDiv?.addEventListener("touchend", onTouchEnd);
      removeSceneListeners = () => {
        activeRenderer.domElement.removeEventListener(
          "webglcontextlost",
          onContextLost
        );
        window.removeEventListener("resize", onResize);
        document.removeEventListener("mousemove", onMouseMove);
        landingDiv?.removeEventListener("touchstart", onTouchStart);
        landingDiv?.removeEventListener("touchend", onTouchEnd);
      };

      loadingTimeout = window.setTimeout(() => {
        console.warn("3D character loading timed out; showing the fallback.");
        progress.clear();
        host.classList.add("character-model-failed");
      }, 15000);

      void loadCharacter()
        .then((gltf) => {
          if (disposed) return;
          window.clearTimeout(loadingTimeout);
          host.classList.remove("character-model-failed");
          character = gltf.scene;

          const bounds = new THREE.Box3().setFromObject(character);
          const size = bounds.getSize(new THREE.Vector3());
          const center = bounds.getCenter(new THREE.Vector3());
          const distance = Math.abs(camera.position.z - center.z);
          const visibleHeight =
            2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * distance;
          const fittedScale =
            size.y > 0 ? (visibleHeight * 0.88) / size.y : 1;
          character.scale.setScalar(fittedScale);
          character.position.set(
            -center.x * fittedScale,
            camera.position.y - center.y * fittedScale,
            -center.z * fittedScale
          );

          scene.add(character);

          const animations = setAnimations(gltf);
          mixer = animations.mixer;
          if (hoverDivRef.current) {
            hoverCleanup = animations.hover(gltf, hoverDivRef.current);
          }

          headBone =
            character.getObjectByName("spine006") ||
            character.getObjectByName("mixamorigHead") ||
            character.getObjectByName("Head") ||
            character.getObjectByName("head") ||
            character.getObjectByName("Spine3") ||
            null;
          screenLight = character.getObjectByName("screenlight") || null;

          void progress.loaded().then(() => {
            if (disposed) return;
            lightTimer = window.setTimeout(() => {
              if (disposed) return;
              light.turnOnLights();
              animations.startIntro();
            }, 2500);
          });
        })
        .catch((error) => {
          if (disposed) return;
          window.clearTimeout(loadingTimeout);
          console.error("Character model failed to load:", error);
          host.classList.add("character-model-failed");
          void progress.loaded();
        });

      const animate = () => {
        if (disposed) return;
        animationFrame = window.requestAnimationFrame(animate);
        if (headBone) {
          handleHeadRotation(
            headBone,
            mouse.x,
            mouse.y,
            interpolation.x,
            interpolation.y,
            THREE.MathUtils.lerp
          );
          light.setPointLight(screenLight);
        }
        if (mixer) mixer.update(clock.getDelta());
        activeRenderer.render(scene, camera);
      };
      animate();
    } catch (error) {
      console.error("Could not initialize the 3D scene:", error);
      host.classList.add("character-model-failed");
      setLoading(100);
    }

    return () => {
      disposed = true;
      window.clearTimeout(loadingTimeout);
      window.clearTimeout(lightTimer);
      window.clearTimeout(touchDebounce);
      window.cancelAnimationFrame(animationFrame);
      hoverCleanup?.();
      removeSceneListeners();
      scene.clear();
      renderer?.dispose();
      if (renderer && host.contains(renderer.domElement)) {
        host.removeChild(renderer.domElement);
      }
    };
  }, [setLoading]);

  return (
    <div className="character-container">
      <div className="character-model" ref={canvasDiv}>
        <div className="character-rim" />
        <div className="character-fallback" aria-hidden="true" />
        <div className="character-hover" ref={hoverDivRef} />
      </div>
    </div>
  );
};

export default Scene;
