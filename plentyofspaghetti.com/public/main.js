// public/main.js

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();

// Add fake stars to the background
const starCount = 1000;
addStars();

function addStars() {
  const starsGeometry = new THREE.BufferGeometry();
  const starVertices = [];

  for (let i = 0; i < starCount; i++) {
    const x = THREE.MathUtils.randFloatSpread(2000);
    const y = THREE.MathUtils.randFloatSpread(2000);
    const z = THREE.MathUtils.randFloatSpread(2000);
    starVertices.push(x, y, z);
  }

  starsGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(starVertices, 3)
  );

  const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff });
  const starField = new THREE.Points(starsGeometry, starsMaterial);

  scene.add(starField);
}

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  5000
);
camera.position.z = 100;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create and add light to the scene
const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1, 2000);
pointLight.position.set(0, 0, 0); // Place the light at the sun's position
scene.add(pointLight);

// Load textures
const loader = new THREE.TextureLoader();

// Arrays of image URLs for planets and moons
const planetImages = [
  'img/meatballs/2.png',
  'img/meatballs/3.png',
];

const moonImages = [
  'img/olives/1.png',
  'img/olives/2.png',
  'img/olives/3.png',
  'img/olives/4.png',
  'img/olives/5.png',
];

// Sauce ring texture
const ringTexture = loader.load('img/sauce/1.png'); // Ensure this image exists

// Helper function to create a meatball with a random texture
function createMeatball(radius, texturePath) {
  const geometry = new THREE.SphereGeometry(radius, 32, 32);
  const texture = loader.load(texturePath);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const meatball = new THREE.Mesh(geometry, material);
  meatball.radius = radius;
  return meatball;
}

// Create solar system
const planets = [];
const orbitRadii = [20, 40, 60, 80, 100, 120]; // Increased number of planets
const planetCount = orbitRadii.length;
const timescale = document.getElementById('timescale');
let time = 0;

// Create the sun at the center
// Load a different meatball texture for the sun
const sun = createMeatball(5, 'img/meatballs/1.jpg');
sun.position.set(0, 0, 0);
scene.add(sun);

// Add planets to the scene
for (let i = 0; i < planetCount; i++) {
  // Randomly select a planet image
  const planetImage =
    planetImages[Math.floor(Math.random() * planetImages.length)];
  const planet = createMeatball(3, planetImage);
  const orbitRadius = orbitRadii[i];
  planet.orbitRadius = orbitRadius;
  planet.angle = Math.random() * Math.PI * 2;
  planet.position.x = orbitRadius * Math.cos(planet.angle);
  planet.position.z = orbitRadius * Math.sin(planet.angle);
  planet.userData = { hasMoons: false }; // Initialize moon status
  planets.push(planet);
  scene.add(planet);

  // Add sauce rings to two specific planets
  if (i === 2 || i === 4) {
    // Adding rings to the 3rd and 5th planets
    addSauceRing(planet);
  }
}

