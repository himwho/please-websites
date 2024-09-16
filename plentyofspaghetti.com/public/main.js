// public/main.js

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create and add light to the scene
const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1, 1000);
pointLight.position.set(0, 0, 0); // Place the light at the sun's position
scene.add(pointLight);

// Load textures
const loader = new THREE.TextureLoader();

// Load meatball texture for planets and moons
const meatballTexture = loader.load('img/meatballs/2.png');

// Load a different meatball texture for the sun
const sunTexture = loader.load('img/meatballs/1.jpg');

// Helper function to create a meatball
function createMeatball(radius, texture) {
  const geometry = new THREE.SphereGeometry(radius, 32, 32);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const meatball = new THREE.Mesh(geometry, material);
  meatball.radius = radius;
  return meatball;
}

// Create solar system
const planets = [];
const orbitRadii = [15, 30, 45]; // Adjusted radii for orbit
const planetCount = orbitRadii.length;
const timescale = document.getElementById('timescale');
let time = 0;

// Create the sun at the center
const sun = createMeatball(5, sunTexture);
sun.position.set(0, 0, 0);
scene.add(sun);

// Add planets to the scene
for (let i = 0; i < planetCount; i++) {
  const planet = createMeatball(2, meatballTexture);
  const orbitRadius = orbitRadii[i];
  planet.orbitRadius = orbitRadius;
  planet.angle = Math.random() * Math.PI * 2;
  planet.position.x = orbitRadius * Math.cos(planet.angle);
  planet.position.z = orbitRadius * Math.sin(planet.angle);
  planet.userData = { hasMoons: false }; // Initialize moon status
  planets.push(planet);
  scene.add(planet);
}

// Add moons to two of the planets
const moons = [];
const moonOrbitRadius = 3; // Distance of moons from their planets

// Let's add moons to the first and second planets
for (let i = 0; i < 2; i++) {
  const planet = planets[i];
  planet.userData.hasMoons = true;
  const moonCount = 2; // Number of moons for each planet

  for (let j = 0; j < moonCount; j++) {
    const moon = createMeatball(0.5, meatballTexture);
    moon.orbitRadius = moonOrbitRadius + j * 1; // Slightly different orbit radii for multiple moons
    moon.angle = Math.random() * Math.PI * 2;
    moon.parentPlanet = planet;
    moons.push(moon);
    scene.add(moon);
  }
}

// Add spaghetti noodles (trails) to the planets
const trails = [];
planets.forEach((planet) => {
  const positions = [];
  const trailGeometry = new THREE.BufferGeometry();
  const trailMaterial = new THREE.LineBasicMaterial({ color: 0xffd700 }); // Golden color for spaghetti
  const trail = new THREE.Line(trailGeometry, trailMaterial);
  scene.add(trail);
  trails.push({ trail, positions });
});

// Set up OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

// Array to hold exploding noodles
const noodles = [];

// Raycaster for detecting clicks
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Event listener for clicks
window.addEventListener('click', onClick, false);

function onClick(event) {
  // Calculate mouse position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the raycaster
  raycaster.setFromCamera(mouse, camera);

  // Check for intersections with planets
  const intersects = raycaster.intersectObjects(planets);

  if (intersects.length > 0) {
    const planet = intersects[0].object;
    spawnNoodles(planet);
  }
}

function spawnNoodles(planet) {
  const noodleCount = 20;
  for (let i = 0; i < noodleCount; i++) {
    const noodleLength = 1 + Math.random() * 2;
    const noodleGeometry = new THREE.CylinderGeometry(0.05, 0.05, noodleLength, 8);
    const noodleMaterial = new THREE.MeshBasicMaterial({ color: 0xffd700 }); // Golden color for noodles
    const noodle = new THREE.Mesh(noodleGeometry, noodleMaterial);

    // Position the noodle at the planet's position
    noodle.position.copy(planet.position);

    // Random orientation
    noodle.rotation.x = Math.random() * Math.PI * 2;
    noodle.rotation.y = Math.random() * Math.PI * 2;
    noodle.rotation.z = Math.random() * Math.PI * 2;

    // Assign a random velocity
    const velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2
    );

    // Add custom properties
    noodle.userData = {
      velocity: velocity,
      life: 2 + Math.random() * 3, // Lifetime in seconds
    };

    noodles.push(noodle);
    scene.add(noodle);
  }
}

// Update function
function animate() {
  requestAnimationFrame(animate);
  const deltaTime = (timescale ? timescale.valueAsNumber : 1) * 0.01; // Adjust deltaTime based on timescale

  time += deltaTime;

  // Update planets
  planets.forEach((planet, index) => {
    planet.angle += deltaTime / planet.orbitRadius; // Simple orbital movement
    planet.position.x = planet.orbitRadius * Math.cos(planet.angle);
    planet.position.z = planet.orbitRadius * Math.sin(planet.angle);

    // Update trail with wiggle effect
    const trailInfo = trails[index];
    const wiggleAmplitude = 0.5;
    const wiggleFrequency = 5;

    // Calculate wiggled position
    const wiggledPosition = planet.position.clone();
    wiggledPosition.y =
      wiggleAmplitude * Math.sin(wiggleFrequency * planet.angle + index);

    trailInfo.positions.push(wiggledPosition);

    // Limit the trail length
    if (trailInfo.positions.length > 500) {
      trailInfo.positions.shift();
    }

    // Update buffer geometry
    const positionsArray = new Float32Array(trailInfo.positions.length * 3);
    for (let i = 0; i < trailInfo.positions.length; i++) {
      positionsArray[i * 3] = trailInfo.positions[i].x;
      positionsArray[i * 3 + 1] = trailInfo.positions[i].y;
      positionsArray[i * 3 + 2] = trailInfo.positions[i].z;
    }
    trailInfo.trail.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positionsArray, 3)
    );
    trailInfo.trail.geometry.attributes.position.needsUpdate = true;
    trailInfo.trail.geometry.setDrawRange(0, trailInfo.positions.length);
  });

  // Update moons
  moons.forEach((moon) => {
    moon.angle += deltaTime / moon.orbitRadius;
    const planetPos = moon.parentPlanet.position;

    moon.position.x =
      planetPos.x + moon.orbitRadius * Math.cos(moon.angle);
    moon.position.z =
      planetPos.z + moon.orbitRadius * Math.sin(moon.angle);
    moon.position.y = planetPos.y; // Keep moons in the same plane
  });

  // Update exploding noodles
  for (let i = noodles.length - 1; i >= 0; i--) {
    const noodle = noodles[i];
    noodle.userData.life -= deltaTime;

    if (noodle.userData.life <= 0) {
      scene.remove(noodle);
      noodles.splice(i, 1);
      continue;
    }

    // Update position based on velocity
    noodle.position.add(noodle.userData.velocity.clone().multiplyScalar(deltaTime));

    // Wiggle effect
    noodle.rotation.x += deltaTime * 10;
    noodle.rotation.y += deltaTime * 10;
  }

  controls.update(); // Update controls
  renderer.render(scene, camera);
}

// Adjust camera position
camera.position.z = 80;

// Handle window resize
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

animate();
