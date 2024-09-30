// Three.js variables
let scene, camera, renderer;
let forkMesh;
let plateMesh;
let textMesh;
let website_details_textMesh;
let mouseX = 0;
let mouseY = 0;

// Matter.js variables
const { Engine, World, Bodies, Body, Composite, Constraint } = Matter;
let engine;
let world;
let plateBody;
let forkBody;
let noodles = [];

// Clock for delta time
const clock = new THREE.Clock();

// Initialize the application
init();
animate();

function init() {
  initThree();
  initMatter();
  createPlate();
  createFork();
  // Create noodles and meatballs at intervals
  setInterval(() => {
    // 10% chance to drop a meatball
    if (Math.random() < 0.1) {
      createMeatball();
    } else {
      createNoodle();
    }
  }, 500);
}

function initThree() {
  // Scene and Camera
  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(
    0,
    window.innerWidth,
    0,
    window.innerHeight,
    1000,
    -1000
  );
  camera.position.z = 10;

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  // Load the font and create the text
  const loader = new THREE.FontLoader();
  loader.load(
    'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
    function (font) {
      const textGeometry = new THREE.TextGeometry('WWW.PLEASE.NYC', {
        font: font,
        size: 30,
        height: 5,
        curveSegments: 12,
        bevelEnabled: false,
      });

      const textMaterial = new THREE.MeshBasicMaterial({ color: 0x404040 });
      textMesh = new THREE.Mesh(textGeometry, textMaterial);

      // Position the text in the background and center it
      textMesh.position.set(window.innerWidth / 2, window.innerHeight / 2, 0);
      textMesh.geometry.center();
      textMesh.rotation.y = THREE.Math.degToRad(180);
      textMesh.rotation.z = THREE.Math.degToRad(180);
      scene.add(textMesh);

      const website_details_textGeometry = new THREE.TextGeometry('THERE IS NOT ENOUGH SPAGHETTI!!', {
        font: font,
        size: 40,
        height: 10,
        curveSegments: 12,
        bevelEnabled: false,
      });

      const website_details_textMaterial = new THREE.MeshBasicMaterial({ color: 0x404040 });
      website_details_textMesh = new THREE.Mesh(website_details_textGeometry, website_details_textMaterial);

      // Position the text in the background and center it
      website_details_textMesh.position.set(window.innerWidth / 2, window.innerHeight / 2 - 100, 0);
      website_details_textMesh.geometry.center();
      website_details_textMesh.rotation.y = THREE.Math.degToRad(180);
      website_details_textMesh.rotation.z = THREE.Math.degToRad(180);
      scene.add(website_details_textMesh);
    }
  );

  // Handle window resize
  window.addEventListener('resize', onWindowResize, false);
}

function initMatter() {
  // Create an engine
  engine = Engine.create();
  world = engine.world;

  // Set gravity to act downward
  engine.gravity.y = 1;
}

function createPlate() {
  // Position near the bottom
  const plateX = window.innerWidth / 2;
  const plateY = window.innerHeight - 50;

  // Three.js plate (semi-circle)
  const plateRadius = 150;
  const plateSegmentCount = 32;
  const plateGeometry = new THREE.CircleGeometry(plateRadius, plateSegmentCount, Math.PI, Math.PI);
  const plateMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
  const plateMesh = new THREE.Mesh(plateGeometry, plateMaterial);
  plateMesh.position.set(plateX, plateY, 0);
  plateMesh.rotation.z = Math.PI; // Flip the circle to make it a bowl
  scene.add(plateMesh);

  // Matter.js plate (composite body to simulate a bowl)
  const bowlSides = [
    // Left side
    Bodies.rectangle(plateX - plateRadius + 10, plateY - plateRadius / 2, 20, plateRadius, { isStatic: true, angle: -Math.PI / 4 }),
    // Bottom
    Bodies.rectangle(plateX, plateY, plateRadius * 2, 20, { isStatic: true }),
    // Right side
    Bodies.rectangle(plateX + plateRadius - 10, plateY - plateRadius / 2, 20, plateRadius, { isStatic: true, angle: Math.PI / 4 })
  ];
  plateBody = Body.create({
    parts: bowlSides,
    isStatic: true
  });
  World.add(world, plateBody);
}

