// public/main.js

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create and add light to the scene
const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1, 100);
camera.add(pointLight);
scene.add(camera);

// Load meatball texture
const loader = new THREE.TextureLoader();
// TODO: add random meatball image
loader.load('img/meatballs/2.png', (texture) => {
  // Create meatball material
  const meatballMaterial = new THREE.MeshBasicMaterial({ map: texture });

  // Helper function to create a meatball
  function createMeatball(radius) {
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    return new THREE.Mesh(geometry, meatballMaterial);
  }

  // Create solar system
  const planets = [];
  const orbitRadii = [10, 20, 30]; // Example radii for orbit
  const planetCount = orbitRadii.length;
  const timescale = document.getElementById('timescale');
  let time = 0;

  // Add planets to the scene
  for (let i = 0; i < planetCount; i++) {
    const planet = createMeatball(1);
    const orbitRadius = orbitRadii[i];
    planet.orbitRadius = orbitRadius;
    planet.angle = Math.random() * Math.PI * 2;
    planet.position.x = orbitRadius * Math.cos(planet.angle);
    planet.position.z = orbitRadius * Math.sin(planet.angle);
    planets.push(planet);
    scene.add(planet);
  }

  // Add spaghetti noodles (trails) to the planets
  const trails = [];
  planets.forEach((planet) => {
    const positions = [];
    const trailGeometry = new THREE.BufferGeometry();
    const trailMaterial = new THREE.LineBasicMaterial({ color: 0xFFD700 }); // Golden color for spaghetti
    const trail = new THREE.Line(trailGeometry, trailMaterial);
    scene.add(trail);
    trails.push({ trail, positions });
  });

//   // Set up OrbitControls
//   const controls = new THREE.OrbitControls(camera, renderer.domElement);
//   controls.enableDamping = true;
//   controls.dampingFactor = 0.25;
//   controls.enableZoom = true;

  // Update function
  function animate() {
    requestAnimationFrame(animate);
    const deltaTime = timescale.valueAsNumber * 0.01; // Adjust deltaTime based on timescale

    planets.forEach((planet, index) => {
      planet.angle += deltaTime / planet.orbitRadius; // Simple orbital movement
      planet.position.x = planet.orbitRadius * Math.cos(planet.angle);
      planet.position.z = planet.orbitRadius * Math.sin(planet.angle);

      // Update trail
      const trailInfo = trails[index];
      trailInfo.positions.push(planet.position.clone());

      // Update buffer geometry
      const positionsArray = new Float32Array(trailInfo.positions.length * 3);
      for (let i = 0; i < trailInfo.positions.length; i++) {
        positionsArray[i * 3] = trailInfo.positions[i].x;
        positionsArray[i * 3 + 1] = trailInfo.positions[i].y;
        positionsArray[i * 3 + 2] = trailInfo.positions[i].z;
      }
      trailInfo.trail.geometry.setAttribute('position', new THREE.BufferAttribute(positionsArray, 3));
      trailInfo.trail.geometry.attributes.position.needsUpdate = true;
    });

    //controls.update(); // Update controls
    renderer.render(scene, camera);
  }

  // Adjust camera position
  camera.position.z = 50;

  // Handle window resize
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  animate();
});
