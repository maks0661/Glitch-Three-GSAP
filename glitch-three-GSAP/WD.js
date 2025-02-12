// эффект сбоя с Glitch.js
const title = document.querySelector('.neon-title');
if (title) {
  const glitch = new Glitch(title, {
    destroy: 5000, // время между сбоями
    intensity: 0.3, // Интенсивность эффекта
    scale: 1.1, // Масштаб текста при сбое
    debug: false // отладочный режим
  });
}

// переключать частицы
let particlesVisible = true;
document.getElementById('toggleParticles').addEventListener('click', () => {
  particlesVisible = !particlesVisible;
});

// 3D сцена с Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('3d-scene').appendChild(renderer.domElement);

// городская сетка
function createCityGrid() {
  const geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-10, 0, -10),
    new THREE.Vector3(10, 0, -10),
    new THREE.Vector3(10, 0, 10),
    new THREE.Vector3(-10, 0, 10),
    new THREE.Vector3(-10, 0, -10)
  ]);
  const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
  const line = new THREE.Line(geometry, material);
  scene.add(line);

  // здания
  for (let i = 0; i < 20; i++) {
    const cubeGeometry = new THREE.BoxGeometry(1, Math.random() * 5 + 2, 1);
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set((Math.random() - 0.5) * 20, Math.random() * 5, (Math.random() - 0.5) * 20);
    scene.add(cube);
  }
}

createCityGrid();

// дроны
function createDrones() {
  const droneGeometry = new THREE.SphereGeometry(0.3, 16, 16);
  const droneMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true });

  for (let i = 0; i < 5; i++) {
    const drone = new THREE.Mesh(droneGeometry, droneMaterial);
    drone.position.set((Math.random() - 0.5) * 20, Math.random() * 10 + 5, (Math.random() - 0.5) * 20);
    scene.add(drone);

    new TWEEN.Tween(drone.position)
      .to({ y: drone.position.y - 10 }, 5000)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .yoyo(true)
      .repeat(Infinity)
      .start();
  }
}

createDrones();

// данные о частицах дождя
function createParticles() {
  const particleGeometry = new THREE.BufferGeometry();
  const particleCount = 500;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20; // x
    positions[i * 3 + 1] = Math.random() * 20; // y
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20; // z
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMaterial = new THREE.PointsMaterial({ color: 0x00ffff, size: 0.1 });
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  function animateParticles() {
    if (!particlesVisible) return;

    for (let i = 0; i < particleCount; i++) {
      const y = positions[i * 3 + 1];
      if (y < -10) {
        positions[i * 3 + 1] = Math.random() * 20;
      } else {
        positions[i * 3 + 1] -= 0.05;
      }
    }

    particleGeometry.attributes.position.needsUpdate = true;
  }

  return animateParticles;
}

const animateParticles = createParticles();

camera.position.z = 20;

function animate() {
  requestAnimationFrame(animate);
  TWEEN.update();
  animateParticles();
  renderer.render(scene, camera);
}
animate();

// плавная анимация с помощью GSAP
gsap.to('.neon-title', {
  duration: 2,
  y: 20,
  repeat: -1,
  yoyo: true,
  ease: 'power1.inOut'
});