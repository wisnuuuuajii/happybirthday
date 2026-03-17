// ============================================================
// PHASE SWITCHER
// ============================================================
function switchPhase(fromId, toId) {
  const from = document.getElementById(fromId);
  const to   = document.getElementById(toId);

  from.classList.add('exit');
  setTimeout(() => {
    from.classList.remove('active', 'exit');
    from.style.display = 'none';
    to.style.display   = 'flex';
    to.classList.add('active', 'enter');
    setTimeout(() => to.classList.remove('enter'), 600);
  }, 300);
}

// ============================================================
// STARS
// ============================================================
for (let i = 0; i < 65; i++) {
  const s  = document.createElement('div');
  s.className = 'star';
  const sz = Math.random() * 2.4 + 0.4;
  s.style.cssText = `
    position:fixed; border-radius:50%; background:white; z-index:1; pointer-events:none;
    width:${sz}px; height:${sz}px;
    top:${Math.random()*100}%; left:${Math.random()*100}%;
    animation: twinkle ${Math.random()*3+1.5}s ease-in-out ${Math.random()*4}s infinite alternate;
  `;
  document.body.appendChild(s);
}

// twinkle keyframe
const ks = document.createElement('style');
ks.textContent = `
  @keyframes twinkle {
    from { opacity:0.07; transform:scale(0.7); }
    to   { opacity:0.6;  transform:scale(1.3); }
  }
`;
document.head.appendChild(ks);

// ============================================================
// PHASE 1 → 2
// ============================================================
document.getElementById('startBtn').addEventListener('click', () => {
  switchPhase('phaseGreet', 'phaseMission');
});

// ============================================================
// PHASE 2 → 3 (countdown)
// ============================================================
document.getElementById('goBtn').addEventListener('click', () => {
  switchPhase('phaseMission', 'phaseCountdown');
  setTimeout(startCountdown, 400);
});

// ============================================================
// COUNTDOWN
// ============================================================
const subs = [
  '',
  'Fokus ya der, jangan menyerah!',
  'Siapkan jarimu, Zezell!',
  'Good Luck!'
];
const colors = ['', '#72efdd', '#ffe066', '#ff6eb4'];
const cfColors = ['#ff4d6d','#ffbe0b','#ff6eb4','#c77dff','#72efdd','#ffe066','#fff'];

function startCountdown() {
  let n = 3;
  const numEl = document.getElementById('countNum');
  const subEl = document.getElementById('countSub');

  numEl.style.color = colors[n];
  subEl.textContent = subs[n];

  const iv = setInterval(() => {
    n--;

    if (n <= 0) {
      clearInterval(iv);

      // "GO!" state
      numEl.style.animation = 'none';
      numEl.offsetHeight;
      numEl.style.animation = 'numPop 0.35s cubic-bezier(.36,2,.6,1) both';
      numEl.textContent = 'GO!';
      numEl.style.color = '#ffe066';
      numEl.style.filter = 'drop-shadow(0 0 40px rgba(255,224,102,0.9))';
      subEl.textContent  = '🎂🎉🎈';

      spawnConfetti(90);

      // Navigate after short pause
      setTimeout(() => {
        document.body.style.transition = 'opacity 0.45s ease';
        document.body.style.opacity    = '0';
        setTimeout(() => {
          window.location.href = '../secondpage/index.html';
        }, 450);
      }, 850);

      return;
    }

    // Re-trigger pop animation
    numEl.style.animation = 'none';
    numEl.offsetHeight;
    numEl.style.animation = 'numPop 0.4s cubic-bezier(.36,2,.6,1) both';
    numEl.textContent  = n;
    numEl.style.color  = colors[n];
    subEl.textContent  = subs[n];

  }, 950);
}

// ============================================================
// CONFETTI BURST
// ============================================================
function spawnConfetti(count) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const c  = document.createElement('div');
      c.className = 'cf';
      const sz = Math.random() * 9 + 5;
      c.style.cssText = `
        left:${Math.random()*100}vw;
        width:${sz}px; height:${sz * 1.4}px;
        background:${cfColors[Math.floor(Math.random() * cfColors.length)]};
        border-radius:${Math.random() > 0.5 ? '50%' : '3px'};
        animation-duration:${Math.random() * 2 + 1.6}s;
      `;
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 3600);
    }, i * 18);
  }
}