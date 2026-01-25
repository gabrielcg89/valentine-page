// =========================
// CONFIGURACIÓN DE FECHA
// =========================
// const targetDate = new Date(2026, 1, 13, 0, 0, 0); // Febrero = 1 (0-based)
const targetDate = new Date(new Date().getTime() + 10 * 1000); // 10 segundos desde ahora

// =========================
// CONTENEDOR DE CONTADOR
// =========================
const body = document.body;
const mainContent = document.querySelector("body > *");
mainContent.style.display = "none"; // ocultamos contenido principal

const countdownDiv = document.createElement("div");
countdownDiv.style.display = "flex";
countdownDiv.style.flexDirection = "column";
countdownDiv.style.justifyContent = "center";
countdownDiv.style.alignItems = "center";
countdownDiv.style.height = "100vh";
countdownDiv.style.textAlign = "center";
countdownDiv.style.fontFamily = "'Poppins', sans-serif";
countdownDiv.style.position = "relative";
countdownDiv.style.overflow = "hidden";
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
// CONTADOR
// =========================
function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    countdownDiv.remove();
    mainContent.style.display = "block";
    clearInterval(countdownInterval);
    clearInterval(heartInterval);
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
// INTERVALS
// =========================
updateCountdown();
const countdownInterval = setInterval(updateCountdown, 1000);
const heartInterval = setInterval(createHeart, 300); // crear corazones cada 0.3s

// =========================
// SELECT ELEMENTS
// =========================
const answerButtons = document.querySelectorAll(".answer[data-response]");
const message = document.querySelector(".answer-message");
const specialPhoto = document.querySelector(".special-photo");
const responseBox = document.querySelector(".response-box");
const responseText = document.getElementById("responseText");
const sendResponseBtn = document.getElementById("sendResponse");
const bigQuestionSection = document.querySelector(".big-question");
const polaroidGallery = document.querySelector(".polaroid-gallery");

// =========================
// STATE
// =========================
let selectedResponse = "";

// =========================
// MESSAGES BY RESPONSE
// =========================
const messages = {
  soft: "Sabía que tu respuesta sería así 🥰 tan linda como TU y de corazón 💕",
  happy: "Awwww sabía que dirías eso 😍 me alegraste el día 💖",
  sure: "Obvi, sabía que no podía ser con nadie más que contigo 💞✨",
};

// =========================
// CONFETTI COLORS
// =========================
const confettiColors = ["#c2185b", "#f48fb1", "#fde8ef", "#ffffff"];

// =========================
// RESTORE MEMORY (localStorage)
// =========================
const savedMemory = localStorage.getItem("valentineMemory");

if (savedMemory) {
  const memory = JSON.parse(savedMemory);

  selectedResponse = memory.respuesta;

  // Mostrar mensaje de respuesta
  message.innerHTML = `<p>${messages[selectedResponse]}</p>`;
  message.classList.remove("hidden");

  // Mostrar foto especial
  specialPhoto.classList.remove("hidden");

  // Mostrar caja de respuesta con el recuerdo
  responseBox.classList.remove("hidden");
  responseBox.innerHTML = `
    <p style="color:#c2185b; font-weight:500;">
      💌 Este recuerdo ya quedó guardado<br><br>
      <em>"${memory.mensaje}"</em><br><br>
      <small>${memory.fecha}</small>
    </p>
  `;

  // Deshabilitar botones
  answerButtons.forEach((btn) => {
    btn.disabled = true;
    btn.style.opacity = "0.6";
    btn.style.cursor = "default";
  });

  // Crear polaroid del recuerdo guardado
  addPolaroid(memory);
}

// =========================
// HANDLE ANSWER BUTTONS
// =========================
answerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedResponse = button.dataset.response;

    // Mostrar mensaje personalizado
    message.innerHTML = `<p>${messages[selectedResponse]}</p>`;
    message.classList.remove("hidden");

    // Mostrar foto especial
    specialPhoto.classList.remove("hidden");

    // Mostrar caja de respuesta
    responseBox.classList.remove("hidden");

    // Deshabilitar botones
    answerButtons.forEach((btn) => {
      btn.disabled = true;
      btn.style.opacity = "0.7";
      btn.style.cursor = "default";
    });

    // Lanzar confetti 🎉
    launchConfetti();
  });
});

// =========================
// SEND RESPONSE + SAVE MEMORY + POLAROID
// =========================
sendResponseBtn.addEventListener("click", async () => {
  const comment = responseText.value.trim() || "Sin comentario";

  const memory = {
    respuesta: selectedResponse,
    mensaje: comment,
    fecha: new Date().toLocaleString(),
  };

  // 🔐 Guardar en localStorage
  localStorage.setItem("valentineMemory", JSON.stringify(memory));

  // ⚠️ Formspree endpoint
  const ENDPOINT_URL = "https://formspree.io/f/xykevqdq";

  try {
    await fetch(ENDPOINT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(memory),
    });

    // Mostrar mensaje de confirmación
    responseBox.innerHTML = `
      <p style="color:#c2185b; font-weight:500;">
        Gracias por escribirme 💖<br>
        Este mensaje lo voy a guardar con mucho cariñito.
      </p>
    `;

    // Crear polaroid del nuevo mensaje
    addPolaroid(memory);
  } catch (error) {
    responseBox.innerHTML = `
      <p style="color:#c2185b;">
        Tu mensaje quedó guardado 💕<br>
        Aunque algo falló al enviarlo, ya está a salvo.
      </p>
    `;
    addPolaroid(memory);
  }
});

// =========================
// FUNCTION: CREATE POLAROID
// =========================
function addPolaroid(memory) {
  const polaroid = document.createElement("div");
  polaroid.classList.add("polaroid");

  // Rotación ligera aleatoria
  const rotateDeg = Math.floor(Math.random() * 5) - 2; // -2 a 2 grados
  polaroid.style.transform = `rotate(${rotateDeg}deg)`;

  polaroid.innerHTML = `
    <div style="padding: 1rem; font-size:0.95rem; color:#2e2e2e;">
      💌 "${memory.mensaje}"<br>
      <small style="color:#6b6b6b;">${memory.fecha}</small>
    </div>
  `;

  // Insertar al inicio de la galería
  polaroidGallery.prepend(polaroid);
}

// =========================
// CONFETTI ANIMATION
// =========================
function launchConfetti() {
  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");

    confetti.style.left = Math.random() * 100 + "%";
    confetti.style.backgroundColor =
      confettiColors[Math.floor(Math.random() * confettiColors.length)];
    confetti.style.animationDuration = 2 + Math.random() * 2 + "s";
    confetti.style.width = 6 + Math.random() * 6 + "px";
    confetti.style.height = 10 + Math.random() * 10 + "px";

    bigQuestionSection.appendChild(confetti);

    setTimeout(() => confetti.remove(), 4000);
  }
}
