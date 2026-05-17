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
const baseSpiderScale = 1.5;

const bodyColor = 0x6f7379;
const headPlateColor = 0xa6abb1;
const legColor = 0x6d7177;

// Rear body and front head plate inspired by the reference silhouette.
const body = new THREE.Mesh(
  new THREE.CircleGeometry(9.2, 36),
  new THREE.MeshBasicMaterial({ color: bodyColor })
);
body.position.set(-0.7, 1.25, 0);
body.scale.set(1.2, 1.02, 1);
spider.add(body);

const head = new THREE.Mesh(
  new THREE.CircleGeometry(5.7, 28),
  new THREE.MeshBasicMaterial({ color: headPlateColor })
);
head.position.set(8.7, -3.2, 0.05);
head.position.z = 0.2;
head.scale.set(1.26, 1.26, 1);
spider.add(head);

const pincherMaterial = new THREE.MeshBasicMaterial({ color: bodyColor });

const leftPincher = new THREE.Mesh(
  new THREE.CapsuleGeometry(0.60, 1.85, 3, 10),
  pincherMaterial
);
leftPincher.position.set(4.35, 2.20, 0.22);
leftPincher.rotation.z = -1.5;
head.add(leftPincher);

const rightPincher = new THREE.Mesh(
  new THREE.CapsuleGeometry(0.60, 1.85, 3, 10),
  pincherMaterial
);
rightPincher.position.set(4.35, -2.20, 0.22);
rightPincher.rotation.z = -1.5;
head.add(rightPincher);

const flower = new THREE.Group();
flower.visible = false;
head.add(flower);
flower.position.set(-50.0, 0, 0);
flower.scale.set(20.0, 20.0, 1);

const flowerStem = new THREE.Mesh(
  new THREE.CapsuleGeometry(0.12, 2.3, 3, 10),
  new THREE.MeshBasicMaterial({ color: 0x5ea36a })
);
flowerStem.position.set(4.05, 0, 0.12);
flowerStem.rotation.z = Math.PI / 2;
flower.add(flowerStem);

const flowerCenter = new THREE.Mesh(
  new THREE.CircleGeometry(0.24, 18),
  new THREE.MeshBasicMaterial({ color: 0xffd46b })
);
flowerCenter.position.set(4.8, 0, 0.32);
flower.add(flowerCenter);

for (let i = 0; i < 6; i++) {
  const petal = new THREE.Mesh(
    new THREE.CircleGeometry(0.25, 16),
    new THREE.MeshBasicMaterial({ color: 0xff66b3 })
  );
  const angle = (i / 6) * Math.PI * 2;
  petal.position.set(
    4.8 + Math.cos(angle) * 0.38,
    Math.sin(angle) * 0.38,
    0.31
  );
  flower.add(petal);
}

const eyeGroup = new THREE.Group();
eyeGroup.position.set(9.0, -100.35, 0.25);
eyeGroup.rotation.z = Math.PI / 2;
eyeGroup.scale.set(1.56, 1.56, 1);
spider.add(eyeGroup);

const leftMainEye = new THREE.Mesh(
  new THREE.CircleGeometry(1.22, 18),
  new THREE.MeshBasicMaterial({ color: 0x000000 })
);
leftMainEye.position.set(-1.15, 0.18, 0);
eyeGroup.add(leftMainEye);

const rightMainEye = leftMainEye.clone();
rightMainEye.position.set(1.15, 0.18, 0);
eyeGroup.add(rightMainEye);

const leftSideEye = new THREE.Mesh(
  new THREE.CircleGeometry(0.58, 16),
  new THREE.MeshBasicMaterial({ color: 0x000000 })
);
leftSideEye.scale.set(1.2, 1.2, 1);
leftSideEye.position.set(-2.5, 1.56, 0);
eyeGroup.add(leftSideEye);

const rightSideEye = leftSideEye.clone();
rightSideEye.position.set(2.5, 1.56, 0);
eyeGroup.add(rightSideEye);

const leftMainShine = new THREE.Mesh(
  new THREE.CircleGeometry(0.34, 14),
  new THREE.MeshBasicMaterial({ color: 0xffffff })
);
leftMainShine.position.set(-1.45, 0.45, 0);
eyeGroup.add(leftMainShine);

const rightMainShine = leftMainShine.clone();
rightMainShine.position.set(1.45, 0.45, 0);
eyeGroup.add(rightMainShine);

