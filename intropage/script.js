alert ('Selamat datang!');
 var lagi = true;

 while( lagi === true ) {
  var nama = prompt('Masukan Nama :');
  alert('Haloo ' + nama);

  lagi = confirm('Tulis ulang nama?');
 }
 alert('Thanks! ' + nama);

const envelope = document.getElementById('envelope');
const paper    = document.getElementById('paper');

// ===== BINTANG ACAK =====
function createStars() {
  for (let i = 0; i < 60; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const size = Math.random() * 2.5 + 0.5;
    s.style.width             = size + 'px';
    s.style.height            = size + 'px';
    s.style.top               = Math.random() * 100 + '%';
    s.style.left              = Math.random() * 100 + '%';
    s.style.animationDuration = (Math.random() * 3 + 1.5) + 's';
    s.style.animationDelay    = (Math.random() * 3) + 's';
    document.body.appendChild(s);
  }
}
createStars();

// ===== CONFETTI =====
const confettiColors = ['#ff4d6d','#ffbe0b','#3a86ff','#8338ec','#06d6a0','#ff6eb4','#ffe066'];

function spawnConfetti() {
  const c  = document.createElement('div');
  c.className = 'confetti';
  const size  = Math.random() * 8 + 4;
  c.style.width             = size + 'px';
  c.style.height            = (size * 1.5) + 'px';
  c.style.left              = Math.random() * window.innerWidth + 'px';
  c.style.backgroundColor   = confettiColors[Math.floor(Math.random() * confettiColors.length)];
  c.style.animationDuration = (Math.random() * 3 + 2) + 's';
  document.body.appendChild(c);
  setTimeout(() => c.remove(), 5000);
}

setInterval(spawnConfetti, 160);

// ===== CLICK HANDLER =====
envelope.addEventListener('click', (e) => {
  // Efek glow ring di posisi klik
  const ring = document.createElement('div');
  ring.className   = 'glow-ring';
  ring.style.left  = e.clientX + 'px';
  ring.style.top   = e.clientY + 'px';
  ring.style.width = ring.style.height = '80px';
  document.body.appendChild(ring);
  setTimeout(() => ring.remove(), 700);

  // Animasi kertas terbang
  paper.classList.add('fly');

  // Fade out halaman lalu pindah
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '0';
  }, 400);

  setTimeout(() => {
    window.location.href = '../firstpage/index.html';
  }, 900);
});