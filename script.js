const video = document.getElementById('video');
const statusText = document.getElementById('status');

let slides = document.querySelectorAll('.slide');
let currentSlide = 0;

let prevX = null;
let cooldown = false;

// 🎥 Start Camera
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    video.onloadedmetadata = () => {
      video.play();
      statusText.innerText = "Camera ON ✅";
    };

  } catch (err) {
    alert("Camera not working ❌");
    console.error(err);
  }
}

startCamera();

// 📊 Slide functions
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

// ✋ MediaPipe setup
const hands = new Hands({
  locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

hands.setOptions({
  maxNumHands: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

// 👉 Gesture Detection
hands.onResults(results => {
  if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
    statusText.innerText = "No Hand ❌";
    prevX = null;
    return;
  }

  statusText.innerText = "Hand Detected ✋";

  let x = results.multiHandLandmarks[0][8].x;

  if (prevX === null) {
    prevX = x;
    return;
  }

  let movement = x - prevX;

  if (!cooldown) {
    if (movement > 0.06) {
      statusText.innerText = "👉 NEXT SLIDE";
      nextSlide();
      triggerCooldown();
    }
    else if (movement < -0.06) {
      statusText.innerText = "👈 PREVIOUS SLIDE";
      prevSlide();
      triggerCooldown();
    }
  }

  prevX = x;
});

function triggerCooldown() {
  cooldown = true;
  setTimeout(() => cooldown = false, 1000);
}

// 🎥 Send frames to MediaPipe
const camera = new Camera(video, {
  onFrame: async () => {
    if (video.readyState === 4) {
      await hands.send({ image: video });
    }
  },
  width: 300,
  height: 200
});

camera.start();