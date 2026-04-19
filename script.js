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
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7
});

hands.onResults(results => {
  if (!results.multiHandLandmarks.length) return;

  let hand = results.multiHandLandmarks[0];
  let indexFinger = hand[8];

  let currentX = indexFinger.x;

  if (!cooldown) {
    if (currentX - prevX > 0.08) {
      statusText.innerText = "👉 Swipe Right → Next";
      nextSlide();
      triggerCooldown();
    }
    else if (prevX - currentX > 0.08) {
      statusText.innerText = "👈 Swipe Left → Previous";
      prevSlide();
      triggerCooldown();
    }
  }

  prevX = currentX;
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