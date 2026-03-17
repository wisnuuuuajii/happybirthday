// ============================================================
// MUSIC
// ============================================================
const bgMusic  = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
bgMusic.volume = 0.3;
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
// STAR CANVAS
// ============================================================
const canvas = document.getElementById('starCanvas');
const ctx    = canvas.getContext('2d');
let stars    = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function initStars() {
  stars = [];
  for (let i = 0; i < 200; i++) {
    stars.push({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      r:     Math.random() * 1.4 + 0.3,
      alpha: Math.random(),
      speed: Math.random() * 0.008 + 0.003,
      dir:   Math.random() > 0.5 ? 1 : -1
    });
  }
}
initStars();

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(s => {
    s.alpha += s.speed * s.dir;
    if (s.alpha >= 1 || s.alpha <= 0.05) s.dir *= -1;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(232,240,255,${s.alpha})`;
    ctx.fill();
  });
  requestAnimationFrame(drawStars);
}
drawStars();

// ============================================================
// INTRO TYPEWRITER
// ============================================================
const introOverlay = document.getElementById('introOverlay');
const introTextEl  = document.getElementById('introText');
const mainWrap     = document.getElementById('mainWrap');

const introMsg = 'Sebelumnya, Izinkan aku memberitahu kamu sesuatu...';

function typeWriter(el, text, speed, cb) {
  let i = 0;
  el.textContent = '';
  const iv = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(iv);
      if (cb) setTimeout(cb, 900);
    }
  }, speed);
}

setTimeout(() => {
  typeWriter(introTextEl, introMsg, 55, () => {
    introOverlay.classList.add('fade-out');
    setTimeout(() => {
      introOverlay.style.display = 'none';
      mainWrap.classList.add('visible');
      setTimeout(startPoem, 400);
    }, 800);
  });
}, 600);

// ============================================================
// POEM DATA
// ============================================================
const poemData = [
  { text: 'Untuk bayangan yang pernah menemani langkahku,',                                         type: 'bold'   },
  { text: '',                                                                                        type: 'spacer' },
  { text: 'ada hal-hal yang terasa lebih utuh saat disimpan dalam diam —',                          type: 'normal' },
  { text: 'dan malam selalu tahu bagaimana menjaganya.',                                            type: 'italic' },
  { text: '',                                                                                        type: 'spacer' },
  { text: 'Kamu bukan sekadar seseorang yang pernah singgah dalam ceritaku,',                       type: 'normal' },
  { text: 'kamu adalah bagian kecil yang membuat hari-hari sederhana terasa lebih hidup.',          type: 'normal' },
  { text: '',                                                                                        type: 'spacer' },
  { text: 'Aku tidak tahu ke mana waktu akan membawa langkah kita setelah ini,',                    type: 'normal' },
  { text: 'tapi ada satu hal yang tetap tinggal —',                                                 type: 'normal' },
  { text: '',                                                                                        type: 'spacer' },
  { text: 'beberapa perjalanan terasa lebih ringan,',                                               type: 'normal' },
  { text: 'karena pernah ada kamu di dalamnya.',                                                    type: 'normal' },
  { text: '',                                                                                        type: 'spacer' },
  { text: 'Dan di antara semua kenangan yang tersisa,',                                             type: 'normal' },
  { text: 'aku menyadari ada luka yang tak sempat kusadari saat itu, dan ada pula yang sebenarnya kutahu, namun tetap kulakukan.',                         type: 'normal' },
  { text: '',                                                                                        type: 'spacer' },
  { text: 'Untuk semua hal yang pernah membuatmu merasa tidak baik-baik saja,',                     type: 'normal' },
  { text: 'aku ingin meminta maaf dengan tulus.',                                                   type: 'bold'   },
  { text: '',                                                                                        type: 'spacer' },
  { text: 'Bukan untuk mengubah apa yang telah terjadi,',                                           type: 'italic' },
  { text: 'melainkan sebagai bentuk kejujuran yang seharusnya sudah lama kusampaikan.',             type: 'italic' },
  { text: '',                                                                                        type: 'spacer' },
  { text: 'Semoga mimpi-mimpimu selalu menemukan jalannya.',                                        type: 'normal' },
  { text: 'Semoga langit tetap ramah pada setiap langkahmu.',                                       type: 'normal' },
  { text: '',                                                                                        type: 'spacer' },
  { text: 'Dan meski kini perjalanan kita tidak lagi berjalan beriringan,',                         type: 'normal' },
  { text: '',                                                                                        type: 'spacer' },
  { text: 'aku hanya ingin menyampaikan satu hal —',                                                type: 'normal' },
  { text: 'Terima kasih karena pernah menjadi bayangan yang indah buatku.',                                type: 'bold'   },
];

// ============================================================
// RENDER POEM — smooth sequential reveal
// ============================================================
const LINE_GAP   = 820;
const SPACER_GAP = 420;
const BOLD_GAP   = 980;

function startPoem() {
  const linesEl  = document.getElementById('poemLines');
  const signEl   = document.getElementById('poemSign');
  const footerEl = document.getElementById('poemFooter');

  let cumDelay = 0;

  poemData.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = `poem-line ${item.type}`;
    if (item.type !== 'spacer') div.textContent = item.text;
    div.dataset.index = i;
    linesEl.appendChild(div);

    const thisDelay = cumDelay;
    setTimeout(() => {
      div.classList.add('visible');
      if (item.type !== 'spacer') spawnStarDust();
    }, thisDelay);

    if (item.type === 'spacer') {
      cumDelay += SPACER_GAP;
    } else if (item.type === 'bold') {
      cumDelay += BOLD_GAP;
    } else {
      cumDelay += LINE_GAP;
    }
  });

  setTimeout(() => {
    signEl.textContent = '— tuan Wisnu perkasa';
    signEl.classList.add('visible');
  }, cumDelay + 1000);

  setTimeout(() => {
    footerEl.innerHTML = `<button class="btn-end" id="btnEnd">tutup malam ini 🌙</button>`;
    footerEl.classList.add('visible');
    document.getElementById('btnEnd').addEventListener('click', () => {
      showOutro();
    });
  }, cumDelay + 2200);
}

// ============================================================
// OUTRO END SCREEN
// ============================================================
function showOutro() {
  if (!document.getElementById('outroScreen')) {
    const outro = document.createElement('div');
    outro.id = 'outroScreen';
    outro.innerHTML = `
      <div class="outro-inner">
        <div class="outro-line-1">Tidak semua langkah harus terus bersama,</div>
        <div class="outro-line-2">Tapi beberapa bayangan akan selalu tinggal di ingatan.</div>
        <div class="outro-moon">🌙</div>
        <div class="outro-sender">Untukmu, Nabila.<br>Buah Hati dari Ayah Rahman dan Bunda Indah.</div>
      </div>
    `;
    document.body.appendChild(outro);
  }

  if (!document.getElementById('outroStyle')) {
    const style = document.createElement('style');
    style.id = 'outroStyle';
    style.textContent = `
      #outroScreen {
        position: fixed;
        inset: 0;
        z-index: 9999;
        background: #06030f;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 32px;
        opacity: 0;
        animation: outroFadeIn 1.2s ease forwards;
      }
      @keyframes outroFadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      .outro-inner {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 22px;
        text-align: center;
        max-width: 480px;
      }
      .outro-line-1,
      .outro-line-2 {
        font-family: 'Lora', serif;
        font-style: italic;
        line-height: 1.85;
        opacity: 0;
      }
      .outro-line-1 {
        font-size: clamp(15px, 3.5vw, 20px);
        animation: outroTextIn 1.4s ease 0.8s forwards;
        color: rgba(200, 225, 255, 0.82);
      }
      .outro-line-2 {
        font-size: clamp(14px, 3vw, 18px);
        animation: outroTextIn 1.4s ease 2.4s forwards;
        color: rgba(160, 200, 255, 0.65);
      }
      @keyframes outroTextIn {
        from { opacity: 0; transform: translateY(10px); filter: blur(4px); }
        to   { opacity: 1; transform: translateY(0);    filter: blur(0);   }
      }
      .outro-moon {
        font-size: 32px;
        opacity: 0;
        animation: outroMoonIn 1s ease 4s forwards;
        filter: drop-shadow(0 0 14px rgba(180, 210, 255, 0.6));
      }
      @keyframes outroMoonIn {
        from { opacity: 0; transform: scale(0.5) translateY(8px); }
        to   { opacity: 1; transform: scale(1) translateY(0);     }
      }
      .outro-sender {
        font-family: 'Lora', serif;
        font-style: italic;
        font-size: clamp(12px, 2.5vw, 15px);
        color: rgba(180, 210, 255, 0.38);
        line-height: 1.9;
        opacity: 0;
        animation: outroTextIn 1.4s ease 5.2s forwards;
        border-top: 1px solid rgba(180, 210, 255, 0.10);
        padding-top: 18px;
        width: 100%;
        max-width: 340px;
      }
    `;
    document.head.appendChild(style);
  }

  mainWrap.style.transition = 'opacity 0.7s ease';
  mainWrap.style.opacity    = '0';

  setTimeout(() => {
    document.getElementById('outroScreen').style.display = 'flex';
  }, 700);
}

// ============================================================
// STAR DUST on line reveal
// ============================================================
function spawnStarDust() {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const s = document.createElement('div');
      s.className = 'sstar';
      s.style.cssText = `
        left: ${Math.random()*100}vw;
        top:  ${Math.random()*100}vh;
        animation-duration: ${Math.random()*1.5+0.8}s;
        animation-delay: ${Math.random()*0.3}s;
      `;
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 2500);
    }, i * 80);
  }
}