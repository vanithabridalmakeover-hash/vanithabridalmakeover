/* ---------------------------------------------------
   GSAP INTRO + SCROLL ANIMATIONS
--------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const overlay = document.getElementById("introOverlay");
  const logo = document.getElementById("introLogo");
  const iris = document.getElementById("irisRing");

  gsap.set(overlay, { opacity: 1 });

  const intro = gsap.timeline();
  intro.fromTo(logo, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.6)" });
  intro.fromTo(iris, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.2 }, "-=0.3");
  intro.to(iris, { opacity: 0, scale: 1.5, duration: 0.3 });
  intro.to(overlay, {
    opacity: 0,
    duration: 0.5,
    onComplete: () => overlay.remove()
  });

  gsap.utils.toArray(".pre-anim").forEach(el => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      scrollTrigger: { trigger: el, start: "top 90%" }
    });
  });
});

/* ---------------------------------------------------
   MULTI-SESSION FORM LOGIC
--------------------------------------------------- */

let sessionCount = 1;
const maxSessions = 10;

const sessionsContainer = document.getElementById("sessionsContainer");
const addBtn = document.getElementById("addSessionBtn");

/* FUNCTION LISTS BY CATEGORY */
const functionMap = {
  "Bridal": [
    "Muhurtham", "Reception", "Sangeeth", "Haldi",
    "Seer / Henna Ceremony", "Engagement", "Photoshoot",
    "Post-Wedding Shoot"
  ],
  "Groom": ["Muhurtham", "Reception", "Engagement"],
  "Bridesmaid": ["Sangeeth", "Reception", "Birthday Celebration"],
  "Family Makeup": ["Event Makeup", "Party Makeup"],
  "Special Occasions": [
    "Baby Shower", "Puberty Function",
    "Birthday Celebration", "Photoshoot"
  ],
  "Other": ["Other Function"]
};

/* MAKEUP TYPE LISTS BY CATEGORY */
const makeupMap = {
  "Bridal": [
    "HD Premium",
    "Soft Glam",
    "Ultra HD",
    "Airbrush Makeup"
  ],
  "Groom": [
    "Normal Makeup"
  ],
  "Bridesmaid": [
    "Basic Makeup",
    "Natural Makeup"
  ],
  "Family Makeup": [
    "Normal Makeup",
    "HD Makeup"
  ],
  "Special Occasions": [
    "Normal Makeup",
    "HD Makeup"
  ],
  "Other": [
    "Normal Makeup"
  ]
};

/* ---------------------------------------------------
   ADD SESSION BLOCK
--------------------------------------------------- */
addBtn.addEventListener("click", () => {
  if (sessionCount >= maxSessions) return;
  sessionCount++;

  const block = document.createElement("div");
  block.className = "session-block";
  block.dataset.index = sessionCount;

  block.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-2">
      <strong>Session ${sessionCount}</strong>
      <button type="button" class="btn btn-sm btn-outline-light remove-session-btn">Remove</button>
    </div>

    <div class="mb-2">
      <label class="form-label small-muted">Category</label>
      <select name="category[]" class="form-select gold-select category-select" required>
        <option value="">Select Category</option>
        <option value="Bridal">Bridal</option>
        <option value="Groom">Groom</option>
        <option value="Bridesmaid">Bridesmaid</option>
        <option value="Family Makeup">Family Makeup</option>
        <option value="Special Occasions">Special Occasions</option>
        <option value="Other">Other</option>
      </select>
    </div>

    <div class="mb-2">
      <label class="form-label small-muted">Function</label>
      <select name="function[]" class="form-select gold-select function-select" required>
        <option value="">Select Function</option>
      </select>
    </div>

    <div class="mb-2">
      <label class="form-label small-muted">Makeup Type</label>
      <select name="package[]" class="form-select gold-select package-select" required>
        <option value="">Select Makeup Type</option>
      </select>
    </div>
  `;

  sessionsContainer.appendChild(block);
});

/* ---------------------------------------------------
   REMOVE SESSION BLOCK
--------------------------------------------------- */
sessionsContainer.addEventListener("click", event => {
  if (!event.target.classList.contains("remove-session-btn")) return;

  event.target.closest(".session-block").remove();
  renumberSessions();
});

/* ---------------------------------------------------
   RENUMBER SESSION TITLES
--------------------------------------------------- */
function renumberSessions() {
  const blocks = document.querySelectorAll(".session-block");
  sessionCount = blocks.length;

  blocks.forEach((block, i) => {
    const number = i + 1;
    block.dataset.index = number;
    block.querySelector("strong").textContent = `Session ${number}`;

    const removeBtn = block.querySelector(".remove-session-btn");
    removeBtn.classList.toggle("d-none", number === 1);
  });
}

/* ---------------------------------------------------
   CATEGORY → FUNCTION + MAKEUP POPULATION
--------------------------------------------------- */
sessionsContainer.addEventListener("change", event => {
  if (!event.target.classList.contains("category-select")) return;

  const category = event.target.value;
  const block = event.target.closest(".session-block");

  const functionSelect = block.querySelector(".function-select");
  const makeupSelect = block.querySelector(".package-select");

  /* Reset menus */
  functionSelect.innerHTML = `<option value="">Select Function</option>`;
  makeupSelect.innerHTML = `<option value="">Select Makeup Type</option>`;

  /* Populate functions */
  if (functionMap[category]) {
    functionMap[category].forEach(fn => {
      functionSelect.innerHTML += `<option value="${fn}">${fn}</option>`;
    });
  }

  /* Populate makeup types */
  if (makeupMap[category]) {
    makeupMap[category].forEach(mk => {
      makeupSelect.innerHTML += `<option value="${mk}">${mk}</option>`;
    });
  }
});

/* ---------------------------------------------------
   WHATSAPP SUBMIT
--------------------------------------------------- */
document.getElementById("makeupForm").addEventListener("submit", e => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const eventDate = document.getElementById("eventDate").value;
  const venue = document.getElementById("venue").value.trim();

  let msg =
  `Name: ${name}
  Phone: ${phone}
  Event Date: ${eventDate}
  Venue: ${venue || "—"}

  `;

  const blocks = document.querySelectorAll(".session-block");

  blocks.forEach((block, i) => {
    const cat = block.querySelector(".category-select").value;
    const fn = block.querySelector(".function-select").value;
    const mk = block.querySelector(".package-select").value;

    msg += `SESSION ${i + 1}\n`;
    msg += `Category: ${cat}\n`;
    msg += `Function: ${fn}\n`;
    msg += `Makeup Type: ${mk}\n\n`;
  });

  msg += `Total Sessions: ${blocks.length}`;

  const url = "https://wa.me/917200051644?text=" + encodeURIComponent(msg);
  window.open(url, "_blank");
});
