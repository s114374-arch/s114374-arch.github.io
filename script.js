/* --- 1. 核心變數與元素取得 --- */
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d'); // 取得畫布的 2D 繪圖環境

const topTextInput = document.getElementById('topText');
const bottomTextInput = document.getElementById('bottomText');
const snapButton = document.getElementById('snap');
const downloadLink = document.getElementById('download');
const filterButtons = document.querySelectorAll('.filter-btn');

// 設定畫布預設解析度 (640x480)
canvas.width = 640;
canvas.height = 480;

let currentFilter = 'none'; // 當前啟用的濾鏡

/* --- 2. 初始化：啟動攝像頭 --- */
async function initCamera() {
  try {
    // 請求使用者的視訊設備 (攝像頭)
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 },
      audio: false // 不需要聲音
    });
    
    // 將視訊流賦值給 <video> 元素並播放
    video.srcObject = stream;
    
    // 當視訊開始播放時，啟動畫布繪製循環
    video.addEventListener('playing', () => {
      drawFrame();
    });

  } catch (err) {
    console.error("無法存取攝像頭: ", err);
    alert("無法存取攝像頭，請確保您已授權權限。");
    // 如果沒有攝像頭，顯示一個替代畫面
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#cyan';
    ctx.font = '20px Courier New';
    ctx.fillText("CAMERA OFFLINE", 50, 50);
  }
}

/* --- 3. 核心繪圖循環：將視訊畫到畫布上 (已修正濾鏡與變形問題) --- */
function drawFrame() {
  // 動態調整畫布的內部解析度，使其完美符合視訊鏡頭的實際比例，防止臉部變形
  if (video.videoWidth && (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight)) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  }

  ctx.save(); // 保存當前狀態
  
  // 【關鍵修正】必須在繪製（drawImage）之前，就先把濾鏡準備好！
  setCanvasFilter(ctx);
  
  // 繪製視訊幀（此時濾鏡會直接套用到這張圖上）
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  ctx.restore(); // 恢復狀態（清除濾鏡，避免影響到後面的文字）

  // 繪製迷因文字（文字不需要套用濾鏡，所以放在 restore 後面）
  drawMemeText(ctx);

  // 使用 requestAnimationFrame 實時重複繪製
  requestAnimationFrame(drawFrame);
}

/* --- 4. 功能：設定濾鏡 (已修正純設定、不重疊繪製) --- */
function setCanvasFilter(context) {
  switch (currentFilter) {
    case 'retro-bw':
      context.filter = 'grayscale(100%) contrast(150%) sepia(20%)';
      break;
    case 'cyber-neon':
      context.filter = 'saturate(200%) hue-rotate(-20deg) contrast(120%)';
      break;
    case 'jpop-soft':
      context.filter = 'contrast(80%) brightness(120%) sepia(10%)';
      break;
    default:
      context.filter = 'none'; // 原圖
  }
}

/* --- 5. 功能：繪製迷因文字 --- */
function drawMemeText(context) {
  const topText = topTextInput.value.toUpperCase(); // 轉大寫
  const bottomText = bottomTextInput.value.toUpperCase();
  
  // 設定文字樣式
  context.font = 'bold 48px Impact, sans-serif'; // Impact 是經典迷因字體
  context.fillStyle = 'white';
  context.strokeStyle = 'black'; // 文字外框
  context.lineWidth = 4;
  context.textAlign = 'center';
  context.filter = 'none'; // 文字不套用濾鏡
  
  // 繪製頂部文字
  if (topText) {
    context.textBaseline = 'top';
    context.strokeText(topText, canvas.width / 2, 10);
    context.fillText(topText, canvas.width / 2, 10);
  }
  
  // 繪製底部文字
  if (bottomText) {
    context.textBaseline = 'bottom';
    context.strokeText(bottomText, canvas.width / 2, canvas.height - 10);
    context.fillText(bottomText, canvas.width / 2, canvas.height - 10);
  }
}

/* --- 6. 事件監聽 --- */

// 濾鏡按鈕點擊事件
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // 移除其他按鈕的 active 樣式
    document.querySelector('.filter-btn.active').classList.remove('active');
    // 給當前按鈕加上 active 樣式
    btn.classList.add('active');
    // 更新當前濾鏡名稱
    currentFilter = btn.dataset.filter;
  });
});

// 文字輸入事件：實時更新 (其實 drawFrame 循環已經幫我們處理了，這裡不需要額外邏輯)

// "TAKE PHOTO" 按鈕：捕捉當前畫布並啟用下載
snapButton.addEventListener('click', () => {
  // 將畫布內容轉換為 Base64 圖片數據
  const dataURL = canvas.toDataURL('image/png');
  
  // 更新下載連結的 href
  downloadLink.href = dataURL;
  
  // 啟用下載按鈕
  downloadLink.classList.remove('disabled');
  downloadLink.classList.add('enabled');
  downloadLink.innerHTML = "💾 SAVE IMAGE (READY)";
  
  // 閃爍一下畫布做為視覺反饋
  canvas.style.opacity = '0.5';
  setTimeout(() => canvas.style.opacity = '1', 100);
});

/* --- 7. 程式啟動 --- */
initCamera();
