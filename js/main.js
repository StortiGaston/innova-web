/* =========================================================
   INNOVA — Interacciones y animaciones
   ========================================================= */

// EDITAR: número de WhatsApp en formato internacional, sin "+", espacios ni guiones.
// Ejemplo Argentina: 54 9 + característica + número → "5493511234567"
const WHATSAPP_NUMBER = "5493794594631";
const WHATSAPP_DEFAULT_MSG = "¡Hola INNOVA! Quisiera hacer una consulta.";

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const waLink = (msg) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

/* ---------- Navegación ---------- */
const nav = $("#nav");
const menu = $("#menu");
const toggle = $("#navToggle");
const progress = $(".progress");

function closeMenu() {
  menu.classList.remove("open");
  toggle.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

toggle.addEventListener("click", () => {
  const open = !menu.classList.contains("open");
  menu.classList.toggle("open", open);
  toggle.classList.toggle("open", open);
  toggle.setAttribute("aria-expanded", String(open));
  document.body.style.overflow = open ? "hidden" : "";
});
$$(".nav__link").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (e) => e.key === "Escape" && closeMenu());

function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle("scrolled", y > 30);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Link activo según la sección visible (solo secciones que tienen link en el menú)
const sections = $$("main section[id]").filter((s) => $(`.nav__link[href="#${s.id}"]`));
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      $$(".nav__link").forEach((l) =>
        l.classList.toggle("active", l.getAttribute("href") === `#${entry.target.id}`)
      );
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
sections.forEach((s) => sectionObserver.observe(s));

/* ---------- Aparición al hacer scroll ---------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

// Escalonar la aparición de elementos hermanos
$$(".reveal").forEach((el) => {
  const siblings = $$(":scope > .reveal", el.parentElement);
  const i = siblings.indexOf(el);
  el.style.setProperty("--d", `${Math.min(i, 6) * 0.08}s`);
  revealObserver.observe(el);
});

/* ---------- Texto que se escribe solo ---------- */
const typedEl = $("#typed");
const words = ["soluciones digitales", "software a medida", "experiencias web", "resultados reales"];

async function typeLoop() {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  let i = 0;
  await sleep(2500);
  while (true) {
    const current = words[i];
    for (let c = current.length; c >= 0; c--) {
      typedEl.textContent = current.slice(0, c);
      await sleep(35);
    }
    i = (i + 1) % words.length;
    const next = words[i];
    for (let c = 1; c <= next.length; c++) {
      typedEl.textContent = next.slice(0, c);
      await sleep(70);
    }
    await sleep(2200);
  }
}
if (typedEl && !reduceMotion) typeLoop();

/* ---------- Contadores ---------- */
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.target;
      const duration = 1800;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  },
  { threshold: 0.6 }
);
$$(".counter").forEach((c) => counterObserver.observe(c));

/* ---------- Efectos con el mouse (solo en escritorio) ---------- */
const finePointer = window.matchMedia("(pointer: fine)").matches;

if (finePointer && !reduceMotion) {
  const glow = $(".cursor-glow");
  let gx = 0, gy = 0, tx = 0, ty = 0;
  window.addEventListener("mousemove", (e) => { tx = e.clientX; ty = e.clientY; });
  (function animateGlow() {
    gx += (tx - gx) * 0.12;
    gy += (ty - gy) * 0.12;
    glow.style.transform = `translate(${gx - 250}px, ${gy - 250}px)`;
    requestAnimationFrame(animateGlow);
  })();

  // Tarjetas con inclinación 3D
  $$(".tilt").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-6px)`;
    });
    card.addEventListener("mouseleave", () => (card.style.transform = ""));
  });

  // Luz que sigue al mouse en los servicios
  $$(".service").forEach((s) => {
    s.addEventListener("mousemove", (e) => {
      const r = s.getBoundingClientRect();
      s.style.setProperty("--mx", `${e.clientX - r.left}px`);
      s.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });

  // Botones magnéticos
  $$(".magnetic").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    btn.addEventListener("mouseleave", () => (btn.style.transform = ""));
  });
} else {
  $(".cursor-glow").style.display = "none";
}

/* ---------- Filtro del portafolio ---------- */
$$(".filter").forEach((btn) => {
  btn.addEventListener("click", () => {
    $$(".filter").forEach((b) => b.classList.toggle("active", b === btn));
    const f = btn.dataset.filter;
    $$(".project").forEach((p) => {
      const show = f === "all" || p.dataset.category === f;
      p.classList.remove("pop");
      p.classList.toggle("hide", !show);
      if (show) {
        void p.offsetWidth; // reinicia la animación
        p.classList.add("pop");
      }
    });
  });
});

/* ---------- Contacto por WhatsApp ---------- */
$("#waFloat").href = waLink(WHATSAPP_DEFAULT_MSG);

// Botones con mensaje propio (por ejemplo, en las páginas de cada servicio)
$$("[data-wa]").forEach((a) => (a.href = waLink(a.dataset.wa)));

// El formulario solo existe en la página de inicio
const form = $("#contactForm");
const note = $("#formNote");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;
    $$("[required]", form).forEach((input) => {
      const field = input.closest(".field");
      const ok = input.value.trim() !== "";
      field.classList.toggle("error", !ok);
      if (!ok) valid = false;
    });

    if (!valid) {
      note.textContent = "Completá los campos obligatorios.";
      return;
    }

    const { nombre, empresa, servicio, mensaje } = Object.fromEntries(new FormData(form));
    const text =
      `¡Hola INNOVA! Soy ${nombre.trim()}` +
      (empresa.trim() ? ` de ${empresa.trim()}` : "") +
      `.\nMe interesa: ${servicio}.\n\n${mensaje.trim()}`;

    window.open(waLink(text), "_blank", "noopener");
    note.textContent = "¡Listo! Abrimos WhatsApp con tu mensaje.";
    form.reset();
  });

  $$("input, textarea, select", form).forEach((el) =>
    el.addEventListener("input", () => el.closest(".field").classList.remove("error"))
  );
}

/* ---------- Año del footer ---------- */
$("#year").textContent = new Date().getFullYear();
