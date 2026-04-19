const video = document.getElementById('video');
const statusText = document.getElementById('status');

// Open Camera
navigator.mediaDevices.getUserMedia({ video: true })
.then(stream => {
  video.srcObject = stream;
});

// Setup MediaPipe
const hands = new Hands({
  locateFile: file => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  }
});

hands.setOptions({
  maxNumHands: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7
});

// Detect Gesture
hands.onResults(results => {
  if (results.multiHandLandmarks.length > 0) {
    let indexFinger = results.multiHandLandmarks[0][8];

    if (indexFinger.y < 0.4) {
      statusText.innerText = "☝️ Finger Up → Scroll";
      window.scrollBy(0, -10);
    } else {
      statusText.innerText = "✋ Hand Detected";
    }
  } else {
    statusText.innerText = "No Hand ❌";
  }
});

// Start Camera
const camera = new Camera(video, {
  onFrame: async () => {
    await hands.send({ image: video });
  },
  width: 400,
  height: 300
});

camera.start();