const leftSideShine = new THREE.Mesh(
  new THREE.CircleGeometry(0.16, 12),
  new THREE.MeshBasicMaterial({ color: 0xffffff })
);
leftSideShine.position.set(-2.25, 1.7, 0);
eyeGroup.add(leftSideShine);

const rightSideShine = leftSideShine.clone();
rightSideShine.position.set(2.25, 1.7, 0);
eyeGroup.add(rightSideShine);

const baseBodyX = -0.7;
const baseBodyY = 1.25;
const baseHeadX = 8.7;
const baseHeadY = -3.2;

// Legs
const legs = [];
const legCount = 8;
const upperLegLength = 8;
const lowerLegLength = 9.5;
const upperLegRadius = 0.62;
const lowerLegRadius = 0.56;
const legGlobalRotationOffset = 1.03;
const legRootOffsets = [
  [-6.0, 4.0],
  [2.2, 6.2],
  [-1.1, 7.2],
  [-4.2, 6.2],
  [-6.0, -4.0],
  [2.2, -6.2],
  [-1.1, -7.2],
  [-4.2, -6.2],
];

for (let i = 0; i < legCount; i++) {
  const root = new THREE.Group();
  const offset = legRootOffsets[i];
  const anchorX = offset[0];
  const anchorY = offset[1];
  const outwardAngle = Math.atan2(anchorY, anchorX - baseBodyX);
  root.position.set(
    anchorX,
    anchorY,
    -0.4
  );
  spider.add(root);

  const upper = new THREE.Mesh(
    new THREE.CapsuleGeometry(upperLegRadius, upperLegLength, 3, 10),
    new THREE.MeshBasicMaterial({ color: legColor })
  );
  upper.position.y = -upperLegLength / 2;
  root.add(upper);

  const joint = new THREE.Group();
  joint.position.y = -upperLegLength;
  root.add(joint);

  const lower = new THREE.Mesh(
    new THREE.CapsuleGeometry(lowerLegRadius, lowerLegLength, 3, 10),
    new THREE.MeshBasicMaterial({ color: legColor })
  );
  lower.position.y = -lowerLegLength / 2;
  joint.add(lower);

  const isUpperSide = anchorY > 0;
  const restRoot = outwardAngle + (isUpperSide ? -0.25 : 0.25) + legGlobalRotationOffset;
  const restJoint = isUpperSide ? 0.62 : -0.62;
  root.rotation.z = restRoot * 0.8;
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
let lastInteractionTime = performance.now();
const idleDelayMs = 20000;

const idlePickupTarget = new THREE.Vector3();
const idlePresentTarget = new THREE.Vector3();
let idleState = "inactive";

function updateIdleWaypoints() {
  const headerEl = document.querySelector("header");
  const headerHeight = headerEl ? headerEl.offsetHeight : 220;
  const topWorldY = window.innerHeight / 2;
  idlePickupTarget.set(-window.innerWidth * 0.16, topWorldY - headerHeight * 0.45, 0);
  idlePresentTarget.set(-window.innerWidth * 0.03, topWorldY - headerHeight - 190, 0);
}

function resetIdleSequence() {
  idleState = "inactive";
  flower.visible = false;
}

function registerInteraction() {
  lastInteractionTime = performance.now();
  resetIdleSequence();
}

updateIdleWaypoints();

function updateTargetFromClientPosition(clientX, clientY) {
  target.set(
    clientX - window.innerWidth / 2,
    window.innerHeight / 2 - clientY,
    0
  );
}

window.addEventListener("mousemove", (e) => {
  registerInteraction();
  updateTargetFromClientPosition(e.clientX, e.clientY);
});

window.addEventListener("touchmove", (e) => {
  if (e.touches.length > 0) {
    registerInteraction();
    const touch = e.touches[0];
    updateTargetFromClientPosition(touch.clientX, touch.clientY);
  }
});

// Click reaction: quick crouch and release.
let crouchStartTime = -Infinity;
const crouchDurationMs = 380;

function triggerCrouch() {
  registerInteraction();
  crouchStartTime = performance.now();
}

window.addEventListener("pointerdown", triggerCrouch);

// Keyboard reaction: spin a mini purple web on Shift+W.
const activeWebs = [];
const webColor = 0x5a2a8a;
const rearWebLocalAnchor = new THREE.Vector3(baseBodyX - 11.2, baseBodyY, 0);
const rearWebWorldAnchor = new THREE.Vector3();

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
  spider.localToWorld(rearWebWorldAnchor.copy(rearWebLocalAnchor));
  web.position.copy(rearWebWorldAnchor);
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
  registerInteraction();
  if (e.shiftKey && !e.ctrlKey && !e.metaKey && e.key.toLowerCase() === "w" && !e.repeat) {
    e.preventDefault();
    createMiniWeb();
  }
});

