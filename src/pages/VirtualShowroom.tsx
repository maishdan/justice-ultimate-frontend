import { useEffect, useRef } from 'react';
import * as THREE from 'three';
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const VirtualShowroom = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentMount = mountRef.current;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#f5f5f5');

    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount!.clientWidth / currentMount!.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount!.clientWidth, currentMount!.clientHeight);
    currentMount!.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color: '#2e86de' });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    new OrbitControls(camera, renderer.domElement);

    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      currentMount!.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="w-full h-screen bg-white">
      <h1 className="text-3xl font-bold text-center mt-4 mb-2 text-blue-700">
        🚗 Virtual Showroom
      </h1>
      <p className="text-center text-gray-500 mb-4">
        Interact with a 3D model of our vehicle
      </p>
      <div ref={mountRef} className="w-full h-[80vh] mx-auto rounded-xl shadow-lg"></div>
    </div>
  );
};

export default VirtualShowroom;
