// ============================================================
// MUSIC
// ============================================================
const bgMusic  = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
bgMusic.volume = 0.35;
let musicOn = false;

musicBtn.addEventListener('click', () => {
  if (!musicOn) {
    bgMusic.play().then(() => {
      musicOn = true;
      musicBtn.textContent = '🔊';
      musicBtn.classList.add('playing');
    }).catch(() => {});
  } else {
    bgMusic.pause();
    musicOn = false;
    musicBtn.textContent = '🎵';
    musicBtn.classList.remove('playing');
  }
});

// ============================================================
// STARS BACKGROUND
// ============================================================
for (let i = 0; i < 60; i++) {
  const s = document.createElement('div');
  s.style.cssText = `
    position:fixed; border-radius:50%; background:white; z-index:1; pointer-events:none;
    width:${Math.random()*2.5+0.4}px; height:${Math.random()*2.5+0.4}px;
    top:${Math.random()*100}%; left:${Math.random()*100}%;
    animation:twinkle ${Math.random()*3+1.5}s ease-in-out ${Math.random()*4}s infinite alternate;
  `;
  document.body.appendChild(s);
}
const ks = document.createElement('style');
ks.textContent = `@keyframes twinkle{from{opacity:.07;transform:scale(.7)}to{opacity:.55;transform:scale(1.3)}}`;
document.head.appendChild(ks);

// ============================================================
// CONFETTI & FIREWORKS
// ============================================================
const cfColors = ['#ff4d6d','#ffbe0b','#ff6eb4','#c77dff','#72efdd','#ffe066','#4a9eff','#fff'];

function spawnConfetti(n = 80) {
  for (let i = 0; i < n; i++) {
    setTimeout(() => {
      const c = document.createElement('div');
      c.className = 'cf';
      const sz = Math.random() * 9 + 5;
      c.style.cssText = `
        left:${Math.random()*100}vw;
        width:${sz}px; height:${sz*1.4}px;
        background:${cfColors[Math.floor(Math.random()*cfColors.length)]};
        border-radius:${Math.random()>.5?'50%':'3px'};
        animation-duration:${Math.random()*2+1.6}s;
      `;
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 3800);
    }, i * 16);
  }
}

function launchFireworks() {
  for (let i = 0; i < 7; i++) {
    setTimeout(() => {
      const cx = 15 + Math.random() * 70;
      const cy = 10 + Math.random() * 55;
      for (let j = 0; j < 20; j++) {
        const f  = document.createElement('div');
        f.className = 'fw';
        const angle = (j / 20) * 360;
        const dist  = 55 + Math.random() * 90;
        const rad   = angle * Math.PI / 180;
        f.style.cssText = `
          left:${cx}vw; top:${cy}vh;
          background:${cfColors[Math.floor(Math.random()*cfColors.length)]};
          --tx:${Math.cos(rad)*dist}px; --ty:${Math.sin(rad)*dist}px;
          animation-duration:${0.55+Math.random()*0.45}s;
        `;
        document.body.appendChild(f);
        setTimeout(() => f.remove(), 1000);
      }
    }, i * 200);
  }
}

// ============================================================
// VICTORY SCREEN
// ============================================================
const victoryScreen = document.getElementById('victoryScreen');
const claimBtn      = document.getElementById('claimBtn');

setTimeout(() => {
  spawnConfetti(100);
  launchFireworks();
}, 800);

claimBtn.addEventListener('click', () => {
  claimBtn.disabled = true;
  claimBtn.textContent = 'Sebentar ya Zezell...🎀';
  spawnConfetti(60);
  victoryScreen.classList.add('hide');
  setTimeout(() => {
    victoryScreen.style.display = 'none';
    showLoadingScreen();
  }, 600);
});

// ============================================================
// LOADING SCREEN
// ============================================================
const loadingScreen = document.getElementById('loadingScreen');
const progressBar   = document.getElementById('progressBar');
const loadingSub    = document.getElementById('loadingSub');
const loadingRays   = document.getElementById('loadingRays');

for (let i = 0; i < 12; i++) {
  const ray = document.createElement('span');
  ray.style.transform = `translateX(-50%) rotate(${i * 30}deg)`;
  loadingRays.appendChild(ray);
}

const loadingMessages = [
  'Membuka bungkus kado..',
  'Menyiapkan kejutan..',
  'Hampir siap..',
  'Kado udah siap dibuka!'
];

