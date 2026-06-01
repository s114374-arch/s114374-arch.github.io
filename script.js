/* --- COMPLETE FIXED SCRIPT.JS (用此代碼覆蓋全檔案) --- */

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d'); // 取得 2D 環境

const topTextInput = document.getElementById('topText');
const bottomTextInput = document.getElementById('bottomText');
const snapButton = document.getElementById('snap');
const downloadLink = document.getElementById('download');
const filterButtons = document.querySelectorAll('.filter-btn');

let currentFilter = 'none';

// 初始化
canvas.width = 640;
canvas.height = 480;

async function initCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 },
      audio: false
    });
    video.srcObject = stream;
    video.addEventListener('playing', () => {
      console.log('Video stream is playing. Starting draw loop.');
      drawLoop(); // 啟動繪圖循環
    });
  } catch (err) {
    console.error("相機存取失敗: ", err);
    alert("無法開啟相機，請確認 HTTPS 或權限設定。");
  }
}

// 核心繪圖循環：將視訊畫到畫布上
function drawLoop() {
  // 1. 自動修正 Canvas 比例，防止變形
  if (video.videoWidth && (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight)) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    console.log(`Canvas resized to video stream: ${canvas.width}x${canvas.height}`);
  }

  // 2. 清除當前畫布
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 3. 【關鍵修正】在繪製影像之前，就設定畫布濾鏡特效
  ctx.save(); // 保存未套用濾鏡前的狀態
  
  applyCanvasFilter(ctx);
  
  // 4. 繪製視訊（此時濾鏡會直接生效）
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  ctx.restore(); // 【關鍵修正】恢復原本狀態，清除濾鏡，避免文字也被濾鏡化

  // 5. 繪製迷因文字（文字不會有濾鏡效果）
  drawMemeText(ctx);

  // 重複循環
  requestAnimationFrame(drawLoop);
}

// 功能：設定濾鏡 (與 CSS Filter 對應)
function applyCanvasFilter(context) {
  // 這裡是 Canvas 濾鏡的設定
  switch (currentFilter) {
    case 'retro-bw':
      // 復古黑白：100% 灰階 + 150% 對比
      context.filter = 'grayscale(100%) contrast(150%)';
      break;
    case 'cyber-neon':
      // 賽博霓虹：高飽和度 + 色相旋轉 -20度
      context.filter = 'saturate(200%) hue-rotate(-20deg) contrast(110%)';
      break;
    case 'jpop-soft':
      // 日系清新：1.5px 模糊 + 10% 暖色調
      context.filter = 'blur(1.5px) sepia(10%) brightness(110%)';
      break;
    default:
      context.filter = 'none'; // 原圖
  }
}

// 功能：繪製迷因文字
function drawMemeText(context) {
  const topText = topTextInput.value.toUpperCase();
  const bottomText = bottomTextInput.value.toUpperCase();
  
  context.font = 'bold 54px Impact, sans-serif'; // 字體加大一點
  context.fillStyle = 'white';
  context.strokeStyle = 'black'; // 文字外框
  context.lineWidth = 4;
  context.textAlign = 'center';
  context.filter = 'none'; // 這裡強制確保文字不套用任何濾鏡
  
  if (topText) {
    context.textBaseline = 'top';
    context.strokeText(topText, canvas.width / 2, 10);
    context.fillText(topText, canvas.width / 2, 10);
  }
  
  if (bottomText) {
    context.textBaseline = 'bottom';
    context.strokeText(bottomText, canvas.width / 2, canvas.height - 10);
    context.fillText(bottomText, canvas.width / 2, canvas.height - 10);
  }
}

/* --- 事件監聽 (不變) --- */
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.filter-btn.active').classList.remove('active');
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    console.log(`Filter changed to: ${currentFilter}`);
  });
});

snapButton.addEventListener('click', () => {
  const dataURL = canvas.toDataURL('image/png');
  downloadLink.href = dataURL;
  downloadLink.classList.remove('disabled');
  downloadLink.classList.add('enabled');
  downloadLink.innerHTML = "💾 SAVE IMAGE (READY)";
  canvas.style.opacity = '0.5';
  setTimeout(() => canvas.style.opacity = '1', 100);
});

// 啟動相機
initCamera();

/* --- 7. 程式啟動 --- */
initCamera();
