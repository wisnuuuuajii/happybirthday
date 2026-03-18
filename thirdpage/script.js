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
// STARS
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
      loadingSub.textContent = 'SELAMAT!';
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
  'Kado ke-2 udah terbuka! Lanjut yaa',
  'Tinggal satu lagi! Yang terakhir ini mungkin spesial',
  'Semua kado udah terbuka! Congrats!'
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
      <div class="twibon-sub">Upload foto, lalu download hasilnya!</div>
    </div>

    <div class="twibon-canvas-wrap">
      <canvas id="twibonCanvas" width="500" height="500"></canvas>
      <div class="twibon-placeholder" id="twibonPlaceholder">
        <span>🖼️</span>
        <p>Foto kamu muncul di sini</p>
      </div>
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

    <div class="twibon-hint">Foto akan otomatis msuk ke frame birthday</div>
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

Masih ada keswmpatan lain yang bisa kamu tempuh melalui SNBT.
Mungkin jalannya akan terasa lebih panjang, tapi setiap usaha yang kamu lakukan pasti memiliki arti.

Aku hanya ingin mendoakan yang terbaik untukmu.
Semoga setiap langkahmu dimudahkan,
semoga setiap proses yang kamu jalani diberi kekuatan dan ketenangan

<strong>Aku yakin semua yang kamu perjuangkan saat ini tidak akan sia-sia.</strong>

Semoga apa yang sedang kamu perjuangkan saat ini benar-benar menemukan jalannya.
Dan semoga, di antara banyak kemungkinan yang ada,
salah satunya membawamu menuju
<em>UNIVERSITAS PEMBANGUNAN NASIONAL
"VETERAN" YOGYAKARTA</em>
    </div>
