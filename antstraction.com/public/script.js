// Scene, Camera, Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const loader = new THREE.GLTFLoader();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Orbit Controls for camera interaction
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Enable damping for smoother experience
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;

// Handle window resize
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Add ambient and directional light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(0, 10, 10);
scene.add(directionalLight);

// Set the camera position
camera.position.z = 50;

// Neural network configuration
const networkLayers = [5, 4, 3, 4, 5]; // Number of neurons per layer
const neuralNetwork = []; // Array to store neurons

// Function to create the neural network
function createNeuralNetwork() {
    const layerDistance = 15;
    const neuronSpacing = 8;
    const depthSpacing = 6; // New parameter for Z-axis spacing

    for (let i = 0; i < networkLayers.length; i++) {
        const neurons = [];
        const layerSize = networkLayers[i];
        const x = i * layerDistance - ((networkLayers.length - 1) * layerDistance) / 2;

        // Calculate how many neurons to place in each dimension
        const gridSize = Math.ceil(Math.sqrt(layerSize));
        
        for (let j = 0; j < layerSize; j++) {
            // Calculate 3D position
            const row = Math.floor(j / gridSize);
            const col = j % gridSize;
            
            const y = (row - (gridSize-1)/2) * neuronSpacing;
            const z = (col - (gridSize-1)/2) * depthSpacing;
            
            const neuronGeometry = new THREE.SphereGeometry(1, 16, 16);
            const neuronMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
            const neuron = new THREE.Mesh(neuronGeometry, neuronMaterial);
            
            neuron.position.set(x, y, z);
            scene.add(neuron);
            neurons.push(neuron);
        }
        neuralNetwork.push(neurons);
    }

    // Create connections between neurons
    const connectionMaterial = new THREE.LineBasicMaterial({ color: 0xaaaaaa });
    for (let i = 0; i < neuralNetwork.length - 1; i++) {
        const currentLayer = neuralNetwork[i];
        const nextLayer = neuralNetwork[i + 1];
        for (const neuronA of currentLayer) {
            for (const neuronB of nextLayer) {
                const points = [];
                points.push(neuronA.position);
                points.push(neuronB.position);
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, connectionMaterial);
                scene.add(line);
            }
        }
    }
}

createNeuralNetwork(); // Build the neural network

// Array to hold ant objects
let ants = [];

// Function to create an ant mesh
function createAnt(token) {
    const ant = new THREE.Group();
    loader.load('ant.glb', function(gltf) {
        const model = gltf.scene;
        // Rotate the model to face forward along the X-axis
        model.rotation.y = Math.PI / 2;  // 90 degrees around Y axis
        model.rotation.x = Math.floor(Math.random() * Math.PI*2); // random rotation around X axis
        model.rotation.z = 0;
        ant.add(model);
        scene.add(ant);
    });
    ant.scale.set(0.0025, 0.0025, 0.0025);
    return ant;

    /*
    const ant = new THREE.Group();

    // Ant body parts
    const headGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const thoraxGeometry = new THREE.SphereGeometry(0.6, 16, 16);
    const abdomenGeometry = new THREE.SphereGeometry(0.8, 16, 16);

    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });

    const head = new THREE.Mesh(headGeometry, bodyMaterial);
    const thorax = new THREE.Mesh(thoraxGeometry, bodyMaterial);
    const abdomen = new THREE.Mesh(abdomenGeometry, bodyMaterial);

    // Position body parts
    head.position.set(-1.4, 0, 0);
    thorax.position.set(0, 0, 0);
    abdomen.position.set(1.5, 0, 0);

    ant.add(head);
    ant.add(thorax);
    ant.add(abdomen);

    // Legs and antennae
    const legMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
    const legGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
    const antennaGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1, 8);

    // Create legs (3 on each side)
    for (let i = -1; i <= 1; i++) {
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        leg.position.set(0, -0.5, i * 0.5);
        leg.rotation.z = Math.PI / 4;
        ant.add(leg);

        const leg2 = new THREE.Mesh(legGeometry, legMaterial);
        leg2.position.set(0.5, -0.5, i * 0.5);
        leg2.rotation.z = Math.PI / 4;
        ant.add(leg2);

        const leg3 = new THREE.Mesh(legGeometry, legMaterial);
        leg3.position.set(-0.5, -0.5, i * 0.5);
        leg3.rotation.z = Math.PI / 4;
        ant.add(leg3);
    }

    // Create antennae
    const antennaLeft = new THREE.Mesh(antennaGeometry, legMaterial);
    antennaLeft.position.set(-1.8, 0.5, -0.2);
    antennaLeft.rotation.z = -Math.PI / 4;
    ant.add(antennaLeft);

    const antennaRight = new THREE.Mesh(antennaGeometry, legMaterial);
    antennaRight.position.set(-1.8, 0.5, 0.2);
    antennaRight.rotation.z = -Math.PI / 4;
    ant.add(antennaRight);

    // Ant label (optional)
    const label = createAntLabel(token);
    label.position.set(0, 1.5, 0);
    ant.add(label);

    scene.add(ant);
    return ant;
    */
}

