// =========================
// CONFIGURACIÓN DE FECHA
// =========================
// Fecha real:
// const targetDate = new Date(2026, 1, 13, 0, 0, 0);

// Para pruebas rápidas (10 segundos)
const targetDate = new Date(new Date().getTime() + 10 * 1000);

// =========================
// OCULTAR CONTENIDO PRINCIPAL
// =========================
const body = document.body;
const allContent = Array.from(body.children).filter(
  el => el.tagName !== "SCRIPT"
);

allContent.forEach(el => el.style.display = "none");

// =========================
// CONTADOR
// =========================
const countdownDiv = document.createElement("div");
countdownDiv.style.cssText = `
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: linear-gradient(135deg, #fde8ef, #fff0f5);
  z-index: 9999;
  font-family: 'Poppins', sans-serif;
`;

countdownDiv.innerHTML = `
  <h1 style="color:#c2185b;">💖 Nuestro Primer San Valentín 💖</h1>
  <p style="margin-top:1rem;">Cielito, espera un poquito más 🤭…</p>
  <h2 id="countdown" style="font-size:3rem; color:#c2185b; margin-top:2rem;"></h2>
`;

body.prepend(countdownDiv);

// =========================
// CORAZONES
// =========================
function createHeart() {
  const heart = document.createElement("div");
  heart.textContent = "💖";
  heart.style.cssText = `
    position:absolute;
    left:${Math.random() * 100}%;
    top:-30px;
    font-size:${20 + Math.random() * 20}px;
    animation: floatHeart ${3 + Math.random() * 2}s linear forwards;
    pointer-events:none;
  `;
  countdownDiv.appendChild(heart);
  setTimeout(() => heart.remove(), 5000);
}

const heartStyle = document.createElement("style");
heartStyle.innerHTML = `
@keyframes floatHeart {
  0% {transform: translateY(0) scale(1); opacity: 0;}
  10% {opacity: 1;}
  100% {transform: translateY(-400px) scale(1.5); opacity: 0;}
}`;
document.head.appendChild(heartStyle);

// =========================
// CONFETTI
// =========================
const confettiColors = ["#c2185b", "#f48fb1", "#fde8ef", "#ffffff"];
const bigQuestionSection = document.querySelector(".big-question");

function launchConfetti() {
  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.cssText = `
      left:${Math.random() * 100}%;
      background:${confettiColors[Math.floor(Math.random() * confettiColors.length)]};
      animation:${2 + Math.random() * 2}s confettiFall linear forwards;
    `;
    bigQuestionSection.appendChild(confetti);
    setTimeout(() => confetti.remove(), 4000);
  }
}

// =========================
// CONTADOR LÓGICA
// =========================
function updateCountdown() {
  const diff = targetDate - new Date();

  if (diff <= 0) {
    countdownDiv.remove();
    allContent.forEach(el => el.style.display = "");
    clearInterval(countdownInterval);
    clearInterval(heartInterval);
    launchConfetti();
    return;
  }

  const s = Math.floor(diff / 1000) % 60;
  const m = Math.floor(diff / 60000) % 60;
  const h = Math.floor(diff / 3600000) % 24;
  const d = Math.floor(diff / 86400000);

  document.getElementById("countdown").textContent =
    `${d}d ${h}h ${m}m ${s}s`;
}

updateCountdown();
const countdownInterval = setInterval(updateCountdown, 1000);
const heartInterval = setInterval(createHeart, 300);

// =========================
// SELECCIÓN DE OPCIÓN ❤️
// =========================
const buttons = document.querySelectorAll(".answer");
const messageBox = document.querySelector(".answer-message");
const photo = document.querySelector(".special-photo");
const responseBox = document.querySelector(".response-box");

const messages = {
  soft: "Sabía que dirías que sí… mi corazón ya lo sentía 💕",
  happy: "No sabes lo feliz que me hace leerte 😍✨",
  sure: "Entonces es oficial… eres mi San Valentín 💖🥰"
};

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.response;

    messageBox.textContent = messages[type];
    messageBox.classList.remove("hidden");
    photo.classList.remove("hidden");
    responseBox.classList.remove("hidden");

    buttons.forEach(b => b.disabled = true);

    launchConfetti();
  });
});
