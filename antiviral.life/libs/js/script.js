let imageList = ['1.webp', '2.webp', '3.webp', '4.webp', '5.webp', '6.webp', '7.webp', '8.webp', '9.webp', '10.webp', '11.webp', '12.webp']; // Example image names
let textList = ["McAfee!", "ANTIVIRUS LIFESTYLE!", "WOO McAfee!", "HEALTHY LIFE!"]; // Example text list
let fadeImages = ['fadeImage1.png', 'fadeImage2.png', 'fadeImage3.png']; // Fading images list
let spawnDelay = 3000;  // Initial delay for image spawning
let minSpawnDelay = 150; // Minimum delay to prevent overwhelming the browser
let explosionImage = 'explosion.png';  // Explosion image

let container = document.getElementById('image-container');
let textContainer = document.getElementById('text-container');

// Function to spawn a random image at a random position with random size and rotation
function spawnRandomImage() {
  let popup = document.createElement('div');
  popup.className = 'window';
  popup.style.position = 'absolute';
  
  // Create the title bar
  let titleBar = document.createElement('div');
  titleBar.className = 'title-bar';
  
  let titleText = document.createElement('div');
  titleText.className = 'title-bar-text';
  let randomText = textList[Math.floor(Math.random() * textList.length)];
  titleText.textContent = randomText;
  
  let controls = document.createElement('div');
  controls.className = 'title-bar-controls';
  
  let closeButton = document.createElement('button');
  closeButton.setAttribute('aria-label', 'Close');
  
  // Improved close button handling
  closeButton.addEventListener('click', (e) => {
    e.stopPropagation();
    popup.remove();
    decreaseSpawnDelay();
  });
  
  // Create the window body with the image
  let windowBody = document.createElement('div');
  windowBody.className = 'window-body';
  
  let img = document.createElement('img');
  let randomImage = imageList[Math.floor(Math.random() * imageList.length)];
  img.src = `/images/${randomImage}`;
  
  // Handle image loading and sizing
  img.onload = () => {
    let width = img.naturalWidth;
    let height = img.naturalHeight;
    let aspectRatio = width / height;
    
    // Limit width to 45vw (accounting for padding)
    const padding = 16; // 8px padding on each side
    const maxWidth = window.innerWidth * 0.45 - padding * 2; // 45vw converted to pixels
    if (width > maxWidth) {
      width = maxWidth;
      height = width / aspectRatio;
    }
    
    // Set window body size including padding
    windowBody.style.width = `${width + padding * 2}px`;
    windowBody.style.height = `${height + padding * 2}px`;
    
    // Position window after we know its size
    let x = Math.random() * (window.innerWidth - (width + padding * 2) - 50);
    let y = Math.random() * (window.innerHeight - (height + padding * 2) - 50);
    popup.style.left = `${Math.max(0, x)}px`;
    popup.style.top = `${Math.max(0, y)}px`;
  };
  
  // Add both mouse and touch events for dragging
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  
  function startDrag(e) {
    isDragging = true;
    initialX = (e.clientX || e.touches[0].clientX) - popup.offsetLeft;
    initialY = (e.clientY || e.touches[0].clientY) - popup.offsetTop;
    popup.style.zIndex = 1000;
  }
  
  function drag(e) {
    if (isDragging) {
      e.preventDefault();
      currentX = (e.clientX || e.touches[0].clientX) - initialX;
      currentY = (e.clientY || e.touches[0].clientY) - initialY;
      popup.style.left = `${currentX}px`;
      popup.style.top = `${currentY}px`;
    }
  }
  
  function stopDrag() {
    isDragging = false;
  }
  
  // Mouse events
  titleBar.addEventListener('mousedown', startDrag);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDrag);
  
  // Touch events
  titleBar.addEventListener('touchstart', startDrag);
  document.addEventListener('touchmove', drag);
  document.addEventListener('touchend', stopDrag);
  
  // Add touch support for close button
  closeButton.addEventListener('touchend', (e) => {
    e.preventDefault();
    e.stopPropagation();
    popup.remove();
    decreaseSpawnDelay();
  });
  
  // Assemble the popup
  controls.appendChild(closeButton);
  titleBar.appendChild(titleText);
  titleBar.appendChild(controls);
  windowBody.appendChild(img);
  popup.appendChild(titleBar);
  popup.appendChild(windowBody);
  
  container.appendChild(popup);
}

