import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75, // field of view
  window.innerWidth / window.innerHeight, // aspect ratio
  0.1,
  1000 // view frustrum, controls which objects visible relative to the camera
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
}); // Renderer makes the magic happen (makes things work)

renderer.setPixelRatio(window.devicePixelRatio); // adapts to different devices
renderer.setSize(window.innerWidth, window.innerHeight); // sets a full screen canvas to different devices
camera.position.setZ(30); // better perspective, changes POV
camera.position.setX(-3);

renderer.render(scene, camera); // render == DRAW

// Adding objects
// Torus

const geometry = new THREE.TorusGeometry(10, 3, 16, 100); // Creates a Torus Shape
const material = new THREE.MeshStandardMaterial({
  // MeshStandardMaterial reacts to light bouncing off it.
  color: 0xff6347,
  // wireframe: true,
}); // Gives material to the shape (Torus) no light source needed
const torus = new THREE.Mesh(geometry, material); // Creates a mesh by combining geometry and material

scene.add(torus); // adds torus to the scene

// Lights

const pointLight = new THREE.PointLight(0xffffff); // allows object to be seen since now it is MeshStandardMaterial which reacts to light.
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff); // lights up everything in the scene equally
scene.add(pointLight, ambientLight); // adds point light to scene

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar); // adds 200 randomly positioned stars

// Background
const spaceTexture = new THREE.TextureLoader().load("space.jpg");
scene.background = spaceTexture;

// Avatar
const myTexture = new THREE.TextureLoader().load("Avatar.png");

const Avatar = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: myTexture })
);

scene.add(Avatar);

// Moon

const moonTexture = new THREE.TextureLoader().load("moon.jpg");
const normalTexture = new THREE.TextureLoader().load("normal.jpg");

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);

Avatar.position.z = -5;
Avatar.position.x = 2;

// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  Avatar.rotation.y += 0.01;
  Avatar.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  moon.rotation.x += 0.005;

  // controls.update(); // makes sure changes are updated

  renderer.render(scene, camera);
}

animate();
// We don't want to call the render method multiple times, so we set up a recursive function, giving us an infinite loop which calls the render method automatically
