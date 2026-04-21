import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js";

// -------- Scene --------
const scene = new THREE.Scene();

// Orthographic camera (2D)
const camera = new THREE.OrthographicCamera(
  -window.innerWidth / 2,
   window.innerWidth / 2,
   window.innerHeight / 2,
  -window.innerHeight / 2,
  0.1,
  10
);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 0);
renderer.domElement.classList.add("spider-canvas");
document.body.appendChild(renderer.domElement);

// -------- Resize --------
window.addEventListener("resize", () => {
  camera.left = -window.innerWidth / 2;
  camera.right = window.innerWidth / 2;
  camera.top = window.innerHeight / 2;
  camera.bottom = -window.innerHeight / 2;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// -------- Spider --------
const spider = new THREE.Group();
scene.add(spider);

const spiderColor = 0x3a3a3a;

// Body segments tuned for a softer, rounded look.
const abdomen = new THREE.Mesh(
  new THREE.CircleGeometry(8.6, 28),
  new THREE.MeshBasicMaterial({ color: spiderColor })
);
abdomen.position.set(-6, 0, 0);
abdomen.scale.set(1.28, 1.18, 1);
spider.add(abdomen);

const thorax = new THREE.Mesh(
  new THREE.CircleGeometry(5.9, 24),
  new THREE.MeshBasicMaterial({ color: spiderColor })
);
thorax.position.set(3, 0, 0.01);
thorax.scale.set(1.08, 1.02, 1);
spider.add(thorax);

const head = new THREE.Mesh(
  new THREE.CircleGeometry(3.8, 20),
  new THREE.MeshBasicMaterial({ color: spiderColor })
);
head.position.set(10.5, 0, 0.02);
head.scale.set(1.04, 1.0, 1);
spider.add(head);

const eyeLWhite = new THREE.Mesh(
  new THREE.CircleGeometry(1.1, 16),
  new THREE.MeshBasicMaterial({ color: 0xffffff })
);
eyeLWhite.position.set(11.8, 1.2, 0.04);
spider.add(eyeLWhite);

const eyeRWhite = eyeLWhite.clone();
eyeRWhite.position.y = -1.2;
spider.add(eyeRWhite);

const eyeLPupil = new THREE.Mesh(
  new THREE.CircleGeometry(0.42, 14),
  new THREE.MeshBasicMaterial({ color: 0x1c1c1c })
);
eyeLPupil.position.set(12.1, 1.2, 0.05);
spider.add(eyeLPupil);

const eyeRPupil = eyeLPupil.clone();
eyeRPupil.position.y = -1.2;
spider.add(eyeRPupil);

const cheekL = new THREE.Mesh(
  new THREE.CircleGeometry(0.62, 14),
  new THREE.MeshBasicMaterial({ color: 0xd9a5a5 })
);
cheekL.position.set(10.8, 2.35, 0.035);
spider.add(cheekL);

const cheekR = cheekL.clone();
cheekR.position.y = -2.35;
spider.add(cheekR);

const baseAbdomenX = -6;
const baseThoraxX = 3;
const baseHeadX = 10.5;

// Legs
const legs = [];
const legCount = 8;
const shoulderRadius = 7.4;
const upperLegLength = 11.5;
const lowerLegLength = 14;
const shoulderAngles = [0.95, 0.55, 0.15, -0.25, 3.4, 3.0, 2.6, 2.2];

for (let i = 0; i < legCount; i++) {
  const root = new THREE.Group();
  const angle = shoulderAngles[i];
  root.position.set(
    Math.cos(angle) * shoulderRadius,
    Math.sin(angle) * shoulderRadius,
    -0.01
  );
  spider.add(root);

  const upper = new THREE.Mesh(
    new THREE.PlaneGeometry(1.8, upperLegLength),
    new THREE.MeshBasicMaterial({ color: spiderColor })
  );
  upper.position.y = -upperLegLength / 2;
  root.add(upper);

  const joint = new THREE.Group();
  joint.position.y = -upperLegLength;
  root.add(joint);

  const lower = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, lowerLegLength),
    new THREE.MeshBasicMaterial({ color: spiderColor })
  );
  lower.position.y = -lowerLegLength / 2;
  joint.add(lower);

  const isRightSide = i < legCount / 2;
  const restRoot = angle + (isRightSide ? -0.35 : 0.35);
  const restJoint = isRightSide ? 0.68 : -0.68;
  root.rotation.z = restRoot;
  joint.rotation.z = restJoint;

  legs.push({
    root,
    joint,
    restRoot,
    restJoint,
    phase: i * 0.75,
    strideSign: i % 2 === 0 ? 1 : -1,
  });
}

// -------- Mouse handling --------
const target = new THREE.Vector3();
target.set(0, 0, 0);

function updateTargetFromClientPosition(clientX, clientY) {
  target.set(
    clientX - window.innerWidth / 2,
    window.innerHeight / 2 - clientY,
    0
  );
}

window.addEventListener("mousemove", (e) => {
  updateTargetFromClientPosition(e.clientX, e.clientY);
});

window.addEventListener("touchmove", (e) => {
  if (e.touches.length > 0) {
    const touch = e.touches[0];
    updateTargetFromClientPosition(touch.clientX, touch.clientY);
  }
});

// Click reaction: quick crouch and release.
let crouchStartTime = -Infinity;
const crouchDurationMs = 380;

function triggerCrouch() {
  crouchStartTime = performance.now();
}