// Update click/touch handler for explosions
function handleInteraction(e) {
  // Get coordinates from either mouse or touch event
  const x = e.clientX || e.touches[0].clientX;
  const y = e.clientY || e.touches[0].clientY;
  
  // Only spawn explosion if we're not interacting with a window, taskbar, or start menu
  if (!e.target.closest('.window') && 
      !e.target.closest('.taskbar') && 
      !e.target.closest('.start-menu')) {
    spawnExplosion(x, y);
    decreaseSpawnDelay();
  }
}

document.body.addEventListener('click', handleInteraction);
document.body.addEventListener('touchstart', handleInteraction);

// Update start button handlers for touch
const startButton = document.querySelector('.start-button');
const startMenu = document.querySelector('.start-menu');

function toggleStartMenu(e) {
  e.preventDefault();
  e.stopPropagation();
  startMenu.style.display = startMenu.style.display === 'none' ? 'block' : 'none';
}

startButton.addEventListener('click', toggleStartMenu);
startButton.addEventListener('touchend', toggleStartMenu);

// Close start menu when clicking/touching elsewhere
function closeStartMenu(e) {
  if (!startMenu.contains(e.target) && !startButton.contains(e.target)) {
    startMenu.style.display = 'none';
  }
}

document.addEventListener('click', closeStartMenu);
document.addEventListener('touchend', closeStartMenu);

// Add touch support for menu items
document.querySelectorAll('.menu-item').forEach(item => {
  const handleMenuClick = () => {
    startMenu.style.display = 'none';
    spawnRandomImage();
  };
  
  item.addEventListener('click', handleMenuClick);
  item.addEventListener('touchend', (e) => {
    e.preventDefault();
    handleMenuClick();
  });
});

// Display random text for 5 seconds
function showRandomText() {
  let randomText = textList[Math.floor(Math.random() * textList.length)];
  textContainer.textContent = randomText;
  textContainer.style.color = 'black';
  textContainer.style.left = '50%';
  textContainer.style.top = '50%';
  textContainer.style.transform = 'translate(-50%, -50%)';
  textContainer.style.opacity = 1;

  setTimeout(() => {
    textContainer.style.opacity = 0;
  }, 5000); // Fade out after 5 seconds
}

// Handle mouse shake (detect by tracking mouse movement speed)
let lastX = 0, lastY = 0, lastTime = Date.now();
let shakeThreshold = 50;

document.body.addEventListener('mousemove', (e) => {
  let currentTime = Date.now();
  let timeDiff = currentTime - lastTime;
  let distance = Math.sqrt(Math.pow(e.clientX - lastX, 2) + Math.pow(e.clientY - lastY, 2));

  if (distance / timeDiff > shakeThreshold) {
    spawnExplosion(e.clientX, e.clientY);
    document.body.classList.add('hidden-cursor'); // Hide the mouse cursor
  }

  lastX = e.clientX;
  lastY = e.clientY;
  lastTime = currentTime;
});

// Spawn explosion at mouse location
function spawnExplosion(x, y) {
  let img = document.createElement('img');
  img.src = `/images/${explosionImage}`;
  img.classList.add('explosion');
  img.style.left = `${x - 50}px`; // Center explosion
  img.style.top = `${y - 50}px`; // Center explosion
  container.appendChild(img);

  setTimeout(() => {
    img.remove();
  }, 500); // Remove explosion image after 0.5 seconds
}

// Fading images
let fadeIndex = 0;
function fadeImagesInAndOut() {
  let img = document.createElement('img');
  img.src = `/images/${fadeImages[fadeIndex]}`;
  img.style.opacity = 0;
  img.style.transition = 'opacity 3s ease-in-out';
  img.style.position = 'absolute';
  img.style.top = '50%';
  img.style.left = '50%';
  img.style.transform = 'translate(-50%, -50%)';
  container.appendChild(img);

  setTimeout(() => {
    img.style.opacity = 1;
  }, 100);

  setTimeout(() => {
    img.style.opacity = 0;
    setTimeout(() => {
      img.remove();
    }, 3000); // Remove image after fade-out
  }, 5000); // Fade out after 5 seconds

  fadeIndex = (fadeIndex + 1) % fadeImages.length;
}

// Start image spawning at a regular interval
let spawnInterval = setInterval(spawnRandomImage, spawnDelay);

// Start fading images at regular intervals
setInterval(fadeImagesInAndOut, 7000);

// Display random text at intervals
setInterval(showRandomText, 10000);

function decreaseSpawnDelay() {
  // Decrease delay by 10%
  spawnDelay = Math.max(minSpawnDelay, spawnDelay * 0.9);
  
  // Reset the interval with new delay
  clearInterval(spawnInterval);
  spawnInterval = setInterval(spawnRandomImage, spawnDelay);
}