function createNoodle() {
  // Noodle properties
  const segments = 30; // Increase number of segments for smoother noodles
  const segmentLength = 8; // Decrease segment length
  const segmentWidth = 4; // Decrease segment width for thinner noodles
  const stiffness = 0.1; // Lower stiffness for more flexibility
  const damping = 0.1;

  // Starting position at the top of the screen
  const startX = Math.random() * (window.innerWidth - 100) + 50;
  const startY = -250; // Start slightly above the screen

  let previousBody;
  let noodleBodies = [];
  let noodleCurvePoints = [];

  // Create noodle segments
  for (let i = 0; i < segments; i++) {
    const x = startX;
    const y = startY + i * segmentLength;

    // Three.js segment
    const segmentGeometry = new THREE.BoxGeometry(segmentWidth, segmentLength, 5);
    const segmentMaterial = new THREE.MeshBasicMaterial({ color: 0xffd700 });
    const segmentMesh = new THREE.Mesh(segmentGeometry, segmentMaterial);
    segmentMesh.position.set(x, y, 0);
    scene.add(segmentMesh);

    // Matter.js segment
    const segmentBody = Bodies.rectangle(
      x,
      y,
      segmentWidth,
      segmentLength,
      {
        friction: 1.0,
        frictionStatic: 1.0,
        restitution: 0,
        // Set mass when creating segment bodies
        density: 0.001,
        // Remove collisionFilter or set it to allow collisions
        collisionFilter: {
          group: 0, // Use default collision group
          category: 0x0001,
          mask: 0xFFFFFFFF
        }
      }
    );
    World.add(world, segmentBody);

    // Apply a small random force to initiate wiggling
    Body.applyForce(segmentBody, segmentBody.position, {
      x: (Math.random() - 0.5) * 0.0005,
      y: (Math.random() - 0.5) * 0.0005
    });

    // Link Three.js object and Matter.js body
    segmentMesh.userData.body = segmentBody;
    //noodles.push(segmentMesh);

    noodleBodies.push(segmentBody);

    // Add constraint to previous segment
    if (previousBody) {
      const constraint = Constraint.create({
        bodyA: segmentBody,
        pointA: { x: 0, y: -segmentLength / 2 },
        bodyB: previousBody,
        pointB: { x: 0, y: segmentLength / 2 },
        stiffness: stiffness,
        damping: damping,
        length: 0,
        // Remove collision filters on constraints if any
      });
      World.add(world, constraint);
    }

    previousBody = segmentBody;
  }

  // Create a spline curve through the segment positions
  const positions = noodleBodies.map(body => new THREE.Vector3(body.position.x, body.position.y, 0));
  const curve = new THREE.CatmullRomCurve3(positions);

  // Create the tube geometry along the curve
  const tubeGeometry = new THREE.TubeGeometry(curve, 64, segmentWidth / 2, 8, false);
  const tubeMaterial = new THREE.MeshPhongMaterial({ color: 0xffd700 });
  const noodleMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
  scene.add(noodleMesh);

  // Link the noodle mesh and its bodies
  noodleMesh.userData.bodies = noodleBodies;
  noodleMesh.userData.curve = curve;
  noodleMesh.userData.segmentWidth = segmentWidth;
  noodles.push(noodleMesh);
}

function createMeatball() {
  const radius = 15;
  const x = Math.random() * (window.innerWidth - 2 * radius) + radius;
  const y = -radius; // Start just above the screen

  // Three.js meatball
  const geometry = new THREE.CircleGeometry(radius, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0x8B4513 }); // Brown color
  const meatballMesh = new THREE.Mesh(geometry, material);
  meatballMesh.position.set(x, y, 0);
  scene.add(meatballMesh);

  // Matter.js meatball
  const meatballBody = Bodies.circle(x, y, radius, {
    friction: 0.5,
    restitution: 0.1
  });
  World.add(world, meatballBody);

  // Link Three.js object and Matter.js body
  meatballMesh.userData.body = meatballBody;
  noodles.push(meatballMesh); // Reusing the noodles array for simplicity
}

function createFork() {
  const loader = new THREE.GLTFLoader();
  loader.load(
    './fork.glb', // Path to your fork model
    function (gltf) {
      forkMesh = gltf.scene;

      // Adjust the fork's scale
      forkMesh.scale.set(4, 4, 4); // Adjust the scale as needed

      // Center the fork's geometry
      const box = new THREE.Box3().setFromObject(forkMesh);
      const center = box.getCenter(new THREE.Vector3());
      forkMesh.position.sub(center); // Center the geometry

      // Set initial position
      const initialX = window.innerWidth / 2;
      const initialY = window.innerHeight / 2;
      forkMesh.position.set(initialX, initialY, 1);
      scene.add(forkMesh);

      // Optional: Adjust material to make it metallic
      forkMesh.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshPhysicalMaterial({
            color: 0xb0b0b0,
            metalness: 1,
            roughness: 0.2,
            reflectivity: 0.8,
          });
        }
      });

      forkMesh.rotation.z = THREE.MathUtils.degToRad(115); // Rotate degrees

      // Create a simplified Matter.js body for physics
      forkBody = Bodies.rectangle(
        initialX,
        initialY,
        10,
        80,
        { isStatic: true }
      );
      World.add(world, forkBody);
    },
    undefined,
    function (error) {
      console.error('An error occurred while loading the fork model:', error);
    }
  );
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  // Get the time elapsed since the last frame
  const deltaTime = clock.getDelta();

  // Update the physics engine (deltaTime in milliseconds)
  Engine.update(engine, deltaTime * 1000);

  // Update positions of Three.js objects based on Matter.js bodies
  updateObjectsFromPhysics();

  // Rotate the textMesh based on mouse movement
  if (textMesh) {
    textMesh.rotation.x += (mouseY * 0.0001 - THREE.Math.degToRad(1)) * 0.1;
    textMesh.rotation.y += (mouseX * 0.0001 - THREE.Math.degToRad(1)) * 0.1;
    website_details_textMesh.rotation.x += (mouseY * 0.0001) * 0.05;
    website_details_textMesh.rotation.y += (mouseX * 0.0001) * 0.05;
  }

  // Render the scene
  renderer.render(scene, camera);
}