// Function to create a label for the ant
function createAntLabel(token) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    context.font = '24px Arial';
    context.fillStyle = 'white';
    context.fillText(token, 10, 40);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(5, 2, 1);
    return sprite;
}

// Function to tokenize the user input
function tokenizeInput(inputText) {
    return inputText.split(/\s+/).filter(word => word.length > 0);
}

// Constants for image rendering
const IMAGE_SIZE = 16; // 16x16 grid
const PIXEL_SPACING = 1.5; // Space between ants in final formation

// Enhanced pattern generator with more patterns and fuzzy matching
function generateSimpleImage(prompt) {
    const pixels = Array(IMAGE_SIZE).fill().map(() => Array(IMAGE_SIZE).fill(0));
    const center = Math.floor(IMAGE_SIZE / 2);
    
    // Expanded dictionary of patterns
    const patterns = {
        'ball': () => {
            const radius = 5;
            for(let i = 0; i < IMAGE_SIZE; i++) {
                for(let j = 0; j < IMAGE_SIZE; j++) {
                    const dx = i - center;
                    const dy = j - center;
                    if(Math.sqrt(dx*dx + dy*dy) <= radius) {
                        pixels[i][j] = 1;
                    }
                }
            }
        },
        'circle': () => patterns['ball'](), // Alias for ball
        'sphere': () => patterns['ball'](), // Another alias
        
        'heart': () => {
            for(let i = 0; i < IMAGE_SIZE; i++) {
                for(let j = 0; j < IMAGE_SIZE; j++) {
                    const x = (j - center) / 7;
                    const y = (i - center) / 7;
                    if((x*x + y*y - 1)**3 - x*x*y*y*y <= 0) {
                        pixels[i][j] = 1;
                    }
                }
            }
        },
        'love': () => patterns['heart'](), // Alias for heart
        
        'star': () => {
            const points = 5;
            const outerRadius = 7;
            const innerRadius = 3;
            for(let i = 0; i < IMAGE_SIZE; i++) {
                for(let j = 0; j < IMAGE_SIZE; j++) {
                    const dx = j - center;
                    const dy = i - center;
                    const angle = Math.atan2(dy, dx);
                    const radius = Math.sqrt(dx*dx + dy*dy);
                    const targetRadius = outerRadius * 
                        (Math.abs(Math.cos(angle * points / 2)) * (outerRadius - innerRadius) + innerRadius) / outerRadius;
                    if(radius <= targetRadius) {
                        pixels[i][j] = 1;
                    }
                }
            }
        },
        
        'smile': () => {
            pixels[center-3][center-3] = 1;
            pixels[center-3][center+3] = 1;
            for(let i = -2; i <= 2; i++) {
                pixels[center+2][center+i] = 1;
            }
            pixels[center+1][center-3] = 1;
            pixels[center+1][center+3] = 1;
        },
        'happy': () => patterns['smile'](),
        'face': () => patterns['smile'](),
        
        'square': () => {
            for(let i = center-4; i <= center+4; i++) {
                for(let j = center-4; j <= center+4; j++) {
                    pixels[i][j] = 1;
                }
            }
        },
        'box': () => patterns['square'](),
        
        'triangle': () => {
            const size = 8;
            for(let i = 0; i < size; i++) {
                const width = (i * 2) + 1;
                const startJ = center - Math.floor(width/2);
                for(let j = 0; j < width; j++) {
                    pixels[center + 4 - i][startJ + j] = 1;
                }
            }
        },
        
        'diamond': () => {
            const size = 7;
            for(let i = 0; i < size; i++) {
                const width = size - Math.abs(i - size/2);
                const startJ = center - Math.floor(width/2);
                for(let j = 0; j < width; j++) {
                    pixels[center - Math.floor(size/2) + i][startJ + j] = 1;
                }
            }
        },
        
        'cross': () => {
            // Vertical line
            for(let i = center-4; i <= center+4; i++) {
                pixels[i][center] = 1;
            }
            // Horizontal line
            for(let j = center-4; j <= center+4; j++) {
                pixels[center][j] = 1;
            }
        },
        'plus': () => patterns['cross']()
    };

    // Fuzzy pattern matching
    const words = prompt.toLowerCase().split(/\s+/);
    let matchedPattern = null;
    
    // Try to find a matching pattern in any of the words
    for(const word of words) {
        for(const pattern in patterns) {
            if(word.includes(pattern) || pattern.includes(word)) {
                matchedPattern = patterns[pattern];
                break;
            }
        }
        if(matchedPattern) break;
    }

    // Use matched pattern or default
    (matchedPattern || patterns['square'])();
    return pixels;
}

