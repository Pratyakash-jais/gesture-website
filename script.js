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

hands.setOptions({
  maxNumHands: 1,
minDetectionConfidence: 0.4,
minTrackingConfidence: 0.4
});

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

hands.onResults(results => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (results.multiHandLandmarks.length > 0) {
    statusText.innerText = "Hand Detected ✋";

    results.multiHandLandmarks.forEach(hand => {
      hand.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x * 400, point.y * 300, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
      });
    });
  } else {
    statusText.innerText = "No Hand ❌";
  }
});

function triggerCooldown() {
  cooldown = true;
  setTimeout(() => cooldown = false, 1000);
}

// Start Camera
const camera = new Camera(video, {
  onFrame: async () => {
    await hands.send({ image: video });
  },
  width: 300,
  height: 200
});

camera.start();