import * as THREE from "three";
import { GLTF } from "three-stdlib";

const setAnimations = (gltf: GLTF) => {
  let character = gltf.scene;
  let mixer = new THREE.AnimationMixer(character);
  const clips = gltf.animations || [];

  // Log available animations for debugging
  if (clips.length > 0) {
    console.log("Available animations:", clips.map((c) => c.name).join(", "));
  }

  // Try to find specific animations; fall back gracefully to what's available
  const findClip = (name: string) =>
    clips.find((c) => c.name.toLowerCase() === name.toLowerCase()) || null;

  const idleClip =
    findClip("idle") ||
    findClip("Idle") ||
    findClip("TPose") ||
    clips[0] || null;

  const walkClip =
    findClip("walk") ||
    findClip("Walk") ||
    findClip("run") ||
    findClip("Run") ||
    clips[1] || null;

  // Play idle/default animation immediately
  let idleAction: THREE.AnimationAction | null = null;
  if (idleClip) {
    idleAction = mixer.clipAction(idleClip);
    idleAction.play();
  }

  function startIntro() {
    // Try to transition from idle to walk and back, creating an "intro" effect
    if (walkClip && idleAction) {
      const walkAction = mixer.clipAction(walkClip);
      walkAction.enabled = true;
      idleAction.fadeOut(0.5);
      walkAction.reset().fadeIn(0.5).play();
      setTimeout(() => {
        walkAction.fadeOut(1.0);
        if (idleAction) {
          idleAction.reset().fadeIn(1.0).play();
        }
      }, 3000);
    }
  }

  function hover(_gltf: GLTF, hoverDiv: HTMLDivElement) {
    if (!hoverDiv) return;
    const onHoverFace = () => {
      if (walkClip) {
        const walkAction = mixer.clipAction(walkClip);
        walkAction.reset().fadeIn(0.3).play();
        if (idleAction) idleAction.fadeOut(0.3);
      }
    };
    const onLeaveFace = () => {
      if (walkClip && idleAction) {
        const walkAction = mixer.clipAction(walkClip);
        walkAction.fadeOut(0.5);
        idleAction.reset().fadeIn(0.5).play();
      }
    };
    hoverDiv.addEventListener("mouseenter", onHoverFace);
    hoverDiv.addEventListener("mouseleave", onLeaveFace);
    return () => {
      hoverDiv.removeEventListener("mouseenter", onHoverFace);
      hoverDiv.removeEventListener("mouseleave", onLeaveFace);
    };
  }

  return { mixer, startIntro, hover };
};

export default setAnimations;
