gsap.registerPlugin(Observer);

const bowl = document.querySelector(".bowl");
const text = document.querySelector(".text");
const addIngredientBtn = document.getElementById("add-ingredient");

// construct array of ingredients and mao heads
var ingredients = new Array();
// fill with images
ingredients[0] = 'lib/images/chili1.png';
ingredients[1] = 'lib/images/chili2.png';
ingredients[2] = 'lib/images/chili3.png';
ingredients[3] = 'lib/images/chili4.png';
ingredients[4] = 'lib/images/chili5.png';
ingredients[5] = 'lib/images/chili6.png';
ingredients[6] = 'lib/images/chili7.png';
ingredients[7] = 'lib/images/meat1.png';

var maos = new Array();
maos[0] = 'lib/images/mao1.png';
maos[1] = 'lib/images/mao2.png';

function getRandomInt(val) {
  return Math.ceil(Math.random() * val) * (Math.round(Math.random()) ? 1 : -1);
}

function addSoupIngredient() {
  const el = document.createElement("img");
  const img = ingredients[Math.floor(Math.random() * ingredients.length)];
  const pos = 40;
  const translate = 5;
  const rotate = 180;

  el.setAttribute("src", img);
  el.classList.add("img");
  el.style.top = `${getRandomInt(pos)}%`;
  el.style.left = `${getRandomInt(pos)}%`;

  el.height = 30 + getRandomInt(100-30);

  bowl.appendChild(el);
  gsap.to(el, {
    xPercent: () => getRandomInt(translate),
    yPercent: () => getRandomInt(translate),
    rotation: () => getRandomInt(rotate),
    ease: "expo.out",
    duration: 2
  });
}

function addMao() {
  const el = document.createElement("img");
  const img = maos[Math.floor(Math.random() * maos.length)];
  const pos = 40;
  const translate = 5;
  const rotate = 30;

  el.setAttribute("src", img);
  el.classList.add("img");
  el.style.top = `${getRandomInt(pos)}%`;
  el.style.left = `${getRandomInt(pos)}%`;

  el.height = 30 + getRandomInt(80-30);

  bowl.appendChild(el);
  gsap.to(el, {
    xPercent: () => getRandomInt(translate),
    yPercent: () => getRandomInt(translate),
    rotation: () => getRandomInt(rotate),
    ease: "expo.out",
    duration: 2
  });
}

function moveChars(obj) {
  const { event, deltaX, deltaY } = obj;
  const el = event.target;
  const r = el.getBoundingClientRect();
  const y = event.clientY - (r.top + Math.floor(r.height / 2));
  const t = 5;

  gsap.to(obj.event.target, {
    xPercent: `+=${deltaX * t}`,
    yPercent: `+=${deltaY * t}`,
    rotation: `-=${deltaX * t * Math.sign(y)}`,
    duration: 3,
    ease: "expo.out"
  });
}

Observer.create({
  target: bowl,
  onMove: (self) => self.event.target.matches(".img") && moveChars(self)
});

gsap.to(".img", {
  xPercent: () => getRandomInt(2),
  yPercent: () => getRandomInt(2),
  rotation: () => getRandomInt(70),
  duration: 5
});

addIngredientBtn.addEventListener("click", addMao);

// preload ingredients
window.onload = function() {
  for (var i = 1; i < 100; i++) addSoupIngredient();
  for (var i = 1; i < 3; i++) addMao();
};