function showLoadingScreen() {
  loadingScreen.classList.add('show');
  progressBar.style.width = '0%';
  let progress = 0;
  let msgIndex = 0;

  const iv = setInterval(() => {
    const increment = Math.random() * 18 + 8;
    progress = Math.min(progress + increment, 100);
    progressBar.style.width = progress + '%';

    const newMsgIndex = Math.floor((progress / 100) * loadingMessages.length);
    if (newMsgIndex !== msgIndex && newMsgIndex < loadingMessages.length) {
      msgIndex = newMsgIndex;
      loadingSub.style.opacity = '0';
      setTimeout(() => {
        loadingSub.textContent = loadingMessages[msgIndex];
        loadingSub.style.opacity = '1';
      }, 200);
    }

    if (progress >= 100) {
      clearInterval(iv);
      progressBar.style.width = '100%';
      loadingSub.textContent = 'ENJOY!';
      setTimeout(() => {
        loadingScreen.classList.add('hide');
        setTimeout(() => {
          loadingScreen.style.display = 'none';
          showMainContent();
        }, 600);
      }, 500);
    }
  }, 320);
}

function showMainContent() {
  const wrapper = document.getElementById('wrapper');
  wrapper.style.display = 'flex';
  wrapper.style.opacity = '0';
  wrapper.style.transform = 'translateY(24px)';
  wrapper.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  setTimeout(() => {
    wrapper.style.opacity = '1';
    wrapper.style.transform = 'translateY(0)';
  }, 80);
}

// ============================================================
// GIFT STATE
// ============================================================
let openedCount = 0;
const hintText  = document.getElementById('hintText');
const hints = [
  'Klik kado pertama untuk mulai!',
  'Kado ke-2 udah terbuka, Lanjut der!',
  'Tinggal satu lagi, you can do it!',
  'Yeay, Semua kado udah terbuka! Cheers!!'
];

// ============================================================
// GIFT MODAL
// ============================================================
const overlay      = document.getElementById('modalOverlay');
const modalCard    = document.getElementById('modalCard');
const modalClose   = document.getElementById('modalClose');
const modalContent = document.getElementById('modalContent');

function openModal(giftNum) {
  modalCard.className       = 'modal-card card-' + giftNum;
  modalCard.style.animation = '';
  modalContent.innerHTML    = getContent(giftNum);
  overlay.classList.add('show');
  modalCard.scrollTop = 0;

  if (giftNum === 2) {
    setTimeout(() => initTwibon(), 100);
    setTimeout(() => initTwibonEffects(), 300);
  }

  if (giftNum === 3) {
    setTimeout(() => {
      const starsEl = document.getElementById('snbpStars');
      if (!starsEl) return;
      for (let i = 0; i < 20; i++) {
        const s  = document.createElement('span');
        const sz = Math.random() * 4 + 2;
        s.style.cssText = `
          width:${sz}px; height:${sz}px;
          top:${Math.random()*100}%; left:${Math.random()*100}%;
          animation-duration:${Math.random()*2.5+1.5}s;
          animation-delay:${Math.random()*2}s;
        `;
        starsEl.appendChild(s);
      }
      setTimeout(() => { spawnConfetti(100); launchFireworks(); }, 300);
    }, 100);
  } else {
    setTimeout(() => spawnConfetti(45), 300);
  }
}

function closeModal() {
  modalCard.style.animation = 'modalOut 0.28s ease both';
  setTimeout(() => {
    overlay.classList.remove('show');
    modalCard.style.animation = '';
  }, 280);
}

modalClose.addEventListener('click', closeModal);
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeModal();
});

// ============================================================
// GIFT CLICK
// ============================================================
document.querySelectorAll('.gift-box').forEach(box => {
  box.addEventListener('click', () => {
    if (box.classList.contains('locked')) return;
    const num = parseInt(box.dataset.gift);
    if (box.classList.contains('opened')) {
      openModal(num);
      return;
    }
    box.classList.add('opened');
    openedCount++;
    const next = document.getElementById('gift' + (num + 1));
    if (next) {
      setTimeout(() => {
        next.classList.remove('locked');
        next.querySelector('.lock-icon')?.remove();
        next.classList.add('just-unlocked');
        setTimeout(() => next.classList.remove('just-unlocked'), 700);
      }, 350);
    }
    hintText.textContent = hints[openedCount] || '';
    openModal(num);
  });
});

// ============================================================
// INFO BUTTON
// ============================================================
const infoBtn   = document.getElementById('infoBtn');
const infoModal = document.getElementById('infoModal');
const infoClose = document.getElementById('infoClose');

infoBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  infoModal.classList.add('show');
});
infoClose.addEventListener('click', () => {
  infoModal.classList.remove('show');
});
infoModal.addEventListener('click', (e) => {
  if (e.target === infoModal) infoModal.classList.remove('show');
});

// ============================================================
// GIFT CONTENT
// ============================================================
function getContent(n) {

  // ── KADO 1 — SURAT ──────────────────────────────────────
  if (n === 1) return `
    <div class="letter-seal">1️⃣8️⃣</div>
    <div class="letter-title">Happy Eighteen!!</div>
    <div class="letter-body">
Haii Zezell,

Selamat ulang tahun yaa.
Semoga di usia kamu yang sekarang, banyak hal baik yang terus datang pelan-pelan ke hidup kamu. Semoga semua usaha yang sedang kamu jalanin juga dapat menemukan jalannya.

Mungkin kita sudah tidak saling bertukar kabar, tapi aku tetap berharap kamu baik-baik saja di sana, dan semua hal yang sedang kamu perjuangkan bisa berjalan sesuai dengan apa yang kamu harapkan.

tidak terasa, sudah lebih dari dua tahun sejak <strong>7 Januari 2024.</strong> Waktu berjalan cepat, membawa banyak cerita baru untuk masing-masing dari kita.

<em>Semoga tahun ini membawa banyak kesempatan baru, cerita baru, dan hal-hal baik yang pantas kamu dapatkan. Jaga diri baik-baik ya.</em>
    </div>
    <div class="letter-sign">— Wisnu aji nugroho</div>
  `;

  // ── KADO 2 — TWIBON BIRTHDAY ────────────────────────────
  if (n === 2) return `
    <div class="twibon-header">
      <div class="twibon-badge-label">Birthday Twibon</div>
      <div class="twibon-title">Selebrasikan Ultahmu!</div>
      <div class="twibon-sub">Upload foto, sesuaikan, lalu download!</div>
    </div>

    <div class="twibon-canvas-wrap">
      <canvas id="twibonCanvas" width="500" height="500"></canvas>
      <div class="twibon-placeholder" id="twibonPlaceholder">
        <span>🖼️</span>
        <p>Foto kamu muncul di sini</p>
      </div>
    </div>

    <div class="twibon-zoom-wrap" id="twibonZoomWrap">
      <button class="btn-zoom" id="zoomOut">−</button>
      <span class="zoom-label" id="zoomLabel">100%</span>
      <button class="btn-zoom" id="zoomIn">+</button>
    </div>

    <div class="twibon-controls">
      <label class="btn-twibon-upload" for="twibonInput">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        Upload Foto
      </label>
      <input type="file" id="twibonInput" accept="image/*" style="display:none">
      <button class="btn-twibon-download" id="twibonDownload" disabled>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Download
      </button>
    </div>

    <div class="twibon-hint">Drag geser · Slider zoom · Download 🎉</div>
  `;

  // ── KADO 3 — DOA SNBP ───────────────────────────────────
  if (n === 3) return `
    <div class="snbp-stars" id="snbpStars"></div>
    <div class="card-3-bg"></div>
    <div class="snbp-badge">&#x2B50; Doa &amp; Harapan</div>
    <img class="snbp-logo" src="../assets/img/UpnVeteranYogyakarta.png" alt="UPN Veteran Yogyakarta">
    <div class="snbp-univ">Universitas Pembangunan Nasional<br>"Veteran" Yogyakarta</div>
    <div class="snbp-main">Semoga<br>Lolos SNBP / SNBT<br>2026</div>
    <div class="snbp-name">Nabila Aulia Rahma</div>
    <div class="snbp-divider"></div>
    <div class="snbp-msg">
Akhir-akhir ini mungkin ada satu kabar yang sedang kamu tunggu dengan penuh harap.
Tentang langkah yang akan membawa kamu menuju masa depan yang sedang kamu impikan

SNBP adalah hasil dari semua usaha yang sudah kamu lakukan selama ini.
Dan jika hasilnya belum seperti yang diharapkan, bukan berarti jalanmu berhenti di sana.

Masih ada kesempatan lain yang bisa kamu tempuh melalui SNBT.
Mungkin jalannya akan terasa lebih panjang, tapi setiap usaha yang kamu lakukan pasti memiliki arti.

Aku hanya ingin mendoakan yang terbaik untukmu.
Semoga setiap langkahmu dimudahkan,
semoga setiap proses yang kamu jalani diberi kekuatan dan ketenangan serta kelancaran.

<strong>Aku yakin semua yang sudah kamu perjuangkan untuk saat ini tidak akan sia-sia.</strong>

Semoga apa yang sedang kamu perjuangkan saat ini benar-benar akan menemukan jalannya.
Dan semoga, di antara banyak kemungkinan yang ada,
salah satunya membawamu menuju
<em>UNIVERSITAS PEMBANGUNAN NASIONAL
"VETERAN" YOGYAKARTA</em>
    </div>
<br><br>
    <div class="btn-moon-wrap">
      <div class="moon-sparkle" style="animation-duration:2.1s;animation-delay:0s;">✦</div>
      <div class="moon-sparkle" style="animation-duration:1.7s;animation-delay:0.6s;">✦</div>
      <div class="moon-sparkle" style="animation-duration:2.3s;animation-delay:1.2s;">⋆</div>
      <div class="moon-sparkle" style="animation-duration:1.9s;animation-delay:0.3s;">✦</div>
      <div class="moon-sparkle" style="animation-duration:2.6s;animation-delay:0.9s;">⋆</div>
      <button class="btn-moon" id="btnMoon" onclick="triggerMoonSpin()">🌙</button>
      <div class="btn-moon-label">Tap the moon</div>
      <div class="btn-moon-sub">✦ Let the moon guide you ✦</div>
    </div>
  `;
}