function updateObjectsFromPhysics() {
  // Update noodles and meatballs
  for (let i = noodles.length - 1; i >= 0; i--) {
    const mesh = noodles[i];
    const body = mesh.userData.body;
    
    if (mesh.userData.bodies) {
      // This is a noodle
      const noodleBodies = mesh.userData.bodies;
      const positions = noodleBodies.map(body => {
        if (!body.position) {
          console.error('Body position is undefined:', body);
        }
        return new THREE.Vector3(body.position.x, body.position.y, 0);
      });

      // Update the curve with new positions
      mesh.userData.curve.points = positions;

      // Update the geometry
      mesh.geometry.dispose(); // Dispose the old geometry
      mesh.geometry = new THREE.TubeGeometry(mesh.userData.curve, 64, mesh.userData.segmentWidth / 2, 8,false);

      // Remove objects that fall off-screen
      if (noodleBodies[0].position.y > window.innerHeight + 100) {
        // Remove all noodle bodies
        noodleBodies.forEach(body => World.remove(world, body));
        // Remove the mesh
        scene.remove(mesh);
        // Remove from noodles array
        noodles.splice(i, 1);
        continue;
      }
    } else if (mesh.userData.body) {
      // This is a meatball or segment mesh
      const body = mesh.userData.body;

      // Remove objects that fall off-screen
      if (body.position.y > window.innerHeight + 100) {
        World.remove(world, body);
        // Remove the mesh
        scene.remove(mesh);
        noodles.splice(i, 1);
        continue;
      }

      // Update Three.js mesh position and rotation
      mesh.position.x = body.position.x;
      mesh.position.y = body.position.y;
      mesh.rotation.z = body.angle;
    }
  }

  // Update fork position in Matter.js
  if (forkMesh && forkBody) {
    Body.setPosition(forkBody, { x: forkMesh.position.x, y: forkMesh.position.y });
    Body.setAngle(forkBody, forkMesh.rotation.z);
  }
}

let prevMouseX = window.innerWidth / 2;
let prevMouseY = window.innerHeight / 2;

function onMouseMove(event) {
  if (!forkMesh) return; // Ensure forkMesh is loaded

  mouseX = event.clientX;
  mouseY = event.clientY;

  // Calculate the change in mouse position
  const deltaX = mouseX - prevMouseX;
  const deltaY = mouseY - prevMouseY;

  // Calculate the angle of movement
  //const angle = Math.atan2(deltaY, deltaX);

  forkMesh.position.set(mouseX, mouseY, 0);

  // Set fork rotation
  //forkMesh.rotation.z = angle;

  // Update fork position and rotation in Matter.js
  if (forkBody) {
    Body.setPosition(forkBody, { x: mouseX, y: mouseY });
    //Body.setAngle(forkBody, angle);
  }

  // Update previous mouse position
  prevMouseX = mouseX;
  prevMouseY = mouseY;
}

function handleOrientation(event) {
  const beta = event.beta || 180; // [-180,180]
  const gamma = event.gamma || 90; // [-90,90]

  if (textMesh) {
    //textMesh.rotation.z = THREE.Math.degToRad(beta) * 0.15;
    //textMesh.rotation.x = THREE.Math.degToRad(gamma) * 0.05;
  }
}

function onWindowResize() {
  camera.right = window.innerWidth;
  camera.bottom = window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  // Update plate position
  if (plateMesh) {
    const plateX = window.innerWidth / 2;
    const plateY = window.innerHeight - 50;

    plateMesh.position.set(plateX, plateY, -500);

    // Update plate body position in Matter.js
    const translation = {
      x: plateX - plateBody.position.x,
      y: plateY - plateBody.position.y,
    };
    Matter.Body.translate(plateBody, translation);
  }

  // Update text position
  if (textMesh) {
    textMesh.position.set(window.innerWidth / 2, window.innerHeight / 2, 0);
    website_details_textMesh.position.set(window.innerWidth / 2, window.innerHeight / 2 - 100, 0);
  }
}

// Mouse move event
document.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('deviceorientation', handleOrientation, true);