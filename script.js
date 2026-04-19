const video = document.getElementById('video');
const statusText = document.getElementById('status');

let slides = document.querySelectorAll('.slide');
let currentSlide = 0;

let prevX = 0;
let cooldown = false;

// Camera
navigator.mediaDevices.getUserMedia({ video: true })
.then(stream => {
  video.srcObject = stream;
});

// Slide Functions
function showSlide(index) {
  slides.forEach(s => s.classList.remove('active'));
  slides[index].classList.add('active');
}

function nextSlide() {
  if (currentSlide < slides.length - 1) {
    currentSlide++;
    showSlide(currentSlide);
  }
}

function prevSlide() {
  if (currentSlide > 0) {
    currentSlide--;
    showSlide(currentSlide);
  }
}

// MediaPipe Setup
const hands = new Hands({
  locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

let prevX = null;
let cooldown = false;

hands.onResults(results => {
  if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
    statusText.innerText = "No Hand ❌";
    prevX = null;
    return;
  }

  statusText.innerText = "Hand Detected ✋";

  let x = results.multiHandLandmarks[0][8].x; // index finger

  if (prevX === null) {
    prevX = x;
    return;
  }

  let movement = x - prevX;

  console.log("Movement:", movement);

  if (!cooldown) {
    if (movement > 0.05) {   // 🔥 easier detection
      statusText.innerText = "👉 NEXT";
      nextSlide();
      triggerCooldown();
    }
    else if (movement < -0.05) {
      statusText.innerText = "👈 PREVIOUS";
      prevSlide();
      triggerCooldown();
    }
  }

  prevX = x;
});

function triggerCooldown() {
  cooldown = true;
  setTimeout(() => cooldown = false, 800);
}

const video = document.getElementById('video');

// Start camera
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    video.onloadedmetadata = () => {
      video.play();
      console.log("Camera started ✅");
    };

  } catch (err) {
    alert("Camera permission denied ❌");
    console.error(err);
  }
}

startCamera();