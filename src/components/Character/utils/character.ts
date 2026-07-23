import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = () => {
    return new Promise<GLTF>((resolve, reject) => {
      let blobUrl: string | null = null;

      const fail = (error: unknown) => {
        if (blobUrl) URL.revokeObjectURL(blobUrl);
        dracoLoader.dispose();
        reject(error instanceof Error ? error : new Error(String(error)));
      };

      void (async () => {
      try {
        const encryptedBlob = await decryptFile(
          "/models/character.enc",
          "Character3D#@"
        );
          blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));

        let character: THREE.Object3D;
        loader.load(
          blobUrl,
          async (gltf) => {
              try {
                character = gltf.scene;
                await renderer.compileAsync(character, camera, scene);
                character.traverse((child: THREE.Object3D) => {
                  if ((child as THREE.Mesh).isMesh) {
                    const mesh = child as THREE.Mesh;
                    mesh.castShadow = true;
                    mesh.receiveShadow = true;
                    mesh.frustumCulled = true;
                  }
                });
                resolve(gltf);
                try {
                  setCharTimeline(character, camera);
                } catch (error) {
                  console.warn("Character timeline unavailable:", error);
                }
                try {
                  setAllTimeline();
                } catch (error) {
                  console.warn("Scroll timeline unavailable:", error);
                }
                const footR = character.getObjectByName("footR");
                const footL = character.getObjectByName("footL");
                if (footR) footR.position.y = 3.36;
                if (footL) footL.position.y = 3.36;
                if (blobUrl) URL.revokeObjectURL(blobUrl);
                blobUrl = null;
                dracoLoader.dispose();
              } catch (error) {
                fail(error);
              }
          },
          undefined,
            fail
        );
      } catch (err) {
          fail(err);
      }
      })();
    });
  };

  return { loadCharacter };
};

export default setCharacter;