window.addEventListener("pointerdown", triggerCrouch);

// Keyboard reaction: spin a mini purple web on Shift+W.
const activeWebs = [];
const webColor = 0x5a2a8a;

function createMiniWeb() {
  const ringCount = 4;
  const spokeCount = 12;
  const outerRadius = 20;
  const ringResolution = 36;
  const positions = [];

  for (let ring = 1; ring <= ringCount; ring++) {
    const radius = (outerRadius * ring) / ringCount;
    for (let i = 0; i < ringResolution; i++) {
      const a0 = (i / ringResolution) * Math.PI * 2;
      const a1 = ((i + 1) / ringResolution) * Math.PI * 2;
      positions.push(
        Math.cos(a0) * radius,
        Math.sin(a0) * radius,
        0,
        Math.cos(a1) * radius,
        Math.sin(a1) * radius,
        0
      );
    }
  }

  for (let i = 0; i < spokeCount; i++) {
    const a = (i / spokeCount) * Math.PI * 2;
    positions.push(0, 0, 0, Math.cos(a) * outerRadius, Math.sin(a) * outerRadius, 0);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));

  const material = new THREE.LineBasicMaterial({
    color: webColor,
    transparent: true,
    opacity: 0.95,
  });

  const web = new THREE.LineSegments(geometry, material);
  web.position.copy(spider.position);
  web.position.z = -0.04;
  web.scale.setScalar(0.4);
  scene.add(web);

  activeWebs.push({
    web,
    material,
    geometry,
    startTime: performance.now(),
    duration: 900,
    spinSpeed: 0.45 + Math.random() * 0.3,
  });
}

window.addEventListener("keydown", (e) => {
  if (e.shiftKey && !e.ctrlKey && !e.metaKey && e.key.toLowerCase() === "w" && !e.repeat) {
    e.preventDefault();
    createMiniWeb();
  }
});

// Start in center
spider.position.copy(target);
const lastPosition = spider.position.clone();

// -------- Animate --------
function animate() {
  requestAnimationFrame(animate);
  const now = performance.now();

  // Smooth follow 
  spider.position.lerp(target, 0.08);

  const velocity = spider.position.distanceTo(lastPosition);
  const movement = target.clone().sub(spider.position);
  if (movement.lengthSq() > 1) {
    const targetRotation = Math.atan2(movement.y, movement.x);
    spider.rotation.z = THREE.MathUtils.lerp(spider.rotation.z, targetRotation, 0.12);
  }

  // Speed-aware gait with subtle idle motion.
  const t = now * 0.001;
  const strideAmount = Math.min(0.9, velocity * 0.07 + 0.11);

  //crouch on click interaction :)
  const crouchElapsed = now - crouchStartTime;
  let crouchAmount = 0;
  if (crouchElapsed >= 0 && crouchElapsed < crouchDurationMs) {
    const crouchT = crouchElapsed / crouchDurationMs;
    if (crouchT < 0.35) {
      crouchAmount = crouchT / 0.35;
    } else {
      crouchAmount = 1 - (crouchT - 0.35) / 0.65;
    }
    crouchAmount = Math.pow(Math.max(0, crouchAmount), 0.7);
  }

  for (let i = 0; i < legs.length; i++) {
    const leg = legs[i];
    const wave = Math.sin(t * 6.2 + leg.phase) * leg.strideSign;
    const sweep = wave * 0.095 * strideAmount;
    const bend = Math.cos(t * 6.2 + leg.phase) * 0.14 * strideAmount;
    const crouchSweep = leg.strideSign * 0.05 * crouchAmount;
    const crouchBend = (leg.restJoint > 0 ? 0.24 : -0.24) * crouchAmount;

    leg.root.rotation.z = leg.restRoot + sweep + crouchSweep;
    leg.joint.rotation.z = leg.restJoint + bend + crouchBend;
  }

  spider.scale.set(1 + crouchAmount * 0.04, 1 - crouchAmount * 0.12, 1);
  abdomen.position.set(baseAbdomenX - crouchAmount * 0.25, -crouchAmount * 0.42, 0);
  thorax.position.set(baseThoraxX, Math.sin(t * 8) * 0.14 - crouchAmount * 0.6, 0.01);
  head.position.set(baseHeadX + crouchAmount * 0.08, -crouchAmount * 0.58, 0.02);
  abdomen.scale.y = 1.18 + Math.sin(t * 4.6) * 0.012 - crouchAmount * 0.03;

  const eyeLook = Math.sin(t * 3.2) * 0.12;
  eyeLPupil.position.x = 12.1 + eyeLook;
  eyeRPupil.position.x = 12.1 + eyeLook;

  //builds web on shift +w
  for (let i = activeWebs.length - 1; i >= 0; i--) {
    const webState = activeWebs[i];
    const elapsed = now - webState.startTime;
    const progress = elapsed / webState.duration;

    if (progress >= 1) {
      scene.remove(webState.web);
      webState.geometry.dispose();
      webState.material.dispose();
      activeWebs.splice(i, 1);
      continue;
    }

    const eased = 1 - Math.pow(1 - progress, 2);
    const scale = 0.4 + eased * 1.8;
    webState.web.scale.setScalar(scale);
    webState.web.rotation.z += webState.spinSpeed;
    webState.material.opacity = 0.95 * (1 - progress);
  }

  lastPosition.copy(spider.position);

  renderer.render(scene, camera);
}


animate();