// ============================================================
// MOON SPIN
// ============================================================
function triggerMoonSpin() {
  const btn = document.getElementById('btnMoon');
  if (!btn) return;
  btn.classList.add('spinning');
  spawnConfetti(30);
  setTimeout(() => {
    window.location.href = '../fourthpage/index.html';
  }, 700);
}

// ============================================================
// TWIBON EFFECTS — bintang berkedip + partikel berputar
// ============================================================
function initTwibonEffects() {
  const wrap = document.querySelector('.twibon-canvas-wrap');
  if (!wrap || wrap.dataset.effectsInit) return;
  wrap.dataset.effectsInit = 'true';

  const H = wrap.offsetHeight || 320;

  // ── Bintang ✦ berkedip di sekeliling frame ──
  const starPos = [
    [-8,  10, 12, '0s',   '2.1s', '#ffe066'],
    [-8,  45, 9,  '0.8s', '1.8s', '#ff6eb4'],
    [-8,  80, 11, '1.5s', '2.4s', '#c77dff'],
    [103, 15, 10, '0.4s', '1.9s', '#72efdd'],
    [103, 55, 13, '1.1s', '2.2s', '#ffe066'],
    [103, 85, 9,  '1.8s', '1.7s', '#ff6eb4'],
    [15,  -8, 11, '0.6s', '2.0s', '#4a9eff'],
    [50,  -8, 9,  '1.3s', '1.8s', '#c77dff'],
    [85,  -8, 12, '0.2s', '2.3s', '#ffe066'],
    [15,  105,10, '0.9s', '2.1s', '#72efdd'],
    [50,  105,13, '1.6s', '1.9s', '#ff6eb4'],
    [85,  105, 9, '0.5s', '2.0s', '#4a9eff'],
  ];

  starPos.forEach(([x, y, size, delay, dur, color]) => {
    const star = document.createElement('div');
    star.style.cssText = `
      position:absolute; pointer-events:none; z-index:10;
      left:${x}%; top:${y}%;
      font-size:${size}px; color:${color};
      text-shadow:0 0 6px ${color},0 0 14px ${color}80;
      opacity:0;
      animation:twibonStarBlink ${dur} ease-in-out ${delay} infinite;
    `;
    star.textContent = '✦';
    wrap.appendChild(star);
  });

  // ── Ring partikel berputar searah ──
  const ring1 = document.createElement('div');
  ring1.style.cssText = `
    position:absolute; inset:-18px; border-radius:22px;
    pointer-events:none; z-index:9;
    animation:twibonRingSpin 8s linear infinite;
  `;
  wrap.appendChild(ring1);

  const dotColors = ['#ff6eb4','#ffe066','#c77dff','#72efdd','#4a9eff','#ffffff'];
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * 360;
    const color = dotColors[i % dotColors.length];
    const size  = 3 + (i % 3);
    const dot   = document.createElement('div');
    dot.style.cssText = `
      position:absolute; border-radius:50%;
      width:${size}px; height:${size}px;
      background:${color};
      box-shadow:0 0 6px ${color},0 0 10px ${color}80;
      top:50%; left:50%;
      transform:rotate(${angle}deg) translateY(-${(H/2)+18}px) translateX(-${size/2}px);
      transform-origin:0 0;
      animation:twibonDotPulse ${1.2+(i%4)*0.3}s ease-in-out ${(i*0.12).toFixed(2)}s infinite alternate;
    `;
    ring1.appendChild(dot);
  }

  // ── Ring partikel berputar berlawanan ──
  const ring2 = document.createElement('div');
  ring2.style.cssText = `
    position:absolute; inset:-28px; border-radius:26px;
    pointer-events:none; z-index:8;
    animation:twibonRingSpin 12s linear infinite reverse;
  `;
  wrap.appendChild(ring2);

  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * 360 + 22.5;
    const color = dotColors[(i+2) % dotColors.length];
    const size  = 2 + (i % 2);
    const dot   = document.createElement('div');
    dot.style.cssText = `
      position:absolute; border-radius:50%;
      width:${size}px; height:${size}px;
      background:${color};
      box-shadow:0 0 5px ${color};
      top:50%; left:50%;
      transform:rotate(${angle}deg) translateY(-${(H/2)+28}px) translateX(-${size/2}px);
      transform-origin:0 0;
      animation:twibonDotPulse ${1.4+(i%3)*0.25}s ease-in-out ${(i*0.18).toFixed(2)}s infinite alternate;
    `;
    ring2.appendChild(dot);
  }

  // ── Inject keyframes kalau belum ada ──
  if (!document.getElementById('twibonEffectKF')) {
    const kf = document.createElement('style');
    kf.id = 'twibonEffectKF';
    kf.textContent = `
      @keyframes twibonStarBlink {
        0%,100% { opacity:0; transform:scale(0.5); }
        50%     { opacity:1; transform:scale(1.3); }
      }
      @keyframes twibonRingSpin {
        from { transform:rotate(0deg); }
        to   { transform:rotate(360deg); }
      }
      @keyframes twibonDotPulse {
        from { opacity:0.3; transform-origin:0 0; filter:brightness(0.8); }
        to   { opacity:1;   transform-origin:0 0; filter:brightness(1.5); }
      }
    `;
    document.head.appendChild(kf);
  }
}

