/* =========================================================
   INNOVA — Preferencias: modo claro/oscuro e idioma
   Se carga en el <head> para aplicar el tema y el idioma
   antes de mostrar la página, así no hay parpadeos.
   La elección se guarda en el navegador del visitante.
   ========================================================= */

const prefs = (() => {
  const root = document.documentElement;
  const read = (key) => { try { return localStorage.getItem(key); } catch { return null; } };
  const save = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
  const norm = (s) => s.replace(/\s+/g, " ").trim();

  /* ---------- Tema ---------- */
  // Si el visitante no eligió, se usa la preferencia de su sistema.
  const lightQuery = window.matchMedia("(prefers-color-scheme: light)");
  let theme = read("innova-theme") || (lightQuery.matches ? "light" : "dark");
  root.dataset.theme = theme;

  function setTheme(next, remember = true) {
    theme = next;
    root.dataset.theme = theme;
    if (remember) save("innova-theme", theme);
    updateControls();
  }

  lightQuery.addEventListener("change", (e) => {
    if (!read("innova-theme")) setTheme(e.matches ? "light" : "dark", false);
  });

  /* ---------- Idioma ---------- */
  // Si el visitante no eligió, se usa inglés solo si su navegador está en inglés.
  let lang = read("innova-lang") || (navigator.language.startsWith("en") ? "en" : "es");
  if (lang !== "en") lang = "es";
  // Oculta la página hasta traducirla, para no mostrar el español un instante
  if (lang === "en") root.classList.add("i18n-pending");

  // Traduce un texto al idioma actual. Admite variables: t("Soy {nombre}", { nombre })
  function t(str, vars = {}) {
    const out = lang === "en" ? TRANSLATIONS.en.text[str] ?? str : str;
    return out.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? "");
  }

  // Lista de todo lo traducible de la página, con su versión en español y en inglés
  let entries = [];

  function collect() {
    const { text, html } = TRANSLATIONS.en;
    const add = (es, en, set) => en && entries.push({ es, en, set });

    add(document.title, text[norm(document.title)], (v) => (document.title = v));
    const meta = document.querySelector('meta[name="description"]');
    if (meta) add(meta.content, text[norm(meta.content)], (v) => (meta.content = v));

    // Elementos que se traducen completos (el orden de las palabras cambia)
    document.querySelectorAll("[data-i18n]").forEach((el) =>
      add(el.innerHTML, html[norm(el.textContent)], (v) => (el.innerHTML = v))
    );

    // Textos sueltos, conservando los espacios de alrededor
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) =>
        node.parentElement.closest("script, style, [data-i18n]") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
    });
    for (let node; (node = walker.nextNode()); ) {
      const en = text[norm(node.data)];
      if (!en) continue;
      const [, before, after] = node.data.match(/^(\s*)[\s\S]*?(\s*)$/);
      add(node.data, before + en + after, (v) => (node.data = v));
    }

    // Atributos que leen los lectores de pantalla o muestra el navegador
    const attrs = ["aria-label", "alt", "title", "placeholder"];
    document.querySelectorAll(attrs.map((a) => `[${a}]`).join()).forEach((el) =>
      attrs.forEach((a) => {
        const es = el.getAttribute(a);
        if (es) add(es, text[norm(es)], (v) => el.setAttribute(a, v));
      })
    );
  }

  function applyLang() {
    root.lang = lang;
    entries.forEach((e) => e.set(lang === "en" ? e.en : e.es));
    updateControls();
    root.classList.remove("i18n-pending");
  }

  function setLang(next) {
    lang = next;
    save("innova-lang", lang);
    applyLang();
    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang } }));
  }

  /* ---------- Botones del menú ---------- */
  function updateControls() {
    const themeBtn = document.getElementById("themeToggle");
    const langBtn = document.getElementById("langToggle");
    themeBtn?.setAttribute("aria-label", t(theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"));
    langBtn?.setAttribute("aria-label", lang === "es" ? "Cambiar idioma a inglés" : t("Cambiar idioma a español"));
  }

  document.addEventListener("DOMContentLoaded", () => {
    collect();
    applyLang();
    document.getElementById("themeToggle")?.addEventListener("click", () => setTheme(theme === "dark" ? "light" : "dark"));
    document.getElementById("langToggle")?.addEventListener("click", () => setLang(lang === "es" ? "en" : "es"));
  });

  return { t, get lang() { return lang; } };
})();