<br><br>
    <div class="btn-letter-wrap">
      <button class="btn-letter" onclick="window.location.href='../fourthpage/index.html'">
        <div class="env-sparkle" style="top:-8px;left:18px;animation-duration:2.1s;animation-delay:0s;">✦</div>
        <div class="env-sparkle" style="top:-4px;right:22px;animation-duration:1.7s;animation-delay:0.5s;">✦</div>
        <div class="env-sparkle" style="bottom:8px;left:10px;animation-duration:2.4s;animation-delay:0.9s;">✦</div>
        <div class="env-sparkle" style="bottom:4px;right:12px;animation-duration:1.9s;animation-delay:1.3s;">✦</div>
        <div class="env-flap"></div>
        <div class="env-seal">〰️</div>
        <div class="env-ribbon">
          <div class="ribbon-v"></div>
          <div class="ribbon-h"></div>
          <div class="ribbon-bow"></div>
          <div class="ribbon-knot"></div>
        </div>
        <div class="env-body"></div>
      </button>
      <div class="btn-letter-label">One more thing, just for you..</div>
      <div class="btn-letter-sub">✦ halaman terakhir ✦</div>
    </div>
  `;
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
  const W = 500, H = 500;

  let userImage = null;

  // ── Gambar frame di atas foto ──
  function drawFrame() {
    ctx.clearRect(0, 0, W, H);

    // 1. Background / foto user
    if (userImage) {
      const img  = userImage;
      const side = Math.min(img.width, img.height);
      const sx   = (img.width  - side) / 2;
      const sy   = (img.height - side) / 2;
      ctx.drawImage(img, sx, sy, side, side, 0, 0, W, H);
    } else {
      // background gelap gradient dgn sedikit noise
      const bg = ctx.createRadialGradient(W*0.4, H*0.35, 0, W*0.5, H*0.5, W*0.85);
      bg.addColorStop(0,   '#2a0845');
      bg.addColorStop(0.5, '#130328');
      bg.addColorStop(1,   '#070010');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // titik cahaya ungu di tengah atas
      const glow = ctx.createRadialGradient(W/2, 60, 0, W/2, 60, 200);
      glow.addColorStop(0,   'rgba(199,125,255,0.22)');
      glow.addColorStop(1,   'rgba(199,125,255,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      // titik cahaya pink bawah
      const glow2 = ctx.createRadialGradient(W/2, H-60, 0, W/2, H-60, 200);
      glow2.addColorStop(0,  'rgba(255,110,180,0.18)');
      glow2.addColorStop(1,  'rgba(255,110,180,0)');
      ctx.fillStyle = glow2;
      ctx.fillRect(0, 0, W, H);
    }

    // 2. Overlay gradient atas & bawah biar teks terbaca
    const overlayTop = ctx.createLinearGradient(0, 0, 0, H * 0.38);
    overlayTop.addColorStop(0, 'rgba(8,2,20,0.78)');
    overlayTop.addColorStop(1, 'rgba(8,2,20,0)');
    ctx.fillStyle = overlayTop;
    ctx.fillRect(0, 0, W, H);

    const overlayBot = ctx.createLinearGradient(0, H * 0.62, 0, H);
    overlayBot.addColorStop(0, 'rgba(8,2,20,0)');
    overlayBot.addColorStop(1, 'rgba(8,2,20,0.88)');
    ctx.fillStyle = overlayBot;
    ctx.fillRect(0, 0, W, H);

    // 3. Pita horizontal atas
    drawRibbon(ctx, W, H);

    // 4. Border luar — double line
    ctx.save();
    ctx.strokeStyle = 'rgba(255,110,180,0.6)';
    ctx.lineWidth   = 5;
    ctx.shadowColor = '#ff6eb4';
    ctx.shadowBlur  = 20;
    roundRect(ctx, 10, 10, W - 20, H - 20, 16);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = 'rgba(255,224,102,0.28)';
    ctx.lineWidth   = 1.2;
    ctx.shadowBlur  = 0;
    roundRect(ctx, 20, 20, W - 40, H - 40, 10);
    ctx.stroke();
    ctx.restore();

    // 5. Sudut dekorasi fancy
    drawCorner(ctx, 20, 20,  1,  1);
    drawCorner(ctx, W-20, 20, -1,  1);
    drawCorner(ctx, 20, H-20,  1, -1);
    drawCorner(ctx, W-20, H-20,-1, -1);

    // 5b. Balon sudut kiri & kanan atas
    drawBalloons(ctx, W, H);

    // 6. Bintang + sparkle
    drawStars(ctx, W, H);
    drawSparkles(ctx, W, H);

    // 7. Teks atas — "✦ Happy 18th Birthday ✦"
    ctx.save();
    ctx.textAlign    = 'center';
    ctx.font         = '700 19px "Nunito", sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillStyle    = '#ffe066';
    ctx.shadowColor  = 'rgba(255,200,50,0.9)';
    ctx.shadowBlur   = 18;
    ctx.fillText('✦  Happy 18th Birthday  ✦', W / 2, 48);
    ctx.restore();

    // 8. Badge "18" lingkaran di tengah atas (hanya jika belum ada foto)
    if (!userImage) {
      drawBadge18(ctx, W / 2, 130);
    }

    // 9. Teks nama — dengan gradient fill
    ctx.save();
    const nameGrad = ctx.createLinearGradient(W*0.2, 0, W*0.8, 0);
    nameGrad.addColorStop(0,   '#e6e6e6');
    nameGrad.addColorStop(0.5, '#ffcce8');
    nameGrad.addColorStop(1,   '#c77dff');
    ctx.textAlign   = 'center';
    ctx.font        = '700 30px "Fredoka One", cursive';
    ctx.fillStyle   = nameGrad;
    ctx.shadowColor = 'rgba(255,110,180,0.9)';
    ctx.shadowBlur  = 22;
    ctx.fillText('Nabila Aulia Rahma', W / 2, H - 56);
    ctx.restore();

    // 10. Teks tahun
    ctx.save();
    ctx.textAlign   = 'center';
    ctx.font        = '800 15px "Nunito", sans-serif';
    ctx.fillStyle   = 'rgba(255,110,180,0.85)';
    ctx.shadowColor = 'rgba(255,110,180,0.5)';
    ctx.shadowBlur  = 10;
    ctx.fillText('🎂  MMXXVI  🎂', W / 2, H - 26);
    ctx.restore();

    // 11. Titik-titik confetti sepanjang border
    drawConfettiDots(ctx, W, H);
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function drawRibbon(ctx, W, H) {
    // Pita tipis horizontal di area nama bawah
    ctx.save();
    const rb = ctx.createLinearGradient(0, H-80, 0, H-70);
    rb.addColorStop(0, 'rgba(255,110,180,0.18)');
    rb.addColorStop(1, 'rgba(255,110,180,0.04)');
    ctx.fillStyle = rb;
    ctx.fillRect(0, H - 80, W, 60);

    // garis tipis atas pita
    ctx.strokeStyle = 'rgba(255,110,180,0.35)';
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.moveTo(0, H - 80);
    ctx.lineTo(W, H - 80);
    ctx.stroke();
    ctx.restore();
  }

  function drawCorner(ctx, x, y, dx, dy) {
    const len = 36;
    const gap = 6;

    // Garis utama L-shape
    ctx.save();
    ctx.strokeStyle = 'rgba(255,224,102,0.85)';
    ctx.lineWidth   = 2.5;
    ctx.shadowColor = '#ffe066';
    ctx.shadowBlur  = 12;
    ctx.lineCap     = 'round';
    ctx.beginPath();
    ctx.moveTo(x + dx * len, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + dy * len);
    ctx.stroke();
    ctx.restore();

    // Titik pojok
    ctx.save();
    ctx.fillStyle   = '#ffe066';
    ctx.shadowColor = '#ffe066';
    ctx.shadowBlur  = 14;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Diamond kecil di ujung garis
    const ex = x + dx * len;
    const ey = y + dy * len;
    ctx.save();
    ctx.fillStyle   = 'rgba(255,224,102,0.6)';
    ctx.shadowColor = '#ffe066';
    ctx.shadowBlur  = 8;
    ctx.beginPath();
    ctx.arc(ex, y,   2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, ey, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawBadge18(ctx, cx, cy) {
    // Lingkaran luar glow
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, 52, 0, Math.PI * 2);
    const bg = ctx.createRadialGradient(cx, cy, 10, cx, cy, 52);
    bg.addColorStop(0,   'rgba(199,125,255,0.35)');
    bg.addColorStop(0.7, 'rgba(255,110,180,0.2)');
    bg.addColorStop(1,   'rgba(255,110,180,0.05)');
    ctx.fillStyle   = bg;
    ctx.shadowColor = '#c77dff';
    ctx.shadowBlur  = 30;
    ctx.fill();

    ctx.strokeStyle = 'rgba(199,125,255,0.6)';
    ctx.lineWidth   = 2;
    ctx.stroke();
    ctx.restore();

    // Angka 18
    ctx.save();
    ctx.textAlign   = 'center';
    ctx.textBaseline= 'middle';
    ctx.font        = '700 44px "Fredoka One", cursive';
    const numGrad   = ctx.createLinearGradient(cx-30, cy-20, cx+30, cy+20);
    numGrad.addColorStop(0, '#ffffff');
    numGrad.addColorStop(1, '#c77dff');
    ctx.fillStyle   = numGrad;
    ctx.shadowColor = 'rgba(199,125,255,0.9)';
    ctx.shadowBlur  = 20;
    ctx.fillText('18', cx, cy);
    ctx.restore();
  }

  function drawStars(ctx, W, H) {
    const stars = [
      [42, 75, 14, 0.55],  [462, 68, 10, 0.45],
      [32, 430, 10, 0.4],  [468, 448, 14, 0.5],
      [75, 240, 8,  0.35], [428, 255, 8, 0.35],
      [235, 28, 10, 0.5],  [265, 478, 10,0.45],
      [130,155, 7, 0.3],   [372, 148, 7, 0.3],
      [118,378, 7, 0.3],   [385, 385, 7, 0.3],
    ];
    stars.forEach(([px, py, sz, alpha]) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle   = '#ffe066';
      ctx.shadowColor = '#ffe066';
      ctx.shadowBlur  = sz * 1.2;
      ctx.font        = `${sz}px serif`;
      ctx.textAlign   = 'center';
      ctx.textBaseline= 'middle';
      ctx.fillText('✦', px, py);
      ctx.restore();
    });
  }

  function drawConfettiDots(ctx, W, H) {
    const dots = [
      // atas
      [60, 15, '#ff6eb4', 4],  [120, 12, '#ffe066', 3],
      [180, 15, '#c77dff', 4], [250, 10, '#72efdd', 3],
      [320, 14, '#4a9eff', 4], [390, 11, '#ff6eb4', 3],
      [450, 15, '#ffe066', 4], [490, 13, '#c77dff', 3],
      // bawah
      [50, H-14, '#72efdd', 4],  [130, H-11, '#ff6eb4', 3],
      [210, H-14, '#ffe066', 4], [290, H-11, '#c77dff', 3],
      [370, H-14, '#4a9eff', 4], [450, H-11, '#ff6eb4', 3],
      // kiri
      [12, 100, '#ffe066', 3],  [15, 200, '#c77dff', 4],
      [11, 310, '#ff6eb4', 3],  [14, 410, '#72efdd', 4],
      // kanan
      [W-12, 110, '#4a9eff', 3], [W-14, 220, '#ff6eb4', 4],
      [W-11, 330, '#ffe066', 3], [W-14, 420, '#c77dff', 4],
    ];
    dots.forEach(([x, y, color, r]) => {
      ctx.save();
      ctx.fillStyle   = color;
      ctx.shadowColor = color;
      ctx.shadowBlur  = r * 2.5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  // ── Balon di sudut kiri & kanan atas ──
  function drawBalloons(ctx, W, H) {
    const balloons = [
      // [cx, cy, rx, ry, color, stringEndX, stringEndY]
      { cx: 62,   cy: 105, rx: 30, ry: 36, color: '#ff6eb4', shine: 'rgba(255,255,255,0.45)', sx: 62,   sy: 185 },
      { cx: 108,  cy: 75,  rx: 26, ry: 32, color: '#c77dff', shine: 'rgba(255,255,255,0.4)',  sx: 108,  sy: 145 },
      { cx: 148,  cy: 100, rx: 22, ry: 27, color: '#ffe066', shine: 'rgba(255,255,255,0.45)', sx: 148,  sy: 168 },
      // kanan
      { cx: W-62,  cy: 105, rx: 30, ry: 36, color: '#4a9eff', shine: 'rgba(255,255,255,0.45)', sx: W-62,  sy: 185 },
      { cx: W-108, cy: 75,  rx: 26, ry: 32, color: '#72efdd', shine: 'rgba(255,255,255,0.4)',  sx: W-108, sy: 145 },
      { cx: W-148, cy: 100, rx: 22, ry: 27, color: '#ff6eb4', shine: 'rgba(255,255,255,0.45)', sx: W-148, sy: 168 },
    ];

    balloons.forEach(b => {
      // Tali balon (wavy bezier)
      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.lineWidth   = 1.2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(b.cx, b.cy + b.ry);
      ctx.bezierCurveTo(
        b.cx + 8,  b.cy + b.ry + 20,
        b.cx - 8,  b.cy + b.ry + 40,
        b.sx, b.sy
      );
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Body balon — gradient radial
      ctx.save();
      const grad = ctx.createRadialGradient(
        b.cx - b.rx * 0.3, b.cy - b.ry * 0.3, b.ry * 0.08,
        b.cx, b.cy, b.ry * 1.1
      );
      grad.addColorStop(0,   lightenColor(b.color, 0.5));
      grad.addColorStop(0.5, b.color);
      grad.addColorStop(1,   darkenColor(b.color, 0.35));
      ctx.fillStyle   = grad;
      ctx.shadowColor = b.color;
      ctx.shadowBlur  = 14;
      ctx.beginPath();
      ctx.ellipse(b.cx, b.cy, b.rx, b.ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Highlight balon
      ctx.save();
      ctx.globalAlpha = 0.55;
      ctx.fillStyle   = b.shine;
      ctx.beginPath();
      ctx.ellipse(b.cx - b.rx * 0.28, b.cy - b.ry * 0.28, b.rx * 0.28, b.ry * 0.2, -0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Simpul bawah balon
      ctx.save();
      ctx.fillStyle = darkenColor(b.color, 0.3);
      ctx.beginPath();
      ctx.ellipse(b.cx, b.cy + b.ry, 4, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  function lightenColor(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.min(255, (n >> 16) + Math.round(amt * 255));
    const g = Math.min(255, ((n >> 8) & 0xff) + Math.round(amt * 180));
    const b = Math.min(255, (n & 0xff) + Math.round(amt * 180));
    return `rgb(${r},${g},${b})`;
  }
  function darkenColor(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.max(0, (n >> 16) - Math.round(amt * 255));
    const g = Math.max(0, ((n >> 8) & 0xff) - Math.round(amt * 255));
    const b = Math.max(0, (n & 0xff) - Math.round(amt * 255));
    return `rgb(${r},${g},${b})`;
  }

  // ── Sparkle / bintang tembak di sekitar frame ──
  function drawSparkles(ctx, W, H) {
    const sparkles = [
      // [x, y, size, color]
      [38,  210, 10, '#ffe066'],
      [W-38, 180, 8,  '#ff6eb4'],
      [60,  310, 7,  '#c77dff'],
      [W-55, 320, 9,  '#72efdd'],
      [200, 35,  8,  '#ff6eb4'],
      [310, 38,  7,  '#4a9eff'],
      [180, H-35, 8, '#ffe066'],
      [330, H-32, 7, '#c77dff'],
      [W-40, 400, 8, '#ffe066'],
      [42,  400, 7,  '#4a9eff'],
    ];

    sparkles.forEach(([x, y, size, color]) => {
      ctx.save();
      ctx.fillStyle   = color;
      ctx.shadowColor = color;
      ctx.shadowBlur  = size * 2;

      // Bintang 4 titik (cross)
      const s = size;
      ctx.beginPath();
      // horizontal
      ctx.moveTo(x - s, y);
      ctx.quadraticCurveTo(x - s*0.18, y - s*0.18, x, y - s);
      ctx.quadraticCurveTo(x + s*0.18, y - s*0.18, x + s, y);
      ctx.quadraticCurveTo(x + s*0.18, y + s*0.18, x, y + s);
      ctx.quadraticCurveTo(x - s*0.18, y + s*0.18, x - s, y);
      ctx.closePath();
      ctx.fill();

      // titik tengah putih
      ctx.fillStyle   = 'rgba(255,255,255,0.7)';
      ctx.shadowBlur  = 4;
      ctx.beginPath();
      ctx.arc(x, y, s * 0.18, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Mini dots acak
    const miniDots = [
      [95, 42, '#ffe066'], [405, 40, '#c77dff'],
      [32, 155, '#ff6eb4'], [W-32, 260, '#72efdd'],
      [75, 460, '#4a9eff'], [W-70, 455, '#ff6eb4'],
    ];
    miniDots.forEach(([x, y, color]) => {
      ctx.save();
      ctx.fillStyle   = color;
      ctx.shadowColor = color;
      ctx.shadowBlur  = 6;
      ctx.globalAlpha = 0.65;
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  // ── State drag ──
  let imgOffsetX = 0, imgOffsetY = 0;
  let isDragging = false;
  let dragStartX = 0, dragStartY = 0;
  let imgDrawX = 0, imgDrawY = 0;

  // Override drawFrame biar pakai offset drag
  function drawFrameWithOffset() {
    ctx.clearRect(0, 0, W, H);

    if (userImage) {
      // Hitung scale biar foto cover penuh canvas
      const img    = userImage;
      const scale  = Math.max(W / img.width, H / img.height);
      const dw     = img.width  * scale;
      const dh     = img.height * scale;
      // Clamp offset biar foto ga keluar batas
      const minX   = W - dw, maxX = 0;
      const minY   = H - dh, maxY = 0;
      imgDrawX = Math.min(maxX, Math.max(minX, imgOffsetX));
      imgDrawY = Math.min(maxY, Math.max(minY, imgOffsetY));
      ctx.drawImage(img, imgDrawX, imgDrawY, dw, dh);
    } else {
      const bg = ctx.createRadialGradient(W*0.4, H*0.35, 0, W*0.5, H*0.5, W*0.85);
      bg.addColorStop(0,   '#2a0845');
      bg.addColorStop(0.5, '#130328');
      bg.addColorStop(1,   '#070010');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
      const glow = ctx.createRadialGradient(W/2, 60, 0, W/2, 60, 200);
      glow.addColorStop(0, 'rgba(199,125,255,0.22)');
      glow.addColorStop(1, 'rgba(199,125,255,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);
      const glow2 = ctx.createRadialGradient(W/2, H-60, 0, W/2, H-60, 200);
      glow2.addColorStop(0, 'rgba(255,110,180,0.18)');
      glow2.addColorStop(1, 'rgba(255,110,180,0)');
      ctx.fillStyle = glow2;
      ctx.fillRect(0, 0, W, H);
    }

    // Overlay + semua elemen frame (sama persis)
    const overlayTop = ctx.createLinearGradient(0, 0, 0, H * 0.38);
    overlayTop.addColorStop(0, 'rgba(8,2,20,0.78)');
    overlayTop.addColorStop(1, 'rgba(8,2,20,0)');
    ctx.fillStyle = overlayTop;
    ctx.fillRect(0, 0, W, H);
    const overlayBot = ctx.createLinearGradient(0, H * 0.62, 0, H);
    overlayBot.addColorStop(0, 'rgba(8,2,20,0)');
    overlayBot.addColorStop(1, 'rgba(8,2,20,0.88)');
    ctx.fillStyle = overlayBot;
    ctx.fillRect(0, 0, W, H);
    drawRibbon(ctx, W, H);
    ctx.save();
    ctx.strokeStyle = 'rgba(255,110,180,0.6)';
    ctx.lineWidth   = 5;
    ctx.shadowColor = '#ff6eb4';
    ctx.shadowBlur  = 20;
    roundRect(ctx, 10, 10, W - 20, H - 20, 16);
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.strokeStyle = 'rgba(255,224,102,0.28)';
    ctx.lineWidth   = 1.2;
    ctx.shadowBlur  = 0;
    roundRect(ctx, 20, 20, W - 40, H - 40, 10);
    ctx.stroke();
    ctx.restore();
    drawCorner(ctx, 20, 20,  1,  1);
    drawCorner(ctx, W-20, 20, -1,  1);
    drawCorner(ctx, 20, H-20,  1, -1);
    drawCorner(ctx, W-20, H-20,-1, -1);
    drawBalloons(ctx, W, H);
    drawStars(ctx, W, H);
    drawSparkles(ctx, W, H);
    ctx.save();
    ctx.textAlign    = 'center';
    ctx.font         = '700 19px "Nunito", sans-serif';
    ctx.fillStyle    = '#ffe066';
    ctx.shadowColor  = 'rgba(255,200,50,0.9)';
    ctx.shadowBlur   = 18;
    ctx.fillText('✦  Happy 18th Birthday  ✦', W / 2, 48);
    ctx.restore();
    if (!userImage) drawBadge18(ctx, W / 2, 130);
    ctx.save();
    const nameGrad = ctx.createLinearGradient(W*0.2, 0, W*0.8, 0);
    nameGrad.addColorStop(0,   '#ffffff');
    nameGrad.addColorStop(0.5, '#ffcce8');
    nameGrad.addColorStop(1,   '#c77dff');
    ctx.textAlign   = 'center';
    ctx.font        = '700 30px "Fredoka One", cursive';
    ctx.fillStyle   = nameGrad;
    ctx.shadowColor = 'rgba(255,110,180,0.9)';
    ctx.shadowBlur  = 22;
    ctx.fillText('Nabila Aulia Rahma', W / 2, H - 56);
    ctx.restore();
    ctx.save();
    ctx.textAlign   = 'center';
    ctx.font        = '800 15px "Nunito", sans-serif';
    ctx.fillStyle   = 'rgba(255,110,180,0.85)';
    ctx.shadowColor = 'rgba(255,110,180,0.5)';
    ctx.shadowBlur  = 10;
    ctx.fillText('🎂  2 0 2 6  🎂', W / 2, H - 26);
    ctx.restore();
    drawConfettiDots(ctx, W, H);

    // Hint drag (hanya saat foto aktif)
    if (userImage) {
      ctx.save();
      ctx.textAlign   = 'center';
      ctx.font        = '600 11px "Nunito", sans-serif';
      ctx.fillStyle   = 'rgba(255,255,255,0.30)';
      ctx.fillText('✥ drag untuk geser foto', W / 2, H - 8);
      ctx.restore();
    }
  }

  // ── Render awal ──
  drawFrame();

  // ── Upload foto ──
  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img  = new Image();
      img.onload = () => {
        userImage  = img;
        // Reset offset ke tengah
        const scale = Math.max(W / img.width, H / img.height);
        imgOffsetX  = (W - img.width  * scale) / 2;
        imgOffsetY  = (H - img.height * scale) / 2;
        placeholder.style.display = 'none';
        canvas.style.cursor       = 'grab';
        drawFrameWithOffset();
        downloadBtn.disabled = false;
        downloadBtn.classList.add('ready');
        spawnConfetti(40);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });

  // ── Drag — Mouse ──
  function getCanvasPos(e) {
    const rect  = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top)  * scaleY,
    };
  }
  function getTouchPos(e) {
    const rect  = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    const t = e.touches[0];
    return {
      x: (t.clientX - rect.left) * scaleX,
      y: (t.clientY - rect.top)  * scaleY,
    };
  }

  canvas.addEventListener('mousedown', (e) => {
    if (!userImage) return;
    isDragging = true;
    const pos  = getCanvasPos(e);
    dragStartX = pos.x - imgOffsetX;
    dragStartY = pos.y - imgOffsetY;
    canvas.style.cursor = 'grabbing';
  });
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const pos  = getCanvasPos(e);
    imgOffsetX = pos.x - dragStartX;
    imgOffsetY = pos.y - dragStartY;
    drawFrameWithOffset();
  });
  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    canvas.style.cursor = 'grab';
  });

  // ── Drag — Touch (mobile) ──
  canvas.addEventListener('touchstart', (e) => {
    if (!userImage) return;
    e.preventDefault();
    isDragging = true;
    const pos  = getTouchPos(e);
    dragStartX = pos.x - imgOffsetX;
    dragStartY = pos.y - imgOffsetY;
  }, { passive: false });
  canvas.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const pos  = getTouchPos(e);
    imgOffsetX = pos.x - dragStartX;
    imgOffsetY = pos.y - dragStartY;
    drawFrameWithOffset();
  }, { passive: false });
  canvas.addEventListener('touchend', () => { isDragging = false; });

  // ── Download (pakai drawFrameWithOffset biar posisi drag tersimpan) ──
  downloadBtn.addEventListener('click', () => {
    // Render sekali lagi tanpa hint teks "drag untuk geser"
    drawFrameWithOffset();
    // Hapus hint sebelum download
    ctx.clearRect(0, W - 14, W, 14);
    drawFrameWithOffset();
    const link    = document.createElement('a');
    link.download = 'twibon-nabila-18th.png';
    link.href     = canvas.toDataURL('image/png');
    link.click();
  });
}