// ============================================================
// TWIBON — logic canvas
// ============================================================
function initTwibon() {
  const canvas      = document.getElementById('twibonCanvas');
  if (!canvas) return;
  const ctx         = canvas.getContext('2d');
  const input       = document.getElementById('twibonInput');
  const downloadBtn = document.getElementById('twibonDownload');
  const placeholder = document.getElementById('twibonPlaceholder');
  const zoomSlider  = null; // tidak dipakai
  const zoomInBtn   = document.getElementById('zoomIn');
  const zoomOutBtn  = document.getElementById('zoomOut');
  const zoomLabel   = document.getElementById('zoomLabel');
  const ZOOM_STEP   = 0.1;
  const ZOOM_MIN    = 0.5;
  const ZOOM_MAX    = 3.0;

  const W = 500, H = 500;

  let userImage  = null;
  let frameImage = null;
  let zoomLevel  = 1;
  let imgOffsetX = 0, imgOffsetY = 0;
  let isDragging = false;
  let dragStartX = 0, dragStartY = 0;

  // ── Load frame PNG twibon ──
  const frameImg = new Image();
  frameImg.onload = () => { frameImage = frameImg; drawFrame(); };
  frameImg.onerror = () => {
    console.warn('Frame twibon gagal load, cek path: ../assets/img/twibon-frame.png');
    drawFrame(); // tetap render background
  };
  frameImg.src = '../assets/img/twibon-frame.png';

  // Render background dulu sambil nunggu frame load
  drawFrame();

  // ── Draw canvas ──
  function drawFrame() {
    ctx.clearRect(0, 0, W, H);

    // Background gelap
    const bg = ctx.createRadialGradient(W*0.4, H*0.35, 0, W*0.5, H*0.5, W*0.85);
    bg.addColorStop(0,   '#2a0845');
    bg.addColorStop(0.5, '#130328');
    bg.addColorStop(1,   '#070010');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Foto user di belakang frame
    if (userImage) {
      const img      = userImage;
      const baseScale = Math.max(W / img.width, H / img.height);
      const scale    = baseScale * zoomLevel;
      const dw       = img.width  * scale;
      const dh       = img.height * scale;

      // Clamp offset biar foto ga keluar area lingkaran
      const minX = W - dw, maxX = 0;
      const minY = H - dh, maxY = 0;
      const dx   = Math.min(maxX, Math.max(minX, imgOffsetX));
      const dy   = Math.min(maxY, Math.max(minY, imgOffsetY));

      ctx.save();
      ctx.beginPath();
      ctx.arc(251, 276, 190, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();
    }

    // Frame PNG di atas foto
    if (frameImage) {
      ctx.drawImage(frameImage, 0, 0, W, H);
    }
  }

  // ── Tombol zoom + - ──
  function applyZoom(newZoom) {
    if (!userImage) return;
    const prev    = zoomLevel;
    zoomLevel     = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, newZoom));

    // Pertahankan titik tengah saat zoom berubah
    const baseScale = Math.max(W / userImage.width, H / userImage.height);
    const oldDw = userImage.width  * baseScale * prev;
    const oldDh = userImage.height * baseScale * prev;
    const newDw = userImage.width  * baseScale * zoomLevel;
    const newDh = userImage.height * baseScale * zoomLevel;

    imgOffsetX += (oldDw - newDw) / 2;
    imgOffsetY += (oldDh - newDh) / 2;

    // Clamp
    imgOffsetX = Math.min(0, Math.max(W - newDw, imgOffsetX));
    imgOffsetY = Math.min(0, Math.max(H - newDh, imgOffsetY));

    if (zoomLabel) zoomLabel.textContent = Math.round(zoomLevel * 100) + '%';
    drawFrame();
  }

  if (zoomInBtn)  zoomInBtn.addEventListener('click',  () => applyZoom(zoomLevel + ZOOM_STEP));
  if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => applyZoom(zoomLevel - ZOOM_STEP));

  // ── Upload foto ──
  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        userImage  = img;
        zoomLevel  = 1;
        if (zoomLabel) zoomLabel.textContent = '100%';
        const scale = Math.max(W / img.width, H / img.height);
        imgOffsetX  = (W - img.width  * scale) / 2;
        imgOffsetY  = (H - img.height * scale) / 2;
        placeholder.style.display = 'none';
        canvas.style.cursor       = 'grab';
        const zw = document.getElementById('twibonZoomWrap');
        if (zw) zw.style.opacity = '1';
        drawFrame();
        downloadBtn.disabled = false;
        downloadBtn.classList.add('ready');
        spawnConfetti(40);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });

  // ── Drag mouse ──
  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    return { x:(e.clientX-rect.left)*(W/rect.width), y:(e.clientY-rect.top)*(H/rect.height) };
  }
  function getTouchPos(e) {
    const rect = canvas.getBoundingClientRect();
    const t    = e.touches[0];
    return { x:(t.clientX-rect.left)*(W/rect.width), y:(t.clientY-rect.top)*(H/rect.height) };
  }

  canvas.addEventListener('mousedown', (e) => {
    if (!userImage) return;
    isDragging = true;
    const p = getPos(e);
    dragStartX = p.x - imgOffsetX;
    dragStartY = p.y - imgOffsetY;
    canvas.style.cursor = 'grabbing';
  });
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const p    = getPos(e);
    const scale = Math.max(W / userImage.width, H / userImage.height) * zoomLevel;
    const dw   = userImage.width  * scale;
    const dh   = userImage.height * scale;
    imgOffsetX = Math.min(0, Math.max(W - dw, p.x - dragStartX));
    imgOffsetY = Math.min(0, Math.max(H - dh, p.y - dragStartY));
    drawFrame();
  });
  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    canvas.style.cursor = 'grab';
  });

  canvas.addEventListener('touchstart', (e) => {
    if (!userImage) return;
    e.preventDefault();
    isDragging = true;
    const p = getTouchPos(e);
    dragStartX = p.x - imgOffsetX;
    dragStartY = p.y - imgOffsetY;
  }, { passive: false });
  canvas.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const p    = getTouchPos(e);
    const scale = Math.max(W / userImage.width, H / userImage.height) * zoomLevel;
    const dw   = userImage.width  * scale;
    const dh   = userImage.height * scale;
    imgOffsetX = Math.min(0, Math.max(W - dw, p.x - dragStartX));
    imgOffsetY = Math.min(0, Math.max(H - dh, p.y - dragStartY));
    drawFrame();
  }, { passive: false });
  canvas.addEventListener('touchend', () => { isDragging = false; });

  // ── Download ──
  downloadBtn.addEventListener('click', () => {
    drawFrame();
    const link    = document.createElement('a');
    link.download = 'twibon-nabila18th-nieboz.png';
    link.href     = canvas.toDataURL('image/png');
    link.click();
  });
}