function addSauceRing(planet) {
  const ringGeometry = new THREE.RingGeometry(
    planet.radius * 1.5,
    planet.radius * 3,
    64
  );
  const ringMaterial = new THREE.MeshBasicMaterial({
    map: ringTexture,
    side: THREE.DoubleSide,
    transparent: true,
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = Math.PI / 2;
  planet.add(ring);
}

// Add moons to some of the planets
const moons = [];
const moonOrbitRadius = 5; // Distance of moons from their planets

// Let's add moons to the first three planets
for (let i = 0; i < 3; i++) {
  const planet = planets[i];
  planet.userData.hasMoons = true;
  const moonCount = 2; // Number of moons for each planet

  for (let j = 0; j < moonCount; j++) {
    // Randomly select a moon image
    const moonImage =
      moonImages[Math.floor(Math.random() * moonImages.length)];
    const moon = createMeatball(1, moonImage);
    moon.orbitRadius = moonOrbitRadius + j * 2; // Slightly different orbit radii for multiple moons
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

// Updated spawnNoodles function
function spawnNoodles(planet) {
  const noodleCount = 20;
  const worldPosition = new THREE.Vector3();
  planet.getWorldPosition(worldPosition);

  for (let i = 0; i < noodleCount; i++) {
    // Generate a random direction vector pointing outward from the planet
    const theta = Math.random() * 2 * Math.PI; // Random angle around the y-axis
    const phi = Math.acos(2 * Math.random() - 1); // Random angle from the y-axis

    const direction = new THREE.Vector3(
      Math.sin(phi) * Math.cos(theta),
      Math.cos(phi),
      Math.sin(phi) * Math.sin(theta)
    );

    // Create a curved path for the noodle
    const pathPoints = [];
    const segments = 10; // Number of segments in the noodle
    const length = 5 + Math.random() * 5; // Length of the noodle
    const spread = 1.5; // How much the noodle wiggles

    for (let j = 0; j <= segments; j++) {
      const t = j / segments;
      const point = new THREE.Vector3().copy(worldPosition);
      const offset = direction.clone().multiplyScalar(length * t);
      point.add(offset);

      // Add some randomness to create the wiggly effect
      point.x += (Math.random() - 0.5) * spread;
      point.y += (Math.random() - 0.5) * spread;
      point.z += (Math.random() - 0.5) * spread;

      pathPoints.push(point);
    }

    const noodleCurve = new THREE.CatmullRomCurve3(pathPoints);
    const noodleGeometry = new THREE.TubeGeometry(
      noodleCurve,
      64,
      0.1,
      8,
      false
    );
    const noodleMaterial = new THREE.MeshBasicMaterial({ color: 0xffd700 });
    const noodle = new THREE.Mesh(noodleGeometry, noodleMaterial);

    // Set the noodle's initial position
    noodle.position.set(0, 0, 0); // Since the path already includes world positions

    // Assign a velocity in the direction vector
    const speed = 1; // Adjust the speed as needed
    const velocity = direction.clone().normalize().multiplyScalar(speed);

    // Add custom properties
    noodle.userData = {
      velocity: velocity,
      life: 2 + Math.random() * 3, // Lifetime in seconds
    };

    noodles.push(noodle);
    scene.add(noodle);
  }
}

// **Add orbiting text meshes**
const textMeshes = [];

// Load Font
const fontLoader = new THREE.FontLoader();
fontLoader.load(
  'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
  function (font) {
    // Messages
    const messages = [
      { text: 'PLENTY OF SPAGHETTI!', size: 20, radius: 250, speed: 0.02 },
      { text: 'PLEASE.NYC', size: 10, radius: 300, speed: -0.015 },
    ];

    messages.forEach((message, index) => {
      const textGeometry = new THREE.TextGeometry(message.text, {
        font: font,
        size: message.size,
        height: 1,
        curveSegments: 12,
      });
      const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);

      // Initial position
      const angle = Math.random() * Math.PI * 2;
      textMesh.position.x = Math.cos(angle) * message.radius;
      textMesh.position.z = Math.sin(angle) * message.radius;
      textMesh.position.y = 0;

      // Store userData for animation
      textMesh.userData = {
        angle: angle,
        radius: message.radius,
        speed: message.speed,
      };

      // Rotate the text to face the center
      textMesh.lookAt(new THREE.Vector3(0, 0, 0));

      // Add to scene and array
      scene.add(textMesh);
      textMeshes.push(textMesh);
    });
  }
);

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

    moon.position.x = planetPos.x + moon.orbitRadius * Math.cos(moon.angle);
    moon.position.z = planetPos.z + moon.orbitRadius * Math.sin(moon.angle);
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
    noodle.position.add(
      noodle.userData.velocity.clone().multiplyScalar(deltaTime)
    );
  }

  // **Update text meshes**
  textMeshes.forEach((textMesh) => {
    const speed = textMesh.userData.speed;
    const radius = textMesh.userData.radius;
    textMesh.userData.angle += speed * deltaTime;

    const angle = textMesh.userData.angle;

    textMesh.position.x = Math.cos(angle) * radius;
    textMesh.position.z = Math.sin(angle) * radius;

    // Rotate the text to face the center
    textMesh.lookAt(new THREE.Vector3(0, 0, 0));
  });

  controls.update(); // Update controls
  renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

animate();
