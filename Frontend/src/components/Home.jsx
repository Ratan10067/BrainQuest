import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { Link } from "react-router-dom";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; // Correct import
import { useNavigate } from "react-router-dom";
export default function HomePage() {
  const navigate = useNavigate();
  const mountRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  function getStarfield({ numStars = 500, sprite } = {}) {
    function randomSpherePoint() {
      const radius = Math.random() * 25 + 25;
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      let x = radius * Math.sin(phi) * Math.cos(theta);
      let y = radius * Math.sin(phi) * Math.sin(theta);
      let z = radius * Math.cos(phi);

      return {
        pos: new THREE.Vector3(x, y, z),
        hue: 0.6, // radius * 0.02 + 0.5
        minDist: radius,
      };
    }
    const verts = [];
    const colors = [];
    const positions = [];
    let col;
    for (let i = 0; i < numStars; i += 1) {
      let p = randomSpherePoint();
      const { pos, hue } = p;
      positions.push(p);
      col = new THREE.Color().setHSL(hue, 0.2, Math.random());
      verts.push(pos.x, pos.y, pos.z);
      colors.push(col.r, col.g, col.b);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      map: sprite,
    });
    const points = new THREE.Points(geo, mat);
    return points;
  }
  //   useEffect(() => {
  //     const mount = mountRef.current;
  //     const width = mount.clientWidth;
  //     const height = mount.clientHeight;

  //     // Renderer
  //     const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  //     renderer.setSize(width, height);
  //     renderer.setPixelRatio(window.devicePixelRatio);
  //     mount.appendChild(renderer.domElement);

  //     // Scene & Camera
  //     const scene = new THREE.Scene();
  //     const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  //     camera.position.set(0, 0, 4);

  //     // Controls
  //     const orbitCtrl = new OrbitControls(camera, renderer.domElement);
  //     orbitCtrl.enableDamping = true;

  //     // Raycaster for UV
  //     const raycaster = new THREE.Raycaster();
  //     const pointer = new THREE.Vector2();
  //     const globeUV = new THREE.Vector2();

  //     // Load Textures
  //     const loader = new THREE.TextureLoader();
  //     const starSprite = loader.load("./assets/circle.png");
  //     const otherMap = loader.load("./assets/04_rainbow1k.jpg");
  //     const colorMap = loader.load("./assets/00_earthmap1k.jpg");
  //     const elevMap = loader.load("./assets/01_earthbump1k.jpg");
  //     const alphaMap = loader.load("./assets/02_earthspec1k.jpg");

  //     // Globe Group
  //     const globeGroup = new THREE.Group();
  //     scene.add(globeGroup);

  //     // Wireframe Globe
  //     const geo = new THREE.IcosahedronGeometry(1, 16);
  //     const mat = new THREE.MeshBasicMaterial({
  //       color: 0x0099ff,
  //       wireframe: true,
  //       transparent: true,
  //       opacity: 0.1,
  //     });
  //     const globeWire = new THREE.Mesh(geo, mat);
  //     globeGroup.add(globeWire);

  //     // Detailed Points
  //     const pointsGeo = new THREE.IcosahedronGeometry(1, 120);
  //     const vertexShader = `
  //       uniform float size;
  //       uniform sampler2D elevTexture;
  //       uniform vec2 mouseUV;
  //       varying vec2 vUv;
  //       varying float vVisible;
  //       varying float vDist;
  //       void main() {
  //         vUv = uv;
  //         vec4 mvP = modelViewMatrix * vec4(position,1.0);
  //         float elv = texture2D(elevTexture,vUv).r;
  //         vVisible = step(0.0,dot(-normalize(mvP.xyz),normalize(normalMatrix*normal)));
  //         mvP.z += 0.35 * elv;
  //         float dist = distance(mouseUV,vUv);
  //         float disp=0.0; float thresh=0.04;
  //         if(dist<thresh) disp=(thresh-dist)*10.0;
  //         vDist = dist;
  //         mvP.z += disp;
  //         gl_PointSize = size;
  //         gl_Position = projectionMatrix*mvP;
  //       }
  //     `;
  //     const fragmentShader = `
  //       uniform sampler2D colorTexture;
  //       uniform sampler2D alphaTexture;
  //       uniform sampler2D otherTexture;
  //       varying vec2 vUv;
  //       varying float vVisible;
  //       varying float vDist;
  //       void main() {
  //         if(floor(vVisible+0.1)==0.0) discard;
  //         float alpha = 1.0-texture2D(alphaTexture,vUv).r;
  //         vec3 color = texture2D(colorTexture,vUv).rgb;
  //         vec3 other = texture2D(otherTexture,vUv).rgb;
  //         float thresh=0.04;
  //         if(vDist<thresh) color=mix(color,other,(thresh-vDist)*50.0);
  //         gl_FragColor = vec4(color,alpha);
  //       }
  //     `;
  //     const uniforms = {
  //       size: { value: 4.0 },
  //       colorTexture: { value: colorMap },
  //       otherTexture: { value: otherMap },
  //       elevTexture: { value: elevMap },
  //       alphaTexture: { value: alphaMap },
  //       mouseUV: { value: new THREE.Vector2(0, 0) },
  //     };
  //     const pointsMat = new THREE.ShaderMaterial({
  //       uniforms,
  //       vertexShader,
  //       fragmentShader,
  //       transparent: true,
  //     });
  //     const points = new THREE.Points(pointsGeo, pointsMat);
  //     globeGroup.add(points);

  //     // Lights
  //     scene.add(new THREE.HemisphereLight(0xffffff, 0x080820, 3));
  //     scene.add(getStarfield({ numStars: 4500, sprite: starSprite }));

  //     // Handle Raycasting
  //     function handleRaycast() {
  //       raycaster.setFromCamera(pointer, camera);
  //       const inter = raycaster.intersectObject(globeWire);
  //       if (inter.length) globeUV.copy(inter[0].uv);
  //       uniforms.mouseUV.value = globeUV;
  //     }

  //     // Animation Loop
  //     const animate = () => {
  //       globeGroup.rotation.y += 0.002;
  //       handleRaycast();
  //       orbitCtrl.update();
  //       renderer.render(scene, camera);
  //       requestAnimationFrame(animate);
  //     };
  //     animate();

  //     // Mouse Move
  //     const onMove = (e) => {
  //       pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  //       pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  //     };
  //     window.addEventListener("mousemove", onMove);

  //     // Resize
  //     const onResize = () => {
  //       const w = mount.clientWidth;
  //       const h = mount.clientHeight;
  //       renderer.setSize(w, h);
  //       camera.aspect = w / h;
  //       camera.updateProjectionMatrix();
  //     };
  //     window.addEventListener("resize", onResize);

  //     // Cleanup
  //     return () => {
  //       window.removeEventListener("mousemove", onMove);
  //       window.removeEventListener("resize", onResize);
  //       orbitCtrl.dispose();
  //       mount.removeChild(renderer.domElement);
  //       renderer.dispose();
  //     };
  //   }, []);
  const handleCheckUserSigIn = () => {
    const user = localStorage.getItem("token");
    console.log(user);
    if (user) {
      navigate("/quiz");
    } else {
      navigate("/signup");
    }
  };
  return (
    <div className="flex flex-col min-h-screen bg-[#2c3250]">
      <header className="flex flex-col-reverse md:flex-row items-center justify-between flex-1 px-6 py-16">
        <div className="text-white md:w-1/2 space-y-6">
          <h2 className="text-5xl font-bold leading-tight">
            Quiz Smarter with{" "}
            <span className="text-yellow-300">BrainQuest</span>
          </h2>
          <p className="text-lg">
            Dynamic AI-generated quizzes, adaptive difficulty, and insightful
            analytics to boost your knowledge.
          </p>
          <button
            onClick={handleCheckUserSigIn}
            className="inline-block bg-yellow-300 cursor-pointer text-[#2c3250] font-semibold px-8 py-3 rounded-full hover:scale-105 transition"
          >
            Get Started
          </button>
        </div>
        <div ref={mountRef} className="w-full md:w-1/2 h-64 md:h-96" />
      </header>

      {/* Content Section */}
      <section className="px-6 py-12 bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h3 className="text-3xl font-semibold text-[#2c3250]">
            Why Choose BrainQuest?
          </h3>
          <p className="text-gray-700">
            Our platform offers real-time leaderboard, personalized quizzes, and
            global community challenges.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition">
              <h4 className="text-xl font-semibold text-[#2c3250] mb-2">
                AI Questions
              </h4>
              <p>
                Instantly generate fresh, relevant quiz questions on any topic.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition">
              <h4 className="text-xl font-semibold text-[#2c3250] mb-2">
                Adaptive Learning
              </h4>
              <p>Quizzes adjust in difficulty based on your performance.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition">
              <h4 className="text-xl font-semibold text-[#2c3250] mb-2">
                Global Leaderboard
              </h4>
              <p>Compete with learners worldwide and track your rank.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2c3250] text-white py-6 px-6 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p>
            &copy; {new Date().getFullYear()} BrainQuest. All rights reserved.
          </p>
          <div className="flex gap-1 space-x-4 mt-4 md:mt-0">
            <a href="#" aria-label="Facebook" className="hover:opacity-80">
              <img
                src="/icons/facebook.svg"
                alt="Facebook"
                className="w-6 h-6"
              />
            </a>
            <a href="" aria-label="Instagram" className="hover:opacity-80">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/1200px-Instagram_logo_2022.svg.png"
                alt="Instagram"
                className="w-7 h-8"
              />
            </a>
            <a
              href="https://www.linkedin.com/in/ratan-kumar-24961b285/"
              aria-label="LinkedIn"
              className="hover:opacity-80"
              target="_blank"
            >
              <img
                src="https://static.vecteezy.com/system/resources/previews/023/986/970/non_2x/linkedin-logo-linkedin-logo-transparent-linkedin-icon-transparent-free-free-png.png"
                alt="LinkedIn"
                className="w-10 h-10"
              />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