// Start in center
spider.position.copy(target);
spider.scale.setScalar(baseSpiderScale);
const lastPosition = spider.position.clone();

// -------- Animate --------
function animate() {
  requestAnimationFrame(animate);
  const now = performance.now();
  updateIdleWaypoints();

  const idleElapsed = now - lastInteractionTime;
  const isIdle = idleElapsed >= idleDelayMs;

  let followTarget = target;
  if (isIdle) {
    if (idleState === "inactive") {
      idleState = "to-header";
    }

    if (idleState === "to-header") {
      followTarget = idlePickupTarget;
      if (spider.position.distanceToSquared(idlePickupTarget) < 120) {
        flower.visible = true;
        idleState = "to-present";
      }
    } else if (idleState === "to-present") {
      followTarget = idlePresentTarget;
      if (spider.position.distanceToSquared(idlePresentTarget) < 80) {
        idleState = "presenting";
      }
    } else {
      followTarget = idlePresentTarget;
    }
  } else if (idleState !== "inactive") {
    resetIdleSequence();
  }

  // Smooth follow 
  const followLerp = idleState === "inactive" ? 0.08 : 0.06;
  spider.position.lerp(followTarget, followLerp);

  const velocity = spider.position.distanceTo(lastPosition);
  const movement = followTarget.clone().sub(spider.position);
  if (movement.lengthSq() > 1) {
    const targetRotation = Math.atan2(movement.y, movement.x);
    spider.rotation.z = THREE.MathUtils.lerp(spider.rotation.z, targetRotation, 0.12);
  } else if (idleState === "presenting") {
    const presentRotation = Math.atan2(-0.06, 1);
    spider.rotation.z = THREE.MathUtils.lerp(spider.rotation.z, presentRotation, 0.08);
  }

  // Speed-aware gait with subtle idle motion.
  const t = now * 0.001;
  const idleLegBlend = idleState === "presenting" ? 0.55 : 0;
  const strideAmount = Math.min(0.9, velocity * 0.07 + 0.11);
  const gaitSpeed = THREE.MathUtils.lerp(6.2, 4.1, idleLegBlend);

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
    const wave = Math.sin(t * gaitSpeed + leg.phase) * leg.strideSign;
    const sweep = wave * THREE.MathUtils.lerp(0.095, 0.07, idleLegBlend) * strideAmount;
    const bend = Math.cos(t * gaitSpeed + leg.phase) * THREE.MathUtils.lerp(0.14, 0.1, idleLegBlend) * strideAmount;
    const crouchSweep = leg.strideSign * 0.05 * crouchAmount;
    const crouchBend = (leg.restJoint > 0 ? 0.24 : -0.24) * crouchAmount;

    leg.root.rotation.z = leg.restRoot + sweep + crouchSweep;
    leg.joint.rotation.z = leg.restJoint + bend + crouchBend;
  }

  spider.scale.set(
    baseSpiderScale * (1 + crouchAmount * 0.04),
    baseSpiderScale * (1 - crouchAmount * 0.12),
    baseSpiderScale
  );
  const bodyBobY = Math.sin(t * 8) * 0.11 + (idleState === "presenting" ? Math.sin(t * 2.4) * 0.08 : 0);
  body.position.set(baseBodyX - crouchAmount * 0.12, baseBodyY + bodyBobY - crouchAmount * 0.46, 0);
  head.position.set(baseHeadX + crouchAmount * 0.08, baseHeadY - crouchAmount * 0.52, 0.2);
  eyeGroup.position.set(8.7 + crouchAmount * 0.08, -2.35 - crouchAmount * 0.5, 0.25);
  body.scale.y = 1.02 + Math.sin(t * 4.6) * 0.012 - crouchAmount * 0.03;

  if (flower.visible) {
    flower.rotation.z = Math.sin(t * 3.2) * 0.1;
  }

  const eyeLook = Math.sin(t * 3.2) * 0.12;
  leftMainShine.position.x = -1.45 + eyeLook * 0.45;
  rightMainShine.position.x = 1.45 + eyeLook * 0.45;
  leftSideShine.position.x = -2.25 + eyeLook * 0.28;
  rightSideShine.position.x = 2.25 + eyeLook * 0.28;

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
