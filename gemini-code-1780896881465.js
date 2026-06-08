const toggleBtn = document.getElementById('toggle-style');
const body = document.body;
const plantImg = document.getElementById('plant-image');

// 假設目前植物是 Stage 1
let currentStage = 1; 

toggleBtn.addEventListener('click', () => {
  const currentStyle = body.getAttribute('data-style');
  
  if (currentStyle === 'handdrawn') {
    // 切換成像素風
    body.setAttribute('data-style', 'pixel');
    plantImg.src = `images/pixel_stage${currentStage}.png`;
  } else {
    // 切換回手繪風
    body.setAttribute('data-style', 'handdrawn');
    plantImg.src = `images/handdrawn_stage${currentStage}.png`;
  }
});