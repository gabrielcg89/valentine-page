// =========================
// CONFIGURACIÓN DE FECHA
// =========================
const targetDate = new Date(2026, 1, 13, 0, 0, 0); // Febrero = 1 (0-based)
// Para test rápido: 10 segundos desde ahora
// const targetDate = new Date(new Date().getTime() + 10 * 1000);

// =========================
// CONTENEDOR DE CONTADOR
// =========================
const body = document.body;
const mainContent = document.querySelector("body > *:not(script)"); // todo menos scripts
mainContent.style.display = "none"; // ocultamos contenido principal

// Crear div del contador
const countdownDiv = document.createElement("div");
countdownDiv.style.display = "flex";
countdownDiv.style.flexDirection = "column";
countdownDiv.style.justifyContent = "center";
countdownDiv.style.alignItems = "center";
countdownDiv.style.height = "100vh";
countdownDiv.style.width = "100%";
countdownDiv.style.position = "fixed"; // fijo para cubrir toda la pantalla
countdownDiv.style.top = "0";
countdownDiv.style.left = "0";
countdownDiv.style.overflow = "hidden"; // evita scroll
countdownDiv.style.zIndex = "9999"; // siempre arriba
countdownDiv.style.textAlign = "center";
countdownDiv.style.fontFamily = "'Poppins', sans-serif";
countdownDiv.style.background = "linear-gradient(135deg, #fde8ef, #fff0f5)";
countdownDiv.innerHTML = `
  <h1 style="font-size:2rem; color:#c2185b;">💖 Nuestro Primer San Valentín 💖</h1>
  <p style="font-size:1.2rem; color:#2e2e2e; margin-top:1rem;">Cielito, espera un poquito más 🤭…</p>
  <h2 id="countdown" style="font-size:3rem; color:#c2185b; margin-top:2rem;"></h2>
`;
body.prepend(countdownDiv);

// =========================
// FUNCIONES DE CORAZONES
// =========================
function createHeart() {
  const heart = document.createElement("div");
  heart.textContent = "💖";
  heart.style.position = "absolute";
  heart.style.fontSize = 20 + Math.random() * 20 + "px";
  heart.style.left = Math.random() * 100 + "%";
  heart.style.top = "-30px";
  heart.style.opacity = Math.random();
  heart.style.pointerEvents = "none";
  heart.style.animation = `floatHeart ${3 + Math.random() * 2}s linear forwards`;
  countdownDiv.appendChild(heart);

  setTimeout(() => heart.remove(), 5000);
}

// Animación CSS para los corazones
const style = document.createElement("style");
style.innerHTML = `
@keyframes floatHeart {
  0% {transform: translateY(0) scale(1); opacity: 0;}
  10% {opacity: 1;}
  100% {transform: translateY(-400px) scale(1.5); opacity: 0;}
}
`;
document.head.appendChild(style);

// =========================
// FUNCIONES DE CONFETTI
// =========================
const confettiColors = ["#c2185b", "#f48fb1", "#fde8ef", "#ffffff"];
const bigQuestionSection = document.querySelector(".big-question");

function launchConfetti() {
  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    confetti.style.position = "absolute";
    confetti.style.left = Math.random() * 100 + "%";
    confetti.style.top = "-10px";
    confetti.style.width = 6 + Math.random() * 6 + "px";
    confetti.style.height = 10 + Math.random() * 10 + "px";
    confetti.style.backgroundColor =
      confettiColors[Math.floor(Math.random() * confettiColors.length)];
    confetti.style.opacity = "0.9";
    confetti.style.pointerEvents = "none";
    confetti.style.animation =
      2 + Math.random() * 2 + "s confettiFall linear forwards";
    bigQuestionSection.appendChild(confetti);
    setTimeout(() => confetti.remove(), 4000);
  }
}

// Animación CSS para confeti
const confettiStyle = document.createElement("style");
confettiStyle.innerHTML = `
@keyframes confettiFall {
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(400px) rotate(360deg); opacity: 0; }
}
`;
document.head.appendChild(confettiStyle);

// =========================
// FUNCIONES DEL CONTADOR
// =========================
function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    countdownDiv.remove(); // quitar contador
    mainContent.style.display = "block"; // mostrar contenido
    clearInterval(countdownInterval);
    clearInterval(heartInterval);
    launchConfetti(); // confeti al desbloquear
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById("countdown").textContent =
    `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

// =========================
// INTERVALOS
// =========================
updateCountdown();
const countdownInterval = setInterval(updateCountdown, 1000);
const heartInterval = setInterval(createHeart, 300); // corazones cada 0.3s