// Calculate final positions for ants based on image pixels
function calculateImagePositions(pixels) {
    const positions = [];
    const startX = neuralNetwork[neuralNetwork.length - 1][0].position.x + 20;
    
    for (let i = 0; i < IMAGE_SIZE; i++) {
        for (let j = 0; j < IMAGE_SIZE; j++) {
            if (pixels[i][j] === 1) {
                positions.push(new THREE.Vector3(
                    startX,
                    (IMAGE_SIZE/2 - i) * PIXEL_SPACING,
                    (j - IMAGE_SIZE/2) * PIXEL_SPACING
                ));
            }
        }
    }
    return positions;
}

// Modified visualization function
function visualizeInput(inputText) {
    const tokens = tokenizeInput(inputText);
    const imagePixels = generateSimpleImage(inputText);
    const finalPositions = calculateImagePositions(imagePixels);
    const requiredAntCount = finalPositions.length;
    
    console.log(`Need to create ${requiredAntCount} ants total`); // Debug info
    
    // Clear existing ants
    ants.forEach(ant => {
        scene.remove(ant.mesh);
    });
    ants = [];

    // Create initial ants (one per word)
    tokens.forEach((token, index) => {
        const antMesh = createAnt(token);
        const ant = {
            mesh: antMesh,
            path: [],
            progress: 0,
            speed: 15,
            token: token,
            t: 0,
            isOriginal: true,
            requiredAnts: requiredAntCount
        };

        // Calculate path including final position
        const startPos = new THREE.Vector3(
            neuralNetwork[0][0].position.x - 20,
            0,
            (Math.random() - 0.5) * 10
        );
        ant.path.push(startPos);

        // Add network layer positions
        neuralNetwork.forEach((layer, layerIndex) => {
            const neuron = layer[Math.floor(Math.random() * layer.length)];
            ant.path.push(neuron.position.clone());
        });

        // Add final position
        if (finalPositions[index]) {
            ant.path.push(finalPositions[index]);
        }

        scene.add(ant.mesh);
        ants.push(ant);
    });
}

// ant multiplication logic
function multiplyAnts(ant, layerIndex) {
    const currentTotal = ants.length;
    const remainingLayers = neuralNetwork.length - layerIndex;
    
    if (currentTotal < ant.requiredAnts) {
        const remainingAntsNeeded = ant.requiredAnts - currentTotal;
        const antsToCreateAtThisLayer = Math.ceil(remainingAntsNeeded / (remainingLayers + 1));
        const antsNeeded = Math.min(4, antsToCreateAtThisLayer);
        
        const newAnts = [];
        for (let i = 0; i < antsNeeded && currentTotal + newAnts.length < ant.requiredAnts; i++) {
            const newAntMesh = createAnt(ant.token);
            const newAnt = {
                mesh: newAntMesh,
                path: [],
                progress: 0, // Start from beginning of new path
                speed: ant.speed,
                token: ant.token,
                t: 0,
                isClone: true,
                requiredAnts: ant.requiredAnts
            };
            
            // Start from current ant's position
            const currentPos = ant.mesh.position.clone();
            newAnt.path.push(currentPos);
            
            // Calculate remaining path through network starting from next layer
            for (let j = layerIndex + 1; j < neuralNetwork.length; j++) {
                const layer = neuralNetwork[j];
                const randomNeuron = layer[Math.floor(Math.random() * layer.length)];
                newAnt.path.push(randomNeuron.position.clone());
            }
            
            // Find available final position
            const availablePositions = calculateImagePositions(generateSimpleImage(ant.token))
                .filter(pos => !ants.some(existingAnt => 
                    existingAnt.path[existingAnt.path.length - 1].equals(pos)
                ));
            
            if (availablePositions.length > 0) {
                const randomFinalPos = availablePositions[Math.floor(Math.random() * availablePositions.length)];
                newAnt.path.push(randomFinalPos);
                
                // Position new ant at spawn position
                newAnt.mesh.position.copy(currentPos);
                newAnt.mesh.quaternion.copy(ant.mesh.quaternion);
                
                scene.add(newAnt.mesh);
                newAnts.push(newAnt);
            }
        }
        return newAnts;
    }
    return [];
}

// Update the animation loop
function updateAnts(delta) {
    const antsToAdd = [];
    
    ants.forEach(ant => {
        if (ant.progress < ant.path.length - 1) {
            const start = ant.path[ant.progress];
            const end = ant.path[ant.progress + 1];
            const distance = start.distanceTo(end);
            ant.t += (ant.speed * delta) / distance;

            // Update position
            const position = new THREE.Vector3().lerpVectors(start, end, ant.t);
            ant.mesh.position.copy(position);
            
            // Update rotation
            const direction = new THREE.Vector3().subVectors(end, start).normalize();
            const targetRotation = new THREE.Quaternion();
            const up = new THREE.Vector3(0, 1, 0);
            const matrix = new THREE.Matrix4();
            
            matrix.lookAt(new THREE.Vector3(0, 0, 0), direction, up);
            targetRotation.setFromRotationMatrix(matrix);
            
            const additionalRotation = new THREE.Quaternion().setFromEuler(
                new THREE.Euler(0, Math.PI / 2, 0)
            );
            targetRotation.multiply(additionalRotation);
            
            ant.mesh.quaternion.slerp(targetRotation, 0.1);

            if (ant.t >= 1) {
                // Only multiply ants at network layers, not at final positions
                if (ant.progress < ant.path.length - 2) {
                    const newAnts = multiplyAnts(ant, ant.progress);
                    antsToAdd.push(...newAnts);
                }
                
                ant.progress++;
                ant.t = 0;
            }
        }
    });

    // Add new ants
    ants.push(...antsToAdd);
}

// Event listener for the 'Visualize' button
document.getElementById('visualize-button').addEventListener('click', () => {
    const inputText = document.getElementById('user-input').value;
    if (inputText.trim() !== '') {
        visualizeInput(inputText);
    }
});

// Animation loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    updateAnts(delta);
    renderer.render(scene, camera);
}

animate(); // Start the animation